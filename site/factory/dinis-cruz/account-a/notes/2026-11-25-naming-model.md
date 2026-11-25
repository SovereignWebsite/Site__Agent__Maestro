# The naming model for agents, accounts and their repositories

Agreed by Dinis Cruz in a.maestro's session, 25 Nov 2026, step by step. To be applied incrementally: nothing is renamed until the steps below say so, and old names stay as aliases until no reference remains.

## Agent ids

`<account id>.<role>[.<speciality>]@[<project>.]<owner>`

- **Account id:** a platform code plus a number, the first thing on every channel and browser tab.
  - Claude: `cl-1` (account A), `cl-2` (B), `cl-3` (C), `cl-4` (D), `cl-5` (E), `cl-6` (F), `cl-8` (the 8th account).
  - Other platforms: `mi-N` (Mistral), `gpt-N` (ChatGPT), `gem-N` (Gemini).
- **Role:** the second segment, for example `maestro`, `router`, `infra`, `drive`. A hyphen inside the account id keeps it one token, so the role is always the second dot-segment.
- **Speciality:** optional, a worker of the role. A worker with no repository of its own works on `work/<its name before @>` in its lead's repository, for example `cl-1.aws.iam`. A hub's router may have one worker per counterpart, named by the counterpart's full name: `cl-1.router.claude-8`, `cl-1.router.mistral-1`.
- **After the @:**
  - **the owner alone** for owner-wide agents (maestros, routers, decisions): `cl-1.maestro@dinis`;
  - **project then owner** for agents inside one project: `cl-1.drive@SovereignWebsite.dinis`, `cl-1.ios@VoiceDebrief.dinis`.
- **Another owner's agents** carry their own account ids and owner. The other party appears only in a speciality, and a private person's name is used only with their consent.

## Repositories

- **Agent homes, one per role per account:** `Site__Agent__<Role>__<Provider>__<Number>`, for example `Site__Agent__Maestro__Claude__8` and `Site__Agent__Router__Claude__8`. No GitHub Pages and no custom domain, so no certificate slot. Only that agent writes there. The shared sites (maestro, router) list the homes by reading their dev branches.
- **Agent-type sites** keep their full words: `Site__Agent__Maestro`, `Site__Agent__Router`, `Site__Agent__Infrastructure` (formerly Factory).
- **The control repository** stays `SovereignWebsite__IaC`.
- **Area folders:** `site/factory/<owner>/<account>/` stays as the area folder on every agent site for now.

## Renames

- **`factory` becomes `infra`:** `cl-1.infra@SovereignWebsite.dinis`, site `Site__Agent__Infrastructure`.
- **Steps** (a.factory's plan: https://github.com/SovereignWebsite/Site__Agent__Factory/blob/dev/site/factory/dinis-cruz/account-a/proposals/2026-11-25-naming-model-steps.md):
  - 0: the ABP hooks read the new ids (abp@), and a.factory's workflow grant;
  - 1: the naming rules in the IaC;
  - 2: the Claude-8 homes;
  - 3: factory to infra;
  - 4: everything else, one at a time.

  Each step is a PR for Dinis's merge.
- **New policy entries:** each agent proposes its own, infra writes it, and Dinis merges.
