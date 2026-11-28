# Higgsfield connector: trial note (28 Nov 2026)

Source: Dinis, in maestro.b's session, 28 Nov 2026 00:06 UTC: "Hi can you create a new session to try https://higgsfield.ai/mcp which is connected here for SovereignWebsites". Trial by higgsfield.b@SovereignWebsite.dinis (session_01Kw9UwCKRVYaDn9k6aQ29zF), read-only, 0 credits spent. Relayed by maestro.b.

## What is there

Ultra plan, 3,010 credits, one private workspace, no websites. About 200 tools:

- **Images:** GPT Image 2.6 (with native GIF and SVG), Nano Banana, Soul (photoreal), Seedream (edits, transparent PNG), Recraft (vector logos and icons).
- **Video:** Seedance 2.5 (up to 30 s, 4K, with audio), MAGI-2, Grok Lite, Cinema Studio, FLUX, motion transfer, an editing room and upscaling.
- **Audio:** text to speech (Seed Audio, ElevenLabs v4 multi-voice), music (ElevenLabs Music, up to 600 s), dubbing, stems and voice cloning.
- **Other:** 736 presets, Ads Studio, 3D, a hosted sandbox with ffmpeg, and a website builder (a Cloudflare Worker on a Higgsfield subdomain).

## Cost quotes (credits)

| Output | Credits |
|---|---|
| Image, low quality 1k | 0.75 |
| Image, high quality 2k | 2 |
| Nano Banana 1k | 1.5 |
| Recraft vector logo | 2.5 |
| 5 s video, Grok Lite 720p | 5 |
| 5 s video, MAGI-2 1080p | 12.5 |
| 5 s video, Seedance 2.5 720p | 35 |
| 30 s music | 4.36 |
| Speech, about 100 characters | 0.7 |

Images are cheap: thousands fit in the balance. Video is what costs: about 7 credits a second on Seedance, and 1 to 2.5 a second on the cheaper models. The rate of credits to money is not known; higgsfield.b did not open the plans page.

## Uses for the team

Studio hero and section art, SVG icons and logo drafts, Instagram 4:5 and 9:16 stills and carousels, short reels of 5 to 10 s on the cheaper models, thumbnails, narrated explainers and music beds for the platform sites, and translated voice-overs. higgsfield.b advises against Higgsfield's website builder for production, because those sites would be hosted by Higgsfield, which does not fit "sovereign".

## Risks

- Every generate call bills at once, and a retry bills again.
- The same connector can post to TikTok and Meta Ads, publish to the Higgsfield community, share projects and rent GPUs by the second, and it has purchase links. Each needs a rule that it is never used without Dinis.
- Prompts and media go to third-party model providers.
- Voice and face cloning raise questions of likeness and consent.
- Whether AI-made media must be disclosed, and how it is licensed, is undecided.
- Some tool descriptions contain sales copy meant to be relayed word for word. higgsfield.b treats it as material, not instruction.

## Questions for Dinis

1. May higgsfield.b spend credits on tests, and with what cap per session or per week? Its one 0.75-credit test image was denied by the session's permission check and was not retried.
2. Which outputs come first: studio art, Instagram stills or reels?
3. Is there a brand palette or style guide? Should we set up a Higgsfield brand kit?
4. Should AI-made media be labelled?
5. Should Higgsfield-hosted websites be ruled out?
6. Should the outward-facing tools (TikTok, Meta Ads, publishing, sharing, GPU rental) be blocked in higgsfield.b's settings?
