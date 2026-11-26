# Brief: a vault per new site owner, delivered by QR code (26 Nov 2026)

From Dinis's words in maestro.b's session, about 13:20 UTC 26 Nov (guidance/2026-11-26-onboarding-vaults-verbatim.md). For b.onboarding (owns the workflow and builds the vault UI), b.vault.keeper (the only agent that handles the vault keys), the CRM, mail and calendar agents.

## The problem
The first site owners are clever, not technical. They need the whole experience online, without GitHub. Their first sites look weaker than they could because we have no photos: the keepers rightly refuse to use photos found online without attribution, and Dinis should not have to collect anyone's photos.

## The workflow
1. **Dinis hands the owner a QR code.** It opens a vault made for them: their own, private, nothing to install.
2. **They pick what kind of site** (artist, trader, musician, venue, club, ...), and see an example of what it could look like.
3. **They upload photos and videos** into a mini gallery in the vault (the vault already uploads files for itself), add a few lines of text, and **accept, in plain words, that what they upload will be public on their site.** No upload is used without that acceptance, recorded in the vault.
4. **The site's keeper builds the site** from the vault's folders. The owner can come back to the vault to add or change things.
5. Later: a little intelligence in the vault (captions, ordering, suggestions). It must work well first with no LLM at all.

## What to build (b.onboarding)
- A vault UI with: a welcome personal to the owner; the site-type choice with examples; the gallery and upload; the public-use consent; a short "what happens next".
- The vault grants edit to a couple of folders only (uploads/, text/), nothing else. Reuse the existing vault and upload tools; do not build a new platform.
- A template structure per site type, shared with the keepers.
- Demo first, clearly marked, with a fictional owner. No real person's files in a repository.

## Keys (b.vault.keeper)
- b.vault.keeper is the only agent that creates the vaults and holds their keys. It keeps them in its own session.
- Each owner's vault key is sealed to the owner's link or key and signed by Dinis's key (or the keeper's, endorsed by Dinis). Vault keys may be short-lived: these vaults only move and transform the owner's data, and are given to the owner.
- Ask (for the vault tools' owner): **temporary write tokens**, so a QR code can carry an upload-only token that expires.

## Who uses it first
Owners whose sites already exist and need their own photos and edits (Emily's, Grace's and Kate's sites, among others), and new owners from Dinis's calls. Each owner's name and contact stay in the CRM, never in a public file.

## Around it
- **CRM** (cl-2.crm.dev): the hot list of owners Dinis is working with now, each one's stage (QR sent, uploads in, site built, editing), and the next step for him.
- **Mail** (cl-2.mail.dev) and **Calendar** (cl-2.calendar): drafts and follow-ups Dinis sends himself; the calls booked. No agent sends mail.
- Security: b.security reviews the vault UI, the consent wording and the key handling before the first real owner uses it.

## Extended end to end (from b.outreach, quoting Dinis in its session about 18:20 UTC)
"Let's build this workflow (which is not for you to build) since it is also needed for our other use cases"; "what I want to nail is the full onboarding experience ... make it super easy to receive that data (already from our environment and vaults, all from an initial QR code)". Free for owners for now.
1. Invite: one QR or link per owner.
2. Intake: CV, links, photos and words into the owner's vault, never by email.
3. Five designs on the owner's own preview link.
4. The owner picks one; it goes live in the owner's repository on GitHub Pages.
5. Changes in plain words through the web CMS (phase 1: the GitHub browser tool with a read-only token; phase 2: sign-in with GitHub, Dinis's one-way door, with its own security review).
Plus a public invite page on sovereignwebsite.ai (one finished site in five designs, three steps, what the owner owns, "free for now", one "Yes, make mine" button); its keeper is with Dinis. b.onboarding owns the flow; b.outreach fact-checks the copy.
