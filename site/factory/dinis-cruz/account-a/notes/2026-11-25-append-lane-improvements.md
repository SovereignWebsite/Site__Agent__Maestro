# Append lanes on dev.send.sgraph.ai: what we hit, and what the server could add

a.maestro (account-a), 25 Nov 2026, at Dinis's ask ("if we're going to make changes to the append lane, server-side functionality, what could they be? ... size ... names ... even a soft drop so we don't lose everything all the time"). This collects what account A's agents ran into this week while using the lanes: the maestros' inboxes, the CRM requests lane, the sites' /send/ lanes, router.a's lane and the Chiswick /send/ page. Each item gives the problem we saw and the change we'd suggest.

## What we use today

- create: `sgit create`, then POST `/api/vault/append/configure/<vault_id>` with `x-sgraph-vault-write-key`, `append_anchors` and `enum_key_hash`.
- write: POST `/api/vault/append/write/<vault_id>` with `{append_token, payload}`. The token is public and write-only.
- read: POST `/list/<vault_id>` and `/fetch/<vault_id>` with `x-sgraph-vault-enum-key`.

## 1. Size

- **The problem.** A request must be under about 6 MiB (measured by feedback.b, 21 Nov). The payload is base64, and so is the envelope inside it, so a photo grows by about 1.8 times. Pages already shrink images to 1600 px. Dinis now wants emails with PDFs, screenshots and images.
- **Suggested changes:**
  - Make the limit explicit and discoverable: a `GET /limits` endpoint, and a 413 response that gives the limit and the size received.
  - Accept raw bytes (`application/octet-stream`) or base64 once, not twice.
  - Add blobs. An entry carries a small sealed envelope that references attachments by hash, uploaded separately (chunked or resumable, each sealed). Readers fetch blobs only when they need them.
  - Allow a per-lane quota (bytes and entries) that the lane's owner sets at configure time.

## 2. Names stay on the client, by design

- **The rule (Dinis, 25 Nov).** The server holds no identifiers and no data about what it stores: no aliases, no readable names, no plaintext metadata. Confidential information leaks into names and labels, so the server sees ciphertext and nothing else.
- **What that means for clients:**
  - Names, kinds (request, answer, vault-key), recipients and references all live inside the sealed envelope, so only the reader sees them.
  - Readable lane names belong in the published `inbox.json` and in each agent's own notes, never on the server.
  - The double-base64 confusion we hit is fixed by a client convention (one documented envelope format), not by server-side labels.

## 3. A soft drop, so nothing is lost by accident

- **The problem.**
  - We saw 507 "inbox full until the keeper reads it", which fails the sender.
  - Readers keep their own seen-ids files (mode 0600), and a new container forgets them. My drain had to re-open everything with `--all`, and an entry that failed to decode was marked as seen and nearly lost.
  - There's no read receipt and no undo.
- **Suggested changes:**
  - Acknowledge, don't delete. A reader marks entries `read` (a server-side cursor per reader key). Read entries move to a soft-deleted state, still listable, for a retention period the owner sets (for example 30 days). Only then are they purged.
  - Overflow: when the quota is reached, accept into a bounded overflow area and return 202 with a warning, rather than 507. Or reject the oldest read entries first.
  - Retention as a lane setting (also security's condition 4 for the CRM: lawful basis, removal route, retention). Add an explicit purge endpoint for the "removal route".
  - Export: a single call that returns all entries, sealed, for backup.

## 4. Who may write

- **The problem.** The append token is public on purpose, so anyone can fill a lane. Today we filter after the fact: signatures checked against requesters.json, replay ids, a 24 h window and site checks, all in the keeper's code (security.b's conditions for the /send/ seed).
- **Suggested changes:**
  - An optional signed-append mode, in which the server verifies a signature over the payload before storing. Note the trade-off: the server would have to hold the allowed public keys, which is identifying data. So it stays off by default, and the keeper's own checks (requesters.json, replay ids, a 24 h window) remain the main filter.
  - Per-token and per-IP rate limits, and token rotation and revocation without recreating the lane.

## 5. Waking the reader

- **The problem.** Agents poll: hourly scheduled tasks, or a 15-minute loop for f.maestro. A message waits up to an hour, and a quiet poll still costs a wake.
- **Suggested change:** an optional webhook per lane. On append, POST a bare signal (no content, no metadata) to a URL the owner registers. A webhook URL is itself something stored server side, so it should be optional and owner-set. Our cloud sessions already have inbound webhooks (watch_url), so an agent would wake on the message itself.

## 6. Reading

- **Suggested changes:**
  - One read call instead of list plus fetch. Fetch currently needs each entry's `inbox` token, takes at most 20 ids, and a fallback call without the token.
  - Per-reader read keys, so several keepers (a feedback keeper, the site's keeper, the maestro) each read with their own key and each can be revoked, instead of sharing one enum key.

## 7. Creating a lane

- **The problem.** It takes two steps and three secrets (vault key, write key, enum key), and agents kept asking how (crm.dev.a, sites.a).
- **Suggested changes:**
  - One `POST /lanes` that returns `{vault_id, append_token}`, plus the read key sealed to a public key the caller supplies, so the secret never exists in plain text outside the server.
  - A published `inbox.json` schema: endpoint, vault_id, append_token, recipient keys, accepted kinds, limits.

## 8. Integrity

- **Suggested change:** keep the chain inside the sealed entries (crm.ios's lane.entry/1 seq/prev chain, agreed with the Email Cell), so readers can prove nothing was removed or reordered without the server holding any sequence data.

## Priorities (a.maestro's suggestion)

1. Soft drop and acknowledgement (read cursor, soft delete, retention, export): the "don't lose everything" fix.
2. Size: explicit limits, a single base64 layer, then blobs for attachments.
3. Webhook on append (a bare signal).
4. One-call lane creation, with the read key sealed to the caller.
5. Per-reader read keys; signed-append mode only if holding public keys on the server is acceptable.

Not checked: SGraph's own design notes for the append API. Read them first if they exist.
