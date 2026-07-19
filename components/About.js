"use client";
import React from "react";
import styles from "./About.module.css";
import { Award, BookOpen, Database, Server, Code, ShieldCheck } from "lucide-react";
import { profile } from "../data/profile";

export default function About() {
  const getGroupIcon = (index) => {
    switch (index) {
      case 0:
        return <Database className={styles.groupIcon} size={20} />;
      case 1:
        return <Server className={styles.groupIcon} size={20} />;
      case 2:
        return <Code className={styles.groupIcon} size={20} />;
      default:
        return <Code className={styles.groupIcon} size={20} />;
    }
  };

  return (
    <section id="about" className="section">
      <div className="container">
        <h2 className="section-title">About & Skills</h2>

        <div className={styles.layout}>
          {/* Left Column: Bio, Education, Certifications */}
          <div className={styles.leftCol}>
            <div className="glass-card">
              <h3 className={styles.cardTitle}>Professional Overview</h3>
              <p className={styles.bio}>
                I am a highly analytical <strong style={{ color: "var(--heading-color)" }}>{profile.personal.title}</strong> with a passion for designing resilient data architectures that scale. With over {profile.personal.experienceYears} years of hands-on experience, I bridge the gap between complex business mandates and clean, automated data pipelines. 
              </p>
              <p className={styles.bio}>
                My engineering philosophy is rooted in automation, early pipeline failure detection, and optimization. Whether optimizing dbt DAG runtimes by 200%-400%, writing robust post-hook macros for metadata analytics, or designing Kimball/Data Vault schemas, I focus on delivering performant, DRY (Don't Repeat Yourself) code.
              </p>
            </div>

            {/* Education Card */}
            <div className="glass-card">
              <h3 className={styles.cardTitle}>
                <BookOpen size={20} className={styles.titleIcon} />
                Education
              </h3>
              {profile.education.map((edu, idx) => (
                <div key={idx} className={styles.educationItem} style={{ marginBottom: idx < profile.education.length - 1 ? "1.5rem" : "0" }}>
                  <span className={styles.year}>{edu.period}</span>
                  <h4 className={styles.eduDegree}>{edu.degree}</h4>
                  <p className={styles.school}>{edu.school} — {edu.location}</p>
                  {edu.gpa && (
                    <div className={styles.eduHighlights}>
                      <span>Grade: <strong>{edu.gpa}</strong></span>
                      {edu.highlights.map((highlight, hIdx) => (
                        <span key={hIdx}>• {highlight}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Certifications Card */}
            <div className="glass-card">
              <h3 className={styles.cardTitle}>
                <Award size={20} className={styles.titleIcon} />
                Certifications
              </h3>
              <div className={styles.certsGrid}>
                {profile.certifications.map((c, i) => (
                  <div key={i} className={styles.certItem}>
                    <ShieldCheck className={styles.certIcon} size={18} />
                    <div>
                      <h4 className={styles.certTitle}>{c.title}</h4>
                      <p className={styles.certMeta}>{c.org} • {c.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Skills */}
          <div id="skills" className={styles.rightCol}>
            {profile.skills.groups.map((group, groupIdx) => (
              <div key={groupIdx} className={`${styles.skillGroupCard} glass-card`}>
                <div className={styles.groupHeader}>
                  {getGroupIcon(groupIdx)}
                  <h3>{group.title}</h3>
                </div>
                <div className={styles.skillsGrid}>
                  {group.skills.map((skill, skillIdx) => (
                    <div key={skillIdx} className={styles.skillItem}>
                      <div className={styles.skillMeta}>
                        <span className={styles.skillName}>{skill.name}</span>
                        <span className={styles.skillLevel}>{skill.level}</span>
                      </div>
                      <div className={styles.progressBarBg}>
                        <div 
                          className={styles.progressBarFill} 
                          style={{ width: skill.level === "Expert" ? "95%" : "80%" }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
