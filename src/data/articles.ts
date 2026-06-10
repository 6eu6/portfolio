export interface Article {
  id: number; slug: string; title: string; subtitle: string; category: string;
  excerpt: string; date: string; readTime: string; featured: boolean; tags: string[];
  content: string;
}

export interface ArticleSection {
  type: "paragraph" | "heading" | "quote" | "code" | "list";
  content: string; items?: string[];
}

export const articles: Article[] = [
  {
    id: 0,
    slug: "arabic-first-ecommerce-rtl-i18n-stripe",
    title: "Building an Arabic-First Storefront",
    subtitle: "What RTL, i18n, and payments actually require — lessons from Al-Qadhi Store",
    category: "Engineering",
    excerpt: "Most e-commerce tutorials assume English and LTR. Building a real Arabic-first store with Next.js taught me that localization is architecture, not translation.",
    date: "2026-05-20",
    readTime: "8 min",
    featured: true,
    tags: ["Next.js", "RTL", "i18n", "Stripe"],
    content: `When I started building Al-Qadhi Store — a digital services marketplace for Arabic-speaking customers — I assumed localization would be the last 10% of the work. Wrap the strings in a translation function, flip the direction, done.

It turned out to be one of the first architectural decisions I had to get right, and almost everything else depended on it.

## RTL is a layout system, not a CSS property

Setting \`dir="rtl"\` on the document gets you maybe 60% of the way. The remaining 40% is where stores look broken and customers lose trust:

- **Logical properties over physical ones.** \`margin-left\` becomes wrong in RTL. Using \`margin-inline-start\` (or Tailwind's \`ms-\`/\`me-\` utilities) means the layout flips correctly for free.
- **Icons that imply direction.** A "next" arrow pointing right means "back" in an RTL flow. I ended up auditing every directional icon in the checkout funnel.
- **Numbers and prices.** Arabic text flows right-to-left, but prices and phone numbers still read left-to-right. Mixing the two in one line without explicit bidi handling produces garbled output — the kind of bug you only catch by reading every screen in Arabic, not by scanning the code.

## Translation files are a product surface

I structured the store Arabic-first: the Arabic copy is the source of truth and English is the translation, not the other way around. That ordering matters. When English is the source, the Arabic always reads like a translation — and in a market where customers are deciding whether to trust you with money, copy that reads natively is a conversion feature.

## Payments: the part that has to be boring

The store sells game top-ups, social media services, and money transfers. For payments I used Stripe, and the main lesson was to keep the payment layer as boring and standard as possible:

\`\`\`ts
// One source of truth for order state transitions
type OrderStatus = "pending" | "paid" | "fulfilled" | "refunded";

const transitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid"],
  paid: ["fulfilled", "refunded"],
  fulfilled: ["refunded"],
  refunded: [],
};
\`\`\`

Every order moves through an explicit state machine, and the webhook handler is the only code allowed to move an order to \`paid\`. Digital goods are delivered manually or by bot after that point, so the boundary between "Stripe's problem" and "my problem" stays sharp.

## What I'd tell someone building for this market

Arabic-speaking users are underserved online, and the bar for trust is high precisely because so many existing services are informal. The features that mattered most weren't clever — clear pricing, visible order history, a refund policy stated in plain Arabic, and a UI that doesn't feel like a translated afterthought. Localization done seriously *is* the differentiator.`,
  },
  {
    id: 1,
    slug: "running-a-store-from-telegram",
    title: "Running an Online Store from Telegram",
    subtitle: "Why I built a Python bot instead of another admin dashboard",
    category: "Product",
    excerpt: "Order management doesn't need a dashboard you have to remember to open. Moving store operations into Telegram cut response time to minutes.",
    date: "2026-05-28",
    readTime: "6 min",
    featured: false,
    tags: ["Python", "Telegram", "Automation", "Operations"],
    content: `Al-Qadhi Store had a working admin dashboard from day one. Orders showed up in a table, I could update statuses, everything a tutorial would tell you to build. And it had one fatal flaw: I had to remember to open it.

Digital goods are a speed business. Someone buying a game top-up expects delivery in minutes, not "when the operator next checks the dashboard." So I built a separate Python service that moves the entire order workflow into Telegram.

## The shape of the system

The bot is deliberately not part of the store codebase. It's a standalone Python service that talks to the store's API:

- A new paid order triggers a Telegram message to the operations chat, with the order details and inline buttons.
- Tapping **Fulfill** or **Refund** calls back into the store API, which owns the state machine. The bot never touches the database directly.
- Status changes sync back, so the customer's order history on the website is always accurate.

Keeping the bot behind the same API the dashboard uses meant zero new business logic — the bot is just another client.

## Why Telegram beats a dashboard for a small operation

The honest reason: my phone is already in my hand, and Telegram notifications already have my attention. A dashboard, no matter how well built, is a destination — somewhere I have to go. The bot is an interrupt — it comes to me.

There's a general principle here that I now apply to every internal tool: **meet the operator where they already are.** For a solo operation or a small team, the best admin interface is usually inside a tool you already check fifty times a day.

## The trade-offs

It's not free. A chat interface is linear, so anything that needs bulk operations or filtering still belongs in the dashboard. And inline-button workflows need to be idempotent — people double-tap buttons on phones, and Telegram retries callbacks. Every action the bot exposes has to be safe to receive twice.

But for the core loop — *order arrives, operator sees it instantly, one tap fulfills it* — the bot turned a process that depended on my discipline into one that depends only on my reaction time. That's the right direction to move operational load.`,
  },
  {
    id: 2,
    slug: "human-in-the-loop-content-automation",
    title: "Automating Content Without Losing Your Voice",
    subtitle: "The human-in-the-loop design behind my X content pipeline",
    category: "AI",
    excerpt: "Full automation produces spam. Full manual doesn't scale. The useful middle: AI drafts everything, a human approves everything.",
    date: "2026-06-02",
    readTime: "7 min",
    featured: false,
    tags: ["AI", "LLM", "Automation", "Telegram"],
    content: `I built the X AI Content Factory to solve a personal problem: growing an X account about AI and productivity requires consistent daily posting, and consistency is exactly what falls apart when life gets busy.

The obvious answer — let an LLM generate and auto-publish posts — is also the wrong one. Fully automated accounts converge on a recognizable, slightly-off voice that readers learn to scroll past. The account's value *is* the judgment behind it; automating the judgment away automates away the value.

## The architecture: automate production, not judgment

The pipeline splits content work into two halves:

1. **Production (automated).** Scheduled runs generate candidate posts with an LLM — drafts in my topic areas, varied in format, queued up without any effort from me.
2. **Judgment (manual).** Every candidate lands in a Telegram channel. I read it on my phone, approve, edit, or reject. Nothing is published without that tap.

The system is built on Next.js and deployed on Vercel, with scheduled functions driving the generation runs and a \`/api/health\` endpoint so I notice when the pipeline silently stops — which, with cron-driven systems, is otherwise exactly how they fail.

## Why review-in-Telegram is the load-bearing decision

The review step only works if it's frictionless. If approving a post required opening a web app, logging in, and navigating to a queue, I'd batch it "for later" and the pipeline would stall. Reviewing in Telegram takes seconds and happens in moments I'd otherwise waste — the approval step costs less than the distraction of thinking "I should post something today."

This is the same lesson I keep relearning across projects: **the bottleneck in any human-in-the-loop system is the loop's ergonomics, not the AI.**

## What the LLM is actually good at here

Not insight — volume and variation. The model is good at producing ten different framings of an idea, which makes my job *selection* rather than *creation*. Selecting from ten drafts takes a fraction of the energy of writing one, and the published result still passes through my taste. On a good day I edit; on a busy day I just filter. Either way the voice stays mine.

If you're building something similar, my one concrete recommendation: put the approval step somewhere you already live, and make rejection a single tap. The pipeline's survival depends on the review step never feeling like work.`,
  },
  {
    id: 3,
    slug: "building-a-3d-portfolio-motion-lessons",
    title: "What Building a 3D Portfolio Taught Me About Motion",
    subtitle: "GSAP, React Three Fiber, and Lenis — and the restraint they demand",
    category: "Design",
    excerpt: "This site is built with a WebGL hero, scroll-driven animation, and smooth scrolling. The hard part wasn't the techniques — it was knowing when to stop.",
    date: "2026-06-05",
    readTime: "7 min",
    featured: false,
    tags: ["GSAP", "React Three Fiber", "Next.js", "Motion Design"],
    content: `The site you're reading this on is itself a project: Next.js 16, a React Three Fiber WebGL scene in the hero, GSAP ScrollTrigger choreographing the sections, Lenis for smooth scrolling, and a Prisma-backed admin panel managing all the content. Building it taught me more about motion design than any tutorial — mostly by letting me make every mistake personally.

## The stack, and why each piece is there

- **GSAP + ScrollTrigger** drives the scroll choreography — the horizontal project showcase is a pinned section where vertical scroll translates the track horizontally, with per-card 3D rotation tied to each card's position in the viewport.
- **Lenis** smooths the scroll itself. Scroll-linked animation looks janky when scroll position jumps in discrete wheel ticks; Lenis interpolates it into a continuous signal worth animating against.
- **React Three Fiber** renders the hero scene, dynamically imported with \`ssr: false\` so WebGL never blocks first paint.

## The mistakes that taught me the most

**Animating everything.** My first version moved on every scroll event — every heading revealed, every card tilted, every divider drifted. The result was exhausting. Motion is information: it tells the eye what changed and what matters. When everything moves, motion stops carrying information. The current site animates roughly a third of what the first draft did.

**Fighting StrictMode instead of understanding it.** React 19 + GSAP + a preloader produced a classic bug: effects mounting twice made the intro animation repeat. The fix wasn't a workaround — it was making animation setup genuinely idempotent, with proper cleanup of every ScrollTrigger on unmount:

\`\`\`ts
return () => {
  scrollTween.kill();
  ScrollTrigger.getAll().forEach((st) => {
    if (st.trigger === section) st.kill();
  });
};
\`\`\`

Sloppy cleanup is invisible until it isn't — duplicated triggers, leaking listeners, animations firing on dead elements.

**Forgetting that motion has a budget.** Backdrop blurs, parallax layers, and a WebGL canvas all compete for the same frame. The glassmorphism cards looked great in isolation and dropped frames the moment they animated over the 3D scene on mobile. Every effect now has to justify itself at 60fps on a mid-range phone, not just in a desktop demo.

## Why build the CMS too?

I could have hardcoded the content. But a portfolio is a proof of work, and "I built the rendering layer *and* the data layer *and* the admin panel" is a stronger proof than a pretty template. Projects, articles, and contact messages all live in PostgreSQL behind a custom dashboard — which also means updating the portfolio doesn't require a deploy.

The meta-lesson: a portfolio site is the rare project where over-engineering is honest signaling. Everywhere else, restraint wins — in motion most of all.`,
  },
  {
    id: 4,
    slug: "building-activepieces-pieces-framework",
    title: "A Framework Approach to Automation Integrations",
    subtitle: "Why I built a piece-builder toolkit for Activepieces instead of copy-pasting my way through",
    category: "Engineering",
    excerpt: "After building a few Activepieces integrations, the repeated boilerplate became the project. Extracting a framework made every next piece dramatically cheaper.",
    date: "2026-05-23",
    readTime: "6 min",
    featured: false,
    tags: ["TypeScript", "Activepieces", "Open Source", "Developer Tools"],
    content: `Activepieces is an open-source automation platform — think workflows connecting triggers and actions across services. Its extension model is the "piece": a TypeScript package defining the actions, triggers, and auth for one integration.

Building my first piece was a pleasant afternoon. Building the third one was déjà vu: the same scaffolding, the same credential-handling decisions, the same dance to test against a live API, the same publish checklist. That repetition is a signal — so I extracted it into a framework, which I've open-sourced under MIT.

## What actually repeats

Three things consumed most of the time on every piece, and none of them were the integration logic itself:

1. **Structure.** Every piece needs the same skeleton — metadata, auth definition, action/trigger registration. Without a convention you re-decide the file layout every time.
2. **Credentials.** API keys must be defined once, threaded into every action, and never logged or leaked into error messages. This is exactly the kind of cross-cutting concern that gets sloppy when rewritten per-piece.
3. **Dynamic options.** Good pieces don't make users paste IDs — they fetch the user's actual resources (channels, projects, lists) into a dropdown at configuration time. Doing this means an authenticated API call *inside the form*, with caching and failure handling. It's fiddly, and it's identical in shape across every piece.

The framework standardizes all three: a typed scaffold for structure, a credential layer the actions consume without touching storage, and a helper for dropdowns that resolve at runtime.

## The economics of internal frameworks

There's a well-known rule of three: don't abstract until you've written something three times. I'd add a corollary from this project — when you do extract the abstraction, **the conventions are worth more than the code**. The framework saves typing, but its real value is that piece number four starts with all the decisions already made. Naming, error shape, auth flow, test approach: settled. The marginal cost of an integration drops from days to hours, and the quality floor rises because the careful credential handling is inherited rather than re-implemented.

## Why open-source it

Partly because it costs nothing — the framework contains conventions, not secrets. Partly because automation platforms live or die by their integration ecosystems, and lowering the cost of building pieces is a contribution the whole ecosystem benefits from. And partly for the most practical reason: open code with an MIT license is the easiest possible thing to show when someone asks how I write TypeScript.`,
  },
  {
    id: 5,
    slug: "why-im-building-yemenpedia",
    title: "Why I'm Building Yemenpedia",
    subtitle: "Structured Arabic knowledge about Yemen, and why the data model comes first",
    category: "Product",
    excerpt: "High-quality Arabic content about Yemen is scarce and scattered. Building a knowledge platform for it starts with an unglamorous decision: the content model.",
    date: "2026-03-10",
    readTime: "5 min",
    featured: false,
    tags: ["Content Modeling", "Arabic Web", "Next.js", "Product"],
    content: `Search for almost any topic about Yemen in Arabic — a city's history, a cultural tradition, a notable figure — and you'll find fragments: a half-maintained forum thread, a social media post, a machine-translated article. The information exists, but it's scattered, unsourced, and slowly rotting. Yemenpedia is my attempt at a structured home for it.

## Starting with the boring part

The tempting way to start a content platform is the visible way: design the article page, make it beautiful, ship something to show. I deliberately started with the opposite — Yemenpedia Core, the open-source engine that defines what a piece of knowledge *is* in the system before any of it is rendered.

That means content models: what fields does an entry about a city share with an entry about a person? How do entries reference each other? How are sources attached? These decisions are nearly impossible to change once real content exists in volume, because every change ripples through everything already written. **A content platform's data model is its real architecture; the website is just one view of it.**

## Arabic-first is a technical commitment

Like Al-Qadhi Store, Yemenpedia is Arabic-first — but for a reading-heavy platform that commitment goes deeper than direction-flipping. Long-form Arabic needs typography chosen for readability at length, layouts designed RTL-native rather than mirrored, and structure (headings, navigation, citations) that works with how Arabic text actually flows. Treating English as the default and Arabic as the adaptation produces the subtle wrongness that every Arabic reader recognizes instantly — and that's precisely what makes existing resources feel untrustworthy.

## The long game

I'm under no illusion that an encyclopedia is a weekend project. It's a years-long effort, and most of the hard problems ahead are editorial rather than technical — sourcing standards, contributor workflows, review. But that's the reason to get the core right now, while changing it is still cheap. The code is public on GitHub; the foundation is being laid deliberately, model-first, so that everything built on top of it inherits its structure instead of fighting it.`,
  },
];

export function getFeaturedArticle() { return articles.find(a => a.featured); }
