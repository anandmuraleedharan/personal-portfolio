# InterviewForge — AI Interview Coach & Resume Prep Suite

**InterviewForge** is a stateless, zero-database AI platform designed for technical career preparation. It empowers candidates with real-time Web Speech audio practice, ATS resume match scoring, STAR behavioral story formatting, and salary negotiation cheat-sheet generators.

---

## 💡 Architecture & Key Features

### 1. ATS Resume Matcher & Tailor (`/tailor`)
* Cross-references target job descriptions against candidate resumes in memory.
* Computes an **ATS Match Score (0–100%)** and highlights missing critical keywords.
* Generates tailored bullet points and exports print-ready A4 PDF & JSON Resume files without storing candidate data.

### 2. Real-Time AI Audio Mock Interviewer (`/interview`)
* Interactive conversational interviewer utilizing Web Speech Synthesis (TTS) and Speech Recognition (STT mic input).
* Grades every response in real-time across **Technical Accuracy (0-10)**, **STAR Structure**, and **Conciseness**.

### 3. STAR Method Story Builder (`/star`)
* Converts raw project achievements into structured **Situation, Task, Action, Result** stories for behavioral rounds.

### 4. Salary Negotiation Sandbox (`/negotiate`)
* Simulates counter-offer dialogue scenarios and generates a 1-page printable interview cheat-sheet.

---

## 🛠 Tech Stack & Port Mapping

* **Framework:** Next.js 16 (App Router), React 19, Tailwind CSS v4
* **AI Engines:** `@google/genai` (Gemini 2.5 Flash primary) + OpenRouter fallback (`llama-3.3-70b`)
* **Local Port Mapping:** `3007` (`http://localhost:3007`)
* **Production Domain:** `https://interviewforge.anandmuraleedharan.com`
