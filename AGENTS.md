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

## Backend & Cost Philosophy ("Minimal Backend, No-Money")
- **Zero-DB / Stateless Lifecycles:** Prefer ephemeral, client-side, or in-memory synchronization (e.g., Supabase Realtime Channels Broadcast + Presence, localStorage) over persistent databases. Avoid database bloat, regulatory storage tracking, or servers that accrue monthly charges.
- **Budget-Conscious / Serverless:** Discard commercial monetization frameworks, subscription models, or payment gateways in Phase 1. Build open, premium-designed, completely free learning/utility platforms.
- **AI Token Management & Fallback:**
  - Standard LLM integration targets the **Gemini API** using direct environment keys (`GEMINI_API_KEY`).
  - If Gemini limits are hit (e.g. rate limits or quota depletion), automatically fall back to **OpenRouter free models** via standard HTTPS requests to `https://openrouter.ai/api/v1/chat/completions`.
  - Target fallback models: `meta-llama/llama-3.3-70b-instruct:free`, `google/gemma-2-9b-it:free`, etc.

## Git Submodule Management
- All apps in `apps/` must be structured as Git submodules to maintain separation of concerns while keeping them aggregated under the `personal-portfolio` repository.

