import React from "react";
import Header from "../../components/Header";
import Playground from "../../components/Playground";

export default function AppsPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navigation Header */}
      <Header />

      {/* Main Content Layout */}
      <main style={{ flexGrow: 1, paddingTop: "6rem" }}>
        {/* Developer Playground & AI Apps */}
        <Playground />
      </main>

      {/* Page Footer */}
      <footer style={{
        padding: "3rem 0",
        borderTop: "1px solid var(--border-color)",
        background: "rgba(3, 7, 18, 0.9)",
        textAlign: "center",
        fontSize: "0.9rem",
        color: "var(--foreground-muted)"
      }}>
        <div className="container" style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center"
        }}>
          <p>© {new Date().getFullYear()} Anand Muraleedharan. All rights reserved.</p>
          <p style={{ fontSize: "0.8rem", color: "var(--foreground-dim)" }}>
            Built with Next.js and Vanilla CSS. Hosted on anandmuraleedharan.com
          </p>
          <div className="footer-links" style={{ display: "flex", gap: "1.5rem" }}>
            <a href="mailto:anand.muraleedharan@gmail.com">Email</a>
            <a href="https://github.com/anandmuraleedharan" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/anand-muraleedharan/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
