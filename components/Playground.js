"use client";
import React from "react";
import styles from "./Playground.module.css";
import { Sparkles, ArrowUpRight, Cpu, Mail, GitCompare, FileText, Activity, BookOpen } from "lucide-react";

export default function Playground() {
  const [appsData, setAppsData] = React.useState([
    {
      title: "The Daily Read",
      subtitle: "AI News Digest Engine",
      description: "A secure, zero-infrastructure serverless agent that leverages Google Gemini's native Search Grounding to compile and email daily morning AI news briefings.",
      badges: ["Next.js 15", "Gemini 3.5", "Resend", "GitHub Actions"],
      url: "https://newsletter.anandmuraleedharan.com",
      icon: <Mail size={22} className={styles.iconBlue} />,
      status: "Active"
    },
    {
      title: "CogPoker",
      subtitle: "AI-Era Story Pointing",
      description: "A real-time, stateless estimation poker platform that shifts focus to cognitive/architectural uncertainty using factor sliders and active peer AI estimators.",
      badges: ["Next.js 16", "Supabase Realtime", "Gemini 2.5", "Tailwind CSS"],
      url: "https://poker.anandmuraleedharan.com",
      icon: <Cpu size={22} className={styles.iconViolet || styles.iconBlue} />,
      status: "Active"
    },
    {
      title: "CodeForge",
      subtitle: "Developer Utility Suite",
      description: "A premium, stateless developer utility workspace featuring side-by-side code diffing, multi-format syntax validators (JSON/XML/YAML/HTML/CSS), and interactive cron builders.",
      badges: ["Next.js 16", "Tailwind CSS v4", "TypeScript", "CompressionStream"],
      url: "https://codeforge.anandmuraleedharan.com",
      icon: <GitCompare size={22} className={styles.iconGreen} />,
      status: "Active"
    },
    {
      title: "PDFForge",
      subtitle: "Client-Side PDF Workspace",
      description: "A serverless, high-performance utility workspace to merge, split, reorder, encrypt, and convert PDFs, featuring client-side page rendering and a local OpenRouter AI doc assistant.",
      badges: ["Next.js 16", "Tailwind CSS v4", "PDF-Lib", "PDF.js", "OpenRouter API"],
      url: "https://pdf.anandmuraleedharan.com",
      icon: <FileText size={22} className={styles.iconRed} />,
      status: "Active"
    },
    {
      title: "Aileron",
      subtitle: "Continuous AI Learning Flywheel",
      description: "A self-improving SQL generator workspace using a Python SDK, Supabase PostgreSQL, and local SQLite. Features a flight telemetry dashboard visualising the live prompt optimization loop.",
      badges: ["Next.js 16", "Python FastAPI", "Supabase Postgres", "SQLite DB", "OpenRouter API"],
      url: "https://aileron.anandmuraleedharan.com",
      icon: <Sparkles size={22} className={styles.iconCyan || styles.iconBlue} />,
      status: "Active"
    },
    {
      title: "Lipi",
      subtitle: "Malayalam Learning Game",
      description: "A highly visual, gamified client-side workspace featuring guided character tracing, match grid/time-attack games, and spaced repetition flashcards.",
      badges: ["Vite", "Vanilla JS", "Web Audio API", "Speech Synthesis", "LocalStorage"],
      url: "https://lipi.anandmuraleedharan.com",
      icon: <BookOpen size={22} className={styles.iconGreen} />,
      status: "Active"
    },
    {
      title: "Visitor Analytics",
      subtitle: "Secure Telemetry Dashboard",
      description: "A private traffic observer. Uses a client-side tracking hook to push pageview events, resolves Vercel edge geolocations, executes a 100-row FIFO database clean-up, and gates access using Google Authenticator (TOTP) codes.",
      badges: ["Next.js 16", "TOTP/Authenticator", "Supabase Postgres", "Vercel Edge", "FIFO Pruning"],
      url: "/analytics",
      icon: <Activity size={22} className={styles.iconCyan || styles.iconBlue} />,
      status: "Active"
    }
  ]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      if (isLocal) {
        setAppsData(prev => prev.map(app => {
          if (app.title === "The Daily Read") {
            return { ...app, url: "http://localhost:3001" };
          }
          if (app.title === "CogPoker") {
            return { ...app, url: "http://localhost:3002" };
          }
          if (app.title === "CodeForge") {
            return { ...app, url: "http://localhost:3003" };
          }
          if (app.title === "PDFForge") {
            return { ...app, url: "http://localhost:3004" };
          }
          if (app.title === "Aileron") {
            return { ...app, url: "http://localhost:3005" };
          }
          if (app.title === "Lipi") {
            return { ...app, url: "http://localhost:3006" };
          }
          return app;
        }));
      }
    }
  }, []);

  return (
    <section id="playground" className="section">
      <div className="container">
        <h2 className="section-title">Developer Playground & AI Apps</h2>
        <p className="section-subtitle" style={{ textAlign: "center", color: "var(--foreground-muted)", marginTop: "-1.5rem", marginBottom: "2rem" }}>
          Explore interactive serverless micro-apps built as extensions of this portfolio
        </p>
        
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
          <a href="/architecture" className="btn btn-primary" style={{ textDecoration: "none" }}>
            <Sparkles size={16} />
            <span>Interactive Architecture Visualizer</span>
          </a>
        </div>

        <div className={styles.grid}>
          {appsData.map((app, i) => (
            <div key={i} className="glass-card flex flex-col justify-between">
              <div>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    {app.icon}
                  </div>
                  <span className={styles.statusBadge}>{app.status}</span>
                </div>

                <h3 className={styles.appTitle}>{app.title}</h3>
                <h4 className={styles.appSubtitle}>{app.subtitle}</h4>
                <p className={styles.description}>{app.description}</p>
              </div>

              <div>
                <div className={styles.badgesContainer}>
                  {app.badges.map((badge, j) => (
                    <span key={j} className={styles.badge}>{badge}</span>
                  ))}
                </div>

                <a 
                  href={app.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.launchBtn}
                >
                  Launch App
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
