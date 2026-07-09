# The Daily Read

A stateless, serverless technology news compilation engine that aggregates morning headlines daily, digests summaries using Google Gemini, and emails the digest to Anand's inbox using Resend.

---

## 📁 Submodule Project Structure

Located at `apps/newsletter-generator`:
```
apps/newsletter-generator/
├── app/
│   ├── api/
│   │   └── cron/
│   │       └── route.ts   # Main scheduled cron route handler
│   ├── layout.tsx
│   └── page.tsx           # Subscriber opt-in visualizer page
├── lib/
│   ├── scraper.ts         # Stateless DuckDuckGo parser wrapper
│   └── templates.ts       # HTML news email template builder
├── package.json
└── tsconfig.json
```

---

## ⚙️ Cron Execution & Security

### Bearer Token Security Gate
To prevent unauthorized users from triggering heavy web crawls and invoking AI models, the serverless route is gated with cryptographically strong bearer tokens. The Next.js Edge route intercepts all incoming requests:

* **Endpoint**: `POST /api/cron`
* **Request Headers**:
  ```http
  Authorization: Bearer <CRON_SECRET>
  Content-Type: application/json
  ```
* **Validation Logic**:
  ```typescript
  import { NextRequest, NextResponse } from "next/server";

  export async function POST(request: NextRequest) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: "Unauthorized access blocked." }, 
        { status: 401 }
      );
    }
    // Proceed with news crawl...
  }
  ```

---

## 🌐 Scraper Proxy Mechanism

Since hosting servers do not maintain a permanent browser instance, the news crawler in `lib/scraper.ts` executes a lightweight scrape via client-side search proxies:
1. Formulates search query strings (e.g. `https://html.duckduckgo.com/html/?q=site:techcrunch.com+OR+site:wired.com+"AI"&s=d`).
2. Performs an HTTP GET request with a customized user-agent to bypass basic scrape protection.
3. Parses the HTML response, extracting news headers, links, and publication tags using regular expression selectors, avoiding heavy DOM parsing engines.

---

## 🧠 Gemini Fallback Cascade

The generator utilizes the official `@google/genai` SDK. To guarantee morning news delivery on developer free tiers, the pipeline executes a cascading retry loop if quota boundaries are breached:

```typescript
import { GoogleGenAI } from "@google/genai";

async function compileDigest(contentPayload: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const modelList = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];
  let lastError = "";

  for (const model of modelList) {
    try {
      console.log(`Compiling news via: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: `Compile a morning tech newsletter. Context:\n${contentPayload}`,
        config: {
          systemInstruction: "You are a professional tech newsletter editor. Output styled Markdown."
        }
      });
      if (response.text) return response.text;
    } catch (e: any) {
      lastError = e.message;
      console.warn(`Model ${model} failed: ${e.message}. Retrying fallback...`);
    }
  }
  throw new Error(`All models failed. Last error: ${lastError}`);
}
```

---

## ✉️ Resend Mailer Payload

Once the news digest is compiled, it is styled into a dark-themed HTML layout using the templates in `lib/templates.ts` and posted to the Resend API:

* **Endpoint**: `https://api.resend.com/emails`
* **JSON Body Parameters**:
  ```json
  {
    "from": "Anand's News <newsletter@anandmuraleedharan.com>",
    "to": ["anand@example.com"],
    "subject": "The Daily Read - Morning Tech Digest",
    "html": "<html>...styled email template...</html>"
  }
  ```

---

## 🚀 Local Development Commands

1. **Install Submodule Dependencies**:
   ```bash
   cd apps/newsletter-generator && npm install
   ```
2. **Start Dev Server Locally**:
   ```bash
   npm run dev
   ```
   *(Running on `http://localhost:3001`)*
3. **Manually Trigger Cron Execution**:
   ```bash
   curl -X POST http://localhost:3001/api/cron \
     -H "Authorization: Bearer your_local_secret"
   ```
