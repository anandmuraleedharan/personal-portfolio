# Tech Stack & Cost Breakdown

A core engineering goal of this digital portfolio is running, scaling, and managing the entire monorepo workspace under a **$0.00/month** budget.

---

## 💰 The Zero-Cost Stack Catalog

The table below lists all tools, platforms, plans, and monthly costs of the project:

| Layer / Service | Tech Provider | Plan Tier | Monthly Cost | Free-Tier Limits |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Web Hosting** | Vercel | Personal / Hobby | `$0.00` | Bandwidth: 100GB/mo. |
| **Serverless Routes** | Vercel | Edge Functions | `$0.00` | Executions: 1M per month. |
| **Cron Dispatcher** | GitHub | Actions Run | `$0.00` | Time: 2,000 minutes/month. |
| **Database Logs** | Supabase | Free Tier | `$0.00` | Storage: 500MB, Row Limit: 50k. |
| **Analytics Storage** | Vercel Postgres (Neon) | Hobby Database | `$0.00` | Storage: 256MB, Compute: 60h/mo. |
| **2FA Passcode Gate** | Google Authenticator | TOTP Protocol | `$0.00` | Free mobile app generator. |
| **Email Gateway** | Resend | Developer Tier | `$0.00` | Quota: 3,000 emails/month (100/day limit). |
| **AI Models (Main)** | Google AI | Gemini Developer | `$0.00` | Rate Limit: 15 RPM (Requests Per Minute). |
| **AI Models (Failover)** | OpenRouter | Free Tier list | `$0.00` | Rate Limit: Varies by model (standard 10 RPM). |
| **PDF Compilation** | PDF-Lib / PDF.js | WebAssembly (client) | `$0.00` | Executed locally in the browser memory. |
| **Audio Synthesizer** | Web Audio API | Client Browser | `$0.00` | Executed locally using the Web Audio API. |
| **URL Base64 Deflate** | Browser Engine | Client CPU | `$0.00` | Executed locally in the browser thread. |

---

## 🔒 Free-Tier Protection Mechanisms

To ensure active user traffic never breaches provider quotas (which can cause service suspensions or billing card charges), the workspace implements three primary guardrails:

### 1. Database Circuit Breakers
To prevent log spam from exhausting free storage limits, the database adapters implement row-cap circuit breakers:
* **Analytics Logs**: Caps active visitor telemetry to **100 rows** via a serverless FIFO delete query after each write, maintaining a ~20KB storage footprint.
* **Trace Limits**: Caps active rows to **200 traces** in Aileron.
* **Feedback Limits**: Caps active rows to **50 corrections** in Aileron.
* **Purge Mechanism**: Runs a FIFO delete query after each insert to keep database storage under **1MB**:

```python
def enforce_circuit_breaker(self):
    conn = self.get_connection()
    cursor = conn.cursor()
    
    # 1. Cap traces to 200 rows max
    cursor.execute("SELECT COUNT(*) FROM aileron_traces")
    if cursor.fetchone()[0] > 200:
        cursor.execute("DELETE FROM aileron_traces WHERE id IN (SELECT id FROM aileron_traces ORDER BY created_at ASC LIMIT 10)")
        
    # 2. Cap feedback corrections to 50 rows max
    cursor.execute("SELECT COUNT(*) FROM aileron_feedback")
    if cursor.fetchone()[0] > 50:
        cursor.execute("DELETE FROM aileron_feedback WHERE id IN (SELECT id FROM aileron_feedback ORDER BY created_at ASC LIMIT 5)")
        
    conn.commit()
    conn.close()
```

### 2. Stateless URL Sharing
Instead of storing diff configurations or YAML/JSON formatting templates in a database, CodeForge compresses state client-side using `CompressionStream('deflate')` and writes the output directly to the URL hash fragment. This enables link sharing with **zero cloud storage costs**.

### 3. SessionStorage Caching
Toggles and adjustments for CV customization are saved directly to the browser's `sessionStorage`. When the visitor navigates to `/resume`, the print view reads these values directly from browser memory, avoiding database lookup fees.

### 4. Client-Side CPU Delegation
Heavy tasks (such as Myers diff alignments, PDF parsing/merging, Web Audio oscillator calculations, and text validations) are run locally in the browser thread, keeping Vercel Edge execution times under 100ms and avoiding serverless timeouts.
