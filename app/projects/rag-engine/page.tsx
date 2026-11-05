"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SAMPLE_PROMPTS = [
  "Provide a list of all the documents that can be referenced in this database.",
  "What's the Suggested Action for GV-1.1-001?",
  "Under NIST AI 600-1, what are the GAI Risks under MP-1.1-004?",
  "What are the similarities and differences between the VA Trustworthy AI Framework and NIST AI 600-1?",
];

const ITERATION_PHASES = [
  {
    phase: "Phase 1: CLI Proof-of-Concept",
    config: "Single PDF (PyPDFLoader), chunk_size=1000, k=3",
    failure:
      "Limited to a single static file in terminal; small k=3 window missed broader document context.",
    solution:
      "Decoupled batch ETL (ingest.py) from FastAPI transport (server.py) inside an isolated Python venv.",
  },
  {
    phase: "Phase 2: Full-Stack Streaming",
    config: "PyPDFDirectoryLoader, k=15, FastAPI StreamingResponse",
    failure:
      "React Strict Mode duplicated streamed tokens; AES-encrypted PDFs crashed pypdf; uppercase .PDF files skipped.",
    solution:
      "Refactored stream accumulator state; added pypdf[crypto]; enforced case-insensitive glob (**/*.[pP][dD][fF]).",
  },
  {
    phase: "Phase 3: Hybrid Lexical + Vector",
    config: "chunk_size=2500, overlap=400, BM25 + Chroma Ensemble",
    failure:
      "Dense embeddings missed alphanumeric control IDs (GV-1.1-001, MP-1.1-004) and severed multi-column table rows.",
    solution:
      "Paired Rank-BM25 lexical search (50%) with Chroma dense embeddings (50%) and natural paragraph separators.",
  },
  {
    phase: "Phase 4: Universal Multi-Doc Synthesis",
    config: "Self-identifying headers, num_ctx=16384, Round-Robin Balancer",
    failure:
      "Single-document crowding hid NIST AI 600-1 during VA comparisons; Ollama truncated context at 2,048 tokens.",
    solution:
      "Stamped [Source Document | Page] into chunks at ingestion; built dynamic source balancer & live Catalog Header.",
  },
];

export default function RagEnginePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Zero-Trust Air-Gapped RAG Engine initialized. Connected locally to Ollama (Llama 3.2 + Nomic-Embed-Text) and Hybrid BM25/ChromaDB across 10 federal AI governance frameworks. Select a test query below or enter a custom prompt.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "assistant", content: "" },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // Replace assistant content with accumulated snapshot to prevent React Strict Mode duplication
        const snapshot = accumulatedText;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: snapshot,
          };
          return updated;
        });
      }
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content:
            "[Connection Notice: Local FastAPI backend not detected on port 8000. Because this engine runs 100% air-gapped on local Apple Silicon without cloud APIs, live interactive queries require the local Uvicorn + Ollama runtime.]",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(input);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-14">
        {/* 1. HERO HEADER */}
        <header className="space-y-4 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Zero-Trust Federal AI Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Air-Gapped Hybrid RAG Document Intelligence Engine
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-3xl leading-relaxed">
            A fully offline Retrieval-Augmented Generation pipeline engineered for classified and CUI/IL5-representative environments. Synthesizes 10 DoD, VA, OMB, and NIST AI regulatory frameworks (~400 pages) locally using a Hybrid Rank-BM25 + Dense Vector Ensemble Retriever.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              "FastAPI",
              "LangChain (LCEL)",
              "ChromaDB",
              "Rank-BM25 Hybrid Search",
              "Ollama (Llama 3.2)",
              "nomic-embed-text",
              "Next.js App Router",
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-mono bg-slate-900 border border-slate-800 rounded-md text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* 2. INTERACTIVE TERMINAL */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Interactive Query Console
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Endpoint: http://localhost:8000/api/chat
            </span>
          </div>

          {/* Quick-Test Prompt Pills */}
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((promptText, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendQuery(promptText)}
                disabled={isLoading}
                className="text-xs text-left px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-300 transition disabled:opacity-50"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Chat Container */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 shadow-2xl overflow-hidden flex flex-col h-[500px]">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-semibold text-sm text-slate-200">
                  Llama 3.2 Air-Gapped Engine (16K Context | Hybrid BM25 + Vector)
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                10 Indexed Federal PDFs
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[82%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-emerald-950/70 border border-emerald-700/40 text-emerald-100"
                        : "bg-slate-800/80 border border-slate-700/60 text-slate-200"
                    }`}
                  >
                    {msg.content || (
                      <span className="text-slate-400 animate-pulse">
                        Retrieving hybrid chunks & synthesizing response...
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Query NIST AI 600-1, VA Trustworthy AI, DoD RAI Strategy, or OMB M-25-21..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-medium transition"
              >
                {isLoading ? "Streaming..." : "Send"}
              </button>
            </form>
          </div>
        </section>

        {/* 3. ARCHITECTURAL HIGHLIGHTS GRID */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white">
            Core Engineering & Retrieval Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-emerald-400 text-xs font-mono uppercase">
                01 / Lexical + Semantic Fusion
              </div>
              <h3 className="text-lg font-semibold text-white">
                Hybrid BM25 + Chroma Vector Ensemble
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Standard dense embeddings fail on exact alphanumeric control IDs such as{" "}
                <code className="text-slate-200">GV-1.1-001</code> and{" "}
                <code className="text-slate-200">MP-1.1-004</code>. Pairing a 50% Rank-BM25 lexical retriever with a 50% Nomic dense vector retriever guarantees exact regulatory code recall alongside conceptual search.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-emerald-400 text-xs font-mono uppercase">
                02 / Cross-Framework Synthesis
              </div>
              <h3 className="text-lg font-semibold text-white">
                Round-Robin Multi-Document Diversification
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Prevents large PDFs from monopolizing top retrieval slots during comparative queries (e.g., comparing the VA Trustworthy AI Framework against NIST AI 600-1). Dynamically matches query tokens against indexed filenames and interleaves chunks across sources.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-emerald-400 text-xs font-mono uppercase">
                03 / Self-Identifying Ingestion
              </div>
              <h3 className="text-lg font-semibold text-white">
                Context-Stamped Chunking & Live Catalog Header
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every 2,500-character chunk is stamped with{" "}
                <code className="text-slate-200">[Source Document | Page]</code> prior to embedding, and a live global document manifest is prepended to each prompt so the LLM has complete visibility into all 10 indexed PDFs.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-emerald-400 text-xs font-mono uppercase">
                04 / Context Window Optimization
              </div>
              <h3 className="text-lg font-semibold text-white">
                16K Expanded Context & Zero-Trust Guardrails
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Overrides Ollama&apos;s default 2,048-token truncation limit to{" "}
                <code className="text-slate-200">num_ctx=16384</code> at{" "}
                <code className="text-slate-200">temperature=0.1</code>, ensuring multi-column regulatory tables and 16-chunk hybrid payloads are evaluated without silent context loss.
              </p>
            </div>
          </div>
        </section>

        {/* 4. ITERATIVE PROGRESSION TABLE */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Iterative Engineering Progression (v1 to v4)
          </h2>
          <p className="text-sm text-slate-400">
            Documented progression from an initial Naive RAG prototype to a fault-tolerant, multi-document hybrid engine.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-300">
                  <th className="p-4 font-semibold">Iteration Phase</th>
                  <th className="p-4 font-semibold">Baseline Config</th>
                  <th className="p-4 font-semibold">Failure Mode Discovered</th>
                  <th className="p-4 font-semibold">Architectural Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300">
                {ITERATION_PHASES.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="p-4 font-medium text-emerald-400 whitespace-nowrap">
                      {item.phase}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-400">
                      {item.config}
                    </td>
                    <td className="p-4 text-slate-400">{item.failure}</td>
                    <td className="p-4 text-slate-200">{item.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. INDEXED CORPUS MANIFEST */}
        <section className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Indexed Federal AI Governance Corpus (my_docs/)
              </h2>
              <p className="text-xs text-slate-400">
                392 Pages | 601 Self-Identifying Chunks | Case-Insensitive & AES-Decrypted Ingestion
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-emerald-400">
              10 / 10 Documents Active
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300">
            {[
              "1. DoD AI Adoption Strategy.PDF",
              "2. DoD RAI STRATEGY & IMPLEMENTATION PATHWAY.PDF",
              "3. NIST AI 600-1.pdf (Generative AI Profile)",
              "4. NIST_AI_RMF.pdf (AI Risk Management Framework 1.0)",
              "5. NIST.IR.8596.iprd.pdf (Cybersecurity & AI Profile)",
              "6. OMB M-25-21.pdf (Federal AI Governance Directive)",
              "7. VA AI Workforce Blueprint 2024.pdf",
              "8. VA Compliance Plan for OMB M-25-21.pdf",
              "9. VA Strategy for AI.pdf",
              "10. VA Trustworthy AI Framework.pdf",
            ].map((docName) => (
              <div
                key={docName}
                className="px-3 py-2 rounded bg-slate-950/70 border border-slate-800/80"
              >
                {docName}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}