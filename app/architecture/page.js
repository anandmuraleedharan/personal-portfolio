"use client";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import styles from "./architecture.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  RotateCcw, 
  Terminal, 
  Cpu, 
  Mail, 
  GitCompare, 
  FileText, 
  Copy, 
  Check, 
  Layers, 
  Network, 
  Zap, 
  Code,
  Activity,
  Database,
  Sliders,
  ExternalLink
} from "lucide-react";

// App technical details and coordinates for animated SVG diagrams
const APPS_ARCH_DATA = {
  dailyread: {
    title: "The Daily Read",
    subtitle: "Serverless Agentic news engine",
    description: "A stateless news compilation engine. A scheduled cron trigger executes a Next.js serverless handler, which aggregates context using a lightweight fallback web scraper, invokes Gemini with search grounding, formats the output, and emails it using Resend.",
    badges: ["Next.js 15", "Gemini SDK", "Resend API", "GitHub Actions", "Stateless"],
    patterns: [
      {
        name: "Serverless Pipeline Pattern",
        desc: "Executes end-to-end inside stateless serverless functions. State is zero-cost, loaded on-the-fly, processed, and immediately sent to recipients without a database."
      },
      {
        name: "Model Fallback Strategy",
        desc: "Tries 'gemini-2.5-flash' first. If rate-limited or quota is exceeded, automatically cascades to 'gemini-2.5-flash-lite' to guarantee daily delivery on free tiers."
      },
      {
        name: "Adapter / Proxy Pattern",
        desc: "Wraps third-party APIs (DuckDuckGo Search Scraper and Resend Emailing) inside Next.js routes, shielding client configuration and API keys securely."
      }
    ],
    nodes: [
      { id: 0, label: "GitHub Cron", sublabel: "Trigger (Daily)", x: 50, y: 110, w: 90, h: 50 },
      { id: 1, label: "Next.js API", sublabel: "route.ts", x: 185, y: 110, w: 85, h: 50 },
      { id: 2, label: "Scraper Proxy", sublabel: "DuckDuckGo", x: 310, y: 50, w: 100, h: 50 },
      { id: 3, label: "Gemini AI", sublabel: "Fallback Stack", x: 310, y: 170, w: 100, h: 50 },
      { id: 4, label: "Resend API", sublabel: "Email Client", x: 440, y: 110, w: 85, h: 50 },
      { id: 5, label: "User Inbox", sublabel: "SMTP Target", x: 550, y: 110, w: 75, h: 50 }
    ],
    links: [
      { from: 0, to: 1, path: "M 95 110 L 185 110" },
      { from: 1, to: 2, path: "M 227.5 85 L 310 50" },
      { from: 1, to: 3, path: "M 227.5 135 L 310 170" },
      { from: 2, to: 4, path: "M 410 50 L 482.5 85" },
      { from: 3, to: 4, path: "M 410 170 L 482.5 135" },
      { from: 4, to: 5, path: "M 525 110 L 550 110" }
    ],
    simulationSteps: [
      { nodeIds: [0], activeLink: -1, status: "GitHub Action triggers daily cron event." },
      { nodeIds: [1], activeLink: 0, status: "Next.js serverless handler initializes, verifying CRON_SECRET." },
      { nodeIds: [2, 3], activeLink: 1, status: "Queries news feeds via DDG Scraper while preparing LLM instructions." },
      { nodeIds: [3], activeLink: 2, status: "Cascades prompts down model list: gemini-2.5-flash -> gemini-2.5-flash-lite." },
      { nodeIds: [4], activeLink: 4, status: "Compiled Markdown is parsed to customized HTML and passed to Resend API." },
      { nodeIds: [5], activeLink: 5, status: "News digest is successfully delivered to recipient email boxes!" }
    ],
    code: `// Multi-tier Fallback Model Execution
async function generateContentWithFallback(
  ai: GoogleGenAI,
  systemInstruction: string,
  contents: string
): Promise<string> {
  const models = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite'
  ];
  
  let lastError = "";
  
  for (const model of models) {
    try {
      console.log(\`Attempting generation with: \${model}\`);
      const response = await ai.models.generateContent({
        model,
        contents,
        config: { systemInstruction }
      });
      
      if (response.text) return response.text;
    } catch (e: any) {
      lastError = e.message;
      console.warn(\`Model \${model} failed: \${e.message}. Falling back...\`);
    }
  }
  
  throw new Error(\`All models exhausted. Final error: \${lastError}\`);
}`,
    docs: {
      overview: "The Daily Read is an automated, stateless morning news compilation engine. Designed around serverless-first and cost-efficiency guidelines, it operates without a persistent database. It relies on GitHub Actions cron schedules to wake up a Next.js serverless route, crawls technology feeds using a stateless proxy web crawler, processes raw news with Gemini AI, and formats the final digest to deliver it to Anand's email via the Resend API.",
      systemFlow: [
        { step: "1. Scheduled Cron Event", detail: "At 06:00 UTC daily, a GitHub Actions workflow dispatches a secure HTTPS POST request to the Next.js `/api/cron` endpoint." },
        { step: "2. Token Security Gate", detail: "The serverless function intercepts the request and validates the authorization header against the server's `CRON_SECRET` to block unauthorized runs." },
        { step: "3. Stateless Search Crawl", detail: "Executes a client-side search query string to crawl tech news topics via a lightweight DuckDuckGo scraper, extracting raw article titles and links." },
        { step: "4. Gemini AI Selection Loop", detail: "Feeds raw text to the Gemini API under strict formatting guidelines. Automatically cascading down the fallback stack if rate limits or quota boundaries are met." },
        { step: "5. Resend Dispatch", detail: "The resulting markdown output is parsed to styled HTML and transactionally dispatched to the recipient's inbox using the Resend SDK." }
      ],
      stateStorage: [
        { key: "API Keys & Secrets", type: "Vercel Env Variables", purpose: "Securely stores GEMINI_API_KEY, RESEND_API_KEY, and CRON_SECRET at the edge host level." },
        { key: "Feed Context Cache", type: "Ephemeral Runtime Memory", purpose: "Zero database footprint. News listings are loaded and processed on-the-fly and cleaned up instantly upon request resolution." }
      ],
      resilience: "Guarantees morning news arrival by employing a cascading failover model for LLM generation: if gemini-2.5-flash exhausts its developer quota or throws a rate limit error, the loop dynamically catches the exception and falls back to gemini-2.5-flash-lite. The API endpoint is protected by a cryptographically strong bearer token validation step."
    }
  },
  cogpoker: {
    title: "CogPoker",
    subtitle: "Real-time story pointing",
    description: "A collaborative scrum estimation poker deck. The app is fully stateless, using client-side listeners and a resilient database-free realtime mechanism. If Supabase is unavailable, it automatically starts polling an in-memory route with self-healing reconciliation.",
    badges: ["Next.js 16", "Supabase Realtime", "Gemini 2.5", "Self-Healing Client", "Realtime Poll Fallback"],
    patterns: [
      {
        name: "Self-Healing Client Sync",
        desc: "Reconciles the server presence array against the client's local memory. If a discrepancy or missing state is caught, it automatically forces a 'track()' event to re-converge state."
      },
      {
        name: "Multi-Provider Fallback (Realtime)",
        desc: "Switches to an in-memory HTTP API polling route on localhost/test beds where Supabase accounts are not configured. Keeps developer environments fully functional."
      },
      {
        name: "Strategy Pattern (Estimation Decider)",
        desc: "Uses separate system prompts and factor schemas (Human complexity vs. Hybrid AI complexity vs. Autonomous model parameters) to score tasks dynamically."
      }
    ],
    nodes: [
      { id: 0, label: "Developer Client", sublabel: "React Session", x: 50, y: 110, w: 90, h: 50 },
      { id: 1, label: "Supabase Realtime", sublabel: "WebSockets", x: 185, y: 50, w: 105, h: 50 },
      { id: 2, label: "Next.js Mock API", sublabel: "Memory Poller", x: 185, y: 170, w: 105, h: 50 },
      { id: 3, label: "Active Peer AI", sublabel: "Gemini / OpenRouter", x: 320, y: 110, w: 100, h: 50 },
      { id: 4, label: "Scrum Room", sublabel: "State Consensus", x: 450, y: 110, w: 90, h: 50 },
      { id: 5, label: "Sync Engine", sublabel: "Self-Heal Loop", x: 565, y: 110, w: 80, h: 50 }
    ],
    links: [
      { from: 0, to: 1, path: "M 95 110 L 185 50" },
      { from: 0, to: 2, path: "M 95 110 L 185 170" },
      { from: 1, to: 3, path: "M 290 50 L 370 85" },
      { from: 2, to: 3, path: "M 290 170 L 370 135" },
      { from: 3, to: 4, path: "M 420 110 L 450 110" },
      { from: 4, to: 5, path: "M 540 110 L 565 110" }
    ],
    simulationSteps: [
      { nodeIds: [0], activeLink: -1, status: "User casts a vote or adjusts cognitive factors in the UI." },
      { nodeIds: [1, 2], activeLink: 0, status: "Tries WebSocket connection. If it fails, starts local Next.js polling API." },
      { nodeIds: [3], activeLink: 2, status: "Triggers active Peer AI estimator to analyze ticket and submit score." },
      { nodeIds: [4], activeLink: 4, status: "Scrum room broadcasts state changes, aggregating scores and updates." },
      { nodeIds: [5], activeLink: 5, status: "Self-healing loop monitors presence; re-tracks missing slots to maintain sync." }
    ],
    code: `// Self-Healing Sync Reconciler in Mock Realtime Provider
class MockRealtimeChannel {
  // ...
  async subscribe(cb?: (status: string) => void) {
    this.intervalId = setInterval(async () => {
      const res = await fetch('/api/realtime', {
        method: 'POST',
        body: JSON.stringify({ action: 'poll', roomId: this.roomId })
      });
      if (res.ok) {
        const data = await res.json();
        
        // SELF-HEALING STATE RECONCILIATION
        if (this.username) {
          const myServerPresenceArray = data.presences[this.userId];
          const myServerPresence = myServerPresenceArray?.[myServerPresenceArray.length - 1];
          const serverVoteCast = myServerPresence?.voteCast || false;
          const localVoteCast = this.lastTrackedState?.voteCast || false;

          // Re-track state immediately if local state has diverged from server consensus
          if (!myServerPresence || serverVoteCast !== localVoteCast) {
            console.log('[SUPABASE MOCK] Out of sync. Self-healing presence track...');
            this.track(this.lastTrackedState).catch(() => {});
          }
        }
      }
    }, 200);
  }
}`,
    docs: {
      overview: "CogPoker is a database-free, real-time scrum story pointing room. Designed to bypass database costs, it leverages Supabase Realtime Channels (Broadcast + Presence) to establish direct WebSocket connections between team members and a Gemini AI peer estimator. It incorporates Web Audio API synthesizers for themed sound effects and features active client-side presence reconciliation for self-healing connection drops.",
      systemFlow: [
        { step: "1. Socket Channel Join", detail: "Voter enters a room, initiating a WebSocket connection that subscribes to the room's presence channel." },
        { step: "2. Peer Broadcast", detail: "When a player casts a vote, their selectedCard value is broadcast to all active channel peers instantly." },
        { step: "3. Concurrent AI Sizing", detail: "When the host broadcasts a ticket update, estimation requests are triggered in parallel across free LLM endpoints (Llama-3.3-70b, Gemma-2-9b, Mistral-7b) to select the fastest response." },
        { step: "4. Consensus Computation", detail: "Upon reveal, the room calculates consensus levels, human vs. AI alignment variance, and primary uncertainty bottlenecks." },
        { step: "5. Safe Tab Disconnection", detail: "A 'beforeunload' event handler intercepts browser closure, forcing a channel unsubscribe to immediately purge stale presence nodes." }
      ],
      stateStorage: [
        { key: "Supabase Presence", type: "WebSocket Channel", purpose: "Ephemeral storage of voter lists, connection statuses, card votes, and moderator roles." },
        { key: "In-Memory State Hub", type: "Local API Route", purpose: "Failover fallback polling target simulating sockets using setInterval." },
        { key: "Browser session", type: "Session Storage", purpose: "Retains voter configurations and active sound themes (Space, Cyberpunk, Tavern, Arcade)." }
      ],
      resilience: "Integrates a self-healing client reconciler that continually compares local player state against the server presence payload, forcing a re-track if it detects connection drops. Sizing algorithms isolate OpenRouter delays by racing multiple free model requests concurrently and falling back to local deterministic heuristic code if all APIs fail."
    }
  },
  codeforge: {
    title: "CodeForge",
    subtitle: "Stateless Developer Utility Suite",
    description: "A premium suite of client-side developer tools. Featuring custom Myers diff validation, XML/YAML converters, and a sharing mechanism that compresses code entirely in the URL hash, achieving sharing without databases.",
    badges: ["Next.js 16", "CompressionStream", "DecompressionStream", "Myers Diff Algorithm", "Zero-Database Share"],
    patterns: [
      {
        name: "URL Hash State Serialization",
        desc: "Encodes application state directly into the browser's URL hash payload. This allows sharing full multi-file comparisons and config maps via a copyable URL with zero database lookup."
      },
      {
        name: "Pipe & Filter Compression",
        desc: "Applies a pipeline of transformations: Raw String -> TextEncoder Bytes -> Deflate Stream -> Base64 URL-Safe conversion, reducing payload size by up to 80%."
      },
      {
        name: "Flyweight / Memory Optimization",
        desc: "Implements high-performance diffing and text operations entirely client-side using JavaScript loops. No heavy backend VM processing."
      }
    ],
    nodes: [
      { id: 0, label: "Raw Code", sublabel: "Input String", x: 50, y: 110, w: 90, h: 50 },
      { id: 1, label: "Text Encoder", sublabel: "UTF-8 Bytes", x: 180, y: 110, w: 90, h: 50 },
      { id: 2, label: "Deflate Stream", sublabel: "GZIP Compression", x: 310, y: 110, w: 100, h: 50 },
      { id: 3, label: "Base64 Safe", sublabel: "URL Encoding", x: 440, y: 110, w: 90, h: 50 },
      { id: 4, label: "URL Hash", sublabel: "Stateless Storage", x: 560, y: 110, w: 80, h: 50 }
    ],
    links: [
      { from: 0, to: 1, path: "M 95 110 L 180 110" },
      { from: 1, to: 2, path: "M 225 110 L 310 110" },
      { from: 2, to: 3, path: "M 360 110 L 440 110" },
      { from: 3, to: 4, path: "M 485 110 L 560 110" }
    ],
    simulationSteps: [
      { nodeIds: [0], activeLink: -1, status: "User writes or edits code. Clicking 'Share Link' starts serialization." },
      { nodeIds: [1], activeLink: 0, status: "TextEncoder converts code strings into a binary byte stream (Uint8Array)." },
      { nodeIds: [2], activeLink: 1, status: "Stream is piped through CompressionStream('deflate') reducing byte size by ~70%." },
      { nodeIds: [3], activeLink: 2, status: "Compressed buffer is converted to a base64 string, modified to be URL-safe (replacing +, /)." },
      { nodeIds: [4], activeLink: 3, status: "Stateless URL hash is set. Sharing this link loads and decompresses the code client-side!" }
    ],
    code: `// Stateless URL Compression Pipeline
export async function compressData(oldText: string, newText: string): Promise<string> {
  if (!oldText && !newText) return '';
  
  const payload = JSON.stringify({ o: oldText, n: newText });
  const encoder = new TextEncoder();
  const bytes = encoder.encode(payload);

  // Compress bytes using deflate format client-side
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    }
  });

  const compressionStream = stream.pipeThrough(new CompressionStream('deflate'));
  const response = new Response(compressionStream);
  const compressedBuffer = await response.arrayBuffer();

  // Convert buffer to base64
  const compressedBytes = new Uint8Array(compressedBuffer);
  let binaryString = '';
  const chunkSize = 8192;
  for (let i = 0; i < compressedBytes.length; i += chunkSize) {
    binaryString += String.fromCharCode.apply(
      null,
      Array.from(compressedBytes.subarray(i, i + chunkSize))
    );
  }
  
  const base64 = btoa(binaryString);
  
  // Make base64 URL safe
  return base64
    .replace(/\\+/g, '-')
    .replace(/\\//g, '_')
    .replace(/=+$/, '');
}`,
    docs: {
      overview: "CodeForge is a privacy-first, stateless developer utility suite for formatting, diffing, and converting code. It enables sharing full multi-file comparison states directly through the URL hash, achieving 100% database-free sharing.",
      systemFlow: [
        { step: "1. Client Input", detail: "User pastes code into the side-by-side Monaco or textarea comparison blocks." },
        { step: "2. Myers Diff Run", detail: "Executes a client-side Myers diff algorithm to dynamically compute character, word, and line-level changes." },
        { step: "3. Bytes Conversion", detail: "Converts text inputs into a binary byte stream (Uint8Array) via TextEncoder." },
        { step: "4. Deflate Stream", detail: "Pipes the bytes through a native browser `CompressionStream('deflate')`, shrinking payload sizes by over 70%." },
        { step: "5. Base64 Safe Hash", detail: "Converts the buffer to a base64 string, replaces unsafe symbols, and updates the URL hash for stateless sharing." }
      ],
      stateStorage: [
        { key: "URL Location Hash", type: "Browser URL Fragment", purpose: "Serves as the primary stateless database. The entire comparison payload is encoded within the link itself." },
        { key: "Editor Configs", type: "Local Storage", purpose: "Retains user editor settings (tab sizes, word wrap, selected visual theme)." }
      ],
      resilience: "All formatting, validator parsing (js-yaml), and diff calculation tasks execute locally inside the browser UI thread (optimizing for speed via chunking for files up to 100MB). There are zero backend database requirements, ensuring infinite availability."
    }
  },
  pdfforge: {
    title: "PDFForge",
    subtitle: "Client-side PDF utility",
    description: "A fast, privacy-focused utility to compile, split, and edit PDFs. To analyze documents securely, it matches text chunks locally and queries an API routing proxy across available free model endpoints on OpenRouter.",
    badges: ["Next.js 16", "PDF-Lib", "PDF.js", "OpenRouter Free Models", "Client-Side Processing"],
    patterns: [
      {
        name: "Client-Side Sandbox Pattern",
        desc: "Maintains document privacy by parsing, rendering, splitting, and merging files inside the user's browser via PDF.js. Zero bytes of raw files are uploaded to any server."
      },
      {
        name: "Cascade / Fallback proxy",
        desc: "Implements API failover: Llama 3.3 70B -> Gemini 2.5 Flash -> Generic Free tier. If a free API is experiencing outages, it immediately retries the next."
      },
      {
        name: "Stateless RAG (Retrieval Augmented Gen)",
        desc: "Extracts textual contents from the canvas locally and feeds it directly into the prompt request payload dynamically, skipping complex vector database ingestion."
      }
    ],
    nodes: [
      { id: 0, label: "PDF Upload", sublabel: "Drag & Drop", x: 50, y: 110, w: 90, h: 50 },
      { id: 1, label: "PDF.js Parser", sublabel: "Client Sandbox", x: 185, y: 110, w: 95, h: 50 },
      { id: 2, label: "Text Extractor", sublabel: "Context slice", x: 320, y: 110, w: 95, h: 50 },
      { id: 3, label: "API Route Proxy", sublabel: "Serverless Node", x: 450, y: 110, w: 100, h: 50 },
      { id: 4, label: "OpenRouter LLM", sublabel: "Cascade (Llama/Gemini)", x: 575, y: 110, w: 100, h: 50 }
    ],
    links: [
      { from: 0, to: 1, path: "M 95 110 L 185 110" },
      { from: 1, to: 2, path: "M 232.5 110 L 320 110" },
      { from: 2, to: 3, path: "M 367.5 110 L 450 110" },
      { from: 3, to: 4, path: "M 500 110 L 575 110" }
    ],
    simulationSteps: [
      { nodeIds: [0], activeLink: -1, status: "User drops a PDF file onto the client workspace." },
      { nodeIds: [1], activeLink: 0, status: "PDF.js loads the document structure locally and extracts text from selected page ranges." },
      { nodeIds: [2], activeLink: 1, status: "User asks a question; local client chunks relevant text context into the chat array." },
      { nodeIds: [3], activeLink: 2, status: "Proxies request to Next.js API endpoint to hide keys and keep requests secure." },
      { nodeIds: [4], activeLink: 3, status: "OpenRouter receives request; cascades failovers dynamically until success." }
    ],
    code: `// OpenRouter Cascade Model Failover Proxy
export async function POST(request: NextRequest) {
  const { messages, systemInstruction } = await request.json();
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  
  // Format message payload ...
  const formattedMessages = systemInstruction 
    ? [{ role: "system", content: systemInstruction }, ...messages]
    : messages;

  const orModels = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemini-2.5-flash:free",
    "openrouter/free"
  ];

  let lastError = "";

  // Cascade fallbacks
  for (const model of orModels) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": \`Bearer \${openrouterKey}\`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ model, messages: formattedMessages, temperature: 0.3 })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return NextResponse.json({ content: text, model });
        }
      }
    } catch (err: any) {
      lastError = err.message;
    }
  }

  return NextResponse.json({ error: \`AI failed: \${lastError}\` }, { status: 502 });
}`,
    docs: {
      overview: "PDFForge is a browser-based PDF utility that allows splitting, merging, and querying documents locally. It maintains absolute data privacy by performing all rendering and text extraction in the browser client sandbox, calling serverless AI proxies for processing.",
      systemFlow: [
        { step: "1. PDF Selection", detail: "Voter drops a document. The browser instantiates a local Blob URL." },
        { step: "2. Sandboxed Text Extraction", detail: "PDF.js parses pages, extracting textual layers and compiling character arrays completely locally." },
        { step: "3. Local Context Selection", detail: "Performs RAG indexing locally, selecting context snippets corresponding to user questions." },
        { step: "4. Token Concealment Proxy", detail: "Posts data to `/api/pdfforge` which secures credentials and routes requests to model hosts." },
        { step: "5. OpenRouter Cascade", detail: "Iterates down a failover endpoint chain (Llama 3.3 70B -> Gemini 2.5 Flash -> Generic Free) until successful completion." }
      ],
      stateStorage: [
        { key: "Binary Document Blob", type: "Ephemeral memory", purpose: "PDF data arrays held in sandbox memory; never sent to any backend servers." },
        { key: "Dialog Array", type: "React State", purpose: "Retains prompt dialogue history locally for context mapping." }
      ],
      resilience: "Shields developer API tokens using Next.js serverless functions as proxies. Bypasses third-party rate limits and API outages by implementing a cascade retry system across OpenRouter free model endpoints."
    }
  },
  portfolio: {
    title: "Personal Portfolio",
    subtitle: "AI Recruiter & Resume Bot",
    description: "Anand's digital portfolio hub. Serves as a stateless entry point. Features a resume chatbot with a keyword-matching fallback system and an AI Recruiter resume tailor that stores tailored states in SessionStorage for zero-database PDF exporting.",
    badges: ["Next.js 16", "Gemini 2.5", "Framer Motion", "SessionStorage", "Vanilla CSS"],
    patterns: [
      {
        name: "Dynamic Profile Context Injection",
        desc: "Loads a central JSON profile dynamically and injects it directly into the LLM system instructions on each API call, ensuring contextually accurate responses."
      },
      {
        name: "Stateless Client-Side Cache (SessionStorage)",
        desc: "Stores AI-generated resume customizations in browser sessionStorage. The print route reads this state, eliminating database read/write costs."
      },
      {
        name: "Local Keyword-Matching Fallback Engine",
        desc: "Automatically intercepts questions when the Gemini API is offline or quota-blocked, routing them to a local keyword-matching algorithm to guarantee answer availability."
      }
    ],
    nodes: [
      { id: 0, label: "Visitor UI", sublabel: "Landing Page", x: 50, y: 110, w: 90, h: 50 },
      { id: 1, label: "AI Chatbot API", sublabel: "/api/chat", x: 185, y: 50, w: 100, h: 50 },
      { id: 2, label: "Recruiter API", sublabel: "/api/tailor", x: 185, y: 170, w: 100, h: 50 },
      { id: 3, label: "Gemini 2.5 API", sublabel: "Cognitive Solver", x: 320, y: 110, w: 105, h: 50 },
      { id: 4, label: "SessionStorage", sublabel: "State Cache", x: 460, y: 170, w: 100, h: 50 },
      { id: 5, label: "Tailored PDF", sublabel: "/resume", x: 565, y: 110, w: 80, h: 50 }
    ],
    links: [
      { from: 0, to: 1, path: "M 95 110 L 185 50" },
      { from: 0, to: 2, path: "M 95 110 L 185 170" },
      { from: 1, to: 3, path: "M 285 50 L 340 85" },
      { from: 2, to: 3, path: "M 285 170 L 340 135" },
      { from: 3, to: 4, path: "M 390 110 L 460 170" },
      { from: 4, to: 5, path: "M 520 170 L 565 110" }
    ],
    simulationSteps: [
      { nodeIds: [0], activeLink: -1, status: "Visitor interacts with the Chatbot or runs the Recruiter Resume Tailor." },
      { nodeIds: [1, 2], activeLink: 0, status: "Requests are dispatched to secure Next.js API routes (/api/chat or /api/tailor)." },
      { nodeIds: [3], activeLink: 2, status: "Central profile data is parsed and passed along with prompts to Gemini." },
      { nodeIds: [4], activeLink: 4, status: "AI-tailored CV response is cached in browser sessionStorage." },
      { nodeIds: [5], activeLink: 5, status: "Resume page parses sessionStorage and compiles a custom print-ready PDF." }
    ],
    code: `// Secure API Route Proxy with dynamic profile injection & fallback engine
export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      
      // Dynamic context injection from profile module
      const systemInstruction = \`
        You are Anand's portfolio AI. Here is his experience details:
        \${JSON.stringify(profile.experience)}
        Answer questions based only on this metadata.
      \`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [...history, { role: "user", parts: [{ text: message }] }],
        config: { systemInstruction }
      });

      return Response.json({ response: response.text });
    } else {
      // Local keyword-matching fallback engine
      const lowercaseMsg = message.toLowerCase();
      let matchedResponse = "";
      const answers = getFallbackAnswers();

      for (const item of answers) {
        if (item.keywords.some(kw => lowercaseMsg.includes(kw))) {
          matchedResponse = item.response;
          break;
        }
      }
      return Response.json({ response: matchedResponse || "Fallback active." });
    }
  } catch (error) {
    return Response.json({ response: "Error." }, { status: 500 });
  }
}`,
    docs: {
      overview: "The Personal Portfolio is the stateless entry point of Anand's digital profile. It features an interactive resume chatbot with keyword fallbacks, and a resume customizer that caches tailoring parameters to export dynamic resume PDFs without a database.",
      systemFlow: [
        { step: "1. Chat / Tailor Input", detail: "Visitor asks the chatbot a question, or uses the Recruiter Tailor panel to customize Anand's CV." },
        { step: "2. Profile JSON Read", detail: "The serverless function reads static career details (`profile.json`) on-the-fly." },
        { step: "3. Context Injection", detail: "Injects career details dynamically into the Gemini prompt instruction set." },
        { step: "4. Fallback Keyword Match", detail: "If the API returns error or quota exhaustion, a local keyword-matching parser handles basic Q&A." },
        { step: "5. Session Cache & PDF Print", detail: "Caches customized CV points in sessionStorage; the print page `/resume` reads this memory to compile a print-ready PDF." }
      ],
      stateStorage: [
        { key: "Experience Profile", type: "Static JSON file", purpose: "Acts as the source of truth for all career details, projects, and skills." },
        { key: "Tailoring State", type: "Session Storage", purpose: "Saves customized CV adjustments to build print-ready documents without database writes." }
      ],
      resilience: "Integrates a client-side keyword-matching fallback engine that intercepts questions when the Gemini API is offline or quota-blocked, routing them to local regex matching to guarantee answer availability."
    }
  },
  aileron: {
    title: "Aileron",
    subtitle: "Continuous AI Learning Flywheel",
    description: "A self-improving prompt optimization and continuous feedback flywheel for SQL Generation. Uses a Python SDK backend to run natural language translations, executes query results against a sandbox SQLite database, logs traces in Supabase PostgreSQL, and mutates system prompt configurations dynamically.",
    badges: ["Next.js 16", "Python FastAPI", "Supabase Postgres", "SQLite DB", "OpenRouter API", "TDD & Playwright"],
    patterns: [
      {
        name: "Database Adapter Pattern",
        desc: "Abstracts the database adapter layer to support a local file-based SQLite database for offline development, and a cloud-based Supabase PostgreSQL cluster for live production hosting."
      },
      {
        name: "Storage Circuit Breaker",
        desc: "Defines safe row cap thresholds (200 traces, 50 corrections) in the database write layer, auto-purging historical records to maintain a zero-cost database tier."
      },
      {
        name: "DSPy Prompt Compiler Loop",
        desc: "Extracts user corrections and formats them into system few-shot prompt exemplars, runs validation test benchmarks to compute accuracy scores, and tracks prompt version configurations."
      }
    ],
    nodes: [
      { id: 0, label: "User UI", sublabel: "SQL Sandbox", x: 50, y: 110, w: 90, h: 50 },
      { id: 1, label: "FastAPI Route", sublabel: "/api/execute", x: 175, y: 110, w: 100, h: 50 },
      { id: 2, label: "Supabase DB", sublabel: "Adapter Layer", x: 300, y: 50, w: 95, h: 50 },
      { id: 3, label: "OpenRouter", sublabel: "Llama-3 Free", x: 300, y: 170, w: 95, h: 50 },
      { id: 4, label: "Feedback/TDD", sublabel: "Correction Log", x: 425, y: 110, w: 100, h: 50 },
      { id: 5, label: "DSPy Optimizer", sublabel: "Flywheel Compile", x: 550, y: 110, w: 110, h: 50 }
    ],
    links: [
      { from: 0, to: 1, path: "M 95 110 L 175 110" },
      { from: 1, to: 2, path: "M 225 110 L 300 50" },
      { from: 1, to: 3, path: "M 225 110 L 300 170" },
      { from: 2, to: 4, path: "M 395 50 L 475 110" },
      { from: 3, to: 4, path: "M 395 170 L 475 110" },
      { from: 4, to: 5, path: "M 475 110 L 550 110" }
    ],
    simulationSteps: [
      { nodeIds: [0], activeLink: -1, status: "User inputs a natural language query in the SQL Sandbox." },
      { nodeIds: [1], activeLink: 0, status: "Requests are dispatched to the FastAPI Python server at /execute." },
      { nodeIds: [3], activeLink: 2, status: "Gateway calls OpenRouter requesting SQL generation from Llama 3." },
      { nodeIds: [2], activeLink: 1, status: "Executes SQL in sandbox tables and writes trace metadata to Supabase (Circuit Breaker active)." },
      { nodeIds: [4], activeLink: 3, status: "User rates output, logging corrections back to Supabase feedback dataset." },
      { nodeIds: [5], activeLink: 5, status: "DSPy optimizer compiles corrections, runs benchmarks, and saves the new prompt version." }
    ],
    code: `# Database adapter with storage circuit breaker
def log_trace(self, input_query, generated_sql, is_success, error_message, latency_ms, token_count, cost_usd):
    conn = self.get_connection()
    cursor = conn.cursor()
    
    # Write trace data ...
    placeholder = "%s" if self.is_postgres else "?"
    cursor.execute(f"""
        INSERT INTO aileron_traces 
        (input_query, generated_sql, is_success, error_message, latency_ms, token_count, cost_usd) 
        VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder})
    """, (input_query, generated_sql, is_success, error_message, latency_ms, token_count, cost_usd))
    
    conn.commit()
    conn.close()
    
    # ENFORCE STORAGE SAFETY LIMITS (Circuit Breaker)
    return self.enforce_circuit_breaker()`,
    docs: {
      overview: "Aileron is a self-improving prompt optimization and continuous feedback flywheel for SQL Generation. It connects a Next.js SQL sandbox frontend to a Python FastAPI backend. The backend executes queries inside a secure SQLite sandbox, captures latency and token metrics, logs trace paths, and mutates system prompt instructions dynamically using the DSPy prompt compiler.",
      systemFlow: [
        { step: "1. Visual NL Query", detail: "User types a query (e.g. 'List all customers from Germany') in the visual SQL sandbox." },
        { step: "2. FastAPI Translation", detail: "Dispatches the payload to the FastAPI Python service (port 8005) which calls OpenRouter for SQL translation." },
        { step: "3. Read-Only Sandbox execution", detail: "Executes the compiled SQL in a local, read-only SQLite sandbox pre-populated with mock customers, orders, and items tables." },
        { step: "4. Correction Submission", detail: "If the output has mistakes (such as the Germany query missing the filter on Prompt v1), the user casts a thumbs down and submits the correct query." },
        { step: "5. DSPy Prompts optimization", detail: "The backend runs the compiler, injecting the correction into active system prompts as a few-shot exemplar, saving and promoting Prompt v2." }
      ],
      stateStorage: [
        { key: "Supabase DB", type: "PostgreSQL Database", purpose: "Hosts production traces, feedback scores, execution metrics, and active prompt versions." },
        { key: "SQLite Database", type: "Read-only file", purpose: "Local sandboxed database executing generated SQL queries safely." },
        { key: "Storage Circuit Breaker", type: "Database Middleware", purpose: "Locks and purges historical traces (> 200) and corrections (> 50) to preserve free-tier storage capacities (< 1MB)." }
      ],
      resilience: "Integrates a DB adapter layer to swap backends (SQLite local for offline test runs, Supabase Postgres for live). Evaluates query results against an automated test suite before saving updates to prevent compiling broken prompts."
    }
  }
};

const TECH_STACK_ROW_1 = [
  {
    title: "Next.js & Vercel",
    cost: "$0",
    desc: "Application framework & Serverless edge hosting. Handles static prerendering and runs secure API proxy routes with zero cold starts.",
    icon: (
      <svg viewBox="0 0 512 512" width="18" height="18" fill="currentColor">
        <path d="M256,48,496,464H16Z"/>
      </svg>
    )
  },
  {
    title: "Gemini AI",
    cost: "$20/mo",
    desc: "Advanced reasoning, estimation scoring, and profile Q&A using the Google AI Studio developer tier (gemini-2.5-flash) backed by AI Pro context quotas.",
    costStyle: { background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.2)' },
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#38bdf8' }}>
        <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" fill="currentColor"/>
      </svg>
    ),
    iconStyle: { background: 'rgba(56, 189, 248, 0.05)', borderColor: 'rgba(56, 189, 248, 0.2)' }
  },
  {
    title: "OpenRouter API",
    cost: "$0",
    desc: "Acts as our API failover route. Pools and iterates across open-weight free model endpoints (e.g. Llama 3.3 70B) in case of primary API outages.",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20M2 12h20M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
      </svg>
    )
  },
  {
    title: "GitHub & Actions",
    cost: "$0",
    desc: "Code versioning, submodule mapping, and automated GitHub Actions workflow runners acting as a serverless cron triggers.",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    )
  },
  {
    title: "Supabase Realtime",
    cost: "$0",
    desc: "Bypasses heavy database writes by utilizing active WebSocket broadcast/presence channels for instant scrum poker peer estimation sync.",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ color: '#3ecf8e' }}>
        <path d="M13.92 2L5 12.86h6.92L10.08 22 19 11.14h-6.92z"/>
      </svg>
    ),
    iconStyle: { background: 'rgba(62, 207, 142, 0.05)', borderColor: 'rgba(62, 207, 142, 0.2)' }
  },
  {
    title: "Resend API",
    cost: "$0",
    desc: "Serverless transactional email gateway. Dispatches daily morning AI news briefings compiled dynamically without background mail servers.",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    )
  },
  {
    title: "DuckDuckGo Grounding",
    cost: "$0",
    desc: "Zero-cost fallback search context grounding, crawling DuckDuckGo to feed fresh AI headlines to The Daily Read compiler daily.",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#de5833' }}>
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        <path d="M10 8c1.5 0 2.5 1 2.5 2H7.5c0-1 1-2 2.5-2z" fill="currentColor" />
      </svg>
    ),
    iconStyle: { background: 'rgba(222, 88, 51, 0.05)', borderColor: 'rgba(222, 88, 51, 0.2)' }
  },
  {
    title: "Spaceship DNS",
    cost: "$12/yr",
    costStyle: { background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderColor: 'rgba(99, 102, 241, 0.2)' },
    desc: "Domain Registrar & custom DNS subdomain mapping. Binds newsletter, cogpoker, codeforge, and pdf targets to anandmuraleedharan.com.",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#818cf8' }}>
        <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5" />
        <path d="M12 2C6.5 2 2 6.5 2 12c0 2.5 1 4.5 2.5 6l11.5-11.5c-1.5-1.5-3.5-2.5-6-2.5z" />
        <path d="M22 2s-3 1-5 3L5.5 16.5c2 2 3 5 3 5s1-1 2.5-2.5L22 2z" />
      </svg>
    ),
    iconStyle: { background: 'rgba(129, 140, 248, 0.05)', borderColor: 'rgba(129, 140, 248, 0.2)' }
  }
];

const TECH_STACK_ROW_2 = [
  {
    title: "Browser Web APIs",
    cost: "$0",
    desc: "Leverages CompressionStream for stateless URLs, PDF.js for sandbox document parsing, and SessionStorage for custom resume state.",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    )
  },
  {
    title: "Antigravity 2.0",
    cost: "$0",
    desc: "Autonomous AI coding partner designed by Google DeepMind, orchestrating, coding, and deploying this visualizer and app suite.",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
      </svg>
    ),
    iconStyle: { background: 'rgba(6, 182, 212, 0.05)', borderColor: 'rgba(6, 182, 212, 0.2)' }
  },
  {
    title: "Playwright",
    cost: "$0",
    desc: "E2E integration testing framework. Simulates real-time multi-user WebSocket voting and presence sessions to verify scrum room reliability.",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2e8b57' }}>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m10 8 6 4-6 4V8z" fill="currentColor" />
      </svg>
    ),
    iconStyle: { background: 'rgba(46, 139, 87, 0.05)', borderColor: 'rgba(46, 139, 87, 0.2)' }
  },
  {
    title: "Docker",
    cost: "$0",
    desc: "Local infrastructure orchestrator. Runs Supabase CLI container engines locally, supporting database-free real-time WebSocket connection targets.",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ color: '#2496ed' }}>
        <rect x="2" y="10" width="3" height="2.5" rx="0.5" />
        <rect x="5.5" y="10" width="3" height="2.5" rx="0.5" />
        <rect x="9" y="10" width="3" height="2.5" rx="0.5" />
        <rect x="12.5" y="10" width="3" height="2.5" rx="0.5" />
        <rect x="3.75" y="7" width="3" height="2.5" rx="0.5" />
        <rect x="7.25" y="7" width="3" height="2.5" rx="0.5" />
        <rect x="10.75" y="7" width="3" height="2.5" rx="0.5" />
        <rect x="7.25" y="4" width="3" height="2.5" rx="0.5" />
        <path d="M1 13.5c0-1 .8-1.8 1.8-1.8h13.7c1.3 0 2.2-1.3 3-2.5.4-.6 1.3-.6 1.7 0 .5.8 1.1 1.7 1.8 1.7.5 0 .8.4.8.9v1.5c0 3.3-2.7 6-6 6H4.5C2.6 19.3 1 17.7 1 15.8v-2.3z" />
      </svg>
    ),
    iconStyle: { background: 'rgba(36, 150, 237, 0.05)', borderColor: 'rgba(36, 150, 237, 0.2)' }
  },
  {
    title: "FastAPI & Python",
    cost: "$0",
    desc: "High-performance API gateway and SDK running Aileron's evaluation sandbox and DSPy prompts optimization on Python 3.14.",
    icon: <Terminal size={18} style={{ color: '#009688' }} />,
    iconStyle: { background: 'rgba(0, 150, 136, 0.05)', borderColor: 'rgba(0, 150, 136, 0.2)' }
  },
  {
    title: "DSPy Optimizer",
    cost: "$0",
    desc: "Programmatic few-shot prompt compiler, validating and scoring system instructions against benchmark test suites.",
    icon: <Sliders size={18} style={{ color: '#ec4899' }} />,
    iconStyle: { background: 'rgba(236, 72, 153, 0.05)', borderColor: 'rgba(236, 72, 153, 0.2)' }
  },
  {
    title: "Opik Tracing & Metrics",
    cost: "$0",
    desc: "Execution observability framework, capturing SQL generation latency, costs, and traces.",
    icon: <Activity size={18} style={{ color: '#a855f7' }} />,
    iconStyle: { background: 'rgba(168, 85, 247, 0.05)', borderColor: 'rgba(168, 85, 247, 0.2)' }
  },
  {
    title: "SQLite Sandbox",
    cost: "$0",
    desc: "Secure, read-only SQL compilation and sandbox database environment for local code execution and verification.",
    icon: <Database size={18} style={{ color: '#f97316' }} />,
    iconStyle: { background: 'rgba(249, 115, 22, 0.05)', borderColor: 'rgba(249, 115, 22, 0.2)' }
  },
  {
    title: "MkDocs & Material",
    cost: "$0",
    desc: "Dedicated project technical documentation portal. Custom styled slate theme, Outfit/Inter typography, and local search indexing.",
    icon: <FileText size={18} style={{ color: '#00bcd4' }} />,
    iconStyle: { background: 'rgba(0, 188, 212, 0.05)', borderColor: 'rgba(0, 188, 212, 0.2)' }
  }
];

export default function ArchitecturePage() {
  const [activeTab, setActiveTab] = useState("dailyread");
  const [simulationIndex, setSimulationIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeData = APPS_ARCH_DATA[activeTab];

  // Copy code utility
  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset simulation when switching tabs
  useEffect(() => {
    setSimulationIndex(-1);
    setIsPlaying(false);
  }, [activeTab]);

  // Simulation play interval logic
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setSimulationIndex(prev => {
          if (prev >= activeData.simulationSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeData]);

  const triggerSimulation = () => {
    setSimulationIndex(0);
    setIsPlaying(true);
  };

  const resetSimulation = () => {
    setSimulationIndex(-1);
    setIsPlaying(false);
  };

  // Helper to highlight syntax for code spotlights
  const renderHighlightedCode = (codeText) => {
    return codeText.split("\n").map((line, idx) => {
      // Very basic keyword & comment coloring for visual excellence
      let processed = line;
      
      // Comments
      if (line.trim().startsWith("//")) {
        return <div key={idx} className={styles.comment}>{line}</div>;
      }
      
      // Process simple tokens
      const words = line.split(/(\s+|=|\(|\)|\{|\}|\[|\]|;|,|\.|\`|\$|:)/);
      const elements = words.map((word, wIdx) => {
        if (['async', 'function', 'const', 'let', 'export', 'import', 'from', 'return', 'await', 'for', 'of', 'throw', 'new', 'try', 'catch', 'class', 'if', 'else', 'interface', 'private', 'constructor', 'try'].includes(word.trim())) {
          return <span key={wIdx} className={styles.keyword}>{word}</span>;
        }
        if (['Promise', 'string', 'number', 'boolean', 'Uint8Array', 'TextEncoder', 'ReadableStream', 'CompressionStream', 'Response', 'NextRequest', 'NextResponse', 'GoogleGenAI', 'MockRealtimeChannel'].includes(word.trim())) {
          return <span key={wIdx} className={styles.type}>{word}</span>;
        }
        if (word.startsWith('"') || word.startsWith("'") || word.startsWith("`") || (word.endsWith('"') && word.length > 1) || (word.endsWith("'") && word.length > 1)) {
          return <span key={wIdx} className={styles.string}>{word}</span>;
        }
        if (/^\d+$/.test(word.trim())) {
          return <span key={wIdx} className={styles.number}>{word}</span>;
        }
        return word;
      });

      return <div key={idx}>{elements}</div>;
    });
  };

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.mainContent}>
        <section className="section">
          <div className="container">
            
            {/* Header / Hero intro */}
            <div className={styles.headerSection}>
              <motion.h1 
                className={styles.title}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Architecture & Design Patterns
              </motion.h1>
              <motion.p 
                className={styles.subtitle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Interactive flowcharts, pipeline designs, and structural decisions behind each micro-app.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className={styles.docsLinkWrapper}
              >
                <a 
                  href="http://localhost:8000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.docsButton}
                >
                  <ExternalLink size={16} />
                  <span>View Dedicated Tech Docs Portal</span>
                </a>
              </motion.div>
            </div>

            {/* App selection tabs */}
            <div className={styles.tabsContainer}>
              <button 
                className={`${styles.tabButton} ${activeTab === 'dailyread' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('dailyread')}
              >
                <Mail size={16} />
                <span>The Daily Read</span>
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'cogpoker' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('cogpoker')}
              >
                <Cpu size={16} />
                <span>CogPoker</span>
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'codeforge' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('codeforge')}
              >
                <GitCompare size={16} />
                <span>CodeForge</span>
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'pdfforge' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('pdfforge')}
              >
                <FileText size={16} />
                <span>PDFForge</span>
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'portfolio' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('portfolio')}
              >
                <Layers size={16} />
                <span>Personal Portfolio</span>
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'aileron' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('aileron')}
              >
                <Zap size={16} />
                <span>Aileron</span>
              </button>
            </div>

            {/* Main Visualizer Workspace */}
            <div className={styles.visualizerGrid}>
              
              {/* Left Panel: Description & Design Patterns */}
              <div className="glass-card">
                <div className={styles.infoCard}>
                  <div>
                    <div className={styles.metaHeader}>
                      <div className={styles.appTitleGroup}>
                        <h2 className={styles.appTitle}>{activeData.title}</h2>
                        <span className={styles.statusIndicator}>Stateless</span>
                      </div>
                      <p className={styles.appSubtitle}>{activeData.subtitle}</p>
                    </div>

                    <p className={styles.description}>{activeData.description}</p>
                    
                    <div className={styles.badges}>
                      {activeData.badges.map((badge, bIdx) => (
                        <span key={bIdx} className={styles.badge}>{badge}</span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.patternsSection}>
                    <h3 className={styles.patternsTitle}>
                      <Layers size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                      Design Patterns In Action
                    </h3>
                    <div className={styles.patternsList}>
                      {activeData.patterns.map((pattern, pIdx) => (
                        <div key={pIdx} className={styles.patternItem}>
                          <div className={styles.patternName}>
                            <span className={styles.patternDot} />
                            {pattern.name}
                          </div>
                          <p className={styles.patternDesc}>{pattern.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel: Animated Canvas & Simulation Controls */}
              <div className="glass-card">
                <div className={styles.infoCard}>
                  <div className={styles.diagramTitle}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Network size={16} />
                      System Pipeline Simulation
                    </span>
                    <div className={styles.controlsGroup}>
                      <button 
                        className={styles.simulateBtn} 
                        onClick={triggerSimulation}
                        disabled={isPlaying}
                      >
                        <Play size={12} fill="white" />
                        <span>{simulationIndex === -1 ? "Simulate" : isPlaying ? "Running..." : "Replay"}</span>
                      </button>
                      
                      {simulationIndex !== -1 && (
                        <button 
                          className={styles.copyBtn} 
                          style={{ padding: '0.4rem' }} 
                          onClick={resetSimulation}
                          title="Reset Diagram"
                        >
                          <RotateCcw size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={styles.diagramCanvas}>
                    <svg viewBox="0 0 650 250" className={styles.svgContainer}>
                      {/* Define defs for arrows and gradients */}
                      <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 2 L 8 5 L 0 8 z" fill="rgba(255, 255, 255, 0.2)" />
                        </marker>
                        <marker id="arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 2 L 8 5 L 0 8 z" fill="var(--primary)" />
                        </marker>
                      </defs>

                      {/* Connectors (Links) */}
                      {activeData.links.map((link, idx) => {
                        const activeStepIndex = activeData.simulationSteps[simulationIndex];
                        const isLinkActive = simulationIndex !== -1 && activeStepIndex && activeData.simulationSteps.slice(0, simulationIndex + 1).some(step => {
                          return step.activeLink === idx;
                        });

                        return (
                          <path 
                            key={idx}
                            d={link.path}
                            className={`${styles.diagramLink} ${isLinkActive ? styles.diagramLinkActive : ""}`}
                            markerEnd={isLinkActive ? "url(#arrow-active)" : "url(#arrow)"}
                          />
                        );
                      })}

                      {/* Nodes */}
                      {activeData.nodes.map((node) => {
                        const activeStepIndex = activeData.simulationSteps[simulationIndex];
                        const isActive = simulationIndex !== -1 && activeStepIndex && activeStepIndex.nodeIds.includes(node.id);
                        const isPassed = simulationIndex !== -1 && activeData.simulationSteps.slice(0, simulationIndex).some(step => step.nodeIds.includes(node.id));

                        let nodeClass = styles.diagramNode;
                        if (isActive) {
                          nodeClass += ` ${styles.diagramNodeActive}`;
                        } else if (isPassed) {
                          nodeClass += ` ${styles.diagramNodeSuccess}`;
                        }

                        // Check if it's a fallback sub-node (e.g. DDG, mock polling, Gemini fallback)
                        if (activeTab === 'dailyread' && (node.id === 2 || node.id === 3) && isActive) {
                          nodeClass += ` ${styles.diagramNodeFallback}`;
                        }
                        if (activeTab === 'cogpoker' && (node.id === 2 || node.id === 3) && isActive) {
                          nodeClass += ` ${styles.diagramNodeFallback}`;
                        }
                        if (activeTab === 'portfolio' && (node.id === 1 || node.id === 2) && isActive) {
                          nodeClass += ` ${styles.diagramNodeFallback}`;
                        }
                        if (activeTab === 'aileron' && (node.id === 2 || node.id === 3) && isActive) {
                          nodeClass += ` ${styles.diagramNodeFallback}`;
                        }

                        return (
                          <g key={node.id}>
                            <rect 
                              x={node.x}
                              y={node.y - node.h/2}
                              width={node.w}
                              height={node.h}
                              rx={8}
                              className={nodeClass}
                            />
                            <text x={node.x + node.w/2} y={node.y - 2} className={styles.diagramLabel}>
                              {node.label}
                            </text>
                            <text x={node.x + node.w/2} y={node.y + 12} className={styles.diagramSublabel}>
                              {node.sublabel}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Status Bar */}
                  <div style={{
                    minHeight: '3rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    fontSize: '0.85rem',
                    color: simulationIndex === -1 ? 'var(--foreground-dim)' : 'var(--foreground)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'color 0.3s ease'
                  }}>
                    <Zap size={14} className={simulationIndex !== -1 ? styles.activeText : ''} style={{ color: simulationIndex === -1 ? 'var(--foreground-dim)' : 'var(--primary)', flexShrink: 0 }} />
                    <span>
                      {simulationIndex === -1 
                        ? "Click 'Simulate' to watch the stateless message pipeline execution flow."
                        : activeData.simulationSteps[simulationIndex]?.status
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Spotlight Section */}
            <div className={styles.codeSpotlightSection}>
              <div className={styles.codeCard}>
                <div className={styles.codeHeader}>
                  <div className={styles.codeMeta}>
                    <Code size={16} style={{ color: 'var(--primary)' }} />
                    <span className={styles.codeTitle}>Pattern Implementation: {activeData.title}</span>
                  </div>
                  <button className={styles.copyBtn} onClick={handleCopyCode}>
                    {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                    <span>{copied ? "Copied!" : "Copy Code"}</span>
                  </button>
                </div>
                <pre className={styles.codeContent}>
                  <code>
                    {renderHighlightedCode(activeData.code)}
                  </code>
                </pre>
              </div>
            </div>

            {/* Deep Dive & Technical Details Section */}
            {activeData.docs && (
              <div className={styles.deepDiveSection}>
                <div className={styles.deepDiveHeader}>
                  <h2 className={styles.deepDiveTitle}>Technical Deep Dive: {activeData.title}</h2>
                  <p className={styles.deepDiveOverview}>{activeData.docs.overview}</p>
                </div>
                
                <div className={styles.deepDiveGrid}>
                  {/* Left Column: System Flow */}
                  <div className="glass-card">
                    <div className={styles.infoCard} style={{ padding: '1.75rem' }}>
                      <h3 className={styles.deepDiveSubTitle}>
                        <Activity size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        System Flow & Execution Sequence
                      </h3>
                      <div className={styles.flowList}>
                        {activeData.docs.systemFlow.map((flow, idx) => (
                          <div key={idx} className={styles.flowItem}>
                            <div className={styles.flowStepNum}>
                              <span>{idx + 1}</span>
                            </div>
                            <div className={styles.flowStepContent}>
                              <div className={styles.flowStepName}>{flow.step}</div>
                              <p className={styles.flowStepDetail}>{flow.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: State & Storage */}
                  <div className="glass-card">
                    <div className={styles.infoCard} style={{ padding: '1.75rem' }}>
                      <h3 className={styles.deepDiveSubTitle}>
                        <Database size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        State & Storage Configuration
                      </h3>
                      <div className={styles.storageTableContainer}>
                        <table className={styles.storageTable}>
                          <thead>
                            <tr>
                              <th>Component</th>
                              <th>Type</th>
                              <th>Purpose</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeData.docs.stateStorage.map((store, idx) => (
                              <tr key={idx}>
                                <td className={styles.storageKey}>{store.key}</td>
                                <td><span className={styles.storageTypeBadge}>{store.type}</span></td>
                                <td className={styles.storagePurpose}>{store.purpose}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Width: Resilience Strategy */}
                <div className={`${styles.resilienceCard} glass-card`}>
                  <h3 className={styles.resilienceTitle}>
                    <Zap size={18} style={{ color: '#eab308', flexShrink: 0 }} />
                    Resilience & Fallback Mechanisms
                  </h3>
                  <p className={styles.resilienceDesc}>{activeData.docs.resilience}</p>
                </div>
              </div>
            )}

            {/* Zero-Cost Stack Section */}
            <div className={styles.stackSection}>
              <div className={styles.stackHeader}>
                <h2 className={styles.stackTitle}>Tech Stack & Cost Breakdown</h2>
                <p className={styles.stackSubtitle}>
                  How this entire ecosystem is structured across serverless free tiers, browser-side utilities, and professional paid upgrades.
                </p>
              </div>

              <div className={styles.marqueeContainer}>
                {/* Row 1: scrolls left */}
                <div className={styles.marqueeRow}>
                  <div className={`${styles.marqueeTrack} ${styles.scrollLeft}`}>
                    {TECH_STACK_ROW_1.map((item, idx) => (
                      <div key={`r1-${idx}`} className={styles.stackCard}>
                        <div className={styles.stackCardHeader}>
                          <div className={styles.stackCardIcon} style={item.iconStyle}>
                            {item.icon}
                          </div>
                          <span className={styles.stackCardTitle}>{item.title}</span>
                          <span className={styles.stackCardCost} style={item.costStyle}>{item.cost}</span>
                        </div>
                        <p className={styles.stackCardDesc}>{item.desc}</p>
                      </div>
                    ))}
                    {/* Duplicate list to achieve seamless infinite scroll */}
                    {TECH_STACK_ROW_1.map((item, idx) => (
                      <div key={`r1-dup-${idx}`} className={styles.stackCard}>
                        <div className={styles.stackCardHeader}>
                          <div className={styles.stackCardIcon} style={item.iconStyle}>
                            {item.icon}
                          </div>
                          <span className={styles.stackCardTitle}>{item.title}</span>
                          <span className={styles.stackCardCost} style={item.costStyle}>{item.cost}</span>
                        </div>
                        <p className={styles.stackCardDesc}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row 2: scrolls right */}
                <div className={styles.marqueeRow}>
                  <div className={`${styles.marqueeTrack} ${styles.scrollRight}`}>
                    {TECH_STACK_ROW_2.map((item, idx) => (
                      <div key={`r2-${idx}`} className={styles.stackCard}>
                        <div className={styles.stackCardHeader}>
                          <div className={styles.stackCardIcon} style={item.iconStyle}>
                            {item.icon}
                          </div>
                          <span className={styles.stackCardTitle}>{item.title}</span>
                          <span className={styles.stackCardCost} style={item.costStyle}>{item.cost}</span>
                        </div>
                        <p className={styles.stackCardDesc}>{item.desc}</p>
                      </div>
                    ))}
                    {/* Duplicate list to achieve seamless infinite scroll */}
                    {TECH_STACK_ROW_2.map((item, idx) => (
                      <div key={`r2-dup-${idx}`} className={styles.stackCard}>
                        <div className={styles.stackCardHeader}>
                          <div className={styles.stackCardIcon} style={item.iconStyle}>
                            {item.icon}
                          </div>
                          <span className={styles.stackCardTitle}>{item.title}</span>
                          <span className={styles.stackCardCost} style={item.costStyle}>{item.cost}</span>
                        </div>
                        <p className={styles.stackCardDesc}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}

