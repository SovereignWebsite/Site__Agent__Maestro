# Brief: the first two customer sites (friendlies), 25 Nov 2026

By b.maestro, from Dinis's words: [verbatim](../guidance/2026-11-25-first-customers-verbatim.md). Dinis: these are friendlies, "but very important since they are validating the workflow".

Per Dinis's routing rule (Site__Agent__Factory site/guidance/2026-11-24-routing-agents-never-build.md), the routing agent works like this:
- b.sites files each site request with b.factory and starts a dedicated keeper per site, on Sonnet;
- each keeper makes its own key, keeps its own area, builds five designs, and goes through design rounds with b.design;
- neither b.maestro nor b.sites builds the site.

## Site 1: lee-elle-horowitz.artist.sovereignweb.site

- **Owner:** Lee-Elle Horowitz. Dinis: "you can name her". Her own text below is what she supplied for her public site.
- **Group:** artist, like Emily's and Grace's sites.
- **Photos:** from Spotlight, which Dinis gives to the keeper directly, as for Emily and Grace. Use no other photos.
- **Contact:** show only what she chooses to publish. No personal phone or email unless she asks for it.

Her text, as supplied:

> **Business:** Private Hebrew Tuition with Lee-Elle Horowitz
>
> **Main service:** Private Hebrew lessons for children, teenagers and adults.
>
> **About me:** South African-born and Israel-raised, I am a fluent Hebrew speaker who grew up in Israel and later moved to the UK. I have experience teaching Hebrew to children and beginners, both online and in person.
>
> I offer personalised Hebrew lessons that focus on building confidence, developing conversational skills and understanding how the language works in everyday life.
>
> My approach is creative, interactive and student-centred. Rather than simply memorising vocabulary, I help students understand how to construct sentences, communicate naturally and develop a practical understanding of Hebrew.
>
> **Hebrew lessons can include:** complete beginners; conversational Hebrew; reading and writing; vocabulary development; sentence construction and grammar; past, present and future tenses; Hebrew for children growing up in the UK; improving fluency for students with some existing knowledge; Hebrew support for school and supplementary Jewish education.
>
> **Teaching approach:** Lessons are tailored to each student's age, ability and goals. I aim to make learning enjoyable, practical and engaging, using conversation, activities and real-life examples. I want students to feel comfortable making mistakes, asking questions and gradually developing confidence using Hebrew independently.
>
> **Teaching qualifications and background:** fluent Hebrew speaker; grew up in Israel; two years of private teaching experience; experience teaching children aged 7 to 11; First Class Honours BA from the Guildford School of Acting, University of Surrey; Enhanced DBS checked.
>
> **Lesson format:** in-person lessons in London; online lessons via Zoom; individual tuition; small group lessons, subject to arrangement.
>
> **Secondary services:** music tuition can appear as a smaller section on the website, offering singing lessons, trombone lessons, beginner guitar lessons, and musical theatre and audition preparation.

## Site 2: moving-van.business.sovereignweb.site

- **What it is:** a small family moving company, referred by a friend of Dinis's family. The owner has been meaning to set up a website but hasn't had time.
- **Kept generic:** "moving-van" in the address, and a made-up business name, which the keeper proposes and Dinis approves. No real name, person, place or contact until the owner agrees and supplies them.
- **Content:** the keeper writes placeholder content for a man-and-van moving service, clearly marked as a demo until the owner supplies the real details.
- **Group:** "business". If that group doesn't exist yet, b.factory adds it, as it did with "services".

## The workflow these two test

- **Web forms:** each site needs a way for its owner to send content, photos and changes, and for its visitors to send enquiries. The /send/ lane, which security.b cleared and a.factory built (d60ffb9), is the base. Dinis sent a voice memo about this yesterday, and b.maestro doesn't have it. Whoever holds it, link it here.
- **Who looks after the forms and requests:** the open question below.

## Dinis's question: should we have customer, onboarding or fulfilment agents?

b.maestro's recommendation:
- **Yes: one onboarding agent per account,** b.onboarding on account B. It owns the intake: the web forms, the requests that arrive, and the first contact with a new site owner. It turns each request into a site request and a keeper, and hands over. It never builds, per the routing rule.
- **Fulfilment stays with each site's keeper,** which knows its site.
- **Separately, a light customers view:** who the site owners are, what each asked for and what was delivered. It goes in the CRM vault (crm.dev.a's tool), not in a repository.
