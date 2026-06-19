"use client";
import React, { useState, useEffect } from "react";
import styles from "./RecruiterAgent.module.css";
import { Sparkles, FileText, Cpu, CheckCircle, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";

export default function RecruiterAgent() {
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const [fitData, setFitData] = useState(null);

  const loadingMessages = [
    "Ingesting job description...",
    "Extracting key role requirements...",
    "Cross-referencing Snowflake & dbt architectures...",
    "Analyzing alignment score...",
    "Re-ordering skill prioritizations...",
    "Emphasizing matching project bullets...",
    "Formatting tailored A4 resume layout...",
    "Ready!"
  ];

  // Animate loading step messages
  useEffect(() => {
    if (!isLoading) return;
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleTailor = async () => {
    if (!jobDescription.trim() || isLoading) return;
    setIsLoading(true);
    setError("");
    setFitData(null);

    try {
      const response = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to customize resume.");
        setIsLoading(false);
        return;
      }

      // Save tailored profile to session storage
      sessionStorage.setItem("tailoredProfile", JSON.stringify(data.tailoredProfile));
      setFitData(data.fitAnalysis);
    } catch (err) {
      console.warn("Error tailoring resume:", err);
      setError(err.message || "An error occurred while customizing your resume.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setJobDescription("");
    setFitData(null);
    setError("");
    sessionStorage.removeItem("tailoredProfile");
  };

  const openTailoredResume = () => {
    window.open("/resume?tailored=true&print=true", "_blank");
  };

  return (
    <section id="recruiter-agent" className="section">
      <div className="container">
        <h2 className="section-title">AI Recruiter Agent</h2>
        <p className="section-subtitle" style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2.5rem', marginTop: '-1rem' }}>
          Paste a job description to instantly analyze Anand's fit and generate a tailored resume.
        </p>

        <div className="glass-card" style={{ padding: "2.5rem", maxWidth: "900px", margin: "0 auto" }}>
          {!fitData && !isLoading && (
            <div className={styles.inputForm}>
              <div className={styles.inputHeader}>
                <Sparkles size={20} className={styles.sparkleIcon} />
                <h3>Tailor Anand's Resume to Your Vacancy</h3>
              </div>
              
              <textarea
                className={styles.textarea}
                placeholder="Paste the job description or role requirements here (e.g. 'We are looking for a Principal Data Engineer with experience in Snowflake migrations, dbt pipelines, and leading Airflow orchestration...')"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isLoading}
              />

              {error && (
                <div className={styles.errorContainer}>
                  <AlertTriangle size={16} style={{ marginRight: "0.5rem" }} />
                  <span>{error}</span>
                </div>
              )}

              <button
                className="btn btn-primary"
                onClick={handleTailor}
                disabled={!jobDescription.trim() || isLoading}
                style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}
              >
                <Cpu size={18} />
                <span>Analyze Fit & Customize Resume</span>
              </button>
            </div>
          )}

          {isLoading && (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}>
                <Cpu size={32} className={styles.loadingIcon} />
              </div>
              <h3 className={styles.loadingTitle}>Customizing Resume</h3>
              <div className={styles.terminal}>
                <div className={styles.terminalHeader}>
                  <span className={styles.terminalTitle}>agent_run.log</span>
                </div>
                <div className={styles.terminalBody}>
                  {loadingMessages.slice(0, loadingStep + 1).map((msg, idx) => (
                    <div key={idx} className={styles.terminalLine}>
                      <span className={styles.tGreen}>[INFO]</span> {msg}
                    </div>
                  ))}
                  {loadingStep < loadingMessages.length - 1 && (
                    <div className={`${styles.terminalLine} ${styles.tPulse}`}>
                      <span className={styles.tYellow}>$</span> <span className={styles.cursor}>_</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {fitData && !isLoading && (
            <div className={styles.resultContainer}>
              <div className={styles.resultHeader}>
                <div className={styles.gaugeContainer}>
                  <div className={styles.gaugeOuter}>
                    <div className={styles.gaugeInner}>
                      <span className={styles.gaugeScore}>{fitData.score}%</span>
                      <span className={styles.gaugeLabel}>Match</span>
                    </div>
                  </div>
                </div>
                <div className={styles.headerText}>
                  <h3 className={styles.resultTitle}>Role Alignment Report</h3>
                  <p className={styles.resultSubtitle}>
                    Anand's profile has been customized to emphasize skills matching your specific role requirements.
                  </p>
                </div>
              </div>

              <div className={styles.analysisGrid}>
                {/* Strengths */}
                <div className={styles.analysisCard}>
                  <h4>
                    <CheckCircle size={18} className={styles.cardIconGreen} />
                    Core Alignments
                  </h4>
                  <ul>
                    {fitData.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                {/* Growth Areas */}
                <div className={styles.analysisCard}>
                  <h4>
                    <Sparkles size={18} className={styles.cardIconPurple} />
                    Growth / Growth Paths
                  </h4>
                  <ul>
                    {fitData.growth.map((gro, i) => (
                      <li key={i}>{gro}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Highlighted Projects */}
              <div className={styles.projectsCard}>
                <h4>
                  <FileText size={18} className={styles.cardIconBlue} />
                  Highlighted Case Studies in Tailored Resume
                </h4>
                <div className={styles.projectsList}>
                  {fitData.highlights.map((proj, i) => (
                    <span key={i} className={styles.projectTag}>{proj}</span>
                  ))}
                </div>
              </div>

              <div className={styles.ctaGroup}>
                <button className="btn btn-primary" onClick={openTailoredResume} style={{ flex: 1, justifyContent: "center" }}>
                  <FileText size={18} />
                  <span>Download Tailored A4 Resume</span>
                  <ArrowRight size={16} />
                </button>
                <button className="btn btn-secondary" onClick={handleReset} style={{ borderColor: "#444" }}>
                  <RefreshCw size={16} />
                  <span>Start Over</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
