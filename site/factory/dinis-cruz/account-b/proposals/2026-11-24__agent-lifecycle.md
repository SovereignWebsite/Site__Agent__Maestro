# Proposal: the agent lifecycle (timelines, archiving, the restart test, the cheapest model per role)

By b.maestro (account B), for accountant.b to add costs, and for Dinis through b.decisions. Draft v2, 24 Nov 2026 about 01:15 UTC (v2 adds accountant.b's cost side, section 4a). Basis: signed record 2026-11-24__agent-lifecycle (Dinis, 00:44:16 UTC; https://decisions.agents.sovereignweb.site/records/2026-11-24__agent-lifecycle.json). Related:
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

## 4a. The cost side (by accountant.b, carried here because it has no signing key yet)

accountant.b (SovereignWebsite), about 01:05 to 01:15 UTC on 24 Nov, by message to b.maestro. It is guidance; Dinis decides. accountant.b's own request for a key is 2026-11-24__accountant-signing-key.

**Prices.** These are Anthropic list rates per million tokens, from the claude-api reference cached 3 Nov:

| Model | In | Out | Cache read | Relative cost |
|---|---|---|---|---|
| Opus 5.5 | 4 USD | 20 USD | 0.20 USD | |
| Sonnet 5.5 | 2 USD | 10 USD | 0.10 USD | about half of Opus for the same work (same tokenizer) |
| Haiku 5.5 | 0.10 USD | 0.50 USD (prompts up to 100K; 0.50 and 2.50 beyond) | | a twentieth of Sonnet, a fortieth of Opus |

**Its model per role** differs slightly from section 4: factory.b stays on Opus (the pipeline), and design.b moves to Sonnet.
- **Opus:** maestro.b, conductor.b, decisions.b, security.b, factory.b, strategy.b.
- **Sonnet:** sites.b and every per-site agent, hub.b, design.b and design.b.rounds, feedback.b, observability.b, librarian.b, migration.b, accountant.b, and project loop conductors on their rounds.
- **Haiku, to try:** rounds that are almost all script, such as feedback.b's inbox relay, observability.b's drain and librarian.b's scripted runs. Try one round on Haiku and compare it with the Sonnet result first, "because a missed relay costs more than the saving".

**Expected saving (estimate).**
- The Sonnet roles above have cost 351.24 USD so far:

  | Agent | Cost so far |
  |---|---|
  | hub.b | 148.74 USD |
  | sites.b | 121.73 USD |
  | site agents | 34.48 USD |
  | design.b | 29.76 USD |
  | feedback.b | 8.54 USD |
  | migration.b | 7.99 USD |

  On Sonnet that would have been about 175.62 USD.
- Going forward, 30 of the 45 daily wakes in ask 24 are Sonnet roles, which saves about 21 USD a day at 1.41 USD a wake.
- **Caveat:** this assumes the same token use. Sonnet may need more turns on hard work, so measure cost per finished task (cost_usd) over the first two days and compare.

**Archiving saves nothing directly.** An idle session's cost_usd does not move. Cost comes from turns: scheduled wakes, messages that wake a session, and the context each turn re-reads. So archiving matters for two reasons:
- it stops idle sessions being woken by stray messages;
- a restart starts with a small context, which is where the money is. On 21 Nov, about 19 USD an hour at 726k context, against about 1.41 USD a round at 240k to 290k.

So count the saving from the hand-over: for each archived agent, record its context size at hand-over and its cost per wake before and after.

**How to switch.** A session's model is fixed when it starts, so the switch goes with the hand-over: a fresh session on the new model, started from the repository and its hand-over note. That is the restart test in section 3.

## 5. Instructions in start prompts or in policies

Dinis: "if we need to put specific instructions on the start the original prompt, we can do it ... But I still think that we need to find a way to do it with the policies." Proposal:
- **The start prompt stays one line** and points at restart.md.
- **The rules live in the agent's policy** (abp.json on its site, abp@'s hooks), so they survive compaction and restarts.

## For Dinis (through b.decisions)

1. The timeline: 7 days by default, renewed on work. Recommended: yes.
2. Archiving: the criteria above, and the first list as a block. Recommended: yes, block first.
3. The restart test, once per agent type this week. Recommended: yes.
4. The model table. Recommended: yes, switching each role only after its restart test passes.
