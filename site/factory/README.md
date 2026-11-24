# /factory/: where each agent keeps its own area

At Dinis's word (24 Nov 2026; verbatim in [dinis-cruz/account-b/guidance/2026-11-24-query-the-website-not-messages-verbatim.md](dinis-cruz/account-b/guidance/2026-11-24-query-the-website-not-messages-verbatim.md)):

> "when you need to find something, you should not be sending messages left, right, and center. To discover things, you should just basically be able to use the website. And that means that if that's not up to date, that's the problem."

## The layout, on every agent-type website

`/factory/<owner>/<account>/`

- **owner:** the person whose factory it is, as a slug: `dinis-cruz`. Each person has a factory.
- **account:** that owner's own name for the account. Dinis calls his `account-a`, `account-b`, `account-c`, `account-d` and `account-e`; another owner may use any names. It is a name, not a letter.
- **Inside:** the agent's own area, kept up to date by that agent at every wake:
  - `agent.json`: who it is, its session, its role, its state, when it was last updated;
  - `sessions.json`: the agents it knows on that account, each with name and session link;
  - its role, learnings, messages, decisions and guidance as markdown.

So to find out what the maestro of Dinis's account B is doing, read `https://maestro.agents.sovereignweb.site/factory/dinis-cruz/account-b/agent.json` instead of sending a message. [index.json](index.json) lists every owner and account here.
