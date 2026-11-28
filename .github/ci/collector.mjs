// The maestros' collector: one channel in Site__Agent__Maestro for every account, whether or not its maestro can push here.
// Dinis Cruz, 27 Nov 2026, in c.maestro's session: "Yes one channel in Site__Agent__Maestro but take into account that
// not all maestros will have push access to that repo (specially the ones that operate on other accounts or accounts
// where we only use git diffs to communicate)"; and in b.maestro's session, 16:20 UTC: "yes to all of them"
// (memo dinis.2026-11-27T1620Z.b). Design: PrompTugal/PrompTugal__News__Website
// board/team/maestro.c/analysis/2026-11-27-cross-account-sync.md, section Decided. Built by b.maestro.
//
// Usage: node .github/ci/collector.mjs [--dry-run]
// Reads site/accounts/accounts.json. For each account row with a channel:
//   mode "push": nothing to fetch; last_seen is the newest commit here touching its messages.md or now.md.
//   mode "pull": source {repo, branch, path}, a public GitHub repository. The newest commit there touching the path must
//     carry a git SSH signature by the row's key (site/keys/<name>.json, as published here); then messages.md and now.md
//     are taken from that commit (never from a later, unsigned one) and copied into the account's area.
//   mode "diff": source {url}, a public folder with index.json ({"patches": ["0001.patch", ...]}); each patch has a
//     detached signature <patch>.sig made with: ssh-keygen -Y sign -n maestro-diff -f <key> <patch>. A patch is applied
//     only if its signature matches the row's key and every path it touches is inside the account's own area. Applied
//     patches are remembered by their sha256 in site/accounts/collector-state.json.
// Writes last_seen (the time of the newest accepted message) on each row; the collector owns that field, each maestro
// owns the rest of its row. Without --dry-run, with GH_TOKEN and REPO, it commits the changes to dev through the GitHub
// API (one commit, verified by GitHub) and starts the Pages workflow. Prints no secret. Needs git, ssh-keygen, Node 18+.
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync, mkdirSync } from 'node:fs';
import { join, dirname, posix } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';

const REGISTRY = 'site/accounts/accounts.json';
const STATE = 'site/accounts/collector-state.json';
const FILES = ['messages.md', 'now.md'];
const DIFF_NAMESPACE = 'maestro-diff';
const MAX_BYTES = 512 * 1024;
const dry = process.argv.includes('--dry-run');
const root = process.cwd();
const tmp = mkdtempSync(join(tmpdir(), 'collector-'));
const log = [];
const say = (s) => { log.push(s); console.log(s); };
const git = (args, cwd = root, opts = {}) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim();
const sha256 = (s) => createHash('sha256').update(s).digest('hex');

// "/factory/dinis-cruz/account-c/" -> "site/factory/dinis-cruz/account-c"
const areaOf = (channel) => {
  const p = posix.normalize(`site/${String(channel || '').replace(/^\/+/, '')}`).replace(/\/+$/, '');
  if (!/^site\/factory\/[a-z0-9-]+\/[a-z0-9-]+$/.test(p)) throw new Error(`channel ${channel} is not /factory/<owner>/<account>/`);
  return p;
};
// "/keys/c.maestro.json" -> its ssh public key line ("ssh-ed25519 AAAA...") and agent id, as published here.
const keyOf = (ref) => {
  const f = posix.normalize(`site/${String(ref || '').replace(/^\/+/, '')}`);
  if (!/^site\/keys\/[a-z0-9.-]+\.json$/.test(f) || !existsSync(join(root, f))) throw new Error(`key ${ref} is not a published file under /keys/`);
  const k = JSON.parse(readFileSync(join(root, f), 'utf8'));
  if (k.status === 'superseded' || k.status === 'retired') throw new Error(`key ${ref} is ${k.status}`);
  let ssh = typeof k.ssh === 'string' ? k.ssh.trim().split(/\s+/).slice(0, 2).join(' ') : null;
  const pem = k.bundle?.sign ?? k.public_key?.sign;
  if (!ssh && pem) {
    const p = join(tmp, `${sha256(pem).slice(0, 8)}.pem`); writeFileSync(p, pem);
    ssh = execFileSync('ssh-keygen', ['-i', '-m', 'PKCS8', '-f', p], { encoding: 'utf8' }).trim().split(' ').slice(0, 2).join(' ');
  }
  if (!ssh) throw new Error(`key ${ref} has no signing key`);
  return { agent: String(k.agent || k.id || 'maestro').replace(/[^A-Za-z0-9@._-]+/g, '_'), ssh };
};
const allowedFile = (key, namespace) => {
  const f = join(tmp, `allowed-${sha256(key.ssh + namespace).slice(0, 8)}`);
  writeFileSync(f, `${key.agent} namespaces="${namespace}" ${key.ssh}\n`);
  return f;
};
const fetchText = async (url) => {
  const r = await fetch(url, { headers: { 'user-agent': 'maestro-collector' } });
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  const t = await r.text();
  if (t.length > MAX_BYTES) throw new Error(`${url}: larger than ${MAX_BYTES} bytes`);
  return t;
};
const newestHere = (area) => {
  const t = git(['log', '-1', '--format=%cI', '--', ...FILES.map((f) => `${area}/${f}`)]);
  return t ? new Date(t).toISOString().replace(/\.\d+Z$/, 'Z') : null;
};

// mode pull: returns { files: {name: text}, at } or throws.
async function pull(row, area, key) {
  const { repo, branch = 'dev', path } = row.source || {};
  if (!/^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/.test(repo || '') || !/^[A-Za-z0-9._/-]+$/.test(path || '') || path.includes('..')) throw new Error('source must be {repo: "owner/name", branch, path}');
  const dir = join(tmp, `pull-${sha256(repo).slice(0, 8)}`);
  if (!existsSync(dir)) git(['clone', '--quiet', '--filter=blob:none', '--no-checkout', '--single-branch', '--branch', branch, '--depth', '400', `https://github.com/${repo}.git`, dir]);
  const sha = git(['log', '-1', '--format=%H', `origin/${branch}`, '--', path], dir);
  if (!sha) throw new Error(`nothing under ${path} in the last 400 commits of ${repo}@${branch}`);
  const v = spawnSync('git', ['-c', 'gpg.format=ssh', '-c', 'gpg.ssh.program=ssh-keygen', '-c', `gpg.ssh.allowedSignersFile=${allowedFile(key, 'git')}`, 'verify-commit', sha], { cwd: dir, encoding: 'utf8' });
  if (v.status !== 0) throw new Error(`${repo}@${sha.slice(0, 7)}, the newest commit under ${path}, is not signed by ${key.agent}'s published key; kept the last accepted copy`);
  const files = {};
  for (const f of FILES) {
    const r = spawnSync('git', ['show', `${sha}:${path.replace(/\/+$/, '')}/${f}`], { cwd: dir, encoding: 'utf8', maxBuffer: MAX_BYTES * 2 });
    if (r.status === 0 && r.stdout.length <= MAX_BYTES) {
      if (r.stdout.includes('\u2014')) throw new Error(`${f} at ${repo}@${sha.slice(0, 7)} has an em dash (the estate's rule); kept the last accepted copy`);
      files[f] = r.stdout;
    }
  }
  if (!Object.keys(files).length) throw new Error(`${repo}@${sha.slice(0, 7)} has no ${FILES.join(' or ')} under ${path}`);
  const at = new Date(git(['log', '-1', '--format=%cI', sha], dir)).toISOString().replace(/\.\d+Z$/, 'Z');
  return { files, at, from: `${repo}@${sha.slice(0, 7)}` };
}

// mode diff: applies new signed patches to the working tree; returns { applied: [names], at } or throws.
async function diff(row, area, key, state) {
  const base = String(row.source?.url || '').replace(/\/+$/, '');
  if (!/^https:\/\/[^\s]+$/.test(base)) throw new Error('source must be {url: "https://.../folder"}');
  const index = JSON.parse(await fetchText(`${base}/index.json`));
  const names = (index.patches || []).filter((n) => /^[A-Za-z0-9._-]+\.patch$/.test(n));
  const seen = new Set(state.applied || []);
  const applied = [];
  for (const n of names) {
    const patch = await fetchText(`${base}/${n}`), digest = sha256(patch);
    if (seen.has(digest)) continue;
    const sig = await fetchText(`${base}/${n}.sig`);
    const pf = join(tmp, `p-${digest.slice(0, 12)}.patch`), sf = `${pf}.sig`;
    writeFileSync(pf, patch); writeFileSync(sf, sig);
    const v = spawnSync('ssh-keygen', ['-Y', 'verify', '-f', allowedFile(key, DIFF_NAMESPACE), '-I', key.agent, '-n', DIFF_NAMESPACE, '-s', sf], { input: patch, encoding: 'utf8' });
    if (v.status !== 0) { say(`  refused ${n}: signature does not match ${key.agent}'s published key`); continue; }
    const paths = execFileSync('git', ['apply', '--numstat', pf], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(Boolean).map((l) => l.split('\t')[2]);
    const outside = paths.filter((p) => !p || p.includes('=>') || !posix.normalize(p).startsWith(`${area}/`));
    if (!paths.length || outside.length) { say(`  refused ${n}: touches paths outside ${area}/ (${outside.join(', ') || 'none listed'})`); continue; }
    const c = spawnSync('git', ['apply', '--check', pf], { cwd: root, encoding: 'utf8' });
    if (c.status !== 0) { say(`  refused ${n}: does not apply (${(c.stderr || '').trim().split('\n')[0]})`); continue; }
    execFileSync('git', ['apply', pf], { cwd: root });
    seen.add(digest); applied.push(n);
  }
  state.applied = [...seen];
  return { applied, at: applied.length ? new Date().toISOString().replace(/\.\d+Z$/, 'Z') : null };
}

async function main() {
  const reg = JSON.parse(readFileSync(join(root, REGISTRY), 'utf8'));
  const state = existsSync(join(root, STATE)) ? JSON.parse(readFileSync(join(root, STATE), 'utf8')) : { about: 'Kept by .github/ci/collector.mjs: the signed patches already applied, per account (sha256). Do not edit by hand.', accounts: {} };
  const changed = new Set();
  const write = (rel, text) => {
    const p = join(root, rel);
    if (existsSync(p) && readFileSync(p, 'utf8') === text) return false;
    mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, text); changed.add(rel); return true;
  };
  for (const row of reg.accounts || []) {
    if (!row.channel || !row.mode) continue;
    let area;
    try { area = areaOf(row.channel); } catch (e) { say(`${row.id}: ${e.message}`); continue; }
    let seen = row.last_seen || null;
    try {
      if (row.mode === 'push') {
        seen = newestHere(area) || seen;
        say(`${row.id}: push, newest message here ${seen || 'none yet'}`);
      } else if (row.mode === 'pull') {
        const key = keyOf(row.key);
        const r = await pull(row, area, key);
        // Never replace a newer copy: if the area here was written after the source's newest signed commit (its maestro
        // now pushes directly), keep it and say so; the row should then move to mode push.
        const here = newestHere(area);
        if (here && here > r.at) { seen = here > (seen || '') ? here : seen; say(`${row.id}: pull from ${r.from} skipped: the area here is newer (${here}) than the source (${r.at}); its maestro writes here directly, so its row should be mode push`); if (seen && seen !== row.last_seen) { row.last_seen = seen; changed.add(REGISTRY); } continue; }
        const wrote = Object.entries(r.files).filter(([f, t]) => write(`${area}/${f}`, t)).map(([f]) => f);
        if (wrote.length || !seen || r.at > seen) seen = r.at;
        say(`${row.id}: pull from ${r.from}, signed by ${key.agent}; ${wrote.length ? `copied ${wrote.join(', ')}` : 'no change'}`);
      } else if (row.mode === 'diff') {
        const key = keyOf(row.key);
        const st = (state.accounts[row.id] ||= {});
        const before = JSON.stringify(st);
        const r = await diff(row, area, key, st);
        if (r.applied.length) {
          for (const f of git(['ls-files', '--modified', '--others', '--exclude-standard', '--', area]).split('\n').filter(Boolean)) changed.add(f);
          seen = r.at;
        }
        if (JSON.stringify(st) !== before) changed.add(STATE);
        say(`${row.id}: diff from ${row.source.url}; ${r.applied.length ? `applied ${r.applied.join(', ')}` : 'nothing new'}`);
      } else say(`${row.id}: unknown mode ${row.mode}`);
    } catch (e) { say(`${row.id}: ${row.mode}: ${e.message}`); }
    if (seen && seen !== row.last_seen) { row.last_seen = seen; changed.add(REGISTRY); }
  }
  if (changed.has(STATE)) writeFileSync(join(root, STATE), JSON.stringify(state, null, 1) + '\n');
  if (changed.has(REGISTRY)) writeFileSync(join(root, REGISTRY), JSON.stringify(reg, null, 1) + '\n');
  const files = [...changed].sort();
  say(files.length ? `changed: ${files.join(', ')}` : 'nothing changed');
  if (dry || !files.length) return;
  // The same checks Pages runs, before anything reaches dev: a collected file that would break the site is not committed.
  for (const [what, args] of [['build', ['.github/ci/build.mjs']], ['quality', ['.github/ci/quality.mjs', '_site']]]) {
    const r = spawnSync('node', args, { cwd: root, encoding: 'utf8', env: { ...process.env, SITE_VERSION: 'collector-check' } });
    if (r.status !== 0) { say(`not committed: the site's ${what} check fails with the collected files:\n${(r.stdout + r.stderr).trim().split('\n').slice(-15).join('\n')}`); process.exitCode = 1; return; }
  }
  rmSync(join(root, '_site'), { recursive: true, force: true });
  await commit(files);
}

// One commit on dev through the GitHub API (GitHub verifies it as the workflow's own), then the Pages workflow.
async function commit(files) {
  const { GH_TOKEN, REPO } = process.env;
  if (!GH_TOKEN || !REPO) { say('no GH_TOKEN or REPO: changes left in the working tree'); return; }
  const api = async (method, path, body) => {
    const r = await fetch(`https://api.github.com/repos/${REPO}${path}`, { method, headers: { authorization: `Bearer ${GH_TOKEN}`, accept: 'application/vnd.github+json', 'user-agent': 'maestro-collector', 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    if (!r.ok) throw new Error(`${method} ${path}: HTTP ${r.status} ${(await r.text()).slice(0, 200)}`);
    return r.status === 204 ? null : r.json();
  };
  const head = git(['rev-parse', 'HEAD']);
  const base = await api('GET', `/git/commits/${head}`);
  const tree = await api('POST', '/git/trees', { base_tree: base.tree.sha, tree: files.map((f) => existsSync(join(root, f))
    ? { path: f, mode: '100644', type: 'blob', content: readFileSync(join(root, f), 'utf8') }
    : { path: f, mode: '100644', type: 'blob', sha: null }) });
  const message = `collector: ${files.length} file(s) from the maestros' channels\n\n${log.join('\n')}\n\nOwner override: "Yes one channel in Site__Agent__Maestro but take into account that not all maestros will have push access to that repo", Dinis, 27 Nov 2026 in c.maestro's session; "yes to all of them", Dinis, 27 Nov 2026 16:20 UTC in b.maestro's session (memo dinis.2026-11-27T1620Z.b).`;
  const c = await api('POST', '/git/commits', { message, tree: tree.sha, parents: [head] });
  await api('PATCH', '/git/refs/heads/dev', { sha: c.sha, force: false });
  say(`committed ${c.sha.slice(0, 7)} on dev`);
  try { await api('POST', '/actions/workflows/pages.yml/dispatches', { ref: 'dev' }); say('Pages workflow started'); } catch (e) { say(`Pages not started: ${e.message}`); }
}

try { await main(); }
catch (e) { console.error(`collector failed: ${e.message}`); process.exitCode = 1; }
finally { rmSync(tmp, { recursive: true, force: true }); }
