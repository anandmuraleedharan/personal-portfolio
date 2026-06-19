import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import RecruiterAgent from "../components/RecruiterAgent";
import Recommendations from "../components/Recommendations";
import Chatbot from "../components/Chatbot";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navigation Header */}
      <Header />

      {/* Main Content Layout */}
      <main style={{ flexGrow: 1 }}>
        {/* Hero Banner Section */}
        <Hero />

        {/* Bio, Education and Certifications */}
        <About />

        {/* Chronological Work Timeline */}
        <Experience />

        {/* Key Projects Showcase */}
        <Projects />

        {/* AI Recruiter Agent for Custom Resumes */}
        <RecruiterAgent />

        {/* Recommendations / Testimonials */}
        <Recommendations />

        {/* Interactive Resume Bot */}
        <Chatbot />
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
            <a href="https://github.com/anandmuraleedharan" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/anand-muraleedharan/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
