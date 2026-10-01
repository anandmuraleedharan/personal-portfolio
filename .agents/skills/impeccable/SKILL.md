---
name: impeccable
description: >-
  Design guidance, anti-slop rules, and quality control for AI coding agents.
  Use when asked to "polish UI", "audit design", "critique layout", "remove AI tells",
  or elevate frontend craftsmanship to production standards.
---

# Impeccable Design Skill

Based on the open-source standard by Paul Bakaus (`pbakaus/impeccable`), this skill acts as an uncompromising creative director for UI code, eliminating common "AI slop" tells and enforcing production-grade design craft.

## The Anti-Slop Manifesto (What Never To Do)

Every LLM defaults to the same visual clichés because of template training bias. You must strictly avoid:
1. **No Cliché Gradients:** Never use generic purple-to-blue or pink linear gradients (`bg-gradient-to-r from-purple-500 to-indigo-600`).
2. **No Default Typography:** Never reach for unconfigured Inter or system sans-serif without an explicit typographic scale and paired font.
3. **No Nested Cards:** Never nest cards inside cards inside cards with identical borders and background colors.
4. **No Untinted Neutrals:** Never use pure `rgb(0,0,0)` black or raw neutral gray (`#808080`). Always tint darks and grays with the brand or ambient hue (e.g., slate, zinc with a 2% cobalt tint).
5. **No Gratuitous Numbering:** Never add decorative numbers ("01", "02", "03") or pill badges above headings unless the content is genuinely a strict sequence.
6. **No Bouncy / Jello Animations:** Avoid bouncy spring easings that wobble; use tight, dampened easing curves.

---

## 24 Design Commands Vocabulary

When the user asks for design operations, map their intent to these 24 core operations:

| Command | Action & Objective |
| :--- | :--- |
| **`init`** | Record durable product context in `PRODUCT.md` (target audience, job-to-be-done, tone, constraints) before touching UI code. |
| **`critique`** | Perform an objective design review of visual hierarchy, scanability, and emotional resonance. |
| **`audit`** | Audit technical quality: accessibility (WCAG AA), contrast ratios, keyboard navigation, and mobile viewports. |
| **`polish`** | Final craftsmanship pass: pixel alignment, border consistency, hover states, and typography kerning. |
| **`bolder`** | Amplify timid designs: increase contrast, scale up display typography, use purposeful asymmetry. |
| **`quieter`** | Tone down over-decorated UIs: remove unnecessary borders, reduce competing accent colors, introduce whitespace. |
| **`distill`** | Strip away decorative fluff to reveal core content and essential actions. |
| **`harden`** | Add edge-case UI: empty states, long text overflow (ellipsis / wrap), error states, and loading skeletons. |
| **`animate`** | Add purposeful, choreographed motion: enter transitions, layout morphing, tactile active presses. |
| **`typeset`** | Establish typographic scale, optical line-heights, letter-spacing tracking, and tabular numbers. |
| **`layout`** | Fix spatial rhythm, alignment axes, responsive breakpoints, and grid proportions. |
| **`delight`** | Add subtle, unexpected moments of craft (smooth tooltips, sound effects, bespoke micro-interactions). |

---

## Execution Heuristics

1. **Hierarchy First:** If everything shouts, nothing is heard. Establish one primary focal point per viewport.
2. **Whitespace is Luxury:** High-end interfaces breathe. Give major sections `py-20` to `py-32` of padding.
3. **Tactile Feedback:** Every interactive element must have 4 distinct visual states: Default, Hover, Active (downscale), and Focus-visible.
4. **Content-Aware Styling:** Don't design generic containers; design around the actual data, length, and shape of real user text.
