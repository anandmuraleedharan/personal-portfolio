"use client";
import React from "react";
import styles from "./DrivesMe.module.css";
import { Code, Rocket, Users, Award } from "lucide-react";

export default function DrivesMe() {
  const principles = [
    {
      icon: <Code size={28} className={styles.icon} />,
      title: "Clean Code",
      description: "Writing maintainable, scalable, and well-documented code that stands the test of time."
    },
    {
      icon: <Rocket size={28} className={styles.icon} />,
      title: "Innovation",
      description: "Constantly exploring new technologies and methodologies to deliver cutting-edge solutions."
    },
    {
      icon: <Users size={28} className={styles.icon} />,
      title: "Collaboration",
      description: "Building strong teams and fostering an environment of knowledge sharing and growth."
    },
    {
      icon: <Award size={28} className={styles.icon} />,
      title: "Excellence",
      description: "Committed to delivering high-quality work that exceeds expectations and creates value."
    }
  ];

  return (
    <section id="what-drives-me" className={styles.drivesSection}>
      <div className="container">
        <div className={styles.header}>
          <h2 className="section-title">What Drives Me</h2>
          <p className={styles.subtitle}>Core principles that guide my work</p>
        </div>
        
        <div className={styles.grid}>
          {principles.map((p, idx) => (
            <div key={idx} className={`${styles.card} glass-card`}>
              <div className={styles.iconWrapper}>
                {p.icon}
              </div>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardDesc}>{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
