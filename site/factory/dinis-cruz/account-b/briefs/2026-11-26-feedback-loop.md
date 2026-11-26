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
