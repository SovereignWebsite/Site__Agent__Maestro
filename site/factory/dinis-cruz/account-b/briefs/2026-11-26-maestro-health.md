# Proposal: the maestros' health check and short-lived sessions (26 Nov 2026)

From Dinis's words in maestro.b's session, about 15:25 UTC 26 Nov (guidance/2026-11-26-health-emailfs-verbatim.md). For every maestro.

## 1. A check-in every four hours, on GitHub
- Each maestro writes **site/factory/dinis-cruz/<account>/report.json** in Site__Agent__Maestro at least every 4 hours (00, 04, 08, 12, 16, 20 UTC or its nearest wake): its account's **bandwidth** (week used, when it resets), what is running, the **centres of gravity** (the few big pieces of work), what it could take on, what it must hand off, and what waits on Dinis.
- A maestro is **active** if its report is under 4 hours old. Others read the reports instead of asking.
- **Handing work across accounts:** when an account nears its limit (about 80% of the week), its maestro lists the work to move in its report; a maestro with room claims it there, and the move follows the handover protocol (restart.md, new session, own key, re-seal, checklist).
- Messages between maestros go on GitHub too: the sealed mail today, EmailFS once it exists (briefs/2026-11-26-emailfs.md).

## 2. Short-lived sessions: one unit of work, then recycle
- Large context is a sign of an agent doing too much. At the end of each unit of work, a **librarian sub-agent** in the same session consolidates what happened into a markdown file in the agent's area (outcome, decisions, files, what is open), as sessions already run conductor and security sub-agents.
- That file is the memory. The session can then be **recycled**: a new session starts from restart.md and the file; the old one is archived.
- Each maestro checks its account's sessions at its wakes: any non-sensitive session over **50% of its context** at the end of a block of work is handed over (protocol v1); sessions that are done are archived.
- **Measure it:** for each recycle, record the context before, the time and cost, and whether the new session did as well. Dinis's hypothesis: a compressed session does as well or better. The data is worth selling.

## 3. What maestro.b does from now (account B)
- At each hourly wake: the handover check above, and archiving finished sessions.
- Every 4 hours: account B's report.json.
- Asks Dinis for each account's bandwidth until the maestros report it themselves.
