# Aileron: SQL Prompt Flywheel

A self-improving prompt optimization and continuous feedback flywheel for Natural Language to SQL generation. Aileron connects a Next.js playground UI to a Python FastAPI backend running a secure SQLite sandbox and a DSPy prompt compiler.

---

## 📁 Submodule Project Structure

Located at `apps/aileron`:
```
apps/aileron/
├── backend/
│   ├── run.sh             # Startup script (venv activation & uvicorn boot)
│   ├── requirements.txt   # Python dependency manifest
│   ├── client.py          # OpenRouter client wrappers
│   ├── optimizer.py       # DSPy prompt mutation loop
│   ├── sandbox.py         # Read-only SQLite executor
│   ├── storage.py         # PostgreSQL / SQLite DB adapter & circuit breaker
│   └── main.py            # FastAPI route definitions
├── src/                   # Next.js frontend source code
├── package.json
└── tsconfig.json
```

---

## 🗄️ SQLite Sandbox Schema

The Python execution backend in `backend/sandbox.py` executes generated SQL queries against a local, read-only SQLite database. It is pre-populated with transactional business tables:

### 1. `mock_customers`
* `id` (INTEGER, Primary Key)
* `name` (TEXT)
* `country` (TEXT)
* `created_at` (TIMESTAMP)

### 2. `mock_orders`
* `id` (INTEGER, Primary Key)
* `customer_id` (INTEGER, Foreign Key referencing `mock_customers.id`)
* `order_date` (DATE)
* `total_amount` (DECIMAL)

### 3. `mock_order_items`
* `id` (INTEGER, Primary Key)
* `order_id` (INTEGER, Foreign Key referencing `mock_orders.id`)
* `product_name` (TEXT)
* `quantity` (INTEGER)
* `price` (DECIMAL)

---

## 🔄 Germany Query Loop (Mistake Demo)

To demonstrate prompt optimization during recruitment reviews, the generator uses a deterministic mistake scenario for queries about "Germany":

### Prompt Version v1 (Buggy generation)
When the user requests *"List all customers from Germany"*, the engine generates:
```sql
SELECT * FROM mock_customers; -- Demo Error: Missing Germany filter!
```
The sandbox executes this and returns *all* customers (including USA, Canada, Germany), showing the error.

### Feedback Loop
1. The user clicks **Thumbs Down** on the playground.
2. Submits the correction: `SELECT * FROM mock_customers WHERE country = 'Germany'`.
3. The optimizer compiles Prompt Version v2, adding this correction as a few-shot exemplar.

### Prompt Version v2 (Corrected generation)
Running the same request with Version v2 yields:
```sql
SELECT * FROM mock_customers WHERE country = 'Germany';
```
The sandbox now returns only German customers.

---

## 🔌 FastAPI Endpoint Specifications

Running on port `8005`:

### 1. `POST /execute`
Translates query to SQL and executes it.
* **Request**: `{ "query": "Customers in Germany", "version": "v1" }`
* **Response**: `{ "sql": "...", "columns": [...], "rows": [...], "latency_ms": 120 }`

### 2. `POST /feedback`
Logs thumbs up/down and SQL corrections.
* **Request**: `{ "query": "...", "generated_sql": "...", "corrected_sql": "...", "is_positive": false }`
* **Response**: `{ "status": "Feedback logged successfully." }`

### 3. `POST /optimize`
Runs the DSPy compiler to compile Prompt Version v2.
* **Response**: `{ "version": "v2", "accuracy_score": 0.95 }`

---

## 🚀 Local Development Commands

1. **Start Backend Server**:
   ```bash
   cd apps/aileron/backend && bash run.sh
   ```
   *(Running on `http://localhost:8005`)*
2. **Start Frontend Server**:
   ```bash
   cd apps/aileron && npm run dev
   ```
   *(Running on `http://localhost:3005`)*
