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
  Code
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
}`
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
}`
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
}`
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
}`
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
}`
  }
};

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

            {/* Zero-Cost Stack Section */}
            <div className={styles.stackSection}>
              <div className={styles.stackHeader}>
                <h2 className={styles.stackTitle}>Zero-Cost Tech Stack ($0/month)</h2>
                <p className={styles.stackSubtitle}>
                  How this entire portfolio ecosystem is engineered to run on serverless free tiers and native web APIs.
                </p>
              </div>

              <div className={styles.stackGrid}>
                <div className={styles.stackCard}>
                  <div className={styles.stackCardHeader}>
                    <div className={styles.stackCardIcon}>
                      <Layers size={18} />
                    </div>
                    <span className={styles.stackCardTitle}>Next.js & Vercel</span>
                    <span className={styles.stackCardCost}>$0</span>
                  </div>
                  <p className={styles.stackCardDesc}>
                    Application framework & Serverless edge hosting. Handles static prerendering and runs secure API proxy routes with zero cold starts.
                  </p>
                </div>

                <div className={styles.stackCard}>
                  <div className={styles.stackCardHeader}>
                    <div className={styles.stackCardIcon}>
                      <Cpu size={18} />
                    </div>
                    <span className={styles.stackCardTitle}>Gemini API</span>
                    <span className={styles.stackCardCost}>$0</span>
                  </div>
                  <p className={styles.stackCardDesc}>
                    Advanced reasoning, estimation scoring, and profile Q&A using the Google AI Studio developer tier (gemini-2.5-flash).
                  </p>
                </div>

                <div className={styles.stackCard}>
                  <div className={styles.stackCardHeader}>
                    <div className={styles.stackCardIcon}>
                      <Network size={18} />
                    </div>
                    <span className={styles.stackCardTitle}>OpenRouter API</span>
                    <span className={styles.stackCardCost}>$0</span>
                  </div>
                  <p className={styles.stackCardDesc}>
                    Acts as our API failover route. Pools and iterates across open-weight free model endpoints (e.g. Llama 3.3 70B) in case of primary API outages.
                  </p>
                </div>

                <div className={styles.stackCard}>
                  <div className={styles.stackCardHeader}>
                    <div className={styles.stackCardIcon}>
                      <Terminal size={18} />
                    </div>
                    <span className={styles.stackCardTitle}>GitHub & Actions</span>
                    <span className={styles.stackCardCost}>$0</span>
                  </div>
                  <p className={styles.stackCardDesc}>
                    Code versioning, submodule mapping, and automated GitHub Actions workflow runners acting as a serverless cron triggers.
                  </p>
                </div>

                <div className={styles.stackCard}>
                  <div className={styles.stackCardHeader}>
                    <div className={styles.stackCardIcon}>
                      <Zap size={18} />
                    </div>
                    <span className={styles.stackCardTitle}>Supabase Realtime</span>
                    <span className={styles.stackCardCost}>$0</span>
                  </div>
                  <p className={styles.stackCardDesc}>
                    Bypasses heavy database writes by utilizing active WebSocket broadcast/presence channels for instant scrum poker peer estimation sync.
                  </p>
                </div>

                <div className={styles.stackCard}>
                  <div className={styles.stackCardHeader}>
                    <div className={styles.stackCardIcon}>
                      <Mail size={18} />
                    </div>
                    <span className={styles.stackCardTitle}>Resend API</span>
                    <span className={styles.stackCardCost}>$0</span>
                  </div>
                  <p className={styles.stackCardDesc}>
                    Serverless transactional email gateway. Dispatches daily morning AI news briefings compiled dynamically without background mail servers.
                  </p>
                </div>

                <div className={styles.stackCard}>
                  <div className={styles.stackCardHeader}>
                    <div className={styles.stackCardIcon}>
                      <Code size={18} />
                    </div>
                    <span className={styles.stackCardTitle}>Browser Web APIs</span>
                    <span className={styles.stackCardCost}>$0</span>
                  </div>
                  <p className={styles.stackCardDesc}>
                    Leverages CompressionStream for stateless URLs, PDF.js for sandbox document parsing, and SessionStorage for custom resume state.
                  </p>
                </div>

                <div className={styles.stackCard}>
                  <div className={styles.stackCardHeader}>
                    <div className={styles.stackCardIcon}>
                      <Cpu size={18} />
                    </div>
                    <span className={styles.stackCardTitle}>Antigravity</span>
                    <span className={styles.stackCardCost}>$0</span>
                  </div>
                  <p className={styles.stackCardDesc}>
                    Autonomous AI coding partner designed by Google DeepMind, orchestrating, coding, and deploying this visualizer and app suite.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}

