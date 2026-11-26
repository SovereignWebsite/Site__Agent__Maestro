# Plan of action: owners' vaults, CRM, mail and calendar (26 Nov 2026, draft 1)

At Dinis's word in maestro.b's session, about 13:20 UTC 26 Nov (guidance/2026-11-26-onboarding-vaults-verbatim.md). The build brief: briefs/2026-11-26-onboarding-vaults.md. Each agent's own plan comes back as a link in its area and is added here.

## Who does what

| Agent | Model | Job | Status |
|---|---|---|---|
| b.onboarding | Sonnet | owns the workflow; builds the vault UI (welcome, site type with examples, gallery and upload, public-use consent, what happens next) | plan in 13:24: agree folders with the keeper, no-LLM demo, reuse vault tools, b.security before any real owner; **push to Site__Agent__Onboarding refused** |
| b.vault.keeper | Opus | the only agent that creates owners' vaults and holds their keys; QR access; sealing and signing; the "temporary write tokens" ask | started 13:22; home asked of b.factory |
| cl-2.crm.dev | Opus | the CRM, moved from account A; first job: Dinis's hot list of owners and their stage | plan in 13:24: a #/hot page (stage, next step, days waiting), data only in an encrypted vault; tests 24/24 (one maybe flaky); **holds until Dinis speaks in its session** |
| cl-2.mail.dev | Sonnet | the Gmail tool, moved from A; drafts Dinis sends himself (QR, uploads in, site ready) | working; **push to the Email Cell refused** |
| b.calendar | Sonnet | a Google Calendar tool, the Gmail tool's twin; calls with owners | plan in 13:24: read Dinis's own calendar in his browser, propose three slots, invite as a draft he creates himself; key made; waits for its home |
| b.security | Opus | reviews the vault UI, consent wording and key handling before the first real owner | to brief once the plans are in |
| each site's keeper | Sonnet | builds the owner's site from the vault's folders | after the demo |

## Steps
1. **Today:** each new agent makes its key and sends its one-page plan; b.factory makes the two homes; the CRM gets its vault keys sealed to its new key.
2. **Demo:** b.onboarding and b.vault.keeper ship one fictional owner's vault end to end (QR, type, uploads, consent), clearly marked.
3. **Review:** b.security on the demo.
4. **First owners:** Dinis hands QR codes to the owners whose sites exist and need their photos, and to new owners from his calls; the CRM tracks each one.
5. **Later:** a little intelligence inside the vault; temporary write tokens once the vault tool has them.

## What only Dinis decides
- **In cl-2.crm.dev's session** (https://claude.ai/code/session_01Kw9UwDtVrNDaZZiNceBp5H): attach Site__Tool__CRM (push, dev only); where its key is published; which vault holds the real hot list (it suggests a new confidential "Site owners" vault made in Dinis's browser, so no agent holds the data); whether to rotate the Requests inbox's enum key (crm.dev.a once printed part of it in its own session).
- **In b.onboarding's session** (https://claude.ai/code/session_01Kw9UwDY33zG6K3quxgKEAA): push to Site__Agent__Onboarding.
- **In cl-2.mail.dev's session** (https://claude.ai/code/session_01Kw9UwBXbhLqW5YqytqTBTn): push to AgentiCCells__Cell__Email.
- **For b.calendar:** the Google client and consent screen (freebusy and calendar.events only), which calendar, your working hours.
- Push access for each new session, in its own session, if refused.
- How the CRM's vault keys reach cl-2.crm.dev (cl-1.maestro holds Our work and Team contacts).
- Whether a.crm.design and a.crm.studio move to B at all, since design now happens on other accounts.
- The Google client and consent screen for the Calendar tool.
- The consent wording an owner accepts, once b.security has reviewed it.
