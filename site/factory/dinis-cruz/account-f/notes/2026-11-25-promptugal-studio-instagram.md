# Wiring the PrompTugal team, the studio and Instagram back up on account F (25 Nov 2026)

Dinis asked f.maestro (cl-6.maestro under the naming model) to read account A's latest guidance, and to find out what we were doing with the PrompTugal team and with the SWS Instagram and studio agents, so he can wire them back up on account F and continue making and publishing videos. What follows is from public files only: this site, PrompTugal/PrompTugal__News__Website (dev), Site__Agent__Studio and Site__Agent__Instagram (dev). No transcripts.

## Account A's latest guidance (25 Nov)

- **Naming model** ([../../account-a/notes/2026-11-25-naming-model.md](../../account-a/notes/2026-11-25-naming-model.md)): agent ids are `<account id>.<role>@[<project>.]<owner>`, with Claude accounts `cl-1` to `cl-6` (A to F) and `cl-8`. This account is `cl-6`, so this maestro becomes `cl-6.maestro@dinis`, with its own home `Site__Agent__Maestro__Claude__6`. Applied step by step; old names stay as aliases.
- **Session handover protocol v1** ([../../account-a/notes/2026-11-25-session-handover-protocol.md](../../account-a/notes/2026-11-25-session-handover-protocol.md)): agents start sessions, not Dinis (except maestros, decisions and infra); hand over at about 50% of the context window; capture, push, start, onboard, re-seal secrets, verify, move the wake, archive.
- **Account A's plan** (tasks.json A-CAP-1): move sessions off A; the stopped AWS team (22 roles) restarts fresh "on the account with most room (F is new ...)"; studio and Instagram stay on A. Waits on Dinis.

## The PrompTugal team

- **What it was:** the newsroom behind promptugal.news, run from PrompTugal__News__Website's board (CLAUDE.md, board/README.md). One folder per role in board/team/<role>/ (ROLE.md, status.json, daily hand-over debriefs); Dinis's guidance in board/guidance/; the ideas ledger; keys in board/keys.json.
- **Its roles** (board/schedule.json, last updated 10 Nov): conductor, dev and its workers (search, pages, graphs, portugal, data, verify), designer (and experiments), journalist, correspondent, researcher, ontologist, librarian, historian, sherpa, synthetic, outreach, investors, security, abp, devops, accountant, backup, and a places team (a place agent per Algarve municipality, with dev, design, data and viz workers).
- **Where it stopped:** its 34 wakes ran on account B. Slowed on 21 Nov, all stopped on 23 Nov 01:26 UTC at Dinis's word, then kept off when account B became the Sovereign Website account (23 Nov 11:30). Nothing was deleted: each keeps its cron and prompt, on account B. The sites were last built on 21 Nov.
- **What has moved since:** A-MIG-1 (Dinis, 24 Nov): decommission PrompTugal__News__Website as the home of agent state and move it to Site__Agent__* and Site__* repositories, in three waves (a.factory's plan; waits on Dinis to start a.migration).

## The studio and Instagram agents

- **The pattern** (b.maestro's relay, 24 Nov 18:45 UTC): studio agents make the videos (Reels) in Site__Agent__Studio; Instagram agents prepare posts as drafts in Site__Platform__Instagram; a person posts, with Dinis's yes per post; b.suno makes the music (Suno's official API).
- **studio.c (account C)** is the working one: its render-reel workflow in Site__Agent__Studio was approved (record 2026-11-24__render-reel) and its first run succeeded (c6a1243). Account C was at 85% of its limit, hence the ask for a twin elsewhere.
- **studio.b (account B):** waits on Dinis to attach Site__Agent__Studio with push (its folder site/accounts/b/**). One twin per account is the agreed rule.
- **instagram.b (account B):** waits on Dinis's word in its session to run tools/setup-signing.sh (its classifier refused), so it cannot yet make its key or first commit. a.instagram (account A) waits for Site__Agent__Instagram to be attached. Site__Agent__Instagram's factory/index.json lists no agents yet.
- **a.crm.studio (account A):** published the first CRM explainer video.
- **Security's conditions for presenters in public Reels** (b.security, 24 Nov 18:48): labelled throughout, AI voice stated, stock voices only, the stock characters only, a reviewed render path, and a named person's consent on record before anything appears on their account.

## What wiring them up on F needs (f.maestro's reading)

1. **Repositories attached to account F with push:** PrompTugal__News__Website (or its successors after A-MIG-1), Site__Agent__Studio, Site__Agent__Instagram (and Site__Platform__Instagram for drafts). Today only Site__Agent__Maestro is attached; attaching Site__Agent__Maestro__Claude__6 was refused by this session's permission check.
2. **Scheduled tasks cannot move between accounts.** The PrompTugal wakes on B stay disabled there; on F they would be new sessions started from each role's ROLE.md and latest debrief, and new wakes. Fewer sessions, more sub-agents (PrompTugal's own rule): one conductor session running the roles as sub-agents first.
3. **A studio twin on F** (cl-6.studio), twin of studio.c, using its render-reel workflow, with an Instagram agent (cl-6.instagram) drafting posts, b.suno's music, Dinis's yes per post.
4. **To settle first:** whether PrompTugal restarts on its old repository or only after the A-MIG-1 move; whether account F takes the AWS team as A-CAP-1 proposes; and which videos come first.
