# Personal Portfolio

The central digital landing page and coordinator for Anand's portfolio workspace. The portfolio serves static career highlights and features custom AI assistance tools.

---

## 📁 Submodule Project Structure

Located at the root of the project:
```
personal-portfolio/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts   # Chatbot API (Profile context injection)
│   │   └── tailor/
│   │       └── route.ts   # Recruiter CV tailor API
│   ├── architecture/
│   │   ├── page.js        # Interactive architecture visualizer page
│   │   └── architecture.module.css
│   ├── resume/
│   │   └── page.js        # Print-ready resume compiler view
│   ├── layout.js
│   └── page.js            # Portfolio landing page
├── components/
│   ├── Header.js
│   └── Playground.js      # Sandbox selector drawer
├── data/
│   └── profile.json       # Career context database
└── package.json
```

---

## 🧠 Chatbot & Context Injection

The floating chatbot at `/api/chat` reads from `data/profile.json` and embeds it directly into the Gemini model's system instructions:

```typescript
import { GoogleGenAI } from "@google/genai";
import profile from "@/data/profile.json";

export async function POST(request: Request) {
  const { message, history } = await request.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `
      You are Anand's portfolio chatbot assistant. Use the following profile to answer questions:
      EXPERIENCE: ${JSON.stringify(profile.experience)}
      PROJECTS: ${JSON.stringify(profile.projects)}
      SKILLS: ${JSON.stringify(profile.skills)}
      Ensure answers are accurate to this context.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [...history, { role: "user", parts: [{ text: message }] }],
      config: { systemInstruction }
    });

    return Response.json({ response: response.text });
  }
}
```

---

## 🛡️ Regex Keyword-Matching Fallback

If API keys are missing or rate limits occur, the API route falls back to a local keyword-matching algorithm:

```typescript
const fallbackQAs = [
  {
    keywords: ["contact", "email", "phone", "reach"],
    response: "You can reach Anand via email at anand@example.com or find his links on the header."
  },
  {
    keywords: ["education", "university", "degree"],
    response: "Anand holds a Bachelor's degree in Computer Science, detailing his academic milestones on the resume page."
  },
  {
    keywords: ["github", "code", "repos"],
    response: "You can check out Anand's repositories at github.com/anandmuraleedharan."
  }
];

export function getFallbackAnswer(message: string): string {
  const clean = message.toLowerCase();
  for (const qa of fallbackQAs) {
    if (qa.keywords.some(kw => clean.includes(kw))) {
      return qa.response;
    }
  }
  return "Anand's AI Chatbot is currently offline. Please try again shortly or review his Resume page!";
}
```

---

## 📄 SessionStorage CV Customizer

To enable database-free resume tailoring:
1. The visitor views the `/resume` page and toggles experience items, projects, or skill tags.
2. The UI writes these visibility states to browser `sessionStorage`:
   ```javascript
   sessionStorage.setItem("cv_tailor_settings", JSON.stringify(activeSettings));
   ```
3. When triggering the browser print shortcut (`Ctrl + P` or `Cmd + P`), custom CSS rules hide non-selected elements and remove the header, generating a tailored PDF with zero database overhead.

---

## 🚀 Local Development Commands

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   *(Running on `http://localhost:3000`)*
