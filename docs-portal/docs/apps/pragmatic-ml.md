# PragmaticML — The Anti-LLM Playbook for Principal ML Engineers

**PragmaticML** is a specialized, zero-cost Machine Learning study platform and architectural reference manual. It addresses "LLM Reflex Syndrome"—the industry tendency to deploy expensive, slow, non-deterministic 70B+ parameter generative LLMs for tasks that classical and targeted machine learning algorithms solve in 2 milliseconds with zero API costs.

---

## 💡 Architecture & Key Features

### 1. Config-Driven Modular Curriculum (`lib/curriculum/`)
* **Declarative Schema:** Every machine learning concept is declared via a strongly-typed TypeScript configuration (`types.ts`), decoupling mathematical theory, diagrams, and code recipes from page routing.
* **Automated Static Generation (SSG):** All concept routes (`/concepts/[slug]`) are pre-rendered at build time with 100% type safety and zero server-side rendering latency.

### 2. The 10 Principal ML Curriculum Pillars
1. **Graph & Network Algorithms:** PageRank (Random walk stationary distributions), Dijkstra's Algorithm (Greedy priority-queue pathfinding), A* Search (Heuristic guidance), and Bellman-Ford (Negative cycle arbitrage).
2. **Distance & Similarity Metrics:** Cosine Similarity & Angular Distance, Euclidean ($L_2$) & Manhattan ($L_1$), Levenshtein Dynamic Programming, Jaccard Index & Bitwise Hamming, and Mahalanobis Covariance Distance.
3. **Classical Supervised Learning:** Logistic Regression, Linear Regression with Ridge/Lasso/ElasticNet, Decision Trees (CART), Random Forests (Bagging & OOB), Gradient Boosted Trees (XGBoost/LightGBM), SVMs (RBF Kernel Trick), Naive Bayes, and k-NN.
4. **Unsupervised Learning & Dimensionality Reduction:** Principal Component Analysis (PCA & SVD), K-Means & K-Means++, DBSCAN (Density reachability & outlier rejection), and t-SNE & UMAP (Manifold learning).
5. **Recommenders & Collaborative Filtering:** User/Item Collaborative Filtering, Matrix Factorization (ALS / SVD), and Two-Tower Dual Encoders for billion-scale candidate generation.
6. **Classical NLP & Information Extraction:** GLiNER (Zero-shot bidirectional span NER), TF-IDF statistical weighting, Word2Vec (Skip-gram & CBOW), GloVe & FastText, and VADER rule-based sentiment.
7. **Search, Retrieval & Ranking:** Okapi BM25 (Term saturation & length normalization), Dense Vector Retrieval (Bi-encoders), Cross-Encoder Re-Ranking, Reciprocal Rank Fusion (Hybrid Search RRF), and HNSW (Hierarchical Navigable Small World).
8. **Deep Learning & Neural Architectures:** Convolutional Neural Networks (CNNs & ResNet skip connections), Multi-Layer Perceptrons & Backprop, RNN/LSTM/GRU, Transformers & Scaled Dot-Product Self-Attention, and Encoder vs Decoder vs Seq2Seq archetypes.
9. **Evaluation, Loss Functions & Calibration:** Loss Functions (Cross-Entropy, MSE, Focal Loss for extreme class imbalance), Classification Metrics (ROC-AUC vs PR-AUC & $F_1$), and Probability Calibration (Brier score).
10. **Production ML Systems & Optimization:** Model Quantization (FP16, INT8, INT4, PTQ vs QAT), Model Distillation & Pruning, Covariate Shift & Concept Drift Detection (PSI & KS-test), and Inference Latency vs Throughput Engineering.

### 3. Integrated Architectural & Helper Diagrams
* Every concept features a native dark-mode **Mermaid architectural diagram** or visual schema illustrating exact tensor transformations, memory layouts, and data pipelines.
* Formulations and loss objectives rendered via **KaTeX** LaTeX formatting.

### 4. Principal ML Engineer Interview Focus
* Each module includes real-world Principal ML system design interview questions, failure modes in production, and architectural tradeoffs.

---

## 🛠 Tech Stack & Port Mapping

* **Framework:** Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript 5
* **Diagram Engine:** Mermaid.js client-side rendering
* **Math Typesetting:** KaTeX (`katex.renderToString`)
* **Local Port Mapping:** `3008` (`http://localhost:3008`)
* **Production Domain:** `https://pragmatic-ml.anandmuraleedharan.com`

---

## 🚀 Deployment & Subdomain Binding

### 1. Vercel Deployment
```bash
cd apps/pragmatic-ml
npx vercel --prod --yes
```

### 2. Custom Subdomain Binding
```bash
npx vercel domains add pragmatic-ml.anandmuraleedharan.com pragmatic-ml
```

### 3. Spaceship DNS Configuration
Add a DNS CNAME record in Spaceship DNS:
* **Host:** `pragmatic-ml`
* **Type:** `CNAME`
* **Target:** `cname.vercel-dns.com`
