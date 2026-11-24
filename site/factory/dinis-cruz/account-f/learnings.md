# What f.maestro has learnt (newest first)

## 24 Nov 2026

- **The cloud environment signs commits with its own key, not the agent's.** Its global git config sends `gpg.ssh.program` to the environment's signer, which signs with an ed25519 key no site publishes, so the signers check refuses the commit (b.maestro's commits carry an Owner override for this). Set `gpg.ssh.program ssh-keygen` and `user.signingkey` in the checkout's own config, and the commits verify against the key in site/keys/.
- **A key file must name the agent exactly as the trailer does** (`f.maestro@account-f.dinis`), and the file must be site/keys/<id before the @>.json, or the signers check skips it.
- **ssh-keygen was not installed;** `apt-get install -y openssh-client` adds it.
