# a.maestro's review of Append Lanes v2: Implementation Plan (25 Nov 2026)

The plan: https://github.com/the-cyber-boardroom/SGraph-AI__App__Send/blob/claude/vault-inbox-append-api-jj79bn/team/roles/dev/reviews/11/25/v0.33.69__dev-plan__append-lanes-v2-implementation.md (and the architect review beside it). Reviewer: maestro.a (account-a), as the heaviest user on account A: the maestros' inboxes, vault-key copies, and the CRM, sites and router lanes.

**Verdict: agree. Phase 1 can start now.** The four phases match what we hit this week. The ground rules (zero-knowledge, no identifiers at rest, opt-in per lane, no layout change, no outbound calls) hold throughout. Below are the points to settle, phase by phase, and the reviewers who should comment before each phase.

## Points to settle

**All phases**
1. **Logs.** "No identifiers at rest" should include logs. Lambda or CDN access logs must not record request bodies, append tokens, enum keys, grant strings, signer keys or file ids. State the logging policy in the plan, and test that a write leaves none of these in the logs.
2. **The client envelope.** Phase 1 asks agents for "one base64 layer (a documented envelope)". Phase 3 needs blob references (hash, size, key, IV) inside it, and Phase 4 suggests putting the grant and signature inside it. One owner should write that envelope spec once, for the CLI, the vault web client and the agents. crm.ios's lane.entry/1 (agreed with the Email Cell) is the nearest draft.

**Phase 1**
3. Agreed as written. Our part: a.maestro's `maestro_mail.py` still double-encodes (base64 of a base64 envelope). I'll switch it to one layer once the envelope is documented, while keeping the drain able to read both forms.

**Phase 2**
4. **Read keys per lane.** `enum_key_hashes` (up to 16) are per vault. A feedback keeper would then read every lane in that vault. Can a lane optionally carry its own read-key hashes, so a reader sees only its lanes?
5. **Retention classes.** Add a short class (1 or 3 days) for transient lanes, such as doorbell-style signals and test lanes. The CRM lanes need retention set before real contacts (security's condition 4), so a lane whose owner chose "none" could get a warning in stats.
6. **Soft limit.** The writer gets no sign until 507 at the hard limit. That's acceptable, since keepers watch `over_soft` in stats. Agents should alert their owner when `over_soft` appears.

**Phase 3**
7. **Blob path.** `bare/append/<token>/blobs/<sha256>`: is `<token>` the raw append token or its hash? Prefer `sha256(token)`, as for the lane settings, so the raw token never appears in an object key.
8. **Orphaned blobs.** `mark_processed` never touches blobs, and purge needs the write key, which keepers usually don't hold. With retention "none", blobs pile up until the byte budget blocks writers. Two options: require a retention class when `blobs` is on, or let the enum key purge named blob ids (the reader knows which blobs its processed entries referenced).
9. **Decision 2 (blobs on token lanes):** agree, owner opt-in with a byte budget, plus point 8.

**Phase 4**
10. **Curve alignment.** Grants and signatures are ECDSA P-256 (raw r||s), which matches pki.sgit.ai, the browser keyrings and security.b's endorsement rule for the /send/ seed. crm.ios's lane.entry/1 uses Ed25519. Settle one curve, or accept both, before the iOS CRM writes to signed lanes.
11. **The grant is the endorsement.** security.b's condition for the /send/ seed (every listed key after the owner's carries the owner's endorsement) maps directly onto Phase 4 grants, so the server would enforce it rather than each keeper's code. Worth saying in the plan, and asking security.b to confirm.
12. **Per-grant budget.** A single granted writer can fill a signed lane up to 50,000 entries and 20 GiB. An optional per-grant byte budget would contain a compromised or runaway writer. It can be deferred.
13. **Rollback.** Agreed with the plan's warning: rotate signed lanes' tokens before any Phase 4 rollback. Clients should refuse to treat a lane as signed unless `/limits` lists `signed-lanes`.

**Out of scope: webhook**
14. Agreed. For waking sessions we found another path the same day: a no-data doorbell artifact that the artifact service signs (tested at 01:31 UTC). So nothing outbound is needed on SG/Send.

## Decisions needed (the plan's list): a.maestro's view

1. Ceilings as proposed: agree.
2. Blobs on token lanes: owner opt-in with a byte budget, plus point 8.
3. Retention set: agree, plus a 1 or 3 day class (point 5).
4. Batch write: defer: agree.
5. One 401 code per check: agree.
6. Owners: vault web, the SGraph Send team; sgit CLI, the sgit team; agents, a.maestro for account A until a.feedback exists, then a.feedback.

## Who should review before implementation

- **Before Phase 1:** none. It's server-only, with equivalence tests and the old path behind a switch.
- **Before Phase 2:** crm.dev.a (CRM lanes, read keys, retention for real contacts); sites-pages.a or a.factory (the /send/ seed); b.decisions (decisions 1, 3, 4).
- **Before Phase 3:** mail.dev.a and a.mail.conductor (email attachments); crm.dev.a; DevOps (S3 CORS and lifecycle); security (presigned URLs and point 8).
- **Before Phase 4:** security.b (crypto, logs, the endorsement mapping, rollback); the pki.sgit.ai developer (key formats, test vectors); crm.ios (curve alignment); router.a (outside agents such as Mistral and ChatGPT as granted writers).
