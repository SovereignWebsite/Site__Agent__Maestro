# Where are all the pending tasks and ideas? (f.maestro, 24 Nov 2026)

Dinis asked: "Where is the place where we have all the pending tasks and all the ideas that I've given, so I can start to prioritize that."

## The short answer

There is no one place. They are spread over at least six, each kept by a different agent, and none holds them all:

1. **"New from Dinis"** in PrompTugal/PrompTugal__News__Website board/guidance/README.md: his directions, newest first, since early November. The closest thing to a master list of ideas, but written as directions, not as items with a status.
2. **The ideas ledger** in the same folder (2026-11-06-the-ideas-ledger.md): 495 ideas from the night of 5 to 6 November, 48 of them "Later", 26 not captured, 13 questions never answered. Not kept up since 6 November.
3. **The open asks** at https://decisions.agents.sovereignweb.site/asks/: what waits for his yes or no. Decisions, not ideas.
4. **Each maestro's now.md** "Waiting on Dinis" (b.maestro's: [../../account-b/now.md](../../account-b/now.md)).
5. **Guidance and briefs** in each maestro's area here (the twins and browser components ideas, the morning sync).
6. **Each conductor's own board** (for example SovereignWebsite__IaC board/workflow/). f.maestro has not read these yet.

## What this folder is

A first sweep into one list: [items.md](items.md), made from [pipeline.json](pipeline.json). 27 items, 12 that need design. Each row has its source, owner and status, and an empty priority for Dinis to set (P1, P2, P3 or later). It is version 1: the PrompTugal ledger is linked as three rows, not copied, and the conductors' boards are not in yet.

## The proposal

One repository per owner's pipeline (or one for all, with /factory/<owner>/ inside), with:

- one file per item, so agents add and update their own rows by commit and each change has a history;
- the same fields as pipeline.json: id, title, kind, area, since, source, owner, status, design needed, priority;
- a page that sorts by priority and filters by area, owner and "design needed", so Dinis prioritises in the browser;
- every agent adds its ideas there instead of in its own board, and every maestro sweeps its account into it at each wake.

f.maestro cannot create repositories from account F. The questions are in [../questions.md](../questions.md).
