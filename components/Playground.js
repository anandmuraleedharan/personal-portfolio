"use client";
import React from "react";
import styles from "./Playground.module.css";
import { Sparkles, ArrowUpRight, Cpu, Mail } from "lucide-react";

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
          return app;
        }));
      }
    }
  }, []);

  return (
    <section id="playground" className="section">
      <div className="container">
        <h2 className="section-title">Developer Playground & AI Apps</h2>
        <p className="section-subtitle" style={{ textAlign: "center", color: "var(--foreground-muted)", marginTop: "-1.5rem", marginBottom: "3rem" }}>
          Explore interactive serverless micro-apps built as extensions of this portfolio
        </p>

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
