"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { profile } from "../../data/profile";
import "./resume.css";

export default function ResumePage() {
  const [activeProfile, setActiveProfile] = useState(profile);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    
    // Check if tailored=true and load from sessionStorage
    if (searchParams.get("tailored") === "true") {
      const stored = sessionStorage.getItem("tailoredProfile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setActiveProfile(parsed);
        } catch (e) {
          console.warn("Error parsing tailored profile", e);
        }
      }
    }

    // Check if ?print=true is in the URL
    if (searchParams.get("print") === "true") {
      // Small timeout to ensure font loading and rendering is complete
      const timer = setTimeout(() => {
        window.print();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Helper to render skill bubble row
  const renderSkillMeters = (rating) => {
    return (
      <div className="skillMeters">
        {[1, 2, 3, 4, 5].map((val) => (
          <div 
            key={val} 
            className={`bubble ${val <= rating ? "bubbleFilled" : ""}`}
          />
        ))}
      </div>
    );
  };

  // Find relevant experience references from activeProfile
  const autodeskFull = activeProfile.experience.find(e => e.key === "autodeskFull");
  const atosJourney = activeProfile.experience.find(e => e.key === "atosJourney");
  const sap = activeProfile.experience.find(e => e.key === "sap");

  // Atos sub-roles
  const managerRole = atosJourney.roles[0];
  const blueShieldProj = managerRole.clientProjects[0];

  const consultantRole = atosJourney.roles[1];
  const amFamProj = consultantRole.clientProjects[0];
  const upsProj = consultantRole.clientProjects[1];

  const developerRole = atosJourney.roles[2];
  const autodeskContractProj = developerRole.clientProjects[0];

  const internRole = atosJourney.roles[3];

  return (
    <div>
      {/* Screen Controls - Hidden during print */}
      <div className="screenControls">
        <Link href="/" className="controlBtn controlBtnSecondary">
          ← Back to Website
        </Link>
        <button onClick={() => window.print()} className="controlBtn">
          Save / Print PDF
        </button>
      </div>

      <div className="resumeContainer">
        {/* ================= PAGE 1 ================= */}
        <div className="resumePage">
          {/* Blue Header Banner */}
          <div className="headerBanner">
            <h1 className="nameTitle">{activeProfile.personal.name}</h1>
            <p className="roleTitle">{activeProfile.personal.subtitle}</p>
          </div>

          <div className="columnsContainer">
            {/* Left Column */}
            <div className="leftColumn">
              {/* Summary */}
              <div>
                <p className="summaryText">{activeProfile.personal.summary}</p>
              </div>

              {/* Work History */}
              <div className="timeline">
                <h3 className="sectionTitle">Work History</h3>

                {/* Role 1: Autodesk Fulltime */}
                <div className="timelineItem">
                  <div className="jobHeader">
                    <h4 className="jobTitle">Principal Data Engineer & Architect</h4>
                    <span className="jobMeta">2023-11 - Present</span>
                  </div>
                  <div className="jobCompany">{autodeskFull.company} — {autodeskFull.location}</div>
                  <ul className="bulletList">
                    {autodeskFull.resumeItems.map((item, idx) => (
                      <li key={idx}>
                        <strong>{item.title.split(":")[0]}</strong>: {item.details}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Role 2: Manager & Blue Shield */}
                <div className="timelineItem">
                  <div className="jobHeader">
                    <h4 className="jobTitle">{managerRole.title}</h4>
                    <span className="jobMeta">{managerRole.period.split(" ")[0]} - {managerRole.period.split(" ")[2]}</span>
                  </div>
                  <div className="jobCompany">Eviden (An Atos Company) — Plano, TX</div>
                  <ul className="bulletList">
                    {managerRole.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                  
                  <div className="clientGroup">
                    <div className="clientHeader">Client Placement: {blueShieldProj.client} ({blueShieldProj.role})</div>
                    <ul className="bulletList">
                      {blueShieldProj.details.map((detail, idx) => (
                        <li key={idx} dangerouslySetInnerHTML={{ __html: detail.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Role 3: Senior/Principal Consultant (UPS & Autodesk Contract) */}
                <div className="timelineItem">
                  <div className="jobHeader">
                    <h4 className="jobTitle">{consultantRole.title.split(" (")[0]}</h4>
                    <span className="jobMeta">{consultantRole.period.split(" ")[0]} - {consultantRole.period.split(" ")[2]}</span>
                  </div>
                  <div className="jobCompany">Maven Wave, an Atos Company — Plano, TX</div>
                  
                  <div className="clientGroup" style={{ marginTop: '4px' }}>
                    <div className="clientHeader">Client Placement: {upsProj.client} ({upsProj.role})</div>
                    <ul className="bulletList">
                      {upsProj.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="clientGroup">
                    <div className="clientHeader">Client Placement: {autodeskContractProj.client} ({autodeskContractProj.role})</div>
                    <ul className="bulletList">
                      {autodeskContractProj.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="rightColumn">
              {/* Contact */}
              <div>
                <h3 className="sectionTitle">Contact</h3>
                <div className="contactList">
                  <div className="contactItem">
                    <span className="contactLabel">Address</span>
                    <span className="contactValue">{activeProfile.personal.location}</span>
                  </div>
                  <div className="contactItem">
                    <span className="contactLabel">Phone</span>
                    <span className="contactValue">{activeProfile.personal.phone}</span>
                  </div>
                  <div className="contactItem">
                    <span className="contactLabel">E-mail</span>
                    <span className="contactValue">{activeProfile.personal.email}</span>
                  </div>
                  <div className="contactItem">
                    <span className="contactLabel">LinkedIn</span>
                    <span className="contactValue">
                      <a href={activeProfile.personal.linkedin} target="_blank" rel="noopener noreferrer">
                        {activeProfile.personal.linkedinShort}
                      </a>
                    </span>
                  </div>
                  <div className="contactItem">
                    <span className="contactLabel">GitHub</span>
                    <span className="contactValue">
                      <a href={activeProfile.personal.github} target="_blank" rel="noopener noreferrer">
                        {activeProfile.personal.githubShort}
                      </a>
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills (Page 1) */}
              <div>
                <h3 className="sectionTitle">Skills</h3>
                <div className="skillsList">
                  {activeProfile.skills.resumeSidebar.map((skill, idx) => (
                    <div key={idx} className="skillItem">
                      <div className="skillInfo">
                        <span className="skillName">{skill.name}</span>
                        <span className="skillLevel">{skill.level}</span>
                      </div>
                      {renderSkillMeters(skill.rating)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pageBreak" />

        {/* ================= PAGE 2 ================= */}
        <div className="resumePage">
          <div className="columnsContainer" style={{ height: "100%" }}>
            {/* Left Column */}
            <div className="leftColumn">
              {/* Work History Continued */}
              <div className="timeline">
                <h3 className="sectionTitle">Work History (Cont.)</h3>

                {/* Role 3 Cont: Coke One North America placement & AmFam */}
                <div className="timelineItem">
                  <div className="jobCompany">Maven Wave / Atos Placement & Progression</div>
                  
                  <div className="clientGroup" style={{ marginTop: '4px' }}>
                    <div className="clientHeader">Coke One North America (Principal Consultant Project, 2022-02 - 2023-03)</div>
                    <ul className="bulletList">
                      <li>Designed and implemented BI re-platforming from SAP HANA to Snowflake.</li>
                      <li>Developed master/fact dbt models using Kimball DW modeling, optimizing DAG runs by 400% through clustering and custom macros.</li>
                    </ul>
                  </div>

                  <div className="clientGroup">
                    <div className="clientHeader">Client Placement: {amFamProj.client} ({amFamProj.role})</div>
                    <ul className="bulletList">
                      {amFamProj.details.map((detail, idx) => (
                        <li key={idx} dangerouslySetInnerHTML={{ __html: detail.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Role 4: Visual BI Intern / Solutions Developer */}
                <div className="timelineItem">
                  <div className="jobHeader">
                    <h4 className="jobTitle">{developerRole.title.split(" - ")[1]} (formerly Intern)</h4>
                    <span className="jobMeta">{internRole.period.split(" ")[0]} - {developerRole.period.split(" ")[2]}</span>
                  </div>
                  <div className="jobCompany">Visual BI Solutions — Plano, TX</div>
                  <ul className="bulletList">
                    <li>
                      <strong>Solutions Developer (Full-time)</strong>: {developerRole.details[0]}
                    </li>
                    <li>
                      <strong>Business Intelligence Developer (Internship)</strong>: {internRole.details[0]}
                    </li>
                  </ul>
                </div>

                {/* Role 5: SAP Labs India */}
                <div className="timelineItem">
                  <div className="jobHeader">
                    <h4 className="jobTitle">Developer (formerly Associate Developer)</h4>
                    <span className="jobMeta">{sap.period.split(" ")[0]} - {sap.period.split(" ")[2]}</span>
                  </div>
                  <div className="jobCompany">{sap.company} — Bengaluru, India</div>
                  <ul className="bulletList">
                    {sap.resumeItems.map((item, idx) => (
                      <li key={idx}>
                        <strong>{item.title.split(" (")[0]}</strong>: {item.details}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="sectionTitle">Education</h3>
                {activeProfile.education.map((edu, idx) => (
                  <div key={idx} className="eduHeader" style={{ marginTop: idx > 0 ? "10px" : "0" }}>
                    <h4 className="degreeTitle">{edu.degree}</h4>
                    <div className="schoolMeta">
                      <span>{edu.school} — {edu.location}</span>
                      <span>{edu.period}</span>
                    </div>
                    {edu.highlights.length > 0 && (
                      <ul className="bulletList" style={{ marginTop: '4px' }}>
                        <li>Grade: {edu.gpa} | {edu.highlights[0]}</li>
                        <li>{edu.highlights[1]}</li>
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div>
                <h3 className="sectionTitle">Certifications</h3>
                <div className="certList">
                  {activeProfile.certifications.map((c, idx) => (
                    <div key={idx} className="certItem">
                      <span className="certName">{c.title}</span>
                      <span className="certDate">{c.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="rightColumn">
              {/* Skills Continued (Page 2) */}
              <div>
                <h3 className="sectionTitle">Skills (Cont.)</h3>
                <div className="skillsList">
                  {activeProfile.skills.resumeSidebarPage2.map((skill, idx) => (
                    <div key={idx} className="skillItem">
                      <div className="skillInfo">
                        <span className="skillName">{skill.name}</span>
                        <span className="skillLevel">{skill.level}</span>
                      </div>
                      {renderSkillMeters(skill.rating)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
