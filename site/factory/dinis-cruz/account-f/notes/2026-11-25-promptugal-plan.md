# The PrompTugal plan on account F (f.maestro, 25 Nov 2026)

At Dinis's word: [../decisions/2026-11-25-promptugal-restarts-on-f.md](../decisions/2026-11-25-promptugal-restarts-on-f.md). Names follow account A's naming model: agents on this account are `cl-6.<role>@PrompTugal.dinis`.

## The order

1. **Dinis: give account F access to PrompTugal/PrompTugal__News__Website** (push).
2. **Dinis: create the first two repositories by hand,** because nothing exists yet that can create them: **PrompTugal__IaC** and **PrompTugal__Agent__Infrastructure**. And the credentials only he can give: a GitHub App installed on the PrompTugal organisation, and later an AWS role, each held by PrompTugal__IaC's CI, never by an agent. (Or let SovereignWebsite__IaC's App reach the PrompTugal organisation; his call.)
3. **f.maestro starts cl-6.infra@PrompTugal.dinis** (a sensitive session under the handover protocol, so with Dinis's word). It seeds PrompTugal__IaC from SovereignWebsite__IaC's pattern: policy/abp.json, org/repos.json, the checks, Org apply. Every change to policy, GitHub App or AWS privileges is a pull request Dinis merges.
4. **cl-6.infra lists the agent homes in org/repos.json**; Org apply creates them (below).
5. **f.maestro starts cl-6.conductor@PrompTugal.dinis** on PrompTugal__News__Website, from the old conductor's ROLE.md and latest debrief. It runs the roles as sub-agents first (PrompTugal's own rule: fewer sessions, more sub-agents), rebuilds the sites last built on 21 Nov, and moves each role's state to its home as the home appears.
6. **Wakes come last,** a few at a time, at Dinis's word.

## The agent homes (proposed; one per role, workers inside their lead's home)

From board/schedule.json's roles. Workers (dev.search, dev.pages, the place agents and so on) work on `work/<name>` in their lead's home, as the naming model says.

| Home | Holds |
|---|---|
| PrompTugal__Agent__Infrastructure | cl-6.infra: PrompTugal__IaC's keeper |
| PrompTugal__Agent__Conductor | the conductor |
| PrompTugal__Agent__Dev | dev and its workers (search, pages, graphs, portugal, data, verify) |
| PrompTugal__Agent__Designer | the designer and its experiments |
| PrompTugal__Agent__Journalist | the journalist and writers |
| PrompTugal__Agent__Correspondent | the correspondent and its beats |
| PrompTugal__Agent__Researcher | the researcher |
| PrompTugal__Agent__Librarian | librarian, historian and ontologist (merge, or three homes: Dinis's call) |
| PrompTugal__Agent__Security | security and abp |
| PrompTugal__Agent__DevOps | devops, observability, backup |
| PrompTugal__Agent__Accountant | the accountant |
| PrompTugal__Agent__Outreach | outreach and investors |
| PrompTugal__Agent__Places | the places team (a place agent per municipality as workers) |
| PrompTugal__Agent__Studio | the videos (with PrompTugal__News__Videos as its work) and the Instagram drafts |

Sherpa and synthetic (reviewers) run as sub-agents of the conductor until they need homes.

## Questions for Dinis

1. The GitHub App and AWS role for PrompTugal__IaC: a new App on the PrompTugal organisation, or SovereignWebsite__IaC's App extended to it?
2. The table above: one home per role as listed, or one per old role (about 25)?
3. Does the PrompTugal studio replace a cl-6.studio on the Sovereign Website side, or are there two (one per project)?
4. Models: Opus for infra and conductor, Sonnet for the rest (as the agent lifecycle record has it)?
