---
name: web-design-guidelines
description: >-
  Audits and enforces Web Interface Guidelines, WCAG accessibility, performance metrics,
  and modern responsive layout standards. Use when reviewing UI code, testing accessibility,
  or preparing code for production release.
---

# Web Design Guidelines

Based on Vercel's Web Interface Guidelines and industry standards for production web engineering. Enforces accessibility, performance, responsive layout, and typography rules across all web surfaces.

## 1. Accessibility & Inclusivity (WCAG 2.2 AA)

- **Contrast Ratios:**
  - Body Text: Minimum `4.5:1` contrast ratio against background.
  - Large Text (`text-lg font-bold` or `text-2xl`+): Minimum `3:1` contrast ratio.
  - Non-text elements (icons, borders, form field boundaries): Minimum `3:1` contrast ratio.
- **Touch Target Sizing:**
  - Interactive targets (buttons, links, menu items) must be at least `44x44px` on touch screens.
- **Semantic HTML & ARIA:**
  - Use native `<button>`, `<a>`, `<nav>`, `<main>`, `<header>`, `<footer>`, `<aside>` instead of generic `div` soup with click handlers.
  - Provide `aria-label` on icon-only buttons (e.g. search icons, close buttons, menu toggles).
  - Use `aria-expanded` on accordion and dropdown toggles.
- **Keyboard Navigation:**
  - Every interactive element must be reachable and operable via `Tab` and `Enter`/`Space`.
  - Never set `outline: none` without providing an equivalent `:focus-visible` ring.

---

## 2. Performance & Core Web Vitals (CWV)

- **Zero Cumulative Layout Shift (CLS):**
  - Always reserve dimensions on images and media containers (`aspect-ratio` or explicit `width` and `height`).
  - Reserve height for dynamic components (loaders, skeletons, banners) to avoid content jumping when loaded.
- **Largest Contentful Paint (LCP) Optimization:**
  - Use Next.js `<Image priority>` for the primary above-the-fold hero image.
  - Avoid rendering heavy client-side charts or WebGL canvases before the initial DOM paint.
- **Interaction to Next Paint (INP):**
  - Debounce rapid inputs (search inputs: 200–300ms).
  - Defer offscreen DOM tree rendering with CSS `content-visibility: auto`.

---

## 3. Responsive Spatial System (8pt Grid)

- **Spacing Multiples:** Align all padding, margins, and gaps to multiples of 4px/8px:
  - Micro: `gap-1` (4px), `gap-2` (8px)
  - Component: `p-4` (16px), `p-6` (24px)
  - Section: `py-12` (48px), `py-20` (80px), `py-32` (128px)
- **Viewport Fluidity:**
  - Use modern CSS container queries (`@container`) for cards that live in variable-width sidebars or grids.
  - Mobile-first breakpoint progression: `base` → `sm` (640px) → `md` (768px) → `lg` (1024px) → `xl` (1280px).

---

## 4. Typography & Internationalization (i18n)

- **Tabular Figures:** Always use `tabular-nums` for numeric counters, currency columns, and countdown timers.
- **Punctuation:** Use true typographic punctuation (em-dashes `—`, curly quotes `“ ”`, apostrophes `’`) instead of straight typewriter quotes.
- **Number & Date Formatting:** Leverage the native browser `Intl.NumberFormat` and `Intl.DateTimeFormat` APIs for currency, dates, and localized lists.
