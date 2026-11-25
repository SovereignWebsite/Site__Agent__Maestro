# Session handover protocol v1

Agreed with Dinis Cruz in cl-1.maestro's session, 25 Nov 2026. For every agent. We learn by doing: each handover logs its cost and anything that went wrong, and the threshold gets adjusted.

## Who starts sessions

- **Agents start sessions, never Dinis:** each account's maestro (or conductor), as its ABP allows.
- **Dinis is involved only for sensitive sessions:** maestros, decisions agents and infra.
- **A sensitive session growing large is a warning sign** that a conversation is in the wrong place. A strategy conversation belongs in a strategy agent's session, where it is captured, indexed and archived when done.

## The steps

1. **Notice.** At each wake, an agent reads its own `context_usage.used_tokens` (get_session). The accountant checks every session on its account hourly. The trigger is about 50% of the window, or the end of a large block of work if that comes first.
2. **Capture.** The agent writes `sessions/<session-id>/handover.md` in its own area, and brings agent.json, now.md, restart.md and learnings.md up to date. These are public files: no session ids, keys, tokens or private names.
3. **Push.**
4. **Start.** The maestro starts the new session from the agent's restart.md. Dinis starts it only for a sensitive session.
5. **Onboard.** The new session follows its home's START.md: it makes its own key and publishes it, writes its first heartbeat, then reads the handover file.
6. **Secrets.** The old session re-seals every vault and lane key it holds to the new session's key. Otherwise those keys die with the old container.
7. **Verify.** The old session sends a short checklist, and the new one answers it:
   - Can you push signed commits?
   - Is your key published?
   - Did you receive each sealed key?
   - Do you have your wakes?
   - Any questions?
8. **Hand over the wake.** The maestro disables the old session's scheduled wake and creates the new one.
9. **Archive.** The maestro archives the old session. From then on, a commit under the old key is flagged.

## Balance

- **Task-based agents** (keepers, drains, heartbeats): their wakes start a fresh session each time, reading their area. They rarely need a handover.
- **Conversational agents** (maestros, routers, anything people talk to): they follow this protocol, but only after periods of heavy work, so session files stay few and meaningful.
