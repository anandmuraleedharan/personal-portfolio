---
name: high-end-visual-design
description: >-
  Agency-grade visual design, spatial luxury, advanced lighting, custom easing choreography,
  and high-polish textures. Use when designing hero sections, flagship interfaces, or luxury/premium digital products.
---

# High-End Visual Design

This skill provides advanced artistic techniques and design tokens to elevate web interfaces to the tier of world-class design engineering (emulating Apple, Linear, Stripe, Teenage Engineering, and Vercel).

## 1. Spatial Luxury & Breathing Room

- **Generous Section Padding:** High-end brands do not crowd their content. Use vertical padding of `py-24` (96px) to `py-36` (144px) between major architectural sections.
- **Asymmetrical Tension:** Symmetrical 3-column grids look like cookie-cutter templates. Break symmetry using 60/40 splits, offset hero graphics, and editorial column widths.
- **Content Framing:** Let the main hero statement occupy its own uncluttered horizontal plane before introducing supporting visuals or secondary controls.

---

## 2. Advanced Depth, Framing & "Doppelrand"

Cheap UI uses heavy drop shadows or generic `backdrop-blur`. High-end visual design uses precision layering:
- **The "Doppelrand" (Double-Border Framing):**
  Create crisp hardware-like bevels by pairing an inner highlight with an outer dark stroke:
  ```css
  box-shadow: 
    inset 0 1px 0 0 rgba(255, 255, 255, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    0 20px 40px -15px rgba(0, 0, 0, 0.5);
  ```
- **Directional Surface Tints:**
  Dark mode surfaces should never be flat. Use a subtle top-to-bottom radial gradient simulating an ambient overhead light source:
  ```css
  background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.03), transparent 70%), #0a0a0c;
  ```
- **Subtle Surface Grain:**
  Apply a low-opacity SVG noise texture (1.5% to 2% opacity) to backgrounds to eliminate digital banding and provide physical tactile warmth.

---

## 3. Motion Choreography & Kinetic Physics

- **Custom Cubic-Bezier Curves:**
  Never use default `ease` or linear motion. Use custom acceleration/deceleration curves:
  - Snappy Entrance: `cubic-bezier(0.16, 1, 0.3, 1)` (Linear / Apple standard)
  - Smooth Editorial Reveal: `cubic-bezier(0.22, 1, 0.36, 1)`
- **Coordinated Staggering:**
  When lists or grids animate in, stagger child items by 40–60ms intervals (`staggerChildren: 0.05`).
- **Physical Resistance:**
  Buttons should feel physical: on mouse-down, scale down by 1.5% (`scale(0.985)`) with immediate 80ms response; on mouse-up, spring back smoothly.

---

## 4. Typography as Sculpture

- **Display Scale:** Scale hero headings with optical balance. Use large headline sizes (`text-5xl` to `text-7xl`) with tight letter spacing (`-0.03em` or `tracking-tight`).
- **Font Pairing Contrasts:**
  - *Option A (Modern Tech):* Technical Grotesque (e.g. `Geist`, `Plus Jakarta Sans`) + High-precision Monospace (`Geist Mono`, `SF Mono`).
  - *Option B (High Editorial):* Sculptural Serif (e.g. `Instrument Serif`, `Newsreader`, `Playfair Display`) + Neutral Geometric Sans.
- **Optical Balance:** Prevent orphaned words at the end of headings using CSS `text-wrap: balance`.

---

## 5. Micro-Craft Checklist

- [ ] All icon strokes are uniform (`1.5px` or `1.75px` across all icons).
- [ ] No border is thicker than `1px` unless intentionally brutalist.
- [ ] Borders use alpha channels (`rgba(255,255,255,0.08)` or `rgba(0,0,0,0.06)`) rather than solid colors, allowing them to adapt gracefully to background changes.
- [ ] Interactive elements provide instant cursor change (`cursor-pointer`) and distinct active/focus visual states.
- [ ] Text contrast meets WCAG AAA standards on hero copy.
