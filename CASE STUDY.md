# Portfolio Case Study: Air-Gapped Federal AI Governance RAG Engine

## Hero Summary (For Project Card / Header)
**Title:** Zero-Trust Air-Gapped RAG Engine for Federal AI Governance  
**Subtitle:** Local Hybrid Retrieval-Augmented Generation (BM25 + Dense Vector) built with FastAPI, LangChain, ChromaDB, Ollama (Llama 3.2), and Next.js.  
**Live Architecture:** 10 Federal AI Frameworks (DoD, VA, OMB, NIST) | 392 Pages | 601 Self-Identifying Chunks | 0 External API Calls

---

## The Challenge: Zero-Trust AI in Regulated Environments
Defense, intelligence, and federal agencies face a critical dilemma: leaders need generative AI to audit complex regulatory frameworks and cross-agency compliance mandates, but transmitting sensitive or Controlled Unclassified Information (CUI) to commercial cloud APIs violates zero-trust data governance.Furthermore, standard "Naive RAG" tutorials fail when confronted with real-world federal documents:
* **Dense Vector Blindness on Alphanumeric Controls:** Standard vector embeddings fail to distinguish specific regulatory control numbers (such as `NIST AI 600-1` Action IDs `GV-1.1-001` or `MP-1.1-004`).
* **Multi-Column Table Destruction:** Default character splitters sever regulatory action IDs from their corresponding risk descriptions.
* **Single-Document Crowding:** When asked to compare two frameworks (e.g., *VA Trustworthy AI Framework* vs. *NIST AI 600-1*), verbose documents monopolize top retrieval slots and starve smaller documents from the LLM's context window.

---

## The Solution: Universal Hybrid RAG Architecture
I engineered a decoupled, full-stack RAG microservice running 100% offline on local Apple Silicon hardware:

1. **Self-Identifying Ingestion Pipeline (`ingest.py`):**
   * Batch-ingests multi-agency PDF repositories (`my_docs/`) using case-insensitive POSIX globbing and AES decryption support (`pypdf[crypto]`).
   * Applies natural boundary chunking (`2,500` characters with `400`-character sliding overlap) and stamps every chunk with `[Source Document: <filename> | Page: <n>]` prior to vectorization so every excerpt is self-attributing.
2. **Hybrid Ensemble Retrieval (`server.py`):**
   * Pairs **BM25 Lexical Keyword Search** (`rank_bm25`) with **ChromaDB Dense Vector Search** (`nomic-embed-text`) in a 50/50 `EnsembleRetriever` to capture both exact alphanumeric control codes and broad conceptual queries.
3. **Dynamic Multi-Document Balancer & Expanded Context Window:**
   * Configured local `llama3.2` with a `16,384`-token context window (`num_ctx=16384`) to prevent silent prompt truncation.
   * Built a custom **Round-Robin Source Diversifier** and dynamic filename token matcher that guarantees multi-document representation during cross-framework policy synthesis, alongside a live `[COMPLETE INDEXED DOCUMENT CATALOG]` header.
4. **Low-Latency Asynchronous Streaming UI:**
   * Streams generated tokens in real time from FastAPI (`StreamingResponse` + `.astream()`) to a Next.js frontend via HTTP `ReadableStream`.

---

## Key Technical Metrics & Configuration
* **Inference Model:** `llama3.2` (Local via Ollama, `temperature=0.1`, `num_ctx=16384`)
* **Embedding Model:** `nomic-embed-text` (768-dimensional dense embeddings)
* **Chunking Strategy:** `chunk_size=2500`, `chunk_overlap=400`, structural separators `["\n\n", "\n", " ", ""]`
* **Retrieval Architecture:** Hybrid `EnsembleRetriever` (50% BM25 Lexical + 50% Chroma HNSW Vector) + Round-Robin Multi-Source Diversifier
* **Indexed Corpus:** 10 Federal & Defense AI Policy Documents (DoD AI Adoption Strategy, DoD RAI Strategy, NIST AI RMF 1.0, NIST AI 600-1 GenAI Profile, NIST IR 8596, OMB M-25-21, VA AI Strategy, VA Trustworthy AI Framework, VA Compliance Plan, VA AI Workforce Blueprint)

---

## Production Evolution Roadmap (Day-2 Operations)
To scale this architecture from a single-node air-gapped workstation to an enterprise enclave deployment:
* **LangGraph Agentic Orchestration:** Transitioning linear LCEL chains into stateful LangGraph workflows featuring automated query decomposition and self-reflective retrieval grading.
* **OpenTelemetry (OTLP) Observability:** Instrumenting FastAPI and LangChain execution spans (`openinference-instrumentation-langchain`) to audit retrieval latency, token throughput, and source attribution in regulated environments.