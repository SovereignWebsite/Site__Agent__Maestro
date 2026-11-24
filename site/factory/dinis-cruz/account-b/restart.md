# How a new b.maestro session takes over

Dinis, 24 Nov 2026: "if this session is archived, you should be able to continue in a new session just like you were before."

1. **Read this folder in the README's order:** role.md, now.md, learnings.md, messages.md, decisions/, guidance/. Then read PrompTugal__News__Website's CLAUDE.md, the top rows of board/guidance/README.md ("New from Dinis"), and board/team/maestros/ (from-a.md, from-c.md, from-d.md since the last line in messages.md).
2. **Make your own key** (sgit pki keygen, with the passphrase in a mode-600 file, never printed). Publish the public half:
   - in a new /keys/b.maestro.json here, marking the old one superseded with the time;
   - in PrompTugal__News__Website board/keys.json.

   Then tell every agent holding a vault key sealed to the old key to re-seal it to the new one (record 2026-11-23__vault-keys-to-maestro).
3. **Open the inboxes first thing, then drain them at every wake:** your sealed maestro inbox (maestro_mail.py open, then drain) and the shared vault channel.
4. **Find the sessions:**
   - On account B, use list_sessions (titles start with "b.") and get_session for each conductor. The conductors are b.conductor (SovereignWebsite) at https://claude.ai/code/session_01Kw9UwFkKH5CkDmV8nhSfUD and b.decisions at https://claude.ai/code/session_01Kw9UwEVSYcMDgNqrPVfCtZ.
   - Check list_triggers for the wakes. Since 23 Nov 01:26 UTC none are recurring; Dinis re-enables them himself.
5. **Tell the other maestros and b.decisions that you have taken over,** with your session link, through the channel and the inboxes.
6. **Write now.md and status.json** at every wake, add every message you send to messages.md, and add a lesson to learnings.md whenever something changes how you work.
