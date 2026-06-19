"use client";
import React from "react";
import styles from "./DrivesMe.module.css";
import { Cpu, ShieldCheck, TrendingUp, Users } from "lucide-react";

export default function DrivesMe() {
  const principles = [
    {
      icon: <Cpu size={28} className={styles.icon} />,
      title: "Navigating Ambiguity",
      description: "Thriving in complex environments, designing simple and reliable data architectures out of unstructured business requirements."
    },
    {
      icon: <ShieldCheck size={28} className={styles.icon} />,
      title: "Extreme Ownership",
      description: "Taking full end-to-end accountability for project execution, maintaining transparency, and delivering under pressure."
    },
    {
      icon: <TrendingUp size={28} className={styles.icon} />,
      title: "Rapid Adaptability",
      description: "Constantly expanding my technical capabilities, learning on the fly, and quickly scaling up to master new data frameworks."
    },
    {
      icon: <Users size={28} className={styles.icon} />,
      title: "Value-Driven Collaboration",
      description: "Fostering team growth, maintaining proactive communications, and bridging complex pipelines with direct stakeholder value."
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
