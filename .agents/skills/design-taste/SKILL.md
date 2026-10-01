---
name: design-taste
description: >-
  Art direction, aesthetic curation, and taste calibration for web interfaces.
  Use when deciding on a visual identity, selecting palettes, picking fonts,
  or preventing generic "AI template" aesthetics.
---

# Design Taste & Art Direction Skill

This skill enforces intentional aesthetic direction, curated color theory, typographic personality, and anti-boilerplate craftsmanship across all web pages and components.

## Aesthetic Archetypes

Before writing a single line of CSS/Tailwind, commit to one of the following cohesive design archetypes matching the application's true domain:

### 1. The Obsidian / Technical Dark Mode
- **Best For:** Developer tools, APIs, infrastructure, terminal products, data engineering.
- **Palette:** Deep obsidian background (`#090a0f` or `#0b0c10`), hairline borders (`border-white/[0.08]`), single high-visibility phosphor accent (amber `#f59e0b`, emerald `#10b981`, or electric cobalt `#3b82f6`).
- **Typography:** Technical monospace (`Geist Mono`, `JetBrains Mono`) for metrics, badges, and code snippets; clean sans (`Geist`, `Inter Tight`) for body.
- **Key Details:** Inset border highlights (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.06)`), subtle grid lines, high density.

### 2. The Swiss Editorial / Stark Modernist
- **Best For:** Publications, thought leadership, architecture portfolios, luxury products.
- **Palette:** Pure stark contrast or soft cream (`#fbfbfa`), charcoal typography (`#121212`), muted warm accents (terracotta, forest green).
- **Typography:** Editorial serif display (`Newsreader`, `Instrument Serif`, `Playfair Display`) paired with a high-legibility geometric or grotesque sans (`Cabinet Grotesk`, `Plus Jakarta Sans`).
- **Key Details:** Asymmetric two-column layouts, generous negative space, thick structural divider rules (`border-t-2 border-neutral-900`), zero card containers.

### 3. The Neo-Brutalist Tactical
- **Best For:** Modern SaaS, dev utilities, developer hackathons, creative tools.
- **Palette:** High-contrast borders (`border-2 border-black dark:border-white`), solid offset drop shadows (`shadow-[4px_4px_0px_0px_#000]`), intentional saturated color blocking (canary yellow, hot coral).
- **Typography:** Bold sans display with tight letter tracking (`tracking-tight font-black`).
- **Key Details:** Crisp hard edges (`rounded-none` or `rounded-sm`), tactile physical button press offsets (`active:translate-x-[2px] active:translate-y-[2px]`).

### 4. The Warm Craft / Artisanal Digital
- **Best For:** Creative software, notebooks, productivity, education, human-centric tools.
- **Palette:** Warm sand (`#f7f5f0`), muted linen cards (`#ffffff`), warm gray text (`#3c3836`), olive or clay accents.
- **Typography:** Friendly humanist sans or rounded grotesque with generous line height (`leading-relaxed`).
- **Key Details:** Soft 1px warm borders (`border-[#e8e4dc]`), paper grain textures, organic rounded corners (`rounded-xl`).

---

## The 60-30-10 Color Discipline

To prevent visual noise and chaotic "AI rainbow" styling:
- **60% Dominant Base:** The background canvas and foundational surface (e.g. deep slate or warm paper).
- **30% Secondary Structure:** Cards, sidebars, borders, muted text, and structural dividers.
- **10% Accent Intent:** Reserved **strictly** for primary calls-to-action, active status indicators, and critical focal points. If accent color is everywhere, it means nothing.

---

## Typography Hierarchy Rules

- **Scale Ratio:** Stick to a defined modular scale (e.g. Major Third 1.25 or Perfect Fourth 1.333).
- **Line Length:** Strictly constrain prose to `max-w-prose` or 65–75 characters per line (`ch` unit) for reading comfort.
- **Kerning & Tracking:** Display headings (`text-3xl` to `text-6xl`) need tighter letter-spacing (`tracking-tight` or `tracking-tighter`). Small metadata (`text-xs`) requires neutral or slightly expanded tracking (`tracking-wide font-medium`).
- **Numeric Data:** Always use tabular figures (`font-variant-numeric: tabular-nums` or `tabular-nums`) for currency, timestamps, counters, and table data to prevent jitter.
