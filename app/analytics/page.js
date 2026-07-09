"use client";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import styles from "./analytics.module.css";
import { 
  Lock, 
  Eye, 
  Users, 
  Activity, 
  MapPin, 
  Compass, 
  Laptop, 
  RefreshCw,
  AlertTriangle
} from "lucide-react";

export default function AnalyticsDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [setupRequired, setSetupRequired] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [data, setData] = useState(null);

  // Check active session on boot
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const payload = await res.json();
        setAuthenticated(payload.authenticated);
        setSetupRequired(payload.setupRequired || false);
        setData(payload);
      } else {
        setAuthenticated(false);
      }
    } catch (err) {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!passcode) return;
    
    setError("");
    setSubmitLoading(true);
    
    try {
      const res = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", code: passcode })
      });
      
      if (res.ok) {
        setPasscode("");
        await fetchStats();
      } else {
        const payload = await res.json();
        setError(payload.error || "Invalid passcode.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <Header />
        <div className={styles.loaderContainer}>
          <RefreshCw className={styles.spinner} size={36} />
          <p>Retrieving secure session...</p>
        </div>
      </div>
    );
  }

  // 1. Passcode Gate Screen
  if (!authenticated) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <main className={styles.mainContent}>
          <div className={styles.gateWrapper}>
            <div className="glass-card">
              <div className={styles.gateCard}>
                <div className={styles.lockIconContainer}>
                  <Lock size={32} />
                </div>
                <h1 className={styles.gateTitle}>Secured Visitor Analytics</h1>
                <p className={styles.gateDesc}>
                  Enter the active 6-digit verification code from your Google or Microsoft Authenticator app on your phone.
                </p>

                <form onSubmit={handleVerify} className={styles.gateForm}>
                  <input
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000 000"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ""))}
                    className={styles.passcodeInput}
                    autoComplete="one-time-code"
                  />
                  {error && <p className={styles.errorMessage}>{error}</p>}
                  
                  <button type="submit" disabled={submitLoading || passcode.length !== 6} className={styles.submitButton}>
                    {submitLoading ? "Authorizing..." : "Access Dashboard"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 2. Database Setup Warning Screen
  if (setupRequired) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <main className={styles.mainContent}>
          <div className={styles.gateWrapper}>
            <div className="glass-card">
              <div className={styles.setupCard}>
                <AlertTriangle size={48} className={styles.warningIcon} />
                <h1 className={styles.setupTitle}>Database Table Required</h1>
                <p className={styles.setupDesc}>
                  The connection to Supabase was successful, but the table <code>visitor_logs</code> does not exist in your database.
                </p>
                <div className={styles.sqlCodeBox}>
                  <p className={styles.sqlLabel}>Run this SQL in your Supabase SQL Editor:</p>
                  <pre className={styles.sqlCode}>
{`CREATE TABLE IF NOT EXISTS visitor_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    page_path TEXT NOT NULL,
    referrer TEXT,
    country TEXT,
    browser TEXT,
    os TEXT,
    session_id TEXT NOT NULL
);`}
                  </pre>
                </div>
                <button onClick={fetchStats} className={styles.refreshButton}>
                  <RefreshCw size={16} />
                  <span>Check Table Connection</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 3. Stats Dashboard Screen
  const { stats, breakdowns, logs } = data || {};

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <div className="container">
          
          {/* Header Section */}
          <div className={styles.dashboardHeader}>
            <div>
              <h1 className={styles.title}>Visitor Analytics</h1>
              <p className={styles.subtitle}>
                Custom tracking statistics and telemetry compiled directly from Vercel Edge proxies and your dedicated Supabase database.
              </p>
            </div>
            <button onClick={fetchStats} className={styles.refreshButton}>
              <RefreshCw size={16} />
              <span>Refresh Stats</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className="glass-card">
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(0, 242, 254, 0.05)", color: "#00f2fe" }}>
                  <Eye size={20} />
                </div>
                <div className={styles.statLabel}>Total Pageviews</div>
                <div className={styles.statValue}>{stats?.totalHits || 0}</div>
                <div className={styles.statDetail}>Active 100-log window</div>
              </div>
            </div>
            <div className="glass-card">
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(255, 87, 34, 0.05)", color: "#ff5722" }}>
                  <Users size={20} />
                </div>
                <div className={styles.statLabel}>Unique Visitors</div>
                <div className={styles.statValue}>{stats?.uniqueVisitors || 0}</div>
                <div className={styles.statDetail}>Deduplicated sessions</div>
              </div>
            </div>
            <div className="glass-card">
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(168, 85, 247, 0.05)", color: "#a855f7" }}>
                  <Activity size={20} />
                </div>
                <div className={styles.statLabel}>Avg Actions / Session</div>
                <div className={styles.statValue}>{stats?.avgHits || 0}</div>
                <div className={styles.statDetail}>Clicks per visitor session</div>
              </div>
            </div>
          </div>

          {/* Breakdowns Grid */}
          <div className={styles.breakdownsGrid}>
            
            {/* Column 1: Popular Content & Traffic Referral */}
            <div className={styles.breakdownCol}>
              <div className="glass-card">
                <div className={styles.sectionCard}>
                  <h2 className={styles.sectionTitle}>
                    <Compass size={18} />
                    <span>Popular Pages</span>
                  </h2>
                  <div className={styles.barList}>
                    {breakdowns?.pages?.map((item, idx) => {
                      const maxCount = breakdowns.pages[0]?.count || 1;
                      const percentage = (item.count / maxCount) * 100;
                      return (
                        <div key={idx} className={styles.barItem}>
                          <div className={styles.barLabel}>
                            <span className={styles.pathName}>{item.name}</span>
                            <span className={styles.barCount}>{item.count} hits</span>
                          </div>
                          <div className={styles.progressBarBg}>
                            <div className={styles.progressBarFill} style={{ width: `${percentage}%`, background: "var(--primary)" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ marginTop: "2rem" }}>
                <div className={styles.sectionCard}>
                  <h2 className={styles.sectionTitle}>
                    <Compass size={18} />
                    <span>Traffic Referrers</span>
                  </h2>
                  <div className={styles.barList}>
                    {breakdowns?.referrers?.map((item, idx) => {
                      const maxCount = breakdowns.referrers[0]?.count || 1;
                      const percentage = (item.count / maxCount) * 100;
                      return (
                        <div key={idx} className={styles.barItem}>
                          <div className={styles.barLabel}>
                            <span>{item.name}</span>
                            <span className={styles.barCount}>{item.count} hits</span>
                          </div>
                          <div className={styles.progressBarBg}>
                            <div className={styles.progressBarFill} style={{ width: `${percentage}%`, background: "var(--accent)" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Geographic & Device Distribution */}
            <div className={styles.breakdownCol}>
              <div className="glass-card">
                <div className={styles.sectionCard}>
                  <h2 className={styles.sectionTitle}>
                    <MapPin size={18} />
                    <span>Top Locations</span>
                  </h2>
                  <div className={styles.rowList}>
                    {breakdowns?.countries?.map((item, idx) => (
                      <div key={idx} className={styles.rowItem}>
                        <span className={styles.locationBadge}>{item.name}</span>
                        <span className={styles.rowCount}>{item.count} visits</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ marginTop: "2rem" }}>
                <div className={styles.sectionCard}>
                  <h2 className={styles.sectionTitle}>
                    <Laptop size={18} />
                    <span>Devices & Browsers</span>
                  </h2>
                  <div className={styles.deviceBreakdown}>
                    <div className={styles.subSection}>
                      <p className={styles.subTitle}>Operating Systems</p>
                      {breakdowns?.os?.map((item, idx) => (
                        <div key={idx} className={styles.rowItem}>
                          <span>{item.name}</span>
                          <span>{item.count} hits</span>
                        </div>
                      ))}
                    </div>
                    <div className={styles.subSection} style={{ marginTop: "1.5rem" }}>
                      <p className={styles.subTitle}>Browsers</p>
                      {breakdowns?.browsers?.map((item, idx) => (
                        <div key={idx} className={styles.rowItem}>
                          <span>{item.name}</span>
                          <span>{item.count} hits</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Live Visitor Feed */}
          <div className="glass-card" style={{ marginTop: "2rem" }}>
            <div className={styles.terminalCard}>
              <div className={styles.terminalHeader}>
                <div className={styles.dotContainer}>
                  <span className={styles.redDot} />
                  <span className={styles.yellowDot} />
                  <span className={styles.greenDot} />
                </div>
                <div className={styles.terminalTitle}>live_traffic_feed.log</div>
              </div>
              <div className={styles.terminalBody}>
                {logs?.length === 0 ? (
                  <p className={styles.terminalEmpty}>No visitor activity logged yet. Visit pages to start logging!</p>
                ) : (
                  logs?.map((log, idx) => {
                    const timeString = new Date(log.timestamp).toLocaleTimeString();
                    return (
                      <div key={idx} className={styles.terminalLine}>
                        <span className={styles.termTime}>[{timeString}]</span>{" "}
                        <span className={styles.termCountry}>Visitor ({log.country})</span>{" "}
                        accessed{" "}
                        <span className={styles.termPath}>{log.page_path}</span>{" "}
                        via{" "}
                        <span className={styles.termAgent}>{log.os} / {log.browser}</span>{" "}
                        (Ref: <span className={styles.termRef}>{log.referrer || "Direct"}</span>)
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
