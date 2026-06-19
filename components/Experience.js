"use client";
import React, { useState } from "react";
import styles from "./Experience.module.css";
import { Briefcase, Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { profile } from "../data/profile";

export default function Experience() {
  const [expanded, setExpanded] = useState({
    autodeskFull: true,
    atosJourney: true,
    sap: false
  });

  const toggleExpand = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section id="experience" className="section">
      <div className="container">
        <h2 className="section-title">Professional Experience</h2>
        
        <div className={styles.timeline}>
          {profile.experience.map((exp) => (
            <div key={exp.key} className={styles.timelineItem}>
              {/* Timeline marker */}
              <div className={styles.timelineMarker}>
                <div className={styles.timelineDot}>
                  <Briefcase size={16} />
                </div>
                <div className={styles.timelineLine}></div>
              </div>

              {/* Content Card */}
              <div className={`${styles.timelineContent} glass-card`}>
                <div 
                  className={styles.cardHeader} 
                  onClick={() => toggleExpand(exp.key)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.headerInfo}>
                    <div className={styles.roleRow}>
                      <h3 className={styles.roleTitle}>{exp.role}</h3>
                      <span className={`${styles.tag} ${styles.tagFulltime}`}>
                        {exp.isJourney ? "Journey" : "Full-Time"}
                      </span>
                    </div>
                    <div className={styles.companyRow}>
                      <span className={styles.companyName}>{exp.company}</span>
                      <span className={styles.divider}>•</span>
                      <span className={styles.metaText}>
                        <Calendar size={14} className={styles.metaIcon} />
                        {exp.period}
                      </span>
                      <span className={styles.divider}>•</span>
                      <span className={styles.metaText}>
                        <MapPin size={14} className={styles.metaIcon} />
                        {exp.location}
                      </span>
                    </div>
                  </div>
                  <button className={styles.expandButton} aria-label="Toggle details">
                    {expanded[exp.key] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {expanded[exp.key] && (
                  <div className={styles.cardBody}>
                    <p className={styles.description}>{exp.description}</p>
                    
                    {!exp.isJourney ? (
                      <ul className={styles.bulletList}>
                        {exp.details.map((bullet, i) => (
                          <li key={i} dangerouslySetInnerHTML={{ __html: bullet.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></li>
                        ))}
                      </ul>
                    ) : (
                      <div className={styles.subTimeline}>
                        {exp.roles.map((subRole, idx) => (
                          <div key={idx} className={styles.subTimelineItem}>
                            {/* Sub Stepper Line */}
                            <div className={styles.subMarker}>
                              <div className={styles.subDot}></div>
                              {idx < exp.roles.length - 1 && <div className={styles.subLine}></div>}
                            </div>
                            
                            {/* Sub Role Content */}
                            <div className={styles.subContent}>
                              <div className={styles.subRoleHeader}>
                                <h4 className={styles.subRoleTitle}>{subRole.title}</h4>
                                <span className={styles.subRolePeriod}>{subRole.period}</span>
                              </div>
                              
                              <ul className={styles.subRoleDetails}>
                                {subRole.details.map((detail, dIdx) => (
                                  <li key={dIdx} dangerouslySetInnerHTML={{ __html: detail.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></li>
                                ))}
                              </ul>
                              
                              {/* Nested Client Projects */}
                              {subRole.clientProjects && subRole.clientProjects.map((proj, pIdx) => (
                                <div key={pIdx} className={styles.clientProjectCard}>
                                  <div className={styles.clientProjectHeader}>
                                    <span className={styles.clientBadge}>Client Placement</span>
                                    <h5 className={styles.clientName}>{proj.client}</h5>
                                    <span className={styles.clientPeriod}>{proj.period}</span>
                                  </div>
                                  <div className={styles.clientRoleName}>{proj.role}</div>
                                  <ul className={styles.clientProjectDetails}>
                                    {proj.details.map((pDetail, pdIdx) => (
                                      <li key={pdIdx} dangerouslySetInnerHTML={{ __html: pDetail.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></li>
                                    ))}
                                  </ul>
                                  {proj.skills && (
                                    <div className={styles.clientSkills}>
                                      <strong>Environment:</strong> {proj.skills}
                                    </div>
                                  )}
                                </div>
                              ))}
                              
                              {/* General role skills if no client project */}
                              {!subRole.clientProjects && subRole.skills && (
                                <div className={styles.roleSkills}>
                                  <strong>Environment:</strong> {subRole.skills}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
