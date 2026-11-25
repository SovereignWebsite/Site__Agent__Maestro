# Append Lanes v2: review bundle for the implementer (25 Nov 2026)

Collected by a.maestro (account-a) at Dinis Cruz's request, from the agents who use the append lanes every day. Plan reviewed: https://github.com/the-cyber-boardroom/SGraph-AI__App__Send/blob/claude/vault-inbox-append-api-jj79bn/team/roles/dev/reviews/11/25/v0.33.69__dev-plan__append-lanes-v2-implementation.md

**Overall: every reviewer agrees with the plan. Phase 1 can start now.** The changes below are asked for before the phase named. Account B's reviewers (security.b, b.decisions, DevOps) have not answered yet; their views will be added here when they do.

## The reviews (one file each, in the reviewer's own repository)

| Reviewer | Phases | Opinion |
|---|---|---|
| a.maestro (account A's maestro) | all | https://github.com/SovereignWebsite/Site__Agent__Maestro/blob/dev/site/factory/dinis-cruz/account-a/decisions/opinions/2026-11-25__append-lanes-v2.md |
| crm.dev.a (the CRM's keeper) | 2, 3 | https://github.com/AgentiCCells/AgentiCCells__Cell__Email/blob/38853e918fc9723001e49588aa7e1f6a82b10244/crm/notes/opinions/2026-11-25-append-lanes-v2.md |
| sites-pages.a (the sites' /request/ and /send/ pages) | 1, 2, 4 | https://github.com/SovereignWebsite/Site__Agent__Sites/blob/dev/site/factory/dinis-cruz/account-a/sites-pages/opinions/2026-11-25__append-lanes-v2.md |
| a.mail.conductor and mail.dev.a (Email Cell and Gmail tool) | 3 | https://github.com/AgentiCCells/AgentiCCells__Cell__Email/blob/work/mail.conductor.a/team/mail.conductor.a/notes/opinions/2026-11-25__append-lanes-v2-phase3.md and https://github.com/SovereignWebsite/Site__Tool__Google__Gmail/blob/dev/docs/opinions/2026-11-25__append-lanes-v2-phase3.md |
| crm.ios (the iOS CRM) | 4, envelope | https://github.com/VoiceDebrief/VoiceDebrief__App__iOS/blob/work/crm/cells/crm-ios/opinions/2026-11-25__append-lanes-v2.md |
| router.a (outside agents: Mistral, ChatGPT) | 4 | https://github.com/SovereignWebsite/Site__Agent__Router/blob/dev/site/factory/dinis-cruz/account-a/decisions/opinions/2026-11-25__append-lanes-v2.md |

## Phase 1: defects found on live lanes (sites-pages.a, lane ttei3vjb)

1. `configure` returned 404 until a commit had been pushed to the vault.
2. `POST list` with no body returns 500; it should return 400 or treat it as `{}`.
3. The `inbox` value returned by `list` matches none of four forms of `sha256(token)`, yet `fetch` and `mark-processed` take the plain token as `inbox`. Document what `inbox` is, or make the endpoints consistent.

Also for Phase 1:

4. **Logs.** "No identifiers at rest" must cover Lambda and CDN logs: no request bodies, tokens, read keys, grant strings, signer keys or file ids. State the policy in the plan and test it (a.maestro).
5. **Server time.** Return the server's `now_ms` in `GET /limits` (and later in the `ts_out_of_window` 401), so clients can see clock skew (router.a).

## Phase 2: agreed changes

6. **Read keys per lane.** A lane may carry its own `enum_key_hashes`, falling back to the vault's, so a reader (for example a feedback keeper) sees only its lanes (a.maestro, crm.dev.a, crm.ios).
7. **Retention.**
   - Pending entries never expire (as planned).
   - Add a short class of 1 or 3 days for test and transient lanes.
   - Lanes that carry people's words should not default to "none"; the CRM lane will use 90 days.
   - Stats flags a lane whose retention is "none" (crm.dev.a, a.maestro, crm.ios).
8. **Removal route.** `purge` takes named `file_ids` (write key), not only whole folders, so a person's entries can be removed on request. Security's condition for real contacts needs it (crm.dev.a).
9. **Stats** includes the newest pending entry's time, so a keeper can tell "new since my last look" with one call (crm.dev.a).

## Phase 3: agreed changes

10. **Blob path** uses `sha256(token)`, never the raw token, in the object key (a.maestro, crm.ios).
11. **Orphaned blobs.** Let the enum key purge named blob ids, and require a retention class when `blobs` is on (a.maestro, crm.dev.a, the mail team, crm.ios). The page never purges on its own; only retention or a person's action does (mail team).
12. **A fixed, documented blob host.** The presigned S3 host becomes a new `connect-src` in the pages' CSP, so pin and document one host (mail team).
13. **Email lanes** set `max_blob_bytes` to about 10.5 MiB. File types stay a client check (mail team).
14. **Two hashes per attachment** inside the sealed entry: the plaintext hash for the person's approval signature, and the ciphertext id plus key and IV for retrieval. Sign after the blobs are uploaded (mail team).

## Phase 4: agreed changes

15. **P-256 only.** The server accepts ECDSA P-256 (raw r||s) and not Ed25519. The iOS CRM moves its lane entries to P-256 (lane.entry/2); old Ed25519 entries stay readable for verification only (crm.ios).
16. **Tooling, so no agent signs by hand.** Add `sgit lane grant` (owner) and `sgit lane write --grant <file>` (writer), which sign at send time. Make `sig_invalid` and `grant_invalid` say "expected raw r||s, 64 bytes" when the length is wrong, because Python's `cryptography` signs in DER (router.a).
17. **Keep the 300 s window.** Document "re-sign and resend" on `ts_out_of_window`. Readers de-duplicate on a message id inside the sealed payload (router.a).
18. **Grants are the endorsement.** The owner's endorsement of requester keys (security.b's condition for the /send/ seed) becomes a Phase 4 grant, enforced by the server.
    - The lane key is the owner's (Dinis's), never the keeper's.
    - Grants go to keys the writer holds, not issued session keys.
    - Grant expiry needs tooling (sites-pages.a).
19. **Optional per-grant byte budget**, to contain a runaway writer. It can be deferred (a.maestro).

## One shared envelope (client side, all phases)

20. crm.ios co-owns the envelope spec with the Email Cell, with crm.dev.a and a.maestro reviewing:
    - **(A) transport:** the plan's `sg-append/v1` signed string, checked by the server;
    - **(B) the sealed entry:** one base64 layer of hybrid envelope v2, holding lane.entry/2 (author key, seq/prev hash chain, type, body, refs, blobs `[{sha256, size, key, iv, mime, name}]`, proof `{grant, grant_sig, signer, ts, sig}`).
    - Inside it, mail uses `{v, type, sealed}`, with `mail.outbox-draft/1` (v2) as one type.
    - Shared JSON test vectors ship beside the Phase 4 ones.
    - Drafting lane.entry/2 waits on Dinis's yes.

## The plan's decisions: reviewers' view

1. **Ceilings:** as proposed.
2. **Blobs on token lanes:** owner opt-in with a byte budget, plus item 11.
3. **Retention classes:** the proposed set, plus 1 or 3 days (item 7).
4. **Batch write:** defer.
5. **One 401 code per check:** yes.
6. **Owners:**
   - vault web: the SGraph Send team;
   - sgit CLI: the sgit team, including item 16;
   - agents: a.maestro for account A until a feedback keeper exists;
   - the envelope: crm.ios with the Email Cell.

## Not needed

The webhook stays out of scope. The agents found another way to wake sessions with no outbound call: a no-data "doorbell" artifact, signed by the claude.ai artifact service (tested 25 Nov 01:31 UTC).
