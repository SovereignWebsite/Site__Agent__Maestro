#!/usr/bin/env python3
"""Seal a vault key to maestro.a (account-a) and append it to its inbox. Needs sgit-ai==0.27.0. Prints no secret.
  python3 -I seal_to_maestro.py --from <your agent name> --vault-id <id> --key-file <file holding the vault key> [--note "..."]
      [--sign-fingerprint <your sgit bundle fingerprint> --passphrase-file <file holding your key store passphrase>]
With --sign-fingerprint the entry is signed with your own sgit key (from ~/.sg-send/keys), so the maestro can check who
sent it against your published key; without it the entry is sealed but unsigned.
The key is read from a file (never argv, never stdout). The inbox and its key are fetched from promptugal.news and the
encryption fingerprint is checked against board/keys.json (id maestro.a-account-a) before anything is sealed."""
import argparse, base64, datetime, json, sys, urllib.request
from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
WANT = 'sha256:7b84926cc96c79ee'
get = lambda u: json.load(urllib.request.urlopen(u, timeout=30))
a = argparse.ArgumentParser(); a.add_argument('--from', dest='frm', required=True); a.add_argument('--vault-id', required=True)
a.add_argument('--key-file', required=True); a.add_argument('--note', default='')
a.add_argument('--sign-fingerprint'); a.add_argument('--passphrase-file'); o = a.parse_args()
ib = get('https://promptugal.news/board/inboxes/maestro.a-account-a.json')
ks = [k for k in get('https://promptugal.news/board/keys.json')['keys'] if k['id'] == 'maestro.a-account-a' and k.get('status') == 'active']
if not ks or ks[-1]['encryption_fingerprint'] != WANT or ib['recipient']['fingerprint'] != WANT: sys.exit('seal: the inbox key does not match maestro.a-account-a; nothing sent')
secret = open(o.key_file).read().strip()
msg = {'kind': 'vault-key', 'from': o.frm, 'to': ib['agent'], 'sent': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ'),
       'vault_id': o.vault_id, 'vault_key': secret, 'note': o.note}
c = PKI__Crypto(); sign = {}
if o.sign_fingerprint:
    import os
    from sgit_ai.crypto.pki.PKI__Key_Store import PKI__Key_Store
    if not o.passphrase_file: sys.exit('seal: --sign-fingerprint needs --passphrase-file; nothing sent')
    pair = PKI__Key_Store(keys_dir=os.path.expanduser('~/.sg-send/keys'), crypto=c).load_key_pair(o.sign_fingerprint, open(o.passphrase_file).read().strip())
    if not pair or not pair['metadata'].get('signing_fingerprint'): sys.exit('seal: no key pair with that fingerprint in ~/.sg-send/keys; nothing sent')
    sign = {'signing_private_key': pair['signing_private'], 'signing_fingerprint': pair['metadata']['signing_fingerprint']}; del pair
env = c.hybrid_encrypt(c.import_public_key_pem(ib['recipient']['encrypt']), json.dumps(msg), **sign); del secret, msg, sign
env = env if isinstance(env, str) else json.dumps(env)
req = urllib.request.Request(f"{ib['endpoint']}/api/vault/append/write/{ib['vault_id']}", method='POST', headers={'Content-Type': 'application/json'},
                             data=json.dumps({'append_token': ib['append_token'], 'payload': base64.b64encode(env.encode()).decode()}).encode())
r = json.load(urllib.request.urlopen(req, timeout=60))
print('sent, file_id ' + str(r.get('file_id', ''))[:12] if (r.get('ok') or r.get('file_id')) else f'not sent: {r}')
