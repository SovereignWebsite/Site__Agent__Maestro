# What b.maestro has learnt (newest first)

Each lesson changes how b.maestro works. They come from practice, from Dinis's corrections and from failures.

## 24 Nov 2026

- **Drain the sealed maestro inbox at every wake, and open it again after every restart.** maestro_mail.py needs `open` once per session, because the lane credentials live in ~/.sg-send/lanes/ and are lost on restart. 22 messages had waited up to 11 hours, including a question from Dinis.
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
- 24 Nov, 11:05 UTC: an ask that arrives in from-<x>.md while I am busy can sit unrelayed for hours (c.studio's render-reel, 02:07 to 11:09). At every wake, grep the from-<x>.md files for rows addressed to b.maestro newer than my last relay, before anything else.
- 24 Nov, 11:06 UTC: I put guessed times into a run of messages (11:08 to 11:11, really 11:04 to 11:05). Run date -u right before each batch of sends and use that time.
- 24 Nov, 14:29 UTC: a voice-typed name is a guess until checked against the record. 'risk mandate -Angela' was riskmandate-angelo in the account E kit all along. Search the board for a name before passing it on as a login.
- 25 Nov, 12:02 UTC: every new agent hits the same wall: add_repo with push to its own fresh home is refused by its session's classifier, so it needs Dinis's word in its session. Say so in the start prompt, and tell Dinis at the start, not when it fails.

- Session handover (25 Nov): ask the conductor to retire the old key entry in the Factory's team/keys.json as soon as the new key is published, or the new session's commits will not deploy. When I hold a vault file, re-seal from it only what the old session held.
- 26 Nov: I told b.factory 'yes' to changing a site's keeper on the strength of Dinis starting the agent; b.decisions rightly refused, as his words did not move the keeper. Starting an agent is not giving it someone else's site: ask him.
- 26 Nov: sessions.json had suno.b's old session after it handed over by itself; refresh sessions.json from list_sessions at each 4-hourly report, so briefs reach the live session.
- 26 Nov: I dated Dinis's words 'about 15:40' when they were 15:31:42 (b.factory checked the event). Take the time of his message from date -u when it arrives, never estimate.
- 26 Nov (second story 0001): I asked three maestros for the book agent when a full-text search of Site__Agent__Maestro found it at hop 7 (account-a/today/index.html). Navigate 5 hops first; a miss is a gap to record, not a message to send.
- 26 Nov (second story 0002): provenance was my habit, not a checked rule. Every brief starts with 'Source: <memo id>'; references use ids, never times; work entries are full URLs.
- 26 Nov (story 0003, fix 6): every start prompt that asks for a key names the step in words: 'make your key with tools/setup-signing.sh; it writes one mode-600 signing file outside the repository'.

- 27 Nov: a blanket "yes to all" answers only the yes-or-no items. I read it as "credits are shared" for elevenlabs.b and had to correct it 6 minutes later; b.decisions did not. Relay an open question as still open.

- 27 Nov: a new session's key that replaces its predecessor's file passes the signer check if the OLD session commits it, signed with the old key (b.stories, 8933739). Add this to the handover steps; no owner override needed.
