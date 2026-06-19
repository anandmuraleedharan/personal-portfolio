"use client";
import React from "react";
import styles from "./Projects.module.css";
import { FolderGit2, Cpu, GitFork, ArrowUpRight, Zap } from "lucide-react";

export default function Projects() {
  const projectsData = [
    {
      title: "SAP HANA to Snowflake BI Re-platforming",
      client: "Coke One North America",
      description: "Led the migration of Coke's legacy SAP HANA BI framework to Snowflake. Overhauled the Kimball fact & dimension schemas and developed performance macros.",
      stats: "400% DAG Runtime Improvement",
      tags: ["Snowflake", "dbt", "SAP HANA", "Kimball DW", "Airflow"],
      icon: <Zap size={22} />
    },
    {
      title: "dbt Pipeline Quality & Testing Framework",
      client: "Autodesk",
      description: "Designed a comprehensive, automated data testing framework to validate Fivetran ingestion feeds early. Implemented post-hooks for metalytic logging.",
      stats: "Zero Pipeline Failures Uncaught",
      tags: ["dbt", "Fivetran", "Snowflake", "Testing Logs"],
      icon: <FolderGit2 size={22} />
    },
    {
      title: "Finance Pipeline Performance Migration",
      client: "Autodesk",
      description: "Migrated complex financial data structures to a unified Snowflake + dbt environment, rewriting queries to push calculations down to the database layer.",
      stats: "200% DAG Speed Increase",
      tags: ["Snowflake", "dbt", "Airflow", "Looker PDTs"],
      icon: <Cpu size={22} />
    },
    {
      title: "Astronomer Airflow Lift & Shift",
      client: "Autodesk",
      description: "Transitioned core data pipelines from dbt Cloud scheduled runs to an enterprise-grade Airflow orchestrator managed on Astronomer for better monitoring.",
      stats: "Centralized Orchestration",
      tags: ["Astronomer", "Apache Airflow", "dbt Cloud"],
      icon: <GitFork size={22} />
    },
    {
      title: "Hierarchical BigQuery HR Data Warehouse",
      client: "UPS",
      description: "Designed BigQuery data warehouse tables optimized to query complex hierarchical organizational charts and reporting loops in real-time.",
      stats: "Sub-second Org Queries",
      tags: ["BigQuery", "Shell Scripting", "HR Schemas", "Linux"],
      icon: <Zap size={22} />
    },
    {
      title: "Full Stack SAP Enterprise Apps",
      client: "SAP Labs India",
      description: "Developed 5 responsive enterprise applications using the modern SAPUI5 JavaScript framework and ABAP backend, deploying CI/CD via Jenkins & Nginx.",
      stats: "5 Apps Shipped",
      tags: ["SAPUI5", "JavaScript", "ABAP", "CI/CD", "Nginx"],
      icon: <FolderGit2 size={22} />
    }
  ];

  return (
    <section id="projects" className="section">
      <div className="container">
        <h2 className="section-title">Key Projects & Impact</h2>
        
        <div className={styles.grid}>
          {projectsData.map((project, i) => (
            <div key={i} className="glass-card">
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  {project.icon}
                </div>
                <div className={styles.clientTag}>{project.client}</div>
              </div>
              
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.description}>{project.description}</p>
              
              <div className={styles.impactHighlight}>
                <span className={styles.impactLabel}>IMPACT:</span>
                <span className={styles.impactVal}>{project.stats}</span>
              </div>
              
              <div className={styles.tagsContainer}>
                {project.tags.map((tag, j) => (
                  <span key={j} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
