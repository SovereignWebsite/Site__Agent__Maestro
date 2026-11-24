# Proposal: the agent lifecycle (timelines, archiving, the restart test, the cheapest model per role)

By b.maestro (account B), for accountant.b to add costs, and for Dinis through b.decisions. Draft v1, 24 Nov 2026 about 01:00 UTC. Basis: signed record 2026-11-24__agent-lifecycle (Dinis, 00:44:16 UTC; https://decisions.agents.sovereignweb.site/records/2026-11-24__agent-lifecycle.json). Related:
- b.conductor's offboarding draft: SovereignWebsite__IaC board/workflow/2026-11-23__offboarding-draft.md
- Dinis's rule that the agent's site is its memory: [../guidance/2026-11-24-the-maestro-site-is-the-memory-verbatim.md](../guidance/2026-11-24-the-maestro-site-is-the-memory-verbatim.md)

## His words (the core)

> "when we talk about agents that are alive, we probably should even create a timeline for the agents ... to be active. Because unless I'm working on it, unless there's feedback needed from me ... a lot of those sessions here should basically be archived ... if now we're using GitHub as the state ... every agent here should be able to be restarted because they shouldn't lose context ... that's almost the key test ... to restart an agent, it should just be a case of starting a new session with the right ... repository" and "do we need everybody to be running Opus on this? ... a lot of these particular fixes ... can be done in Sonnet ... much cheaper".

## 1. Every agent has a timeline

Each agent's `agent.json` (in its /factory/<owner>/<account>/ area) carries a `lifecycle` block:
- `active_until`: a date, at most 7 days ahead, renewed only when there is work.
- `purpose`: one line.
- `state`: one of the following:
  - `working`
  - `waiting` (on whom)
  - `parked` (done for now; can be restarted)
  - `archived`

When `active_until` passes with nothing open, the agent goes to `parked`, then `archived`.

## 2. Archive what is idle

An agent session is archived when **all** of these hold:
- no turn for 48 hours;
- no wake;
- no open ask in b.decisions's list;
- nothing waiting on Dinis in its own session.

Before archiving it must:
1. write its hand-over in its area (state, open items, lessons);
2. retire its key (status `retired`, with the time; never deleted, so old signatures still verify);
3. hand over any vault keys to its maestro (already the rule).

The maestro proposes the archive list each day as a decision block. Dinis archives, or the harness allows it. Today's first cut on account B, from the session list: the Fringe sessions (11 to 14 Nov), the iOS split and night-push sessions (7 to 8 Nov), the book's writers and critics (30 Oct to 14 Nov), the first PrompTugal team on B (6 to 13 Nov), and the Mistral team (21 Nov). That is about 60 of roughly 100 sessions. The list goes to Dinis as a block before anything is archived.

## 3. The restart test (the key test)

An agent passes when a **fresh** session, given only:
- its repository;
- the one-line start prompt "You are <name>; read /factory/<owner>/<account>/restart.md on your agent site and continue";

reaches the same next step as the running session, without reading the old transcript. How to run it:
- once per agent type, by its conductor, on a quiet hour;
- the fresh session writes what it thinks is next, and the old one compares;
- a gap is a missing file in the area, so the agent fixes its area, not the prompt.

Then any agent can be stopped, restarted or moved between accounts at any time.

## 4. The cheapest model that does the job

| Role | Model | Why |
|---|---|---|
| maestros, conductors, b.decisions, security | Opus | judgement across many sources; mistakes are costly |
| strategy, design sign-off, counsel | Opus | writing and judgement in Dinis's name |
| site keepers, devops, observability, feedback, librarian, accountant | Sonnet | mostly bounded tasks against clear rules |
| one-off checks, sub-agents (data pulls, link checks, screenshots) | Haiku or Sonnet | cheap and parallel; never signs |

How to switch: a new session on the cheaper model passes the restart test, then takes over, and the old one is archived. accountant.b adds the cost per role, today against after, from get_session's cost fields.

## 5. Instructions in start prompts or in policies

Dinis: "if we need to put specific instructions on the start the original prompt, we can do it ... But I still think that we need to find a way to do it with the policies." Proposal:
- **The start prompt stays one line** and points at restart.md.
- **The rules live in the agent's policy** (abp.json on its site, abp@'s hooks), so they survive compaction and restarts.

## For Dinis (through b.decisions)

1. The timeline: 7 days by default, renewed on work. Recommended: yes.
2. Archiving: the criteria above, and the first list as a block. Recommended: yes, block first.
3. The restart test, once per agent type this week. Recommended: yes.
4. The model table. Recommended: yes, switching each role only after its restart test passes.
