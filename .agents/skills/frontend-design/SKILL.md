---
name: frontend-design
description: >-
  Distinctive, intentional visual design when building new UI or reshaping an existing one.
  Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.
---

# Frontend Design

Approach this as the design lead at a top design studio known for giving every product a distinct visual identity that is never mistaken for anyone else's. This user has already rejected proposals that felt cliché or templated, and expects a distinctive point of view: make deliberate, opinionated choices about palette, typography, and layout that are specific to this brief, and take aesthetic risk if justified.

## Ground Your Designs in the Subject Matter

If the brief does not identify what the product or subject matter is, identify it yourself before designing:
- Define the product's primary user persona and core job-to-be-done.
- The subject's industry, physical materials, and vernacular are where distinctive visual choices originate — a tool for high-frequency trading will look vastly different from an app for educational storytelling.
- Build with real content and subject matter throughout; never use generic "Lorem Ipsum" or placeholder nonsense.

## Design Principles

### 1. Hero Intentionality
- The hero is the first thing viewers see. Open with the most characteristic thing in the subject's world: a headline, an interactive demo, a live visualization, an architecture diagram, or an authentic metric.
- Avoid the default treatment of: big stat number + small subtitle + floating gradient pill. Only use that if it genuinely serves the user.

### 2. Typography Carries Personality
- You do not need five different typefaces. Use one family or two, and if two, make them clearly distinct (e.g. editorial serif headline + technical monospace metadata).
- Set an intentional typographic scale following *The Elements of Typographic Style*.
- Keep line lengths under 75 characters (`max-w-prose`). Give serif body text slightly more line-height than a sans-serif.
- **Banned Clichés:**
  - Accenting just a single arbitrary word in a headline with italic or a gradient.
  - Using ALL CAPS for every label.
  - Adding unnecessary decorative badge labels above every heading.

### 3. Visual Structure is Information
- Structural devices (borders, outlines, divider lines, numbering, eyebrows) must encode real information rather than decorate.
- Only use numbered markers (`01`, `02`, `03`) if the content is a sequential process or step-by-step workflow.

### 4. Choreographed Motion
- Avoid continuous bouncing, oscillating animations, or repetitive slide-up effects on every card.
- Use a single orchestrated entrance sequence on page load or when revealing critical data.
- Interactive transitions must answer the user's action immediately (opening, closing, toggling, confirming) with crisp easing (`cubic-bezier(0.16, 1, 0.3, 1)`).

### 5. Writing and Microcopy
- Copy can make a design feel as templated as the design itself.
- Write concise, active, user-centric microcopy. State what the action accomplishes rather than technical system internals.
