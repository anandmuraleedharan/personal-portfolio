"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./MobileLayout.module.css";
import { profile } from "../data/profile";
import { 
  Terminal, Mail, Phone,
  BookOpen, Award, ShieldCheck, Database, 
  Server, Code, Briefcase, Calendar, MapPin, 
  Sparkles, FileText, Cpu, CheckCircle, 
  AlertTriangle, ArrowRight, RefreshCw, 
  Quote, ChevronLeft, ChevronRight, MessageSquare,
  Menu, X, Sun, Moon
} from "lucide-react";

// Custom SVG Icons for Brands (removed in newer lucide-react versions)
const GithubIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function MobileLayout() {
  // Navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  // Recommendations state
  const [recIndex, setRecIndex] = useState(0);
  const [recommendations, setRecommendations] = useState([]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Load and toggle theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  // Recruiter Agent state
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const [fitData, setFitData] = useState(null);

  const projectsData = [
    {
      title: "SAP HANA to Snowflake BI Re-platforming",
      client: "Coke One North America",
      description: "Led the migration of Coke's legacy SAP HANA BI framework to Snowflake. Overhauled the Kimball fact & dimension schemas and developed performance macros.",
      impact: "400% DAG Runtime Improvement",
      tags: ["Snowflake", "dbt", "SAP HANA", "Kimball DW", "Airflow"]
    },
    {
      title: "dbt Pipeline Quality & Testing Framework",
      client: "Autodesk",
      description: "Designed a comprehensive, automated data testing framework to validate Fivetran ingestion feeds early. Implemented post-hooks for metalytic logging.",
      impact: "Zero Pipeline Failures Uncaught",
      tags: ["dbt", "Fivetran", "Snowflake", "Testing Logs"]
    },
    {
      title: "Finance Pipeline Performance Migration",
      client: "Autodesk",
      description: "Migrated complex financial data structures to a unified Snowflake + dbt environment, rewriting queries to push calculations down to the database layer.",
      impact: "200% DAG Speed Increase",
      tags: ["Snowflake", "dbt", "Airflow", "Looker PDTs"]
    }
  ];

  const loadingMessages = [
    "Ingesting job description...",
    "Extracting key role requirements...",
    "Cross-referencing architectures...",
    "Analyzing alignment score...",
    "Re-ordering skills...",
    "Formatting resume layout...",
    "Ready!"
  ];

  // Testimonials shuffle on client mount
  useEffect(() => {
    const array = [...profile.testimonials];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setRecommendations(array);
  }, []);

  // Recruiter Agent logs runner
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

  const handlePrevRec = () => {
    if (recommendations.length === 0) return;
    setRecIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
  };

  const handleNextRec = () => {
    if (recommendations.length === 0) return;
    setRecIndex((prev) => (prev + 1) % recommendations.length);
  };

  const handleNavClick = (e, path) => {
    if (path.startsWith("/#") || path.startsWith("#")) {
      const targetId = path.substring(path.indexOf("#") + 1);
      // Check if we are on the homepage
      const isHomepage = typeof window !== "undefined" && (window.location.pathname === "/" || window.location.pathname === "");
      if (isHomepage) {
        e.preventDefault();
        setMobileMenuOpen(false);
        setTimeout(() => {
          const element = document.querySelector(`.mobileView #${targetId}`) || document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
        return;
      }
    }
    
    setTimeout(() => {
      setMobileMenuOpen(false);
    }, 150);
  };

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

  const getGroupIcon = (idx) => {
    switch (idx) {
      case 0: return <Database className={styles.cardTitleIcon} size={18} />;
      case 1: return <Server className={styles.cardTitleIcon} size={18} />;
      default: return <Code className={styles.cardTitleIcon} size={18} />;
    }
  };

  return (
    <div className={styles.mobileContainer}>
      {/* Sticky Compact Mobile Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <Terminal className={styles.logoIcon} size={18} />
          <span>anand.dev</span>
        </div>
        <div className={styles.headerActions}>
          <a href="mailto:anand.muraleedharan@gmail.com" className={styles.actionBtn} aria-label="Email">
            <Mail size={18} />
          </a>
          <button 
            className={styles.mobileToggle} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            <a href="/#about" onClick={(e) => handleNavClick(e, "/#about")}>About</a>
            <a href="/#skills" onClick={(e) => handleNavClick(e, "/#skills")}>Skills</a>
            <a href="/#experience" onClick={(e) => handleNavClick(e, "/#experience")}>Experience</a>
            <a href="/#projects" onClick={(e) => handleNavClick(e, "/#projects")}>Projects</a>
            <a href="/apps" onClick={(e) => handleNavClick(e, "/apps")}>Apps</a>
            <a href="/resume" target="_blank" rel="noopener noreferrer" className={styles.mobileResumeLink} onClick={(e) => handleNavClick(e, "/resume")}>
              Resume PDF
            </a>
            <button onClick={() => { window.dispatchEvent(new CustomEvent("portfolio-chat:open")); setMobileMenuOpen(false); }} className={styles.mobileChatLink}>
              Interview AI
            </button>
            <div className={styles.mobileSocials}>
              <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle Theme">
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <a href="mailto:anand.muraleedharan@gmail.com" aria-label="Email">
                <Mail size={20} />
              </a>
              <a href="https://github.com/anandmuraleedharan" target="_blank" rel="noopener noreferrer">
                <GithubIcon size={20} />
              </a>
              <a href="https://www.linkedin.com/in/anand-muraleedharan/" target="_blank" rel="noopener noreferrer">
                <LinkedinIcon size={20} />
              </a>
            </div>
          </nav>
        </div>
      )}

      <main style={{ flexGrow: 1 }}>
        {/* HERO SECTION */}
        <section className={styles.section} style={{ paddingTop: "5.5rem" }}>
          <div className={styles.hero}>
            <div className={styles.badge}>
              <span className={styles.badgeDot}></span>
              <span>Available for Consultations</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Hi, I'm <span className={styles.gradientText}>Anand</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Principal Data Engineer & Architect building resilient, optimized, and automated pipelines.
            </p>

            <div className={styles.ctaGroup}>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent("portfolio-chat:open"))} 
                className="btn btn-primary ctaBtn"
              >
                Chat with my AI Agent
              </button>
              <a href="mailto:anand.muraleedharan@gmail.com" className="btn btn-secondary ctaBtn">
                Get in Touch
              </a>
            </div>

            <div className={styles.socialGrid}>
              <a href="https://github.com/anandmuraleedharan" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub">
                <GithubIcon size={18} />
              </a>
              <a href="https://www.linkedin.com/in/anand-muraleedharan/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                <LinkedinIcon size={18} />
              </a>
            </div>
          </div>
        </section>

        {/* ABOUT & OVERVIEW */}
        <section id="about" className={styles.section}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          <div className={styles.aboutContainer}>
            <div className="glass-card bioCard">
              <h3 className={styles.cardTitle}>Professional Biography</h3>
              <p className={styles.bioText}>
                I am a highly analytical <strong style={{ color: "var(--heading-color)" }}>{profile.personal.title}</strong> with over {profile.personal.experienceYears} years of hands-on experience designing data architectures that scale.
              </p>
              <p className={styles.bioText}>
                My philosophy is rooted in automated metadata collection, early pipeline failure detection, and optimizations that drive runtimes down by 200% to 400% using Snowflake, dbt, Airflow, and BigQuery.
              </p>
            </div>

            {/* Education */}
            <div className="glass-card">
              <h3 className={styles.cardTitle}>
                <BookOpen size={18} className={styles.cardTitleIcon} />
                Education
              </h3>
              {profile.education.map((edu, idx) => (
                <div key={idx} className={styles.eduItem}>
                  <span className={styles.eduPeriod}>{edu.period}</span>
                  <h4 className={styles.eduDegree}>{edu.degree}</h4>
                  <p className={styles.eduSchool}>{edu.school} — {edu.location}</p>
                  {edu.gpa && <span className={styles.eduGPA}>Grade: <strong>{edu.gpa}</strong></span>}
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="glass-card">
              <h3 className={styles.cardTitle}>
                <Award size={18} className={styles.cardTitleIcon} />
                Certifications
              </h3>
              <div className={styles.certList}>
                {profile.certifications.map((c, idx) => (
                  <div key={idx} className={styles.certItem}>
                    <ShieldCheck className={styles.certIcon} size={16} />
                    <div>
                      <h4 className={styles.certName}>{c.title}</h4>
                      <p className={styles.certMeta}>{c.org} • {c.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className={styles.section}>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <div className={styles.skillsContainer}>
            {profile.skills.groups.map((group, groupIdx) => (
              <div key={groupIdx} className={`${styles.skillGroupCard} glass-card`}>
                <div className={styles.cardTitle}>
                  {getGroupIcon(groupIdx)}
                  <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{group.title}</h3>
                </div>
                <div className={styles.skillsList}>
                  {group.skills.slice(0, 5).map((skill, skillIdx) => (
                    <div key={skillIdx} className={styles.skillItem}>
                      <div className={styles.skillMeta}>
                        <span className={styles.skillName}>{skill.name}</span>
                        <span className={styles.skillLevel}>{skill.level}</span>
                      </div>
                      <div className={styles.progressBg}>
                        <div 
                          className={styles.progressFill}
                          style={{ width: skill.level === "Expert" ? "95%" : "80%" }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WORK EXPERIENCE */}
        <section id="experience" className={styles.section}>
          <h2 className={styles.sectionTitle}>Work History</h2>
          <div className={styles.experienceContainer}>
            {profile.experience.map((exp) => (
              <div key={exp.key} className={`${styles.expCard} glass-card`}>
                <div className={styles.expHeader}>
                  <div className={styles.expRoleRow}>
                    <h3 className={styles.expRole}>{exp.role}</h3>
                    <span className={styles.expTag}>
                      {exp.isJourney ? "Journey" : "Full-Time"}
                    </span>
                  </div>
                  <div className={styles.expCompanyMeta}>
                    <span style={{ fontWeight: 700, color: "var(--heading-color)" }}>{exp.company}</span>
                    <span className={styles.expMetaItem}>
                      <Calendar size={12} style={{ color: "var(--foreground-dim)" }} />
                      {exp.period}
                    </span>
                    <span className={styles.expMetaItem}>
                      <MapPin size={12} style={{ color: "var(--foreground-dim)" }} />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {!exp.isJourney ? (
                  <ul className={styles.expBulletList}>
                    {exp.details.slice(0, 4).map((bullet, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: bullet.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></li>
                    ))}
                  </ul>
                ) : (
                  <ul className={styles.expBulletList}>
                    {exp.roles.map((subRole, idx) => (
                      <li key={idx}>
                        <strong>{subRole.title}</strong> ({subRole.period})
                        <div style={{ fontSize: "0.8rem", marginTop: "0.25rem", color: "var(--foreground-dim)" }}>
                          {subRole.details[0]}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className={styles.section}>
          <h2 className={styles.sectionTitle}>Featured Projects</h2>
          <div className={styles.projectsGrid}>
            {projectsData.map((proj, idx) => (
              <div key={idx} className={`${styles.projectCard} glass-card`}>
                <div className={styles.projHeader}>
                  <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                    {proj.client}
                  </span>
                  <div className={styles.projIconBg}>
                    <Briefcase size={16} />
                  </div>
                </div>
                <h3 className={styles.projTitle}>{proj.title}</h3>
                <p className={styles.projDesc}>{proj.description}</p>
                
                {proj.impact && (
                  <div className={styles.impactBadge}>
                    <span className={styles.impactLabel}>IMPACT:</span>
                    <span className={styles.impactVal}>{proj.impact}</span>
                  </div>
                )}

                <div className={styles.projTags}>
                  {proj.tags.slice(0, 3).map((tag, tIdx) => (
                    <span key={tIdx} className={styles.projTag}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RECOMMENDATIONS */}
        <section className={styles.section} style={{ paddingBottom: "5rem" }}>
          <h2 className={styles.sectionTitle}>Recommendations</h2>
          {recommendations.length > 0 && (
            <div className={styles.carousel}>
              <button className={styles.recNavBtn} onClick={handlePrevRec} aria-label="Previous">
                <ChevronLeft size={16} />
              </button>

              <div className={`${styles.recCard} glass-card`}>
                <div className={styles.quoteHeader}>
                  <Quote className={styles.quoteIcon} size={24} />
                  <div className={styles.recUser}>
                    <h4 className={styles.recName}>{recommendations[recIndex].name}</h4>
                    <span className={styles.recTitle}>{recommendations[recIndex].title}</span>
                    <span className={styles.recTag}>{recommendations[recIndex].relation}</span>
                  </div>
                </div>
                <p className={styles.quoteText}>"{recommendations[recIndex].text}"</p>
                <div className={styles.recFooter}>
                  <span>{recommendations[recIndex].date}</span>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <MessageSquare size={10} style={{ color: "var(--secondary)", marginRight: "0.2rem" }} />
                    LinkedIn Rec
                  </span>
                </div>
              </div>

              <button className={styles.recNavBtn} onClick={handleNextRec} aria-label="Next">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© {new Date().getFullYear()} Anand Muraleedharan. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="mailto:anand.muraleedharan@gmail.com">Email</a>
            <a href="https://github.com/anandmuraleedharan" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/anand-muraleedharan/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
