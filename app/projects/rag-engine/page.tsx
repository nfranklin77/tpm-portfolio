"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ArchNode {
  id: string;
  title: string;
  subtitle: string;
  localStack: string;
  prodEquivalent: string;
  narrative: string;
  technicalDeepDive: string;
  shape?: "rect" | "cylinder" | "diamond";
}

interface ArchColumn {
  stepIndex: number;
  id: string;
  columnNumber: string;
  title: string;
  boundaryBadge: string;
  focusDomain: string;
  colorTheme: "blue" | "emerald" | "amber" | "purple";
  stepOverview: string;
  nodes: ArchNode[];
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

const WALKTHROUGH_STEPS = [
  {
    step: 0,
    label: "Step 0: Executive Frame",
    shortTitle: "Zero-Trust Architecture & Cloud Equivalence",
    domain: "Enterprise Security & Clinical AI Alignment",
    summary:
      "Out of respect for federal security rules, this architecture models a clean-room, air-gapped Python RAG and multi-agent pipeline engineered locally, with every component mapped directly to its federal cloud production equivalent across AWS GovCloud, Azure Government, and Databricks. The system is built around one core mission: giving clinicians and analysts fast, cited search and summarization across fragmented records without leaking PHI/CUI or hallucinating facts.",
    callout:
      "Architectural Separation of Concerns: Columns 1 & 4 govern the ATO/HIPAA compliance boundary, EHR interoperability, OMB M-25-21 auditability, and clinician trust. Columns 2 & 3 govern Python data hygiene, hybrid lexical/vector retrieval, LangGraph state orchestration, and deterministic grounding controls.",
  },
  {
    step: 1,
    label: "Step 1: Data Sources (Col 1)",
    shortTitle: "1. Data Sources & Ingestion (ATO / HIPAA Boundary)",
    domain: "Compliance Boundary & Multi-Modal Ingestion",
    summary:
      "Starting on the far left inside the ATO and HIPAA boundary, incoming data is segmented into the three distinct streams encountered in federal healthcare: (1) Unstructured Policy & Compliance PDFs, (2) Structured Clinical APIs via HL7/FHIR, and (3) Unstructured Community Care Faxes & Health Information Exchange (HIE) records.",
    callout:
      "Why Separate FHIR from Faxes? Structured FHIR payloads (active medications, lab values) carry explicit schema timestamps, whereas scanned multi-page faxes require layout-aware parsing or multimodal LLM extraction so clinical lab tables are never sliced mid-row.",
  },
  {
    step: 2,
    label: "Step 2: Hybrid Search (Col 2)",
    shortTitle: "2. Processing & Hybrid Vector Search",
    domain: "Data Hygiene, Tokenization & Ensemble Retrieval",
    summary:
      "Once documents cross into the Processing & Hybrid Search layer, strict data hygiene runs before anything touches an embedding model. Text is sanitized, tagged with explicit provenance metadata, embedded locally, and indexed into a Hybrid Vector + Lexical store so both conceptual queries and exact medical/regulatory codes are retrieved.",
    callout:
      "Why Metadata Tagging at Ingestion Matters: In longitudinal EHR records, a historical medication list looks semantically identical to a current medication list. Stamping Document ID, Source System, and Timestamp at chunking allows the retriever to weight and filter by recency.",
  },
  {
    step: 3,
    label: "Step 3: Agentic RAG (Col 3)",
    shortTitle: "3. Agentic RAG & Guardrail Orchestration",
    domain: "LangGraph ReAct Loop & Deterministic Critic",
    summary:
      "Instead of firing a single naive prompt at an LLM, runtime execution is governed by a LangGraph ReAct state loop. The orchestrator plans retrieval via MCP tool calls, routes verified context to the LLM inference engine at low temperature, and passes the draft through a deterministic Trustworthy AI Critic Node before release.",
    callout:
      "Deterministic Hallucination Prevention: The Critic Node enforces OMB M-25-21 and Trustworthy AI checks—verifying that every clinical claim maps to a retrieved chunk ID and returning 'Insufficient source data in record' whenever similarity scores fall below threshold.",
  },
  {
    step: 4,
    label: "Step 4: Clinical Delivery (Col 4)",
    shortTitle: "4. Clinical Delivery, HITL Gate & ATO Audit Log",
    domain: "Human-in-the-Loop Verification & Telemetry",
    summary:
      "Once a summary passes the grounding check, it enters the Clinical Delivery & Auditability block. In healthcare and national security, AI is decision-support, never the decision-maker. Outputs pass a mandatory Clinician Human-in-the-Loop (HITL) Gate before rendering in the FastAPI/Next.js UI alongside clickable source citations.",
    callout:
      "Continuous ATO Observability: Three dashed telemetry streams—Retrieval Traces, Agent Traces, and User Feedback—feed into LangSmith locally (or Azure Monitor / CloudWatch in production), logging every prompt, chunk ID, token count, and latency metric for ISSO auditability.",
  },
  {
    step: 5,
    label: "Step 5: Deep-Dive Synthesis",
    shortTitle: "End-to-End Traceability & Architectural Trade-Offs",
    domain: "Full Pipeline Review",
    summary:
      "From raw clinical and regulatory inputs on the far left to a cited, auditable summary on the clinician's screen on the far right, every stage balances retrieval recall, zero-trust data isolation, and deterministic safety verification.",
    callout:
      "Interactive Exploration: Click any individual node inside Columns 1 through 4 below to inspect its exact Local Prototype implementation, Federal Production Cloud equivalent, and engineering trade-off notes.",
  },
];

const ARCHITECTURE_COLUMNS: ArchColumn[] = [
  {
    stepIndex: 1,
    id: "col-1",
    columnNumber: "Column 01",
    title: "Data Sources & Ingestion",
    boundaryBadge: "ATO / HIPAA Boundary",
    focusDomain: "Governance, EHR APIs & Multi-Modal Intake",
    colorTheme: "blue",
    stepOverview:
      "Segments incoming federal healthcare data into three distinct ingestion streams inside the accredited security boundary.",
    nodes: [
      {
        id: "c1-n1",
        title: "Policy & Compliance Docs",
        subtitle: "Trustworthy AI, NIST AI RMF, NIST 800-53, OMB M-25-21",
        localStack: "Local PDF Corpus (my_docs/) via PyPDFDirectoryLoader",
        prodEquivalent: "AWS GovCloud S3 / Azure Gov Blob Regulatory Repositories",
        narrative:
          "Ingests unstructured federal governance and clinical policy PDFs (such as NIST AI 600-1, NIST AI RMF, and agency Trustworthy AI guidelines) to ground compliance and operational queries.",
        technicalDeepDive:
          "Enforces case-insensitive file discovery and AES decryption (pypdf[crypto]) to handle protected federal PDF distributions without pipeline crashes.",
      },
      {
        id: "c1-n2",
        title: "Clinical APIs (HL7 / FHIR)",
        subtitle: "Enterprise EHR & Legacy Clinical Repositories",
        localStack: "Simulated SQLite EHR & FHIR JSON Payloads",
        prodEquivalent: "Oracle Health (MHS GENESIS) & VistA/CPRS HL7/FHIR APIs",
        narrative:
          "Ingests structured clinical telemetry—labs, active medications, allergies, and encounter notes—across standardized HL7 and FHIR interfaces.",
        technicalDeepDive:
          "Structured FHIR resources preserve explicit clinical timestamps and LOINC/RxNorm codes, preventing ambiguity between historical and active patient states.",
      },
      {
        id: "c1-n3",
        title: "Unstructured & Faxed Records",
        subtitle: "Community Care Faxes, Multi-Page TIFF/PDF & HIE",
        localStack: "Layout-Aware PDF/Text Extraction Pipeline",
        prodEquivalent: "Multimodal LLM Intake (AWS Bedrock Claude in GovCloud)",
        narrative:
          "Addresses the messiest bottleneck in clinical search: incoming outside care faxes and Health Information Exchange (HIE) PDFs. Replaces brittle legacy OCR with direct multimodal LLM document extraction.",
        technicalDeepDive:
          "Passing multi-page TIFFs/PDFs into a GovCloud-accredited multimodal model extracts structured patient metadata and preserves complex table rows intact.",
      },
    ],
  },
  {
    stepIndex: 2,
    id: "col-2",
    columnNumber: "Column 02",
    title: "Processing & Hybrid Search",
    boundaryBadge: "Data Hygiene & Indexing",
    focusDomain: "Sanitization, Embeddings & Ensemble Retrieval",
    colorTheme: "emerald",
    stepOverview:
      "Sanitizes raw text, attaches provenance metadata, and indexes chunks into a Hybrid Lexical + Dense Vector store.",
    nodes: [
      {
        id: "c2-n1",
        title: "Python Ingestion & Chunking",
        subtitle: "LangChain, pandas, cl100k_base, PII Redaction",
        localStack: "RecursiveCharacterTextSplitter (2500 chars, 400 overlap)",
        prodEquivalent: "Databricks / Azure Data Factory Sanitization Pipelines",
        narrative:
          "Strips formatting noise, masks unnecessary PII/PHI, and stamps strict provenance metadata—[Document ID | Source System | Page | Timestamp]—directly into each chunk before splitting with semantic overlap.",
        technicalDeepDive:
          "Stamping headers directly into chunk text guarantees that even if metadata dicts are stripped downstream, the LLM always sees the exact source document and timestamp.",
      },
      {
        id: "c2-n2",
        title: "Embedding Layer",
        subtitle: "Zero-Trust Dense Vector Generation",
        localStack: "Ollama Local Embeddings (nomic-embed-text)",
        prodEquivalent: "Azure OpenAI text-embedding-3 / AWS Bedrock Embeddings",
        narrative:
          "Generates high-dimensional semantic representations locally so zero data leaves the air-gapped machine during prototyping, swapping cleanly to accredited cloud embedding endpoints in production.",
        technicalDeepDive:
          "Decouples the embedding interface via LangChain abstractions so switching from local nomic-embed-text to Azure Gov OpenAI requires zero changes to chunking logic.",
      },
      {
        id: "c2-n3",
        title: "Hybrid Vector Store",
        subtitle: "k=3 to 16 | Cosine Similarity + Rank-BM25",
        localStack: "ChromaDB (50%) + Rank-BM25 Lexical Ensemble (50%)",
        prodEquivalent: "Azure AI Search / Databricks Vector Search (Hybrid)",
        shape: "cylinder",
        narrative:
          "Pairs dense vector similarity with sparse BM25 keyword search. Pure semantic embeddings often gloss over exact ICD-10-CM codes, CPT codes, NIST control IDs (GV-1.1-001), or specific drug dosages.",
        technicalDeepDive:
          "Includes a Round-Robin Multi-Document Balancer so a single 150-page PDF cannot monopolize top-K retrieval slots during cross-framework comparison queries.",
      },
    ],
  },
  {
    stepIndex: 3,
    id: "col-3",
    columnNumber: "Column 03",
    title: "Agentic RAG & Guardrails",
    boundaryBadge: "Runtime State Machine",
    focusDomain: "LangGraph ReAct Loop & Deterministic Critic",
    colorTheme: "amber",
    stepOverview:
      "Governs runtime execution via a stateful LangGraph orchestrator, low-temperature inference, and a deterministic grounding critic.",
    nodes: [
      {
        id: "c3-n1",
        title: "LangGraph / ReAct Orchestrator",
        subtitle: "Stateful Routing + Query & Planning Node (MCP)",
        localStack: "LangGraph StateGraph + MCP Tool Interfaces",
        prodEquivalent: "Enterprise Agentic Orchestration Service",
        shape: "diamond",
        narrative:
          "Replaces single-shot naive prompting with a stateful ReAct loop. Decomposes complex clinical or regulatory queries and invokes Model Context Protocol (MCP) tools to fetch verified Top-K chunks and citations.",
        technicalDeepDive:
          "Maintains explicit graph state across tool calls, enabling deterministic fallback routing if initial retrieval returns low-confidence chunks.",
      },
      {
        id: "c3-n2",
        title: "LLM Inference Engine",
        subtitle: "temp=0.1–0.2 | top_p=0.95 | num_ctx=16384",
        localStack: "Local Llama 3.2 via Ollama (16K Context Window)",
        prodEquivalent: "AWS GovCloud Bedrock (Claude) / Azure OpenAI / vLLM",
        narrative:
          "Assembles strict system instructions, the user query, and verified chunks. Routes dynamically in production: managed Bedrock/Azure OpenAI for interactive queries, or self-hosted quantized models on vLLM for batch workloads.",
        technicalDeepDive:
          "Overrides Ollama's default 2,048-token window to num_ctx=16384 and locks temperature at 0.1–0.2 so multi-chunk synthesis remains deterministic and factual.",
      },
      {
        id: "c3-n3",
        title: "Trustworthy AI Critic Node",
        subtitle: "OMB M-25-21 Grounding & Citation Verification",
        localStack: "Deterministic Citation & Threshold Validator",
        prodEquivalent: "Automated Policy & Hallucination Guardrail Gate",
        narrative:
          "Intercepts every draft response before it can leave the orchestration layer. Verifies that every claim maps to a retrieved chunk ID and blocks ungrounded speculation.",
        technicalDeepDive:
          "If retrieval similarity falls below threshold or citations are missing, the Critic Node deterministically halts synthesis and returns 'Insufficient source data in record.'",
      },
    ],
  },
  {
    stepIndex: 4,
    id: "col-4",
    columnNumber: "Column 04",
    title: "Clinical Delivery & Auditability",
    boundaryBadge: "Decision Support & ATO Logging",
    focusDomain: "HITL Verification, UI & Continuous Telemetry",
    colorTheme: "purple",
    stepOverview:
      "Enforces mandatory Human-in-the-Loop review, renders clickable source citations, and streams full OTLP/audit telemetry.",
    nodes: [
      {
        id: "c4-n1",
        title: "Human-in-the-Loop (HITL) Gate",
        subtitle: "Mandatory Clinician / Analyst Verification",
        localStack: "Explicit Verification State Gate",
        prodEquivalent: "EHR Sign-Off & Clinical Decision Support Gate",
        narrative:
          "In regulated healthcare and defense operations, AI is decision-support, never the autonomous decision-maker. Grounded summaries require clinician verification before any record is committed.",
        technicalDeepDive:
          "Satisfies OMB M-25-21 human-oversight mandates for high-impact federal AI use cases by preventing unreviewed automated write-backs.",
      },
      {
        id: "c4-n2",
        title: "Clinical Search & Summary UI",
        subtitle: "FastAPI / Uvicorn Streaming → Next.js App Router",
        localStack: "FastAPI StreamingResponse + Next.js React 19 UI",
        prodEquivalent: "Embedded EHR / Enterprise Portal Micro-Frontend",
        narrative:
          "Streams the verified summary to the user interface alongside inline, clickable source citations pointing to the exact document name, page number, and date.",
        technicalDeepDive:
          "Uses an immutable snapshot accumulator outside React's state setter to prevent duplicate token rendering under React 19 Strict Mode.",
      },
      {
        id: "c4-n3",
        title: "Observability & ATO Audit Log",
        subtitle: "Retrieval Traces • Agent Traces • User Feedback",
        localStack: "LangSmith / OpenTelemetry (OTLP) Trace Collector",
        prodEquivalent: "Azure Monitor / AWS CloudWatch / SIEM Audit Log",
        narrative:
          "Aggregates the three bottom dashed telemetry streams—Retrieval Traces from the vector store, Agent Traces from the orchestrator, and User Feedback from the UI—into an immutable audit trail.",
        technicalDeepDive:
          "Logs every prompt, retrieved chunk ID, token count, and latency metric to give Information System Security Officers (ISSOs) continuous ATO compliance evidence.",
      },
    ],
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

  // Interactive Architecture Explorer State
  const [showArchModal, setShowArchModal] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedNode, setSelectedNode] = useState<ArchNode>(
    ARCHITECTURE_COLUMNS[0].nodes[0]
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const archSectionRef = useRef<HTMLDivElement>(null);

  // Only auto-scroll inside the chat container after user interaction begins
  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages]);

  const handleOpenWalkthrough = () => {
    const nextState = !showArchModal;
    setShowArchModal(nextState);
    if (nextState) {
      setTimeout(() => {
        archSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  const handleSelectStep = (stepNum: number) => {
    setActiveStep(stepNum);
    if (stepNum >= 1 && stepNum <= 4) {
      setSelectedNode(ARCHITECTURE_COLUMNS[stepNum - 1].nodes[0]);
    }
  };

  const handleSelectNode = (colStepIndex: number, node: ArchNode) => {
    setActiveStep(colStepIndex);
    setSelectedNode(node);
  };

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

  const currentWalkthrough = WALKTHROUGH_STEPS[activeStep];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-24 text-slate-50 sm:px-12">
      <div className="mx-auto max-w-5xl">
        
        {/* Top Back Navigation */}
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
            "LangChain & LangGraph",
            "ChromaDB",
            "Rank-BM25 Hybrid Search",
            "Ollama (Llama 3.2)",
            "nomic-embed-text",
            "OpenTelemetry / LangSmith",
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

        {/* Hero Action Links (GitHub Repo + Interactive Architecture Button) */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="https://github.com/nfranklin77/airgapped-rag-pipeline"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm hover:bg-emerald-400 transition-colors"
          >
            View GitHub Repository & Codebase →
          </a>

          <button
            type="button"
            onClick={handleOpenWalkthrough}
            className={`inline-flex items-center gap-2.5 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
              showArchModal
                ? "border-emerald-500 bg-emerald-950/60 text-emerald-300 shadow-lg shadow-emerald-500/10"
                : "border-slate-700 bg-slate-900/90 text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {showArchModal
              ? "Hide Interactive Architecture Blueprint"
              : "Launch Interactive Architecture Walkthrough"}
          </button>
        </div>

        {/* =====================================================================
            INTERACTIVE ARCHITECTURE WALKTHROUGH DRAWER (MERMAID -> NATIVE REACT)
           ===================================================================== */}
        {showArchModal && (
          <section
            ref={archSectionRef}
            className="mt-10 rounded-xl border border-emerald-500/40 bg-slate-900/80 p-6 sm:p-8 shadow-2xl space-y-8 transition-all"
          >
            {/* Top Bar: Title & Step Controls */}
            <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-400">
                  <span>Interactive System Blueprint</span>
                  <span>•</span>
                  <span>Local Prototype ↔ Federal Cloud Production Mapping</span>
                </div>
                <h2 className="mt-1 text-2xl font-bold text-slate-50">
                  Trustworthy Clinical & Regulatory RAG Pipeline
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-emerald-500/50 disabled:opacity-40 cursor-pointer"
                >
                  ← Prev Step
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSelectStep(
                      Math.min(WALKTHROUGH_STEPS.length - 1, activeStep + 1)
                    )
                  }
                  disabled={activeStep === WALKTHROUGH_STEPS.length - 1}
                  className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-40 cursor-pointer"
                >
                  Next Step →
                </button>
              </div>
            </div>

            {/* Guided Step Selector Pills (Steps 0 - 5) */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {WALKTHROUGH_STEPS.map((s) => {
                const isCurrent = activeStep === s.step;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => handleSelectStep(s.step)}
                    className={`rounded-lg border px-3 py-2 text-left transition-all cursor-pointer ${
                      isCurrent
                        ? "border-emerald-400 bg-emerald-950/70 text-emerald-300 shadow-md shadow-emerald-500/10"
                        : "border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <div className="font-mono text-[11px] font-semibold">
                      {s.label}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Step Executive Briefing Banner */}
            <div className="rounded-lg border border-slate-800 bg-slate-950/90 p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {currentWalkthrough.shortTitle}
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-0.5 font-mono text-[11px] text-slate-300">
                  Focus: {currentWalkthrough.domain}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-200">
                {currentWalkthrough.summary}
              </p>
              <div className="rounded border border-emerald-500/20 bg-emerald-950/20 px-4 py-2.5 text-xs leading-relaxed text-emerald-200/90">
                <strong className="font-semibold text-emerald-400">
                  Architectural Callout:{" "}
                </strong>
                {currentWalkthrough.callout}
              </div>
            </div>

            {/* 4-COLUMN INTERACTIVE PIPELINE CANVAS (Mirrors Mermaid Colors & Flow) */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              {ARCHITECTURE_COLUMNS.map((col) => {
                const isColumnFocused =
                  activeStep === 0 ||
                  activeStep === 5 ||
                  activeStep === col.stepIndex;

                const themeClasses = {
                  blue: {
                    border: "border-sky-500/40",
                    bg: "bg-sky-950/20",
                    badge: "bg-sky-950/80 text-sky-300 border-sky-700/50",
                    headerText: "text-sky-300",
                    nodeActive:
                      "border-sky-400 bg-sky-950/60 shadow-md shadow-sky-500/10",
                    nodeIdle:
                      "border-slate-800 bg-slate-950/80 hover:border-sky-500/40",
                  },
                  emerald: {
                    border: "border-emerald-500/40",
                    bg: "bg-emerald-950/20",
                    badge:
                      "bg-emerald-950/80 text-emerald-300 border-emerald-700/50",
                    headerText: "text-emerald-300",
                    nodeActive:
                      "border-emerald-400 bg-emerald-950/60 shadow-md shadow-emerald-500/10",
                    nodeIdle:
                      "border-slate-800 bg-slate-950/80 hover:border-emerald-500/40",
                  },
                  amber: {
                    border: "border-amber-500/40",
                    bg: "bg-amber-950/20",
                    badge: "bg-amber-950/80 text-amber-300 border-amber-700/50",
                    headerText: "text-amber-300",
                    nodeActive:
                      "border-amber-400 bg-amber-950/60 shadow-md shadow-amber-500/10",
                    nodeIdle:
                      "border-slate-800 bg-slate-950/80 hover:border-amber-500/40",
                  },
                  purple: {
                    border: "border-purple-500/40",
                    bg: "bg-purple-950/20",
                    badge:
                      "bg-purple-950/80 text-purple-300 border-purple-700/50",
                    headerText: "text-purple-300",
                    nodeActive:
                      "border-purple-400 bg-purple-950/60 shadow-md shadow-purple-500/10",
                    nodeIdle:
                      "border-slate-800 bg-slate-950/80 hover:border-purple-500/40",
                  },
                }[col.colorTheme];

                return (
                  <div
                    key={col.id}
                    className={`rounded-xl border p-4 transition-all duration-300 flex flex-col justify-between ${
                      themeClasses.border
                    } ${themeClasses.bg} ${
                      isColumnFocused ? "opacity-100 scale-[1.01]" : "opacity-45"
                    }`}
                  >
                    <div>
                      {/* Column Header */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                          {col.columnNumber}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium ${themeClasses.badge}`}
                        >
                          {col.boundaryBadge}
                        </span>
                      </div>

                      <h3
                        className={`text-base font-bold ${themeClasses.headerText} mb-4`}
                      >
                        {col.title}
                      </h3>

                      {/* Interactive Nodes inside Column */}
                      <div className="space-y-3">
                        {col.nodes.map((node, idx) => {
                          const isSelected = selectedNode.id === node.id;
                          return (
                            <div key={node.id}>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSelectNode(col.stepIndex, node)
                                }
                                className={`w-full text-left p-3.5 transition-all cursor-pointer border ${
                                  node.shape === "cylinder"
                                    ? "rounded-2xl border-t-4"
                                    : node.shape === "diamond"
                                    ? "rounded-lg border-l-4"
                                    : "rounded-lg"
                                } ${
                                  isSelected
                                    ? themeClasses.nodeActive
                                    : themeClasses.nodeIdle
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-bold text-slate-100">
                                    {node.title}
                                  </span>
                                  {isSelected && (
                                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                                  )}
                                </div>
                                <p className="mt-1 font-mono text-[11px] text-slate-400 leading-snug">
                                  {node.subtitle}
                                </p>
                              </button>

                              {/* Downward Flow Connector inside Column */}
                              {idx < col.nodes.length - 1 && (
                                <div className="flex justify-center py-1 text-slate-600 font-mono text-xs">
                                  ↓
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Column Flow Indicator */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Stage 0{col.stepIndex}</span>
                      <span>
                        {col.stepIndex < 4 ? "Flows Right →" : "ATO Logged ✓"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BOTTOM DASHED OBSERVABILITY BUS (Mirrors the 3 Dashed Lines in Mermaid) */}
            <div className="rounded-lg border border-dashed border-purple-500/50 bg-purple-950/15 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-purple-300">
                  Continuous Telemetry & ATO Audit Bus (Dashed Trace Lines)
                </span>
              </div>
              <div className="flex flex-wrap gap-3 font-mono text-xs text-slate-300">
                <span className="rounded border border-slate-800 bg-slate-950/80 px-2.5 py-1">
                  1. Retrieval Traces (Col 2 → Col 4)
                </span>
                <span className="rounded border border-slate-800 bg-slate-950/80 px-2.5 py-1">
                  2. Agent Traces (Col 3 → Col 4)
                </span>
                <span className="rounded border border-slate-800 bg-slate-950/80 px-2.5 py-1">
                  3. Clinician Feedback (UI → Audit Log)
                </span>
              </div>
            </div>

            {/* SELECTED NODE INSPECTOR PANEL (Bottom Detail Card) */}
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="font-mono text-xs uppercase text-emerald-400">
                    Selected Component Inspector
                  </span>
                  <h3 className="text-xl font-bold text-slate-100 mt-0.5">
                    {selectedNode.title}
                  </h3>
                </div>
                <span className="font-mono text-xs text-slate-400">
                  {selectedNode.subtitle}
                </span>
              </div>

              {/* Local vs Federal Cloud Production Equivalence */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                  <div className="font-mono text-[11px] uppercase text-emerald-400 mb-1">
                    Local Air-Gapped Prototype (MacBook / Python venv)
                  </div>
                  <div className="text-sm font-semibold text-slate-200">
                    {selectedNode.localStack}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                  <div className="font-mono text-[11px] uppercase text-sky-400 mb-1">
                    Federal Cloud Production Equivalent (GovCloud / Azure Gov)
                  </div>
                  <div className="text-sm font-semibold text-slate-200">
                    {selectedNode.prodEquivalent}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <p className="text-sm leading-relaxed text-slate-300">
                  <strong className="text-slate-100">Architectural Role: </strong>
                  {selectedNode.narrative}
                </p>
                <p className="text-xs leading-relaxed text-slate-400 font-mono">
                  <strong className="text-emerald-400">
                    Engineering Deep-Dive:{" "}
                  </strong>
                  {selectedNode.technicalDeepDive}
                </p>
              </div>
            </div>
          </section>
        )}

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
                className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-left text-xs text-slate-300 transition hover:border-emerald-500/50 hover:bg-slate-800/70 hover:text-emerald-300 disabled:opacity-50 cursor-pointer"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Chat Container */}
          <div className="flex h-[500px] flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-900/60 shadow-2xl">
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
                className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer"
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