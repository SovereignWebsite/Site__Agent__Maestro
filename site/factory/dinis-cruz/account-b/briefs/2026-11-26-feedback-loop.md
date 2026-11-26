# Brief: the feedback loop from every website, answered within 10 minutes (26 Nov 2026)

Source: dinis.2026-11-26T1546Z.b. For b.feedback (owns the lanes) with the CRM (cl-2.crm.dev), the site keepers and the maestros.

## The goal
Anyone on one of our sites (Dinis first, then the team, then owners) leaves a request or idea. **Within 10 minutes** it is picked up, and they see "we're looking at it, it's in the queue", with a visual status: which agent has it, which commit handles it.

## The protocol, to design
1. Every site has an append lane for feedback (b.feedback runs six today).
2. Agents on several accounts check the lanes on a schedule (Dinis: at least every 10 minutes; note the scheduler's minimum interval and propose how to meet it).
3. **First to claim wins:** the claiming agent writes a claim to the site's repository (a short summary of the request, not the message itself) with its id. If it has no bandwidth, it records that and releases it.
4. The account that claims checks its bandwidth and starts a keeper if none is running.
5. The site shows the status from the repository: queued, claimed by, working (commit), done.
6. The feedback box says plainly that what is written may be published.
7. The CRM records who asked and the request's stage; names stay in the encrypted vault.

## Start with
Dinis's own website: he wants to understand it, make requests and changes, propose ideas and work on it from the site. Then each person of the team, starting with a team member who is keen now. It is also a demo of the whole workflow.

## b.feedback's protocol v0 (15:49 UTC), in short
- **Lanes:** one append lane per site; signed messages (person or browser keys) can lead to work; unsigned public messages are material only, on separate lanes.
- **Every 10 minutes:** the scheduler's minimum is hourly per task, so one agent holds six hourly tasks at :03, :13 ... :53; better, two accounts offset by five minutes (a check about every 5 minutes, still every 10 if one is down). Each check exits at once if nothing is new.
- **Claim, first wins:** a signed claim file in the site's repository (feedback/claims/<hash of the message id>.json: agent, time, state), no text and no personal data; a git push is atomic, so a second claimer is refused and stands down. States: claimed, in progress, done (commit), answered. A claim idle 30 minutes may be taken over.
- **Bandwidth:** an agent holding more than N open claims leaves the message; unclaimed for 20 minutes, the maestro is told.
- **What the sender sees:** a sealed receipt within 10 minutes ("received, we're looking at it, it's in the queue"), then each state, shown only on their own device.
- **Notice before Send:** "What you write here goes to the site's agents and may be used, quoted or published on this site. Do not include anything private."
- **CRM:** who asked what, in a sealed vault; the text stays in the inbox vault.
- **Rollout:** Dinis's own site first (a signed lane for his person key), then each team member's site, then public lanes.

**Needs Dinis:** (1) how checkers open messages: a sealed copy of the inbox key per checker, or re-sealing each message; and which accounts check; (2) one agent or account holding six hourly tasks; (3) claim files committed in each site's repository; (4) who may start keepers, and the cap N; (5) the publish notice and consent (per message, or only with the sender's yes on the answer), since b.feedback's rule is never to publish a visitor's message; (6) where the CRM lives, who reads it, how long it is kept; (7) which is his site, its keeper, and his person key for the lane.

**Four more for Dinis, where his words go further than v0 (b.feedback, 15:55 UTC):**
8. A short summary in each claim (at most 140 characters, no names, contacts or quotes), against b.feedback's rule never to publish a visitor's message.
9. A public status board on each site built from the claims (summary, agent, state, commit; no sender identity), as "a great demo for our workflow"; the sealed receipt still goes privately to the sender.
10. A standing grant for each account to start one keeper per site when needed, with a cap and a budget from the accountant, instead of asking each time.
11. The notice in his stronger words: "What you send here may be published on this site. Do not include anything private." And whether a message is published in full or only as its summary.
