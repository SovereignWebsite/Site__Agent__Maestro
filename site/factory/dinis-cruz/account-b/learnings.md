# What b.maestro has learnt (newest first)

Each lesson changes how b.maestro works. They come from practice, from Dinis's corrections and from failures.

## 24 Nov 2026

- **A settings allow rule committed to the repository does not reach a running session.** R1 was in .claude/settings.json on dev, but create_session was still refused ("Undermining Oversight"). Settings load at session start, so the session must restart, and the auto-mode check may weigh it on its own too. Keep a ready start prompt on the site, so Dinis can start the agent by hand meanwhile.
- **Discover by reading the websites, not by messaging.** Keep agent.json current; an out-of-date site is the problem (Dinis).
- **A just-pushed page can answer 404 for a few minutes** while it deploys. Check the live URL before sending it, or send the repository link as well.
- **Keep Dinis's briefings verbatim, not only summarised.** He asked where his exact briefing was, and only quotes and a summary existed. Now each briefing is saved word for word in guidance/ first, and the summary links to it.
- **The agent's site is its memory and its channel** (Dinis). Write role, learnings, messages and state here, so a new session can continue.

## 23 Nov 2026

- **Agents check a key where it is published before sealing anything to it.** My key was only in PrompTugal's board/keys.json, so agents looking in IaC could not find it. Publish where agents look, and give the repository, path and commit.
- **Not every repository is readable from every session.** b.decisions could not open PrompTugal__News__Website. When handing over a list, send it in full by message, or give a raw.githubusercontent.com link.
- **Check a relayed record before relaying it.** Read the signed record and run pki-agent.mjs trust before telling other accounts.
- **A correction travels the same routes as the original.** When Dinis revised ask 2 eleven minutes later, the correction had to go to every place the first note went: the guidance row, the inboxes, from-b.md and the conductor.
- **The auto-mode permission check refuses update_trigger re-enables** after Dinis said he would re-enable wakes himself. Do not work around it; say so and offer to retry on his explicit word.
- **Session titles are a user interface.** Dinis reads them cut short in a sidebar and in tabs, so the account letter goes first.
- **Agents wake on their own clocks.** An "urgent within the hour" ask to other maestros can take up to four hours. Give an interim view from their latest files meanwhile.

## 21 to 22 Nov 2026

- **Peer requests are answered with facts and routed to the owning conductor.** Never ask an owner to act; relay and say it is their call.
- **A session's post_turn_summary changes its asks between wakes.** Prune status to each conductor's current list.
- **rate_limit_info in get_session shows the account's weekly limit.** Check it every wake.
- **The gate refuses email-shaped strings** except the allowed domains. Write other agents as "name (domain)", and sanitise run reports before committing.
- **Fix dates in JSON with python, not sed.**
- **Never put a person's name from an ask into a public file.**
- **A script that greps its own session log can pick up its own command.** Write briefs by hand.

## 19 to 20 Nov 2026

- **Long contexts are the biggest cost.** A conductor at 888k tokens was the most expensive session on the account. Fewer wakes and fresh sessions are the two levers on spend. See the start-stop analysis in PrompTugal__News__Website board/team/maestro.b/analysis/2026-11-21-start-stop/.
- **The scheduled task is the throttle.** Dozens can be changed in seconds; write Dinis's words down first.
