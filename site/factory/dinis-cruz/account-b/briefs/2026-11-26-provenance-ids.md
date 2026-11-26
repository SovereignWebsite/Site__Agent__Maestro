# Proposal: provenance for everything Dinis says (26 Nov 2026)

Source: dinis.2026-11-26T1543Z.b (guidance/2026-11-26-provenance-and-book-verbatim.md). For b.librarian and the ontologist to own; maestro.b starts it in its own area.

## Where Dinis's words go today
Each voice memo or message that reaches maestro.b is saved as he said it in **guidance/<date>-<topic>-verbatim.md** on the maestro site (private names in brackets), then turned into a brief in **briefs/**. Before today they had no id and no index, and the agents' work did not link back.

## The scheme
1. **Every memo gets an id:** `dinis.<UTC time>.<account>`, for example `dinis.2026-11-26T1543Z.b`, written at the top of its page. The time comes from the clock when it arrives.
2. **Every memo is in an index by date and topic:** guidance/index.json (live), with the briefs it led to and the agents it went to. One GET request finds it.
3. **Every brief and message carries the memo id** ("Source: dinis.…"), so an agent can walk back to the words.
4. **Every agent that takes the work replies with a work id and where the work lives** (`<agent>.<date>.<slug>`, its commit or page). The maestro records it under the memo's "work" in the index, so the memo walks forward to the work.
5. **The librarian** joins the indexes across accounts into one map (memo, topic, briefs, agents, work); **the ontologist** keeps the ids and their links consistent across the estate.
6. Handover files and the librarian's end-of-work summaries name the memo ids they served.
