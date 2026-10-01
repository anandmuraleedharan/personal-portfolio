---
name: ui-ux-pro-max
description: >-
  Comprehensive design intelligence engine with curated UI styles, industry-specific palettes,
  font pairings, and UX patterns. Use when architecting complete SaaS interfaces, dashboards,
  or complex application screens.
---

# UI/UX Pro Max

An advanced UI/UX intelligence system designed to deliver production-ready, industry-calibrated user interfaces with stack-aware patterns.

## 1. Domain-Specific Palettes

Select the color system engineered specifically for the problem domain:

| Domain | Surface Canvas | Primary Brand | Accent / Signal | Semantic States |
| :--- | :--- | :--- | :--- | :--- |
| **Fintech & Trading** | `#0b0f19` (Navy Slate) | `#10b981` (Profit Green) | `#3b82f6` (Ticker Blue) | High contrast, crisp borders |
| **Developer Tools** | `#090a0f` (Obsidian) | `#f59e0b` (Phosphor Amber) | `#06b6d4` (Cyan telemetry) | Monospace density, dark mode first |
| **Healthcare & Biotech** | `#f8fafc` (Clean Alabaster) | `#0284c7` (Clinical Azure) | `#14b8a6` (Teal vitals) | Calming, accessible, high legibility |
| **Modern SaaS / AI** | `#030712` (Zinc Black) | `#fafafa` (Crisp White) | `#6366f1` (Muted Indigo) | Minimalist, sharp borders, typography-led |
| **E-Commerce / Consumer** | `#ffffff` (Pure White) | `#18181b` (Carbon) | `#f97316` (Action Tangerine) | Large imagery, clear checkout paths |

---

## 2. Advanced Layout Architectures

### A. The Bento Grid Matrix
- **Composition:** Asymmetric tiles where the primary hero capability spans `col-span-2 row-span-2`, flanked by compact 1x1 telemetry tiles and a wide 2x1 status banner.
- **Visual Texture:** Subtle 1px borders (`border-white/[0.08]` or `border-zinc-200`), corner notches, and inset highlights.

### B. High-Density Command Dashboard
- **Composition:** Fixed compact sidebar (icons + labels, collapsed on mobile), top telemetry bar with breadcrumbs and active environment switch, split master-detail view.
- **Data Display:** Dense tabular layouts with sticky headers, sortable columns, inline badge pills, and drawer side-sheets for record inspection.

---

## 3. Interaction & UX State Resilience

Every component must account for the **5 UX Lifecycle States**:
1. **Initial / Empty State:** Engaging illustration or icon, explanatory copy, and a single high-visibility primary action button (e.g. "Create your first pipeline").
2. **Loading State:** Subtle pulse skeletons that match the exact geometry of incoming cards/text, avoiding layout shift (CLS).
3. **Populated / Ideal State:** High data density, crisp typography, clean alignment.
4. **Error / Recovery State:** Clear human-readable error description, error code tag, and a 1-click retry or rollback button.
5. **Partial / Filtered State:** Clear pill indicating active filters with a 1-click "Clear filters" link when zero results return.

---

## 4. Tactile Micro-Interactions

- **Button Depress:** Apply `active:scale-[0.98] transition-transform duration-100 ease-out`.
- **Focus Rings:** Always provide dual-tone focus rings: `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`.
- **Card Hover:** Subtle border illumination (`hover:border-zinc-400 dark:hover:border-zinc-600`) and slight shadow lift (`hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`).
