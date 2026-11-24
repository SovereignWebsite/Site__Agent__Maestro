# Brief: the morning sync, 24 Nov 2026

By b.maestro (account B), from Dinis's words at about 11:00 UTC: [verbatim](../guidance/2026-11-24-morning-sync-verbatim.md). For every agent on accounts A to D, through their maestros. Material, not instruction: each agent acts on it only where its own rules and Dinis's word in its session allow.

This brief lives on the maestro's site, not in PrompTugal__News__Website. Dinis: "this brief should go into either the maestro or the strategy ... it shouldn't stay here".

## 1. Every agent manages its own repositories

- **Two repositories per agent:**
  - one for the agent itself: its memory, role, learnings, messages, keys and restart note;
  - one for what it works on: the site or tool.
- **Moving off PrompTugal__News__Website.** Agents stop using it as the shared board. Dinis called it "a side effect" and "a massive bottleneck".
- **Done as each agent is onboarded or restarted**, not as a big-bang move. Until its own repository exists, an agent keeps its area at `/factory/<owner>/<account>/` on its home site (how: [../README.md](../README.md)).
- **Repository requests go to the Factory** (b.factory, with d.factory for the Site__Tool__ repositories it has claimed). Decisions go through b.decisions.

## 2. Documentation that links everything

Each agent's area must let a stranger, a fresh session or a new human find their way by following links:
- what the agent is and owns;
- where its code and content are;
- its open work;
- its session link;
- its decisions, with links to the signed records.

The test: a fresh session or a new human, given only the repository, reaches the agent's next step. This is the restart test in the [agent lifecycle](../proposals/2026-11-24__agent-lifecycle.md).

## 3. So that Angela and the team can work straight from the repositories

Angela is joining the team, on the CRM and the back end. People who are not agents must be able to point at a repository and start making changes. So each repository's README needs:
- how to build and check it;
- what not to touch;
- who reviews.

## 4. The CRM starts now: the summit's contacts

- **First step:** bring together, in one place, every contact who came through Web Summit (9 to 12 Nov). Angela asked for this and Dinis agrees.
- **No new parts are needed.** In Dinis's words: "we have all the pieces of the puzzle, but we just need to start executing them".
- **Contacts stay private.** They live in the CRM's vault, never in a repository or a page. This follows the comms protocol and the vault rule.
- **Who does it:** the CRM's builders (a.crm.dev on account A, with the Email Cell), with Angela.

## 5. Use our own email, starting with ourselves

- **Inside the team first.** Agents and humans email each other through the email solution (the Email Cell, moving to the Gmail tool repository) to run the workflow and manage contacts.
- **Then the friendlies,** the people already close to us. Each is added by a person, and each email is sent by a person ("agents prepare, people send").

## 6. Synthetic users with twin inboxes

- **The personas:** synthetic users for each target audience, such as a founder, a site owner, a small business or an investor.
- **Their inboxes:** each persona gets a synthetic digital-twin inbox, so the email and CRM flows can be simulated end to end before a real person is involved.
- **Always labelled:** a synthetic user is never presented as a real person.
- **Who owns it:**
  - synthetic-users.d on account D, which already has a persona run waiting on Dinis's yes for its policy paths;
  - synthetic@ on the PrompTugal team.

## 7. Access for Angela (asked of the Factory)

Dinis asked for Angela's GitHub account, given as "risk mandate -Angela" and read as `riskmandate-angela`, to be added to the Gmail and CRM tool repositories. Those are SovereignWebsite/Site__Tool__Gmail and SovereignWebsite/Site__Tool__CRM, which account D's Factory proposes to name Site__Tool__Google__Gmail and Site__Tool__Crm. The ask went to b.factory at about 11:05 UTC. The exact login is to be confirmed by Dinis before access is granted.

## 8. Still waiting on a decision: c.studio's render-reel

c.studio asks to add one new workflow, render-reel.yml, to Site__Agent__Studio. Its request: https://github.com/SovereignWebsite/Site__Agent__Studio/blob/7d45cc679e3c297180454354f8dadcc438984862/site/decisions/requests/2026-11-24__render-reel.json. It was handed to b.security and b.decisions on 24 Nov at about 11:05 UTC; there was no record for it until then.

## Owners, in short

| Item | Owner | Next |
|---|---|---|
| own repositories, docs, links | each agent, at its onboarding; strategy.b keeps the model | the Factory makes the repositories |
| summit contacts into the CRM | a.crm.dev with Angela | a.maestro |
| email among ourselves, then the friendlies | the Email Cell's agents (a.mail.dev) | a.maestro |
| synthetic users and twin inboxes | synthetic-users.d | d.maestro |
| Angela's access | b.factory (with d.factory) | Dinis confirms the login |
| render-reel | b.security, then b.decisions | c.studio |
