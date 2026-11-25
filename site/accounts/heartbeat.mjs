// Accounts heartbeat: the rule, the check and the view, in one file with no dependencies.
// Runs in a browser (<script type="module">) and in Node 18+ (import). Spec, draft 2:
// https://devops.agents.sovereignweb.site/factory/dinis-cruz/account-a/a.devops/findings/2026-11-25__accounts-heartbeat.html
// Kept by a.devops@SovereignWebsite.dinis. Copy it beside the accounts page; do not edit the rule here without
// changing the spec page too, so a maestro and the check always agree.

export const HOMES = [1, 2, 3, 4, 6, 8].map((n) => ({
  account: `cl-${n}`,
  repo: `Site__Agent__Maestro__Claude__${n}`,
  url: `https://raw.githubusercontent.com/SovereignWebsite/Site__Agent__Maestro__Claude__${n}/dev/site/heartbeat.json`,
  // While false, a home with no heartbeat file yet is grey ("no heartbeat yet"), not red. Set true once its maestro beats.
  required: false,
}));
export const MISSING = Symbol('missing');

const MIN = 60 * 1000, HOUR = 60 * MIN;
const STATES = ['working', 'idle', 'blocked', 'paused', 'stopped'];

// UK weekday (0 Sunday .. 6 Saturday) and hour for an instant, whatever the reader's own time zone.
export function ukClock(t) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: 'numeric', hourCycle: 'h23' })
    .formatToParts(t).map((x) => [x.type, x.value]));
  return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), hour: Number(p.hour) };
}

export function base(t) {
  const { day, hour } = ukClock(t);
  if (day >= 1 && day <= 5 && hour >= 8 && hour < 19) return { band: 'business hours', ms: 30 * MIN };
  if (hour >= 7 && hour < 23) return { band: 'day', ms: 2 * HOUR };
  return { band: 'night', ms: 6 * HOUR };
}

export function inHand(b) { return ((b.work?.working ?? 0) + (b.work?.blocked ?? 0)) > 0; }
export function roomOut(b) { return b.room?.status === 'rejected' || b.room?.overage === true; }

export function roomFactor(b) {
  if (roomOut(b)) return 8;
  if (b.room?.status === 'allowed_warning') return 4;
  return 1; // allowed, or unknown (unknown is shown amber by judge)
}

// The interval after a beat: base x work x room, between 30 minutes and 12 hours.
export function interval(b) {
  const at = parse(b.at);
  const bs = base(at);
  const work = (b.state === 'paused' || !inHand(b)) ? 4 : 1;
  const ms = Math.min(12 * HOUR, Math.max(30 * MIN, bs.ms * work * roomFactor(b)));
  return { ms, band: bs.band, work, room: roomFactor(b) };
}

function parse(s) {
  const t = typeof s === 'string' ? Date.parse(s.length === 17 ? s.replace('Z', ':00Z') : s) : NaN;
  return Number.isFinite(t) ? new Date(t) : null;
}

// Colour one heartbeat at a moment. beat: the parsed JSON; MISSING when the file is not there (404); null when it
// could not be read or parsed. required: whether this home must already be beating.
// Returns { colour: 'red'|'grey'|'amber'|'green', reasons: [...], due, interval_ms }.
export function judge(beat, now = new Date(), required = true) {
  if (beat === MISSING) return required ? { colour: 'red', reasons: ['no heartbeat file'] } : { colour: 'grey', reasons: ['no heartbeat yet'] };
  if (!beat || typeof beat !== 'object') return { colour: 'red', reasons: ['heartbeat could not be read or parsed'] };
  if (beat.v !== 1) return { colour: 'red', reasons: [`unknown version ${beat.v}`] };
  const at = parse(beat.at);
  if (!at) return { colour: 'red', reasons: ['no valid "at"'] };
  if (!STATES.includes(beat.state)) return { colour: 'red', reasons: [`unknown state ${beat.state}`] };
  const iv = interval(beat);
  const grace = Math.max(15 * MIN, iv.ms / 4);
  const due = new Date(at.getTime() + iv.ms);
  const late = now - due;
  const out = (colour, reasons) => ({ colour, reasons, due: due.toISOString(), interval_ms: iv.ms });

  const red = [];
  if (late > iv.ms + grace) red.push('two beats missed');
  if (beat.state === 'stopped') red.push('stopped');
  if (roomOut(beat) && (beat.work?.working ?? 0) > 0) red.push('out of weekly room with sessions working');
  if (red.length) return out('red', red);

  if (beat.state === 'paused') return out('grey', ['paused on purpose']);

  const amber = [];
  if (late > grace) amber.push('one beat missed');
  if (beat.room?.status === 'allowed_warning') amber.push('weekly room low (allowed_warning)');
  if (roomOut(beat)) amber.push('out of weekly room');
  if (!beat.room || !beat.room.status) amber.push('usage unknown');
  if (beat.state === 'blocked') amber.push('all work blocked');
  const resets = parse(beat.room?.resets_at);
  if (resets && resets < at) amber.push('usage figure is stale (reset already passed)');
  if (at - now > 10 * MIN) amber.push('"at" is in the future: a clock is wrong');
  if (amber.length) return out('amber', amber);
  return out('green', []);
}

export async function fetchBeat(url, f = fetch) {
  try {
    const r = await f(url, { cache: 'no-store' });
    if (r.status === 404) return MISSING;
    if (!r.ok) return null;
    return JSON.parse(await r.text());
  } catch { return null; }
}

export async function readAll(homes = HOMES, now = new Date(), f = fetch) {
  return Promise.all(homes.map(async (h) => {
    const beat = await fetchBeat(h.url, f);
    return { ...h, beat: beat === MISSING ? null : beat, ...judge(beat, now, h.required !== false) };
  }));
}

// The lines a.devops writes under "Dinis:" in its agent.json: one per red account.
export function dinisLines(rows, now = new Date()) {
  return rows.filter((r) => r.colour === 'red').map((r) => ({
    account: r.account, why: r.reasons.join('; '), last_beat: r.beat?.at ?? null, checked: now.toISOString().slice(0, 16) + 'Z',
  }));
}

// ---- The view: fills a container with a table, one row per home, and refreshes every 5 minutes. ----
const COLOURS = { green: '#1a7f37', amber: '#9a6700', red: '#cf222e', grey: '#6e7781' };

function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  for (const k of kids) e.append(k ?? '');
  return e;
}

function ago(iso, now) {
  if (!iso) return '';
  const m = Math.round((now - parse(iso)) / MIN);
  return m < 0 ? `in ${-m} min` : m < 90 ? `${m} min ago` : `${Math.round(m / 60)} h ago`;
}

export function render(container, rows, now = new Date()) {
  const head = el('tr', {}, ...['Account', 'Status', 'State', 'Last beat', 'Next due', 'Room', 'Sessions', 'Asks for Dinis', 'Why'].map((h) => el('th', { scope: 'col' }, h)));
  const body = rows.map((r) => {
    const b = r.beat || {};
    const dot = el('span', { style: `display:inline-block;width:.8em;height:.8em;border-radius:50%;background:${COLOURS[r.colour]};margin-right:.4em;vertical-align:-.05em` });
    const asks = b.asks?.count ? (/^https:\/\//.test(b.asks.link || '') ? el('a', { href: b.asks.link }, String(b.asks.count)) : String(b.asks.count)) : '0';
    const room = b.room ? `${b.room.status ?? 'unknown'}${b.room.used_pct != null ? ` (${b.room.used_pct}%)` : ''}${b.room.overage ? ', overage' : ''}` : 'unknown';
    return el('tr', { 'data-colour': r.colour },
      el('td', {}, el('a', { href: `https://github.com/SovereignWebsite/${r.repo}/blob/dev/site/heartbeat.json` }, r.account)),
      el('td', {}, dot, r.colour),
      el('td', {}, b.state ?? ''),
      el('td', { title: b.at ?? '' }, ago(b.at, now)),
      el('td', { title: r.due ?? '' }, r.due ? (parse(r.due) < now ? `overdue ${ago(r.due, now).replace(' ago', '')}` : ago(r.due, now)) : ''),
      el('td', {}, room),
      el('td', {}, b.work ? `${b.work.working ?? 0} working, ${b.work.blocked ?? 0} blocked` : ''),
      el('td', {}, asks),
      el('td', {}, r.reasons.join('; ')));
  });
  const table = el('table', { class: 'heartbeats' }, el('thead', {}, head), el('tbody', {}, ...body));
  const stamp = el('p', { class: 'heartbeats-checked' }, `Checked ${now.toISOString().slice(0, 16).replace('T', ' ')} UTC. Rule: `,
    el('a', { href: 'https://devops.agents.sovereignweb.site/factory/dinis-cruz/account-a/a.devops/findings/2026-11-25__accounts-heartbeat.html' }, 'accounts heartbeat'), '.');
  container.replaceChildren(table, stamp);
}

export async function mount(container, homes = HOMES, everyMs = 5 * MIN) {
  const go = async () => render(container, await readAll(homes), new Date());
  await go();
  setInterval(go, everyMs);
}
