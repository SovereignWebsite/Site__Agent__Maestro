# Review: "Browser-only LLM access: provider options and onboarding recommendation"

a.maestro (account-a), reviewer sub-agent, 25 Nov 2026, at Dinis's ask. Dinis's goal: make AI as smooth as possible for non-technical users of static, no-backend web apps (Sovereign Website sites, the CRM tool at crm.tool.sovereignweb.site, the Gmail tool) and remove back-end complexity.

This review checks the brief against our constraints: static sites on GitHub Pages with a strict CSP, zero-knowledge where possible, no secrets in the frontend, no app-operated proxy if avoidable, UK/EEA users, and OpenRouter already in use elsewhere (Site__Platform__OpenRouter).

How it was checked: the public docs the brief cites were fetched on 25 Nov 2026. CORS preflights were sent from a dummy GitHub Pages origin to each provider's browser endpoint. The live Puter.js bundle and the WebLLM package were downloaded and searched for the hosts they call and for how they store tokens. Nothing was run end to end with a real account. Each claim carries one of these labels: **confirmed**, **partly confirmed**, **not found** or **not checked**.

## In one paragraph

The brief is careful and mostly accurate on facts. Its recommendation suits a **public demo**, but **not the CRM or the Gmail tool as they stand**, because it says too little about where prompts go and what third-party code can reach. Puter's sign-in is the smoothest of the options, but it routes prompts through a Canadian company to an upstream model host that nobody names. Puter's privacy policy says nothing about AI. Its script floats, cannot be pinned with SRI, and would run on the same page as the user's vault keys. OpenRouter OAuth is the stronger default for private data: it works from the browser (CORS confirmed), the user can set data policies per request, and we already use it. The NVIDIA route does not work from a browser at all (no CORS headers) and is licensed for prototyping only. WebLLM is the only option where nothing leaves the device.

## 1. Fact check

| Claim in the brief | Status | Notes |
|---|---|---|
| Puter `signIn()` opens a pop-up, must come from a user click, supports `attempt_temp_user_creation` | **Confirmed** | Error codes: `popup_blocked`, `auth_window_closed`, `not_available_in_app`, `unsupported_origin`. Fails on `file://` and in a sandboxed iframe without `allow-same-origin`. |
| Google is a Puter sign-in option | **Partly confirmed** | The docs mention Google only as an example ("a sign-in provider such as Google"). They do not list the providers. |
| Free allowance has no published figure, resets monthly, does not roll over | **Confirmed** | Purchased credits do not expire and are spent once the allowance runs out. |
| 30 requests per 10 s and 3 concurrent (free accounts) | **Confirmed** | The limits are counted per user and per app. A streaming chat counts as concurrent until it finishes. |
| `402` means balance exhausted, `429` means rate limit | **Confirmed** | `402 insufficient_funds` can also fire when several expensive requests start at once, not only when the month is used up. The UI copy should allow for that. |
| `getMonthlyUsage()` returns `allowanceInfo.monthUsageAllowance` and `remaining` | **Confirmed**, with a gap | The brief says "use the documented units" but does not give them. They are **microcents**: $0.01 = 1,000,000 microcents. `appTotals` and `usage` cover only the calling app. |
| "AI access is included in the app's default permissions" | **Confirmed, but incomplete** | After sign-in the defaults are also: an app folder in the user's Puter storage, a key-value store and **"create and publish websites on the user's behalf"**. That is much more reach than an AI button needs, and users should be told. |
| Puter DeepSeek ids, including `deepseek/deepseek-v4.1-flash` | **Confirmed** | The tutorial lists 14 DeepSeek ids, including dated and experimental builds. Its title says "Free, Unlimited". That is true for the developer only: the user pays from their allowance. Do not repeat "free, unlimited" to users. |
| `qwen/qwen4-max`, `moonshotai/kimi-k3`, `z-ai/glm-5.3`, `deepseek/deepseek-v4-pro` on Puter | **Confirmed** | All appear in Puter's tutorial. |
| Puter Technologies Inc., Vancouver, British Columbia law | **Partly confirmed** | The developer agreement is governed by British Columbia law (confirmed). The address and founder were not re-checked, and a founder's name is not needed in our notes. |
| Puter privacy policy: data may be processed "in Canada and locations around the world" | **Confirmed** | The policy **does not mention AI, prompts, model providers, training or GDPR/UK rights**. The brief understates this. |
| OpenRouter OAuth PKCE works from the browser with no client secret | **Confirmed** | `S256` challenge. The exchange is a POST to `https://openrouter.ai/api/v1/auth/keys`. Codes are single-use and expire after 10 minutes. Optional parameters: `key_label`, `limit` (US dollars), `expiration` (from `1-hour` to `1-year` or `never`), `state`. The CORS preflight returns `access-control-allow-origin: *` for both the key exchange and `/chat/completions` (tested). |
| "Keep the inference key in memory rather than persist it" | **Confirmed, but the docs conflict** | The OAuth guide says not to keep the key in browser storage and to store it encrypted on a server or in an OS keychain. OpenRouter's own `openrouter-oauth.md` skill says "Store `key` in `localStorage`". Our answer: keep it in the user's encrypted vault, set a `limit` and an `expiration`, and hold it in memory only while the page is open. |
| `:free` limits: 20 per minute, 50 per day, 1,000 per day after $10 of credits | **Confirmed** | The threshold placeholder on the page does not render (`{FREE_MODEL_CREDITS_THRESHOLD - 1}`), so the exact cut-off sits just under 10. |
| Free models: Nemotron 3 Ultra, Nemotron 3.5 Super VL, ERNIE 5.5 Flash Preview | **Confirmed** | The ids are `nvidia/nemotron-3-ultra-550b-a55b:free`, `nvidia/nemotron-3.5-super-vl:free` and `baidu/ernie-5.5-flash-preview:free`. Also listed: `google/gemma-4-26b-a4b-it:free` and `nvidia/nemotron-3.5-lightning:free`. The free list changes weekly, so do not hard-code it in the UI. |
| DeepSeek V4.1 Flash is paid on OpenRouter | **Confirmed** | 29 providers, from about $0.05 to $1.50 per million input tokens. No free variant was shown. |
| NVIDIA hosts Kimi K3.1 Pro, Mistral Large 4, GLM-5.3 Flash | **Confirmed** | The catalogue ids are `kimi-k3.1-pro`, `mistral-large-4-1t-a52b` and `glm-5-3-flash`. |
| NVIDIA hosts DeepSeek V4.1 Flash | **Not found** | It is missing from `build.nvidia.com/models.md`, and the cited `build.nvidia.com/deepseek-ai` page returns 404. Treat this as stale. |
| NVIDIA: 40 requests per minute | **Not found in official docs** | Only forum posts report it (consistently). The NIM FAQ says the free endpoints are for "prototyping, research, development and testing purposes only", and production needs an NVIDIA AI Enterprise licence. |
| NVIDIA: manual bearer key, no delegated flow | **Confirmed**, and worse than stated | Keys are made at build.nvidia.com/settings. **`integrate.api.nvidia.com` sends no CORS headers** (preflight and POST tested), so a static page cannot call it from a browser at all. |
| Cloudflare supports OAuth with PKCE for public clients | **Confirmed** | Token endpoint auth is `none`. The docs do not list a Workers AI scope. |
| Cloudflare token may call Workers AI from a browser (the brief's "candidate") | **Not possible as tested** | `api.cloudflare.com` answers the CORS preflight with `405` and no CORS headers. The brief's open question is settled: it needs a Worker, which means a backend. |
| Gemini: UK/EEA/Switzerland need Paid Services | **Confirmed** | "You may use only Paid Services when making API Clients available to users in the European Economic Area..." For our users, the Gemini free tier is off the table. |
| WebLLM: WebGPU, OpenAI-compatible API, web workers | **Confirmed** | The docs do not list browsers. Package `@mlc-ai/web-llm`, latest 0.2.89. |
| Groq, Cerebras, Gemini model names and numbers, the OpenAI complimentary tokens, Chinese providers' auth, MiniMax OAuth, OpenRouter terms §§5 and 7 | **Not checked** | Out of the scope asked, and none of them changes the recommendation. Model names like `qwen/qwen3.8-27b` and "Gemini 4 Hydrogen" should be re-checked before anyone quotes them. |

## 2. Verdict on the recommendation

- **"Puter first" is right for a quick public demo**, where smoothness matters most and nothing confidential is sent. The pop-up flow, guest users, the usage API and the clean 402/429 split are all real.
- **It is wrong as the default for the CRM and the Gmail tool.** Those tools send personal data about third parties (contacts and correspondents) who never agreed to it. Puter does not say which host runs each model or what happens to prompts, its privacy policy is silent on AI, and liability is capped at $50. The suggested default, DeepSeek through an unnamed host, is the hardest choice to defend for UK/EEA personal data.
- **OpenRouter OAuth should be the default for private data, not just the alternative.** It is confirmed to work from the browser. The user owns the key and sets its spending limit and expiry. Data policies can be enforced per request: deny providers that train or retain data, and use zero-data-retention endpoints where offered. We already run it, and its catalogue includes NVIDIA's Nemotron models, which covers most of what the NVIDIA route would offer. The cost is one more consent screen, and the free daily cap of 50 is low for heavy users.
- **The brief misses the real architectural risk**: third-party AI code running on the same origin as the user's vault keys. See 3.3.

## 3. Gaps

### 3.1 Privacy: where prompts go

- **Puter:** the prompt goes to Puter (`api.puter.com`), then to a model host Puter does not name. There is no data-processing statement, no retention period and no training statement for AI.
  - Rule: nothing from the vault goes to Puter unless the user types it in or chooses it explicitly for that request.
- **OpenRouter:** the prompt goes to OpenRouter, then to the chosen provider. Each provider's retention and training policy is published.
  - Settings: the user's account has separate training opt-outs for paid and free models. The app can also send provider data-policy filters with each request. Set them in code for the CRM.
  - Expected conflict (not tested): many `:free` endpoints may require allowing training. "Free" and "private" may not both be available for the same model. Test this before promising both.
- **Gemini free tier:** inputs are used to improve products and may be read by human reviewers, and UK/EEA clients must use Paid Services anyway. Not usable.
- **NVIDIA trial:** retention is not documented in the pages checked.
- **WebLLM:** prompts never leave the device. Only the model weights are downloaded.
- **What the brief should add (product rules):**
  - Show the provider and model before the first send, in plain words: "Your question and the selected email will be sent to OpenRouter and processed by DeepSeek on Fireworks (USA)."
  - Ask once per data class (contacts, emails, notes), not once per site.
  - Minimise what is sent: strip addresses, signatures and quoted threads unless needed.
  - Log what was sent in the user's own vault, so they can see it later.
  - Never send vault keys, tokens or other users' data.

### 3.2 CSP hosts each option needs

GitHub Pages cannot set headers, so the CSP goes in a `<meta>` tag. That means `frame-ancestors` and COOP cannot be set there.

| Option | `script-src` | `connect-src` | `frame-src` | Other |
|---|---|---|---|---|
| Puter (CDN) | `https://js.puter.com` | `https://api.puter.com`, `wss://api.puter.com` (the bundle includes socket.io; whether AI calls use it was not tested), `https://puter.com` | `https://puter.com` (the bundle creates iframes) | The sign-in pop-up opens on `puter.com`. The bundle tries `new Function(...)` inside a try/catch with an `EvalError` fallback, so test it without `'unsafe-eval'` before assuming it works. Other hosts in the bundle (`puter.site`, `worker-sandbox.puter.com`, `puter-net.b-cdn.net`) are for features we would not use. Add them only if the console shows they are needed. |
| Puter (vendored) | `'self'` | as above | as above | Preferred (see 3.3). |
| OpenRouter OAuth | `'self'` | `https://openrouter.ai` (key exchange and inference) | none | The consent screen is a top-level visit to `openrouter.ai/auth`, or a pop-up, so CSP is not involved. Clear `?code=` from the URL with `history.replaceState` straight after the exchange. |
| NVIDIA | n/a | `https://integrate.api.nvidia.com` would be needed, but **the browser blocks it** (no CORS) | n/a | Needs a proxy, so it breaks our constraints. |
| WebLLM | `'self'` (vendored) plus `'wasm-unsafe-eval'` | `https://huggingface.co` and its download-redirect hosts (check in devtools: large files are redirected to HF's CDN), `https://raw.githubusercontent.com` (model wasm libraries) | none | The weights are hundreds of MB to several GB. GitHub Pages limits (100 MB per file, about 1 GB per site) rule out self-hosting the weights there. A vault or another static store could hold them, which would remove the Hugging Face dependency. |

### 3.3 Script supply chain (the biggest gap)

- **`https://js.puter.com/v2/` floats.** On 25 Nov 2026 the bundle (675 KB) carried "Generated on 2026-11-25 00:38" and `Last-Modified` 00:39 the same day, behind a CloudFront cache. It is rebuilt often, so an SRI hash on `/v2/` would break and is not a real option. Any change on Puter's side runs at once, with full rights, on every page that loads it.
- **Pinning is possible.** npm `@heyputer/puter.js` is at 2.6.5 (jsDelivr lists every version, with `/src/index.min.js` as the default entry). Vendor that exact version into the site and serve it from `'self'` with an `integrity` hash, and upgrade on purpose. Puter does not document pinning or SRI.
- **Token exposure.** Puter.js keeps its auth token in the page origin's `localStorage` (seen in the bundle), so any script on that origin can spend the user's allowance. The same applies to an OpenRouter key kept in browser storage.
  - Shared origin: all project pages under one `<user>.github.io` share a single origin, so each tool must have its own (sub)domain. crm.tool.sovereignweb.site already does.
- **Recommended pattern: an AI bridge frame.** Put the provider SDK in a small page on its own origin, for example `ai.<site>` or a shared `ai.sovereignweb.site`. Embed that page as an iframe with `sandbox="allow-scripts allow-same-origin allow-popups"`.
  - The main app sends only the prompt text by `postMessage` and gets back the answer. It checks `event.origin` both ways.
  - Vault keys, the decrypted vault and the main page's DOM stay out of reach of Puter's code and of any future change to it.
  - The **Connect** button must sit inside the bridge frame, so the user's click opens the pop-up from the frame's own user activation.
  - The same bridge can hold the OpenRouter key handling, and later switch providers without touching the apps.

### 3.4 Pop-ups, Safari and iPad

- **Call `puter.auth.signIn()` synchronously in the click handler**, before any `await`. Safari blocks a pop-up opened after an asynchronous gap. Never call it on page load.
- **On iPhone and iPad the "pop-up" opens as a new tab.** The copy "A Puter window will open" should say "a new tab or window". Test that the original tab gets the result back and resumes the task.
- **Safari's tracking prevention deletes script-written storage after about 7 days without a visit** (expected behaviour, not tested here). Users who return weekly may have to sign in again. Say so, and keep the draft safe whatever happens.
- **OpenRouter's reference flow redirects the whole page.** The draft must be saved before leaving: `sessionStorage` for the text, or the vault for anything private. Alternatively, open `/auth` in a pop-up whose callback page posts the code back to the opener. Keep the PKCE verifier in `sessionStorage`, as OpenRouter advises.
- **WebLLM on iPad:** WebGPU ships in recent Safari, but memory is the real limit. Offer only the smallest models there, and detect `navigator.gpu` before offering local mode.

### 3.5 What happens to the user's work and keys

- **Drafts** stay in the app, in memory and in `sessionStorage`. Private drafts go in the vault. They are never put in a login URL (the brief is right here).
- **The Puter session** belongs to the user's Puter account, not to our site. If they sign out on puter.com or the token is cleared, they reconnect. They also get an app folder and a KV store in their Puter account. We should not store anything there for the CRM: the vault stays the system of record.
- **The OpenRouter key** is a spending credential owned by the user.
  - Prefill `key_label` with the site name, a small `limit` (for example $5) and an `expiration` (for example 30 days).
  - Store it encrypted in the user's vault and decrypt it into memory when needed.
  - Show a "Disconnect" link to openrouter.ai/settings/keys so they can revoke it.
  - Never put it in a URL, a log or an append lane.
- **On a shared or lost device**, the vault protects the OpenRouter key. A Puter token in `localStorage` is not protected, which is another reason to keep it in the bridge's origin.

### 3.6 Terms

- **Puter developer agreement** (confirmed):
  - The developer sets any price for the app. Puter can introduce fees or change them "at any time", and changes apply when posted.
  - Puter can remove apps "at any time and for any reason". Liability is capped at $50. The developer indemnifies Puter. Developers must be 18 or over and must comply with privacy law.
  - It is fine for a free demo. It is a fragile base for a product people rely on.
- **OpenRouter:** the brief says resale of API access is prohibited and that users pay OpenRouter directly under OAuth. That matches how OpenRouter describes OAuth, but the terms sections were not re-read here. Keep model costs visibly separate from any Sovereign Website fee.
- **NVIDIA:** the free endpoints are for prototyping, research, development and testing only, so they cannot back a user-facing tool.
- **Gemini:** UK/EEA users need Paid Services on our own project, which also breaks "no app-operated billing".

## 4. Site__Platform__Puter and Site__Platform__NVIDIA

### Site__Platform__Puter: worthwhile

We need it to measure the things the brief says are unknown: the real allowance, guest mode and Safari behaviour. It should contain:

1. **A live demo:** type, then **Get my answer**, then the pop-up, then an automatic resume. Include guest mode (`attempt_temp_user_creation`) behind a toggle, and record whether a fresh guest can finish a task.
2. **An allowance meter:** `getMonthlyUsage()`, with microcents converted to plain money ("about 38p of AI left this month"), the per-app breakdown, and the 402 and 429 messages as the user would see them.
3. **A measurement page:** run a fixed set of realistic tasks (summarise an email, draft a reply, tag ten contacts) on two or three models. Record the cost of each from `usage`, so we can say "about N tasks a month on the free allowance". Publish the results with the date.
4. **The bridge-frame pattern** as a copyable example, with the vendored pinned build (version and SRI hash) and the exact CSP that works.
5. **A permissions and privacy page** in plain English: what signing in gives the app (AI, a storage folder, a KV store, website hosting), where prompts go, and what Puter's policy does not say.
6. **A device test matrix:** Chrome, Firefox, Safari on macOS, iPhone and iPad, with blocked and cancelled pop-ups. Include a screenshot of each sign-in screen and note whether any payment step appears.
7. **A model list** read live from Puter, not hard-coded, with dated notes.

### Site__Platform__NVIDIA: not worthwhile as a demo

- A static page cannot call NVIDIA: there are no CORS headers, the key must be pasted by hand and the licence is for prototyping only. A demo would need a proxy or a pasted key, which are exactly the two things Dinis wants to remove.
- **Better:** add one NVIDIA page to Site__Platform__OpenRouter that demos Nemotron through OpenRouter's free endpoints. It should explain:
  - when the direct NVIDIA API is useful: agents and back-office scripts that hold a key, not end users;
  - the 40 per minute figure, which comes from forum posts and not from official docs;
  - the CORS result, with the date it was tested.
- If Dinis still wants a separate site, keep it to documentation plus a "paste your own key, held only in memory" lab page for developers, with a clear warning. Re-test CORS on each visit, in case NVIDIA adds it.

### Also worth doing

- **A shared `ai.sovereignweb.site` bridge:** one origin and one CSP, with the provider SDKs vendored and pinned, and a `postMessage` contract. Every Sovereign Website tool would embed it.
- **A Site__Platform__WebLLM page:** device check, model size picker, download progress, and "works offline, nothing leaves this device".

## 5. Recommended default per use case

| Use case | Default | Why | Fallback |
|---|---|---|---|
| **Quick public demo** (no private data) | **Puter**, guest mode if a fresh guest can finish the task, otherwise Google sign-in. Load it through the pinned bridge. | Smoothest first run, no key, the user's allowance pays. | OpenRouter OAuth with a named `:free` model. |
| **CRM and Gmail tool** (personal data about third parties) | **OpenRouter OAuth through the bridge.** The key is held in the user's vault with a small limit and an expiry. Requests deny training providers and prefer zero-retention ones. A paid, named model on a named provider, opt-in and shown before sending. Send only minimised content. | The user owns the account and the key. Where the data goes is visible and can be enforced per request. CORS is confirmed. We already run it. | **WebLLM** for sensitive tasks (summarise, classify, draft) where a small model is good enough. Puter only for text the user typed and chose to send. |
| **Fully local** | **WebLLM** in a web worker, vendored and pinned. Weights downloaded once and cached. Offer the smallest model that works on iPad, and a larger one on desktops with a GPU. | Prompts never leave the device. No account, no quota, no third-party terms. | None by design. If WebGPU is missing, say so plainly and offer the OpenRouter route with its privacy note. |

## Could not verify

- No real sign-in was completed with Puter or OpenRouter, so the consent screens, any payment step, guest-mode completion and the fresh allowance amount are still open. This is the brief's own "before launch" list, and it stands.
- Whether Puter.js runs under a CSP without `'unsafe-eval'`, and whether its AI calls use the websocket.
- Which upstream host Puter uses for each model.
- Whether the OpenRouter `:free` endpoints stay available when training is denied.
- NVIDIA's 40 per minute limit in official docs.
- OpenRouter terms §§5 and 7, and all the Groq, Cerebras, Gemini model and Chinese-provider claims.

## Sources checked (25 Nov 2026)

- Puter: [rate limits and quotas](https://docs.puter.com/rate-limits-and-quotas/), [signIn](https://docs.puter.com/Auth/signIn/), [getMonthlyUsage](https://docs.puter.com/Auth/getMonthlyUsage/), [MonthlyUsage object](https://docs.puter.com/Objects/monthlyusage/), [user-pays model](https://docs.puter.com/user-pays-model/), [security and permissions](https://docs.puter.com/security/), [getting started](https://docs.puter.com/getting-started/), [DeepSeek tutorial](https://developer.puter.com/tutorials/free-unlimited-deepseek-api/), [AI tutorial](https://developer.puter.com/tutorials/free-unlimited-ai-api/), [privacy policy](https://puter.com/privacy), [developer agreement](https://puter.com/developer-agreement); the live bundle at `https://js.puter.com/v2/` and the npm package `@heyputer/puter.js` (via jsDelivr).
- OpenRouter: [OAuth](https://openrouter.ai/docs/guides/overview/auth/oauth), [OAuth skill](https://openrouter.ai/skills/openrouter-oauth.md), [limits](https://openrouter.ai/docs/api/reference/limits), [free models](https://openrouter.ai/collections/free-models), [DeepSeek V4.1 Flash](https://openrouter.ai/deepseek/deepseek-v4.1-flash), [provider logging](https://openrouter.ai/docs/guides/privacy/provider-logging); CORS preflights on `/api/v1/auth/keys` and `/api/v1/chat/completions`.
- NVIDIA: [llms.txt](https://build.nvidia.com/llms.txt), [models.md](https://build.nvidia.com/models.md), [NIM FAQ](https://docs.api.nvidia.com/nim/docs/product), forum reports of the 40 per minute limit (for example [this thread](https://forums.developer.nvidia.com/t/api-rate-limit-increase-is-not-granted-by-requesting-it-here/368420)); CORS tests on `integrate.api.nvidia.com`.
- Cloudflare: [OAuth client](https://developers.cloudflare.com/fundamentals/oauth/create-an-oauth-client/); CORS test on `api.cloudflare.com`.
- Google: [Gemini API terms](https://aistudio.google.com/docs/terms).
- WebLLM: [docs](https://webllm.mlc.ai/docs/); the npm package `@mlc-ai/web-llm` 0.2.89 (hosts searched in `lib/index.js`).
