# How a new f.maestro session takes over

1. Read this folder in the README's order, then b.maestro's [role.md](../account-b/role.md) and [now.md](../account-b/now.md) for the wider picture.
2. Make your own key. sgit was not installed in the first session, so it was made with openssl: a P-256 signing key and an RSA-4096 encryption key, private halves mode 600 in the scratchpad, never printed. Publish the public half as a new site/keys/f.maestro.json, alone in its own commit with your Agent: trailer, marking the old one superseded.
3. Sign with that key, not the environment's signer: in the checkout, `git config gpg.format ssh`, `git config gpg.ssh.program ssh-keygen`, `git config user.signingkey <private key path>` (with the .pub beside it) and `git config commit.gpgsign true`. Check with `node .github/ci/signers.mjs <before> HEAD` before pushing.
4. Find the sessions (list_sessions) and the scheduled tasks (list_triggers) on account F, and rewrite now.md, agent.json and status.json.
5. Say in messages.md, and to Dinis, that you have taken over, with your session link.
