# CodeForge

A stateless developer workspace offering code diff comparison engines, text formatters/validators, and cron builders. CodeForge runs entirely client-side, using GZIP deflate streams for database-free sharing links.

---

## 📁 Submodule Project Structure

Located at `apps/codeforge`:
```
apps/codeforge/
├── app/
│   ├── layout.tsx
│   └── page.tsx           # Sidebar, workspace state, & bridge routing
├── components/
│   ├── cron-tool.tsx      # Bidirectional cron selector grid
│   ├── diff-viewer.tsx    # Split comparison editor and Myers view
│   └── formatter-tool.tsx # Format checkers & cross-tool links
├── lib/
│   ├── cron-utils.ts      # Cron expression parser & humanizer
│   ├── diff-utils.ts      # Myers diff alignment logic
│   ├── formatter-utils.ts # YAML, JSON, XML, HTML validators
│   └── share-utils.ts     # GZIP Deflate stream URL compression
├── package.json
└── tsconfig.json
```

---

## 📊 Myers Diff Engine & Calculations

The comparison pane in `lib/diff-utils.ts` aligns original and modified text arrays client-side using a Myers diff algorithm:
* **Dynamic Programming Matrix**: Tracks edit scripts from starting coordinate \((0,0)\) to target coordinate \((N,M)\) where \(N\) is the length of original text and \(M\) is the length of modified text.
* **Greedy Search**: Matches diagonal paths (character equivalence) while calculating edit paths.
* **Complexity**: \(O((N+M)D)\) time, where \(D\) is the length of the shortest edit script (number of insertions/deletions).
* **Chunking**: Splits documents above 50,000 characters into segments to prevent blocking the single-threaded browser UI loop.

---

## 🔗 URL Compression Pipeline

To support sharing multi-file comparison configurations without backend storage costs, CodeForge encodes state into the URL hash via a compression stream:

```typescript
// GZIP Deflate Stream Serialization
export async function compressState(oldText: string, newText: string): Promise<string> {
  const payload = JSON.stringify({ o: oldText, n: newText });
  const bytes = new TextEncoder().encode(payload);

  // Pipe bytes through browser-native deflate stream
  const byteStream = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    }
  });

  const compressionStream = byteStream.pipeThrough(new CompressionStream('deflate'));
  const response = new Response(compressionStream);
  const compressedBuffer = await response.arrayBuffer();

  // Convert buffer to base64
  const compressedBytes = new Uint8Array(compressedBuffer);
  let binaryString = '';
  for (let i = 0; i < compressedBytes.length; i++) {
    binaryString += String.fromCharCode(compressedBytes[i]);
  }
  const base64 = btoa(binaryString);
  
  // URL safe replacements
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
```

---

## ⚙️ Text Formatter Bridge & Validators

`lib/formatter-utils.ts` compiles formatters and validators running on the client browser thread:

### 1. JSON / XML Parser
Uses browser-native `DOMParser` and `JSON.parse` commands:
* Catches syntax exceptions.
* Extracts exact line numbers, columns, and error descriptions.

### 2. Cross-Tool Bridge
If formatting succeeds, users can click **"Send to Diff Original"** or **"Send to Diff Modified"**. The tool uses React state context to load the formatted output directly into the CodeDiff view, bypassing copy-paste steps.

---

## 🚀 Local Development Commands

1. **Install Dependencies**:
   ```bash
   cd apps/codeforge && npm install
   ```
2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   *(Running on `http://localhost:3003`)*
