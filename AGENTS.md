<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# User Profile & Development Philosophy

## Workspace Context
- **Workspace Location:** `/Users/anandmuraleedharan/.gemini/antigravity/scratch/personal-portfolio`
- **Structure:** Monorepo using Git Submodules located in the `apps/` directory (e.g., `apps/newsletter-generator`, `apps/cogpoker`, `apps/codeforge`).
- **Core Stack:** Next.js (App Router), TypeScript, Tailwind CSS, local/edge Supabase Realtime, Gemini API, OpenRouter fallback.
- **Port Allocation Mappings:**
  - Port `3000`: Main Portfolio App (`personal-portfolio` root)
  - Port `3001`: Newsletter App (`apps/newsletter-generator`)
  - Port `3002`: CogPoker App (`apps/cogpoker`)
  - Port `3003`: CodeForge App (`apps/codeforge`)
  - Port `3004`: PDFForge App (`apps/pdfforge`)
  - Port `3005`: Aileron App (`apps/aileron`)
  - Port `3006`: Lipi App (`apps/lipi`)
  - Port `3007`: InterviewForge App (`apps/interviewforge`)

## Backend & Cost Philosophy ("Minimal Backend, No-Money")
- **Zero-DB / Stateless Lifecycles:** Prefer ephemeral, client-side, or in-memory synchronization (e.g., Supabase Realtime Channels Broadcast + Presence, localStorage) over persistent databases. Avoid database bloat, regulatory storage tracking, or servers that accrue monthly charges.
- **Budget-Conscious / Serverless:** Discard commercial monetization frameworks, subscription models, or payment gateways in Phase 1. Build open, premium-designed, completely free learning/utility platforms.
- **AI Token Management & Fallback:**
  - Standard LLM integration targets the **Gemini API** using direct environment keys (`GEMINI_API_KEY`).
  - If Gemini limits are hit (e.g. rate limits or quota depletion), automatically fall back to **OpenRouter free models** via standard HTTPS requests to `https://openrouter.ai/api/v1/chat/completions`.
  - Target fallback models: `meta-llama/llama-3.3-70b-instruct:free`, `google/gemma-2-9b-it:free`, etc.

## Mandatory Local Testing & Git Versioning Workflow
- **Automated Testing Mandate:** `npm run build` alone is insufficient because builds pass even if zero tests exist. For every new project, feature, or API endpoint, unit or integration test suites MUST be created and executed (`npm test` / Vitest / Playwright). The test suite must run and pass locally alongside build verification before committing or deploying code.
- **Local Testing Requirement:** ALWAYS test builds (`npm run build`) and run test suites locally BEFORE pushing or deploying.
- **Git Tracking Requirement:** ALWAYS stage, commit, and push changes to GitHub (`git add . && git commit -m "..." && git push origin main`) for both the parent monorepo AND any submodules in `apps/*` BEFORE or alongside Vercel deployments. Never leave uncommitted or unpushed changes when shipping updates.

## Mandatory Documentation Standards
- **MkDocs Documentation Mandate:** Whenever a new micro-app is added to `apps/` or major features are launched, technical documentation MUST be created in `docs-portal/docs/apps/<app-name>.md`, registered in `docs-portal/mkdocs.yml` navigation, and updated in `docs-portal/docs/index.md` directory & port mapping tables.
- **Interactive Architecture Visualizer Updates:** Whenever a new app is added or architecture changes, `app/architecture/page.js` MUST be updated with new SVG nodes, links, telemetry HUD stats, and code spotlights.





