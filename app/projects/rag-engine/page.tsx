"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

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

const RAG_API_URL =
  process.env.NEXT_PUBLIC_RAG_API_URL || "http://localhost:8000/api/chat";

export default function RagEnginePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Zero-Trust Air-Gapped RAG Engine initialized. Connected locally to Ollama (Llama 3.2 + nomic-embed-text) and Hybrid BM25/ChromaDB across 10 federal AI governance frameworks. Select a test query below or enter a custom prompt.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Only auto-scroll inside the chat container after user interaction begins
  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
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
      const response = await fetch(RAG_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

        // Overwrite final message index using local accumulator to prevent React Strict Mode duplication
        const snapshot = fullResponse;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: snapshot,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content:
            "[Connection Notice: Local FastAPI backend not detected on port 8000. Because this engine runs 100% air-gapped on local Apple Silicon without cloud APIs to enforce zero-trust CUI/IL5 data privacy, live interactive queries require the local Uvicorn + Ollama runtime.]",
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
    <main className="min-h-screen bg-slate-950 px-6 py-24 text-slate-50 sm:px-12">
      <div className="mx-auto max-w-5xl">
        
        {/* Top Back Navigation (Aligned with Clinical AI Agent & Projects Hub) */}
        <Link
          href="/projects"
          className="group mb-8 inline-flex items-center text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span className="mr-2 transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Back to Projects Hub
        </Link>

        {/* 1. HERO HEADER & STATUS BADGES */}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-800/50 bg-emerald-950/80 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Zero-Trust Federal AI Architecture
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
            Hybrid BM25 + Dense Vector
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
            CUI / IL5 Air-Gapped Design
          </span>
        </div>

        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl">
          Air-Gapped Hybrid RAG Document Intelligence Engine
        </h1>
        <p className="mt-4 text-xl leading-relaxed text-slate-400">
          A fully offline Retrieval-Augmented Generation pipeline engineered for classified and CUI/IL5-representative environments. Synthesizes 10 DoD, VA, OMB, and NIST AI regulatory frameworks (~400 pages) locally using a Hybrid Rank-BM25 + Dense Vector Ensemble Retriever.
        </p>

        {/* Tech Stack Pills */}
        <div className="mt-6 flex flex-wrap gap-2">
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
              className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1 font-mono text-xs text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Hero Action Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="https://github.com/nfranklin77/airgapped-rag-pipeline"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm hover:bg-emerald-400 transition-colors"
          >
            View GitHub Repository & Codebase →
          </a>
        </div>

        {/* 2. INTERACTIVE QUERY CONSOLE */}
        <h2 className="mt-16 border-b border-slate-800 pb-2 text-2xl font-bold text-slate-200">
          Interactive Query Console
        </h2>

        <div className="mt-6 space-y-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-400">
              Select a pre-calibrated federal compliance prompt below or enter a custom query:
            </p>
            <span className="font-mono text-xs text-slate-500">
              Endpoint: {RAG_API_URL}
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
                className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-left text-xs text-slate-300 transition hover:border-emerald-500/50 hover:bg-slate-800/70 hover:text-emerald-300 disabled:opacity-50"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Chat Container */}
          <div className="flex h-[500px] flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-900/60 shadow-2xl">
            {/* Console Top Bar with Pulsing Emerald Indicator */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-semibold text-slate-200">
                  Llama 3.2 Air-Gapped Engine (16K Context | Hybrid BM25 + Vector)
                </span>
              </div>
              <span className="font-mono text-xs text-emerald-400/90">
                10 Indexed Federal PDFs
              </span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "border border-emerald-700/40 bg-emerald-950/70 text-emerald-100"
                        : "border border-slate-700/60 bg-slate-800/80 text-slate-200"
                    }`}
                  >
                    {msg.content ? (
                      <div className="flex items-start gap-2.5">
                        {msg.role === "assistant" && i === 0 && (
                          <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                        <span>{msg.content}</span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-2.5 text-slate-300 animate-pulse">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        Retrieving hybrid chunks & synthesizing response...
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 border-t border-slate-800 bg-slate-900 p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Query NIST AI 600-1, VA Trustworthy AI, DoD RAI Strategy, or OMB M-25-21..."
                className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500"
              >
                {isLoading ? "Streaming..." : "Send"}
              </button>
            </form>
          </div>
        </div>

        {/* 3. ARCHITECTURAL HIGHLIGHTS GRID */}
        <h2 className="mt-16 border-b border-slate-800 pb-2 text-2xl font-bold text-slate-200">
          Core Engineering & Retrieval Architecture
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-400">
              Layer 01 // Lexical + Semantic Fusion
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-200">
              Hybrid BM25 + Chroma Vector Ensemble
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Standard dense embeddings fail on exact alphanumeric control IDs such as{" "}
              <code className="text-emerald-300">GV-1.1-001</code> and{" "}
              <code className="text-emerald-300">MP-1.1-004</code>. Pairing a 50% Rank-BM25 lexical retriever with a 50% Nomic dense vector retriever guarantees exact regulatory code recall alongside conceptual search.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-400">
              Layer 02 // Cross-Framework Synthesis
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-200">
              Round-Robin Multi-Document Diversification
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Prevents large PDFs from monopolizing top retrieval slots during comparative queries (e.g., comparing the VA Trustworthy AI Framework against NIST AI 600-1). Dynamically matches query tokens against indexed filenames and interleaves chunks across sources.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-400">
              Layer 03 // Self-Identifying Ingestion
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-200">
              Context-Stamped Chunking & Live Catalog Header
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Every 2,500-character chunk is stamped with{" "}
              <code className="text-slate-300">[Source Document | Page]</code> prior to embedding, and a live global document manifest is prepended to each prompt so the LLM has complete visibility into all 10 indexed PDFs.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-400">
              Layer 04 // Context Window Optimization
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-200">
              16K Expanded Context & Zero-Trust Guardrails
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Overrides Ollama&apos;s default 2,048-token truncation limit to{" "}
              <code className="text-emerald-300">num_ctx=16384</code> at{" "}
              <code className="text-slate-300">temperature=0.1</code>, ensuring multi-column regulatory tables and 16-chunk hybrid payloads are evaluated without silent context loss.
            </p>
          </div>
        </div>

        {/* 4. ITERATIVE PROGRESSION TABLE */}
        <h2 className="mt-16 border-b border-slate-800 pb-2 text-2xl font-bold text-slate-200">
          Iterative Engineering Progression (v1 to v4)
        </h2>
        <p className="mt-4 text-sm text-slate-400">
          Documented progression from an initial Naive RAG prototype to a fault-tolerant, multi-document hybrid engine.
        </p>
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/40">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-200">
                <th className="p-4 font-semibold">Iteration Phase</th>
                <th className="p-4 font-semibold">Baseline Config</th>
                <th className="p-4 font-semibold">Failure Mode Discovered</th>
                <th className="p-4 font-semibold">Architectural Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300">
              {ITERATION_PHASES.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="whitespace-nowrap p-4 font-medium text-emerald-400">
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

        {/* 5. INDEXED CORPUS MANIFEST */}
        <h2 className="mt-16 border-b border-slate-800 pb-2 text-2xl font-bold text-slate-200">
          Indexed Federal AI Governance Corpus (my_docs/)
        </h2>
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/40 p-6">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <p className="text-xs text-slate-400">
              392 Pages • 601 Self-Identifying Chunks • Case-Insensitive & AES-Decrypted Ingestion
            </p>
            <span className="inline-flex items-center gap-1.5 rounded bg-emerald-950/80 border border-emerald-800/50 px-2.5 py-1 font-mono text-xs text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              10 / 10 Documents Active
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 font-mono text-xs text-slate-300 sm:grid-cols-2">
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
                className="rounded border border-slate-800/80 bg-slate-950/70 px-3 py-2"
              >
                {docName}
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}