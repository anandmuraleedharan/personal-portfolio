# Personal Portfolio Project Ideas Backlog

This backlog records potential future projects and micro-apps discussed with Antigravity. These ideas can be expanded or implemented as future standalone submodules.

---

## 1. Gamified Tech Quiz App (Data Engineering & Cloud)
* **The Concept:** An interactive, quiz-based game tailored for developers and data engineers. Players test their knowledge of advanced data concepts, cloud architectures, and development practices.
* **Topics & Curriculum:**
  * **AWS:** IAM policies, VPC subnetting, Lambda configurations, ECS/EKS.
  * **Apache Airflow:** DAG design, custom operators, task groups, executor options, XCom optimization.
  * **dbt (data build tool):** Materialization strategies, model testing frameworks, post-hooks, incremental merges.
  * **Snowflake:** Clustering keys, micro-partitioning, search optimization services, zero-copy cloning, secure sharing.
  * **BigQuery:** Partitioning, clustering, nested fields, slot allocation, query pushdown.
* **Gamification Elements:**
  * Duolingo-style streak trackers and hearts (lives).
  * Timed mode for lightning rounds.
  * Level progression maps to unlock advanced topics.
  * Interactive explanations with syntax highlighting.
* **Architecture Constraints:**
  * Serverless-first. Question banks stored in static, structured JSON files.
  * Session state held locally using browser `localStorage`.

---

## 2. Gamified Malayalam Language Learning App
* **The Concept:** A highly visual, Duolingo-inspired platform to learn Malayalam, featuring specialized themes, audio pronunciation, and drag-and-drop match games.
* **Core Features:**
  * **Thematic Paths:** Casual conversation, travel essentials, local culture/food, idioms.
  * **Interactive Exercise Formats:**
    * Character drawing/tracing.
    * English-to-Malayalam word match grid.
    * Phrase assembler (reordering words).
    * Flashcards with audio playback.
  * **Gamification:** Streak tracking, xp rewards, and level-up popups.
* **Architecture Constraints:**
  * Curriculum and audio references stored in client-side JSON maps.
  * Audio recordings pre-compiled to tiny WebM/MP3 formats and hosted on free CDNs or static assets.

---

## 3. Dedicated Software Design Patterns Explorer
* **The Concept:** A modern, premium microsite exploring the classic Gang of Four (GoF) design patterns (Creational, Structural, Behavioral) with code playgrounds and visual UML charts.
* **Key Features:**
  * Interactive UML diagrams (dynamic SVG flows or Canvas-based).
  * Tabbed code snippets showing the same pattern implemented in JavaScript, TypeScript, Python, and SQL/dbt (custom data-eng spin).
  * Interactive sliders to step through execution flows of complex patterns like State, Observer, and Command.
* **Architecture Constraints:**
  * Statical pages compiled via Next.js for sub-second SEO.
  * Code blocks highlighted with Prism/Shiki client-side.

---

## 4. TraceForge (Structured Log & Flamegraph Analyzer)
* **The Concept:** A high-performance, offline developer utility to analyze structured JSON logs (e.g. OpenTelemetry runs, dbt logs, Winston logs, AWS CloudWatch dumps) and visualize them in trace graphs.
* **Key Features:**
  * **Flamegraphs & Timelines:** Renders execution trace trees dynamically using Canvas, highlighting performance bottlenecks and execution blocks.
  * **Diagnostics:** Automatically parses stack traces, loops, and database queries, highlighting latency anomalies.
  * **Privacy Sandbox:** Performs all calculations entirely inside the user's browser, preventing sensitive corporate log data from being uploaded to any cloud server.
* **Architecture Constraints:**
  * Client-side stream chunking for large log files (up to 100MB) without freezing the UI thread.
  * High-speed Canvas rendering for thousands of trace blocks.

---

## 5. InterviewForge (AI-Powered Interview Coach & Prep Suite)
* **The Concept:** An interactive workspace designed to help candidates prepare for job interviews. It acts as a mock interviewer, behavioral story builder, and salary negotiation sandbox.
* **Key Features & Ideation:**
  * **Interactive AI Mock Interviewer:** Users upload a target job description and their CV. The AI asks tailored behavioral or technical questions (using voice-to-text or typing) and grades their responses.
  * **The STAR Reformatter:** Helps users structure their past project accomplishments into the STAR method (Situation, Task, Action, Result), auto-summarizing raw notes into polished interview talk-tracks.
  * **Interview Cheat-Sheet Generator:** Produces a downloadable "one-pager" summarizing the target company, 5 key questions to expect, and 5 highly strategic questions to ask the interviewer.
  * **Salary Negotiation Simulator:** An interactive text sandbox where candidates practice negotiation strategies against an AI recruiter with anchor boundaries.
* **Architecture Constraints:**
  * Uses Gemini API for audio-to-text evaluation and structured grading feedback.
  * Stores user practice stories and history locally in `localStorage` for privacy.


