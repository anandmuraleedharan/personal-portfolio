# Anand's Digital Portfolio Docs

Welcome to the technical documentation portal for Anand Muraleedharan's digital portfolio and utility suite monorepo. This site hosts detailed engineering details, architecture patterns, and cost breakdowns for the entire ecosystem.

---

## Repository Architecture

This codebase is structured as a Next.js monorepo containing multiple independent application modules. These sub-apps are integrated into the main repository using **Git Submodules**, enabling independent development cycles while maintaining a unified showcase.

```
personal-portfolio/ (Main Repo)
├── app/                  # Main Portfolio Next.js app pages
│   ├── analytics/        # Visitor Analytics & secure 2FA Dashboard
│   └── api/analytics/    # Serverless analytics logger API
├── components/           # Shared portfolio UI components
├── docs-portal/          # This MkDocs documentation portal
└── apps/                 # Git submodules directory
    ├── newsletter-generator/  # "The Daily Read" Newsletter
    ├── cogpoker/              # "CogPoker" Card Story Pointer
    ├── codeforge/             # "CodeForge" Dev Utility Suite
    ├── pdfforge/              # "PDFForge" PDF Editor & Chat
    ├── aileron/               # "Aileron" SQL Prompt Flywheel
    ├── lipi/                  # "Lipi" Malayalam Suite & Game
    └── interviewforge/         # "InterviewForge" AI Coach & Resume Prep
```

---

## Local Development Ports

When running the entire workspace concurrently via `npm run dev:all`, services are mapped to the following local listening ports:

| Service | Port | Directory Path | Core Stack |
| :--- | :--- | :--- | :--- |
| **Portfolio Hub** | `3000` | `./` | Next.js 16, Vanilla CSS |
| **Visitor Analytics** | `3000` | `./app/analytics` | Next.js 16, TOTP, DB FIFO Pruning |
| **The Daily Read** | `3001` | `apps/newsletter-generator` | Next.js, Gemini API, Resend |
| **CogPoker** | `3002` | `apps/cogpoker` | Next.js, Supabase Realtime, Web Audio |
| **CodeForge** | `3003` | `apps/codeforge` | Next.js, CompressionStreams |
| **PDFForge** | `3004` | `apps/pdfforge` | Next.js, PDF.js, PDF-Lib, OpenRouter |
| **Aileron UI** | `3005` | `apps/aileron` | Next.js, SQL Sandbox |
| **Aileron Backend** | `8005` | `apps/aileron/backend` | FastAPI Python, SQLite, DSPy |
| **Lipi** | `3006` | `apps/lipi` | Vite, Vanilla JS, Speech Synthesis |
| **InterviewForge** | `3007` | `apps/interviewforge` | Next.js 16, Gemini 2.5, Web Speech |

> [!NOTE]
> The **Visitor Analytics Dashboard** (`/analytics`) is built directly into the **Portfolio Hub** on port `3000` rather than running as a standalone server submodule.

---

## Project Objectives

* **Zero Hosting Cost**: Run all applications, databases, databases, web scraping, and AI models within free tiers ($0/month).
* **Privacy First**: Shift intensive file processing and content manipulation to client-side sandboxes (running directly in browser memory via Web Assembly and JS streams).
* **Stateless Operations**: Bypass persistent database costs using ephemeral URL hash states and sessionStorage caches.
* **Continuous AI Optimization**: Build self-improving prompt engines that refine instructions based on user corrections.
