"use client";
import React from "react";
import styles from "./Hero.module.css";
import { MessageSquare, ArrowDown, Database, Cpu, HardDrive } from "lucide-react";

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.leftCol}>
          <div className={styles.badge}>
            <span className={styles.badgeDot}></span>
            Principal Data Engineer & Architect
          </div>
          <h1 className={styles.title}>
            Engineering robust <br />
            <span className={styles.gradientText}>Data Ecosystems</span>
          </h1>
          <p className={styles.subtitle}>
            Hi, I'm <strong>Anand Muraleedharan</strong>. I specialize in building, migrating, and optimizing high-performance data warehouses and pipelines. From replatforming SAP HANA to Snowflake, to orchestrating complex dbt & Airflow pipelines at scale, I write code that turns data complexity into operational simplicity.
          </p>
          <div className={styles.ctaGroup}>
            <button onClick={() => window.dispatchEvent(new CustomEvent("portfolio-chat:open"))} className="btn btn-primary">
              <MessageSquare size={18} />
              <span>Interview Anand (AI)</span>
            </button>
            <a href="/resume?print=true" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
              <span>Download A4 Resume</span>
            </a>
            <a href="#experience" className="btn btn-secondary">
              <span>View Experience</span>
              <ArrowDown size={18} />
            </a>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.terminal}>
            <div className={styles.terminalHeader}>
              <div className={styles.terminalDots}>
                <span className={styles.dotRed}></span>
                <span className={styles.dotYellow}></span>
                <span className={styles.dotGreen}></span>
              </div>
              <span className={styles.terminalTitle}>pipeline_run.sh</span>
            </div>
            <div className={styles.terminalBody}>
              <div className={styles.line}><span className={styles.tYellow}>$</span> <span className={styles.tWhite}>python3 run_pipeline.py --env prod</span></div>
              <div className={styles.line}><span className={styles.tGreen}>[INFO]</span> Starting data ingestion pipeline...</div>
              <div className={styles.line}><span className={styles.tGreen}>[INFO]</span> Authenticating with Snowflake Data Warehouse...</div>
              <div className={styles.line}><span className={styles.tCyan}>[DBT]</span> Running models for client: Autodesk</div>
              <div className={styles.line}><span className={styles.tCyan}>[DBT]</span> <span className={styles.tGreen}>✔</span> stg_finance_transactions (2.3s)</div>
              <div className={styles.line}><span className={styles.tCyan}>[DBT]</span> <span className={styles.tGreen}>✔</span> fct_revenue_monthly (4.8s)</div>
              <div className={styles.line}><span className={styles.tGreen}>[INFO]</span> {"Replatforming SAP HANA -> Snowflake: SUCCESS"}</div>
              <div className={styles.line}><span className={styles.tGreen}>[INFO]</span> Testing framework status: <span className={styles.tGreen}>0 errors</span></div>
              <div className={styles.line}><span className={styles.tPurple}>[AIRFLOW]</span> DagRun completed. Duration: <span className={styles.tYellow}>12.5s (200% faster)</span></div>
              <div className={styles.line}><span className={styles.tYellow}>$</span> <span className={styles.tWhite}>_</span></div>
            </div>
          </div>

          {/* Floating Data Icons */}
          <div className={`${styles.floatingIcon} ${styles.icon1}`}>
            <Database size={24} />
          </div>
          <div className={`${styles.floatingIcon} ${styles.icon2}`}>
            <Cpu size={24} />
          </div>
          <div className={`${styles.floatingIcon} ${styles.icon3}`}>
            <HardDrive size={24} />
          </div>
        </div>
      </div>
    </section>
  );
}
