# PDFForge

A privacy-focused client-side PDF utility allowing splits, merges, page reorderings, and AI-driven document queries. PDFForge performs all file operations within the browser client sandbox.

---

## 📁 Submodule Project Structure

Located at `apps/pdfforge`:
```
apps/pdfforge/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts   # Secure API proxy routing to OpenRouter
│   ├── page.tsx           # PDF canvas dropzone & query interface
│   └── layout.tsx
├── public/
│   └── pdf.worker.min.mjs # Copied PDF.js web worker script
├── package.json
└── tsconfig.json
```

---

## 🔒 Sandboxed Document Compilations

To ensure data privacy, PDFForge does not upload documents to the cloud. PDF binaries are processed inside the browser memory using client-side JavaScript runtimes:

### 1. Document Reading & Rendering (`PDF.js`)
* Reads PDF binaries as an `ArrayBuffer` in browser memory.
* Instantiates Web Workers to parse page structure and render text layers directly onto HTML5 canvas elements.

### 2. Document Assembly (`PDF-Lib`)
* Splits and merges page structures in client memory:
  ```typescript
  import { PDFDocument } from "pdf-lib";

  async function splitPdf(pdfBuffer: ArrayBuffer, pageIndices: number[]): Promise<Uint8Array> {
    const srcDoc = await PDFDocument.load(pdfBuffer);
    const newDoc = await PDFDocument.create();
    
    // Copy selected pages
    const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
    copiedPages.forEach(page => newDoc.addPage(page));
    
    return await newDoc.save();
  }
  ```

---

## 🧠 Stateless Client RAG Indexing

PDFForge runs a lightweight Retrieval Augmented Generation (RAG) indexing mechanism entirely on the client side:
* **Text Chunking**: As PDF.js reads pages, it compiles their text layers into page-indexed arrays.
* **Context Assembly**: When a query is submitted, the client performs regex keyword searches on the extracted text arrays.
* **Payload Bundling**: Relevant page snippets are grouped together to construct the system prompt context, avoiding the need for an external vector database.

---

## 🛡️ Secure Edge Routing Proxy

To protect third-party API keys, requests are proxied via a Next.js serverless route, incorporating an automated failover loop:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { messages, systemInstruction } = await request.json();
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  
  // Cascade fallback model list
  const models = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemini-2.5-flash:free",
    "openrouter/free"
  ];
  let lastError = "";

  for (const model of models) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openrouterKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemInstruction },
            ...messages
          ],
          temperature: 0.3
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return NextResponse.json({ content: text, model });
        }
      }
    } catch (err: any) {
      lastError = err.message;
    }
  }

  return NextResponse.json({ error: `AI Cascade failed: ${lastError}` }, { status: 502 });
}
```

---

## 🚀 Local Development Commands

1. **Install Dependencies**:
   ```bash
   cd apps/pdfforge && npm install
   ```
2. **Copy Worker Assets**:
   ```bash
   npm run copy-assets
   ```
3. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   *(Running on `http://localhost:3004`)*
