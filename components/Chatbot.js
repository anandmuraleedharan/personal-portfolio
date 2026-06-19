"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Chatbot.module.css";
import { Send, Sparkles, User, RefreshCw, X, MessageSquare } from "lucide-react";
import { profile } from "../data/profile";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      content: "Hi! I'm Anand's AI Assistant. Ask me anything about his technical projects, Snowflake migrations, dbt frameworks, or education. Click one of the suggestions below to start!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestions = [
    { label: "Overview", text: "Give me the 2-minute overview of Anand's career." },
    { label: "Skills & Stack", text: "What tools and technologies does Anand use?" },
    { label: "Coke Migration", text: "Tell me about the Coke replatforming project." },
    { label: "Download Resume", text: "How can I download a PDF copy of Anand's resume?" },
    { label: "Autodesk Telemetry", text: "What did Anand build for Autodesk?" },
    { label: "Contact Info", text: "How can I get in touch with Anand?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };
    window.addEventListener("portfolio-chat:open", handleOpenChat);
    return () => window.removeEventListener("portfolio-chat:open", handleOpenChat);
  }, []);

  const getFallbackResponse = (query) => {
    const q = query.toLowerCase();
    
    const autodeskFull = profile.experience.find(e => e.key === "autodeskFull");
    const atosJourney = profile.experience.find(e => e.key === "atosJourney");
    const sap = profile.experience.find(e => e.key === "sap");

    const managerRole = atosJourney.roles[0];
    const blueShieldProj = managerRole.clientProjects[0];

    const consultantRole = atosJourney.roles[1];
    const amFamProj = consultantRole.clientProjects[0];
    const upsProj = consultantRole.clientProjects[1];

    const developerRole = atosJourney.roles[2];
    const autodeskContractProj = developerRole.clientProjects[0];

    const internRole = atosJourney.roles[3];

    if (q.includes("overview") || q.includes("summary") || q.includes("who is") || q.includes("career")) {
      return `${profile.personal.name} is a ${profile.personal.title} with ${profile.personal.experienceYears} years of experience. ${profile.personal.summary}`;
    }
    
    if (q.includes("autodesk") || q.includes("adsk")) {
      return `Anand has worked with Autodesk in two separate capacities:

1. **${autodeskFull.resumeItems[0].title} (Full-Time):** ${autodeskFull.resumeItems[0].details}
2. **${autodeskContractProj.role} (Contract, Oct 2020 - Jan 2022):** Placed at Autodesk as a consultant from Visual BI Solutions. ${autodeskContractProj.details.join(" ")}`;
    }
    
    if (q.includes("coke") || q.includes("coca-cola") || q.includes("hana") || q.includes("replatform") || q.includes("replatforming")) {
      return `For Coke One North America (under Maven Wave), Anand designed and implemented the re-platforming of the BI architecture from SAP HANA to Snowflake. He developed master and fact table dbt models using Kimball DW modeling and optimized DAG runtimes by 400% through data clustering, incremental models, and custom post-hook macros for metadata analytics.`;
    }
    
    if (q.includes("skills") || q.includes("tech") || q.includes("stack") || q.includes("tool") || q.includes("language")) {
      return `Anand's technical stack includes:
• **Data Warehousing:** Snowflake, Google BigQuery, SAP HANA, Kimball DW, Data Vault 2.0
• **Pipeline Ingestion & Orchestration:** dbt, Apache Airflow, Astronomer, Fivetran, Looker, Vertex AI, KFP
• **Languages:** SQL, Python, JavaScript, Shell Scripting, Jinja, ABAP, HTML/CSS
• **Cloud & DevOps:** AWS, GCP, Azure, Terraform, Jenkins, Nginx, Git`;
    }
    
    if (q.includes("education") || q.includes("ut dallas") || q.includes("study") || q.includes("gpa") || q.includes("amrita")) {
      return `Anand's educational background:
1. **${profile.education[0].degree}** (GPA ${profile.education[0].gpa}) from **${profile.education[0].school}** (${profile.education[0].highlights.join(", ")}).
2. **${profile.education[1].degree}** (Grade ${profile.education[1].gpa}) from **${profile.education[1].school}**.`;
    }
    
    if (q.includes("contact") || q.includes("touch") || q.includes("email") || q.includes("phone")) {
      return `You can reach Anand via:
• **Email:** ${profile.personal.email}
• **LinkedIn:** ${profile.personal.linkedinShort}
• **GitHub:** ${profile.personal.githubShort}
• **Phone:** +1 ${profile.personal.phone}
• **Location:** ${profile.personal.location}`;
    }

    if (q.includes("recommendation") || q.includes("evin") || q.includes("manager") || q.includes("arun") || q.includes("testimonial") || q.includes("feedback")) {
      return `Anand has received **24 recommendations in total** on LinkedIn from directors, architects, and managers across SAP Labs, Eviden, Maven Wave, and Autodesk!

Here are some highlights:

• **${profile.testimonials[0].name} (${profile.testimonials[0].relationship}):** "${profile.testimonials[0].text}"

• **${profile.testimonials[1].name} (${profile.testimonials[1].relationship}):** "${profile.testimonials[1].text}"`;
    }

    if (q.includes("blue shield") || q.includes("bsc") || q.includes("clinical")) {
      return `At **Blue Shield of California** (${blueShieldProj.role}, May 2023 - Oct 2023), Anand was placed as a consultant during his time as a Data Engineering Manager at Eviden. ${blueShieldProj.details.join(" ")}`;
    }

    if (q.includes("american family") || q.includes("amfam") || q.includes("afi")) {
      return `At **American Family Insurance** (${amFamProj.role}, Feb 2023 - Apr 2023), Anand was placed as a consultant during his time as a Principal Consultant (formerly Senior Consultant) at Maven Wave/Atos. ${amFamProj.details.join(" ")}`;
    }

    if (q.includes("ups")) {
      return `At **UPS** (${upsProj.role}, May 2022 - Dec 2022), Anand was placed as a consultant during his time as a Principal Consultant (formerly Senior Consultant) at Maven Wave/Atos. ${upsProj.details.join(" ")}`;
    }

    if (q.includes("visual bi") || q.includes("visualbi") || q.includes("solutions") || q.includes("maven wave") || q.includes("mavenwave") || q.includes("eviden") || q.includes("atos") || q.includes("consulting") || q.includes("contract")) {
      return `Anand's consulting career at **${atosJourney.company}** spans from May 2019 to Oct 2023, representing a strong 4.5-year career progression through acquisitions:

• **${managerRole.title}** (${managerRole.period}): Led delivery teams, set dbt standards. Placed at **Blue Shield of California** (${blueShieldProj.role}).
• **${consultantRole.title.split(" (")[0]}** (${consultantRole.period}): Placed at **American Family Insurance** (${amFamProj.role}) and **UPS** (${upsProj.role}).
• **${developerRole.title}** (${developerRole.period}): Designed Snowflake pipelines and dbt models. Placed at **Autodesk** (${autodeskContractProj.role}).
• **${internRole.title}** (${internRole.period}): Kimball DW modeling on SAP HANA.`;
    }
    
    if (q.includes("saplabs") || q.includes("sap labs") || q.includes("sap")) {
      return `At **SAP** (3 yrs 2 mos, Jun 2015 - Jul 2018):
• **Developer** (Apr 2018 - Jul 2018): Programmed full-stack features using SAPUI5 and ABAP on SAP HANA databases.
• **Associate Developer** (Jun 2015 - Mar 2018): Shipped 5 web applications utilizing MVC design patterns and OOP concepts, created CI/CD flows in Jenkins, configured Nginx, and analyzed performance in Chrome DevTools.`;
    }

    if (q.includes("cert") || q.includes("certification")) {
      return `Anand holds the following certifications:
${profile.certifications.map((c, i) => `${i + 1}. **${c.title}** (${c.org}, Issued ${c.date})`).join("\n")}`;
    }

    if (q.includes("resume") || q.includes("cv") || q.includes("pdf") || q.includes("download")) {
      return "You can view and export Anand's official 2-page Zety-style resume directly as an ATS-compliant PDF! \n\nClick here to open and save the PDF: [Download A4 PDF Resume](/resume?print=true)\n\nThis generates a clean, non-editable, and fully vector-text PDF suitable for applicant tracking systems (ATS) and recruiters.";
    }

    return `I'm a specialized AI assistant loaded with Anand's profile. Ask me about his roles at Autodesk, his certifications (Astronomer Airflow 3, dbt), recommendations (Evin Anderson), skills (Snowflake, dbt, Airflow, Python), or how to download his A4 Resume PDF!`;
  };

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    // Add user message
    const userMessage = { role: "user", content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map(m => ({
            role: m.role === "model" ? "assistant" : "user",
            content: m.content
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        simulateTyping(data.response);
      } else {
        const fallbackAnswer = getFallbackResponse(textToSend);
        simulateTyping(fallbackAnswer);
      }
    } catch (error) {
      const fallbackAnswer = getFallbackResponse(textToSend);
      simulateTyping(fallbackAnswer);
    }
  };

  const simulateTyping = (fullText) => {
    setIsLoading(false);
    setMessages(prev => [...prev, { role: "model", content: fullText }]);
  };

  const resetChat = () => {
    setMessages([
      {
        role: "model",
        content: "Chat reset! What else would you like to know about Anand's career, data architectures, or project experience?"
      }
    ]);
  };

  return (
    <div className={styles.chatWrapper}>
      {/* Floating Toggle Button */}
      <button 
        className={`${styles.chatLauncher} ${isOpen ? styles.launcherActive : ""}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && <span className={styles.notificationBadge}>1</span>}
      </button>

      {/* Floating Chat Panel */}
      {isOpen && (
        <div className={`${styles.chatPanel} glass-card`}>
          {/* Chat Window Header */}
          <div className={styles.chatHeader}>
            <div className={styles.botTitle}>
              <div className={styles.botAvatar}>
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className={styles.botName}>Anand's AI Assistant</h3>
                <span className={styles.botStatus}>Online • Streaming Answers</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className={styles.headerBtn} onClick={resetChat} title="Reset Chat">
                <RefreshCw size={14} />
              </button>
              <button className={styles.headerBtn} onClick={() => setIsOpen(false)} title="Close Chat">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className={styles.chatMessages}>
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`${styles.messageRow} ${m.role === "user" ? styles.userRow : styles.botRow}`}
              >
                <div className={styles.avatar}>
                  {m.role === "user" ? <User size={12} /> : <Sparkles size={12} />}
                </div>
                <div className={styles.messageBubble}>
                  <p style={{ whiteSpace: "pre-line" }}>{m.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.messageRow} ${styles.botRow}`}>
                <div className={styles.avatar}>
                  <Sparkles size={12} />
                </div>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Panel */}
          <div className={styles.suggestionsContainer}>
            <span className={styles.suggestionsLabel}>Suggested Topics:</span>
            <div className={styles.suggestionsList}>
              {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  className={styles.suggestionTag}
                  onClick={() => handleSend(s.text)}
                  disabled={isLoading}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <form 
            className={styles.inputArea} 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <input
              type="text"
              placeholder="Ask about Snowflake, dbt, Airflow, UTD..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className={styles.inputField}
            />
            <button 
              type="submit" 
              className={styles.sendBtn}
              disabled={!input.trim() || isLoading}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
