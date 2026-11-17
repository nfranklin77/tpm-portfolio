"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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

const SAMPLE_MRO_PROMPTS = [
  "How many repairable parts do I have for the Gulfstream G650?",
  "How many total labor hours are required for all 11 repairable parts, and what's the total cost for these repairs?",
  "What is the maintenance status and history for part number 3040T02P01?",
  "What is the status of unauthorized part number 9999X99P99?",
];

const ITERATION_PHASES = [
  {
    phase: "Phase 1: Static Single-CSV & Vector Prototype",
    config: "Single CSV file, ChromaDB k=8 similarity search, temperature=0.1",
    failure:
      "Vector-only Top-K (k=8) could not count all 11 Gulfstream G650 repairable parts across 120 rows; LLM hallucinated external FAA ADs when counts were missing.",
    solution:
      "Decoupled mathematical fleet aggregations (SQLite) from unstructured manual lookup (ChromaDB) and locked LLM temperature=0.0.",
  },
  {
    phase: "Phase 2: Multi-File ERP Scanner & Deduplication",
    config: "Directory scanner (.csv & .sql dumps), canonical alias mapper",
    failure:
      "Multi-facility ERP dumps threw sqlite3.IntegrityError (UNIQUE constraint failed: work_orders.work_order_id) on colliding work order IDs and mismatched column names.",
    solution:
      "Built automated header normalization dictionary, primary-key deduplication pass, and clean canonical_camp_datalake_ready.csv export.",
  },
  {
    phase: "Phase 3: Live PRAGMA Schema Introspection",
    config: "Zero-hardcoded PRAGMA table_info + SELECT DISTINCT runtime scanner",
    failure:
      "Hardcoded lists of aircraft models and station codes failed whenever a prospect uploaded a new fleet type or custom ERP columns.",
    solution:
      "Engineered introspect_live_schema() to dynamically discover text/numeric columns and distinct categorical values from any uploaded file at query time.",
  },
  {
    phase: "Phase 4: Stateful Multi-Turn & Stopword Guardrails",
    config: "Conversational filter carry-over, STOPWORD_SUBTOKENS, num_predict=2048",
    failure:
      "Follow-up questions ('How many hours are required for all 11 parts?') dropped the prior 'Gulfstream G650' filter and falsely matched the word 'required' to 'Review Required' (stopping at 7 rows).",
    solution:
      "Added multi-turn filter inheritance across conversation history, blocked English stopword sub-token collisions, and expanded num_predict=2048 for full table output.",
  },
];

const WALKTHROUGH_STEPS = [
  {
    step: 0,
    label: "Step 0: Executive Frame",
    shortTitle: "Day-0 Data Readiness & Hybrid MRO Intelligence",
    domain: "Pre-Sales Discovery & Enterprise MRO Onboarding",
    summary:
      "In commercial aviation and MRO software sales, prospects rarely hand over clean data. Exports from legacy systems (CORRIDOR, Quantum Control, Pentagon 2000SQL) arrive as multi-file CSVs and SQL dumps with inconsistent headers, duplicate work order keys, and unstructured mechanic squawks. This architecture takes raw prospect exports from messy intake to a citation-grounded, zero-hallucination live demo in under 48 hours.",
    callout:
      "Why Combining SQL + Vector Matters in Aviation: Pure vector RAG fails at fleet-wide counting, labor-hour rollups, and quote pricing math (because Top-K retrieval only sees a handful of chunks), while pure SQL cannot interpret unstructured Aircraft Maintenance Manuals (AMMs) or FAA Airworthiness Directives (ADs). Click any node below to inspect its exact implementation.",
  },
  {
    step: 1,
    label: "Step 1: ERP Intake (Col 1)",
    shortTitle: "1. Multi-System ERP & Regulatory Intake (Tenant Boundary)",
    domain: "Isolated Tenant Data & Regulatory Corpus",
    summary:
      "On the far left inside an isolated customer tenant boundary, the pipeline ingests three distinct aviation data streams: (1) Raw ERP operational tables (.csv and .sql dumps covering work orders, squawks, parts inventory, and quotes), (2) Unstructured OEM Maintenance Manuals (AMMs/SRMs) and FAA Airworthiness Directives (ADs), and (3) Historical labor and marketplace pricing benchmarks.",
    callout:
      "Strict Tenant Isolation: Every prospect export is processed inside an isolated tenant workspace so tail numbers, historical win/loss quote margins, and fleet telemetry never cross-pollinate between operators.",
  },
  {
    step: 2,
    label: "Step 2: ETL & Dual Store (Col 2)",
    shortTitle: "2. Schema-Agnostic ETL & Dual-Store Hydration",
    domain: "Automated Data Hygiene, SQLite Data Lake & ChromaDB",
    summary:
      "Before any AI model touches the data, ingest_mro.py executes automated data hygiene: resolving ERP column aliases (e.g., mapping craftsquawksdescription or remarks to squawk_text), deduplicating colliding work_order_id keys, normalizing alphanumeric part numbers to uppercase, and outputting a clean trial-import CSV alongside a dual SQLite + ChromaDB index.",
    callout:
      "Zero-Hardcoded Schema Adaptability: Rather than restricting customers to a static template, the ETL preserves 100% of custom columns in SQLite and serializes every row as a self-identifying document in ChromaDB.",
  },
  {
    step: 3,
    label: "Step 3: Hybrid Router (Col 3)",
    shortTitle: "3. Stateful Hybrid Router & Airworthiness Critic",
    domain: "Live PRAGMA Introspection, Multi-Turn Memory & Guardrails",
    summary:
      "At query time, server_mro.py introspects the live SQLite schema via PRAGMA table_info, matches user prompts against actual distinct database values, inherits missing context filters from prior conversation turns, and executes exact COUNT/SUM/AVG SQL queries alongside ChromaDB vector search.",
    callout:
      "Deterministic Hallucination Prevention: If a technician or planner queries an alphanumeric part number that does not exist in the verified SQLite inventory or AMM chunks, the Airworthiness Critic trips a deterministic refusal before the LLM can guess.",
  },
  {
    step: 4,
    label: "Step 4: MRO Delivery (Col 4)",
    shortTitle: "4. AI Technician, Operations Manager & HITL Audit Log",
    domain: "Decision Support, Quoting Accuracy & FAA Traceability",
    summary:
      "Verified outputs power three high-ROI operational workflows: (1) AI Technician Compliance & Quality Escape Detection (with mandatory Human-in-the-Loop review gates for out-of-spec torque or high-risk steps), (2) AI Operations Manager & Quoting Intelligence (rolling up exact labor hours and quoted costs), and (3) Immutable FAA/Enterprise Audit Logging.",
    callout:
      "Human-in-the-Loop (HITL) Sign-Off: In aviation maintenance, AI is decision-support, never the sign-off authority. Low-confidence retrievals or out-of-tolerance values automatically trigger a 'Review Required / Flag for Correction' gate.",
  },
  {
    step: 5,
    label: "Step 5: Pilot Conversion ROI",
    shortTitle: "From 48-Hour Custom Prototype to Paid Enterprise Pilot",
    domain: "Commercial Pre-Sales & ARR Conversion Strategy",
    summary:
      "By demonstrating a prospect's actual tail numbers, part counts, labor hours, and AD compliance status live during technical discovery—and handing them a sanitized canonical CSV ready for trial import—this workflow eliminates the #1 pre-sales bottleneck and anchors a bounded 30-day pilot charter.",
    callout:
      "3 Hard Pilot Conversion Metrics: (1) 95%+ citation & part-number mapping accuracy verified by SME spot-checks, (2) 80%+ reduction in manual records research and quoting lookup time, and (3) 80%+ weekly active operator adoption by Week 4.",
  },
];

const ARCHITECTURE_COLUMNS: ArchColumn[] = [
  {
    stepIndex: 1,
    id: "col-1",
    columnNumber: "Column 01",
    title: "Multi-Source MRO Intake",
    boundaryBadge: "Isolated Tenant Boundary",
    focusDomain: "Legacy ERPs, OEM Manuals & Market Feeds",
    colorTheme: "blue",
    stepOverview:
      "Ingests raw customer ERP dumps (.csv / .sql), unstructured FAA/OEM manuals, and historical quoting data.",
    nodes: [
      {
        id: "c1-n1",
        title: "Legacy MRO ERP Exports (.csv / .sql)",
        subtitle: "CORRIDOR • Quantum Control • Pentagon 2000SQL",
        localStack: "Multi-File Directory Scanner (prospect_exports/)",
        prodEquivalent: "Enterprise Data Lake Asynchronous Ingestion API",
        narrative:
          "Ingests raw customer database dumps and CSV exports covering work orders, squawk logs, labor hours, and parts inventory without requiring manual pre-formatting by customer IT.",
        technicalDeepDive:
          "Supports both flat .csv exports and relational .sql dump scripts (CREATE TABLE / INSERT INTO) via an in-memory SQLite staging parser.",
      },
      {
        id: "c1-n2",
        title: "OEM Manuals & FAA Directives",
        subtitle: "AMM • SRM • FAA Airworthiness Directives (ADs) • AC 43.13-1B",
        localStack: "PyPDFDirectoryLoader (my_aviation_docs/)",
        prodEquivalent: "Managed Document Group & Regulatory Library",
        narrative:
          "Loads unstructured technical publications, task cards, torque specifications, and legally binding FAA Airworthiness Directives for cross-checking against active work orders.",
        technicalDeepDive:
          "Splits documents along aviation-specific boundaries ('PART NO.', 'AD-', paragraph breaks) and extracts regex part/AD anchors into chunk metadata.",
      },
      {
        id: "c1-n3",
        title: "Quoting & Marketplace Telemetry",
        subtitle: "Historical Labor Hours • Quote Win/Loss • Supply Benchmarks",
        localStack: "Relational Cost, Labor & Category Attributes",
        prodEquivalent: "Predictive Pricing & Sales Intelligence Engine",
        narrative:
          "Captures historical labor hours, quoted prices, and part categories (Repairable, Rotable, Expendable) to power upfront work scoping and margin-protected quoting.",
        technicalDeepDive:
          "Preserves numeric precision on labor_hours and quoted_price columns in SQLite so fleet-wide cost rollups are 100% exact.",
      },
    ],
  },
  {
    stepIndex: 2,
    id: "col-2",
    columnNumber: "Column 02",
    title: "Schema-Agnostic ETL & Stores",
    boundaryBadge: "Data Hygiene & Dual Index",
    focusDomain: "Normalization, SQLite Data Lake & ChromaDB",
    colorTheme: "emerald",
    stepOverview:
      "Normalizes disparate ERP headers, deduplicates keys, exports a trial-ready CSV, and hydrates SQLite + ChromaDB.",
    nodes: [
      {
        id: "c2-n1",
        title: "Python ETL & Schema Normalizer",
        subtitle: "Alias Mapping • Key Deduplication • Alphanumeric Cleaning",
        localStack: "ingest_mro.py (pandas + sqlite3 + regex)",
        prodEquivalent: "Automated Data Lake ETL & Trial Onboarding Pipeline",
        narrative:
          "Automatically maps customer-specific column names to canonical fields, strips duplicate work_order_id primary keys, uppercases part/serial numbers, and exports both canonical_camp_datalake_ready.csv (for analyst review) and canonical.sql (DDL + DML for direct Data Lake import).",
        technicalDeepDive:
          "Retains 100% of any extra custom columns present in the prospect's export so zero customer telemetry is lost during onboarding.",
      },
      {
        id: "c2-n2",
        title: "Relational Analytics Store (SQLite)",
        subtitle: "Live PRAGMA Introspection • COUNT / SUM / AVG Engine",
        localStack: "mro_enterprise.db (Dynamic Schema Introspection)",
        prodEquivalent: "Enterprise Cloud Data Lake & SQL Query Console",
        shape: "cylinder",
        narrative:
          "Stores structured MRO records in a relational table that is dynamically introspected at runtime to answer fleet counting, labor hour, and cost aggregation queries with 100% mathematical accuracy.",
        technicalDeepDive:
          "Executes PRAGMA table_info(work_orders) and SELECT DISTINCT on low-cardinality columns at query time—requiring zero hardcoded aircraft models or station codes.",
      },
      {
        id: "c2-n3",
        title: "Hybrid Vector Store (ChromaDB)",
        subtitle: "nomic-embed-text • Self-Identifying Row & PDF Chunks",
        localStack: "ChromaDB Persistent Store (./mro_chroma_db)",
        prodEquivalent: "Enterprise Hybrid Vector & Lexical Search Index",
        shape: "cylinder",
        narrative:
          "Indexes both unstructured FAA/OEM manual chunks and serialized MRO work order records stamped with explicit provenance headers for semantic troubleshooting lookups.",
        technicalDeepDive:
          "Stamps every chunk with [Source | Row/Page Ref | Extracted Part/AD Tokens] so semantic matches retain exact alphanumeric traceability.",
      },
    ],
  },
  {
    stepIndex: 3,
    id: "col-3",
    columnNumber: "Column 03",
    title: "Hybrid Router & Guardrails",
    boundaryBadge: "Deterministic Execution",
    focusDomain: "Multi-Turn Memory, SQL+Vector Fusion & Critic",
    colorTheme: "amber",
    stepOverview:
      "Routes analytical and troubleshooting queries across SQLite and ChromaDB while enforcing strict anti-hallucination gates.",
    nodes: [
      {
        id: "c3-n1",
        title: "Stateful Multi-Turn Query Router",
        subtitle: "Live Value Scanner • History Inheritance • Stopword Filter",
        localStack: "dynamic_sql_analytics() + Conversational Memory",
        prodEquivalent: "Agentic Conversational Query Orchestrator",
        shape: "diamond",
        narrative:
          "Scans incoming prompts against live database values, carries over active filters (e.g., aircraft_model = 'Gulfstream G650') across follow-up questions, and blocks English stopword collisions.",
        technicalDeepDive:
          "Prevents words like 'required' ('How many hours are required?') from falsely triggering 'compliance_status = Review Required' via a curated STOPWORD_SUBTOKENS set.",
      },
      {
        id: "c3-n2",
        title: "Deterministic Synthesis Engine",
        subtitle: "Llama 3.2 • temp=0.0 • num_ctx=8192 • num_predict=2048",
        localStack: "Local Ollama (Llama 3.2) via FastAPI StreamingResponse",
        prodEquivalent: "Dedicated Private Aviation LLM Inference Cluster",
        narrative:
          "Combines authoritative SQLite aggregation tables with top-scoring AMM/AD vector chunks at temperature=0.0 to stream complete, non-truncated technical answers.",
        technicalDeepDive:
          "Expanding num_predict=2048 and num_ctx=8192 ensures multi-record inventory breakdowns (e.g., listing all 11 matching G650 work orders) never cut off mid-stream.",
      },
      {
        id: "c3-n3",
        title: "Airworthiness & Part-Number Critic",
        subtitle: "Regex Part Verification • L2 Distance Ceiling (1.35)",
        localStack: "Deterministic Pre-LLM Part & Threshold Tripwire",
        prodEquivalent: "Automated Compliance & Hallucination Guardrail Gate",
        narrative:
          "Intercepts explicit part-number queries before generation. If a requested part number is absent from verified SQLite inventory and OEM manuals, it halts synthesis and trips a mandatory HITL flag.",
        technicalDeepDive:
          "Eliminates the #1 aviation AI liability—hallucinating a non-existent part number or citing fabricated FAA Airworthiness Directives.",
      },
    ],
  },
  {
    stepIndex: 4,
    id: "col-4",
    columnNumber: "Column 04",
    title: "MRO Delivery & HITL Audit",
    boundaryBadge: "Operations & Compliance UI",
    focusDomain: "AI Technician, Operations Manager & Traceability",
    colorTheme: "purple",
    stepOverview:
      "Delivers cited answers, labor/cost predictions, and HITL compliance workflows to maintenance and commercial teams.",
    nodes: [
      {
        id: "c4-n1",
        title: "AI Technician & HITL Compliance Gate",
        subtitle: "AMM Cross-Check • Quality Escape Detection • Sign-Off Gate",
        localStack: "Explicit HITL Review Flag on Unverified / Out-of-Spec Items",
        prodEquivalent: "AI Technician Compliance & Quality Escape Module",
        narrative:
          "Cross-checks executed work orders against AMM specifications (such as torque ranges) and surfaces high-risk quality escape areas for mandatory technician/inspector approval.",
        technicalDeepDive:
          "Enforces human-in-the-loop governance: unverified part numbers or out-of-spec values require explicit engineering review before sign-off.",
      },
      {
        id: "c4-n2",
        title: "Operations & Quoting Intelligence UI",
        subtitle: "FastAPI (Port 8001) → Next.js React 19 Streaming Console",
        localStack: "Next.js App Router + Immutable Stream Accumulator",
        prodEquivalent: "AI Operations Manager & Sales Intelligence Dashboards",
        narrative:
          "Provides planners, mechanics, and quoting teams with instant natural-language access to labor hour rollups, repairable inventory counts, and historical corrective actions.",
        technicalDeepDive:
          "Uses an immutable snapshot accumulator outside React's state setter to prevent duplicate token rendering under React 19 Strict Mode.",
      },
      {
        id: "c4-n3",
        title: "Tenant Audit Log & Pilot Telemetry",
        subtitle: "SQL Filter Traces • Vector Distance • Adoption Metrics",
        localStack: "Structured SQLite Query & Distance Trace Headers",
        prodEquivalent: "Enterprise Audit Traceability & Pilot Health Telemetry",
        narrative:
          "Logs every executed SQL filter, matched work order ID, and vector distance score—providing both FAA audit traceability and weekly pilot adoption telemetry.",
        technicalDeepDive:
          "Tracks technical groundedness, query latency, and operator usage to convert 30-day pre-sales pilots into annual enterprise contracts.",
      },
    ],
  },
];

// Flat list of all 12 nodes with their column metadata for instant Prev/Next modal stepping
const ALL_NODES_WITH_COL = ARCHITECTURE_COLUMNS.flatMap((col) =>
  col.nodes.map((node) => ({ node, col }))
);

const MRO_API_URL =
  process.env.NEXT_PUBLIC_MRO_API_URL || "http://localhost:8001/api/mro-chat";

export default function EnterpriseMRODemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Enterprise MRO Data & AI Operations Engine initialized. Connected to isolated FastAPI backend (Port 8001), dynamic SQLite schema introspection, and ChromaDB hybrid store. Select a test query below or enter a custom fleet/maintenance question.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Interactive Architecture Walkthrough State
  const [showArchModal, setShowArchModal] = useState(true);
  const [activeStep, setActiveStep] = useState<number>(0);
  // Null when closed; opens centered Spotlight Modal immediately on node click
  const [spotlightNodeId, setSpotlightNodeId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const archSectionRef = useRef<HTMLDivElement>(null);
  const consoleSectionRef = useRef<HTMLDivElement>(null);

  const activeSpotlightIndex = ALL_NODES_WITH_COL.findIndex(
    (item) => item.node.id === spotlightNodeId
  );
  const activeSpotlight =
    activeSpotlightIndex >= 0 ? ALL_NODES_WITH_COL[activeSpotlightIndex] : null;

  const handleStepNode = useCallback(
    (direction: -1 | 1) => {
      if (activeSpotlightIndex < 0) return;
      const nextIdx =
        (activeSpotlightIndex + direction + ALL_NODES_WITH_COL.length) %
        ALL_NODES_WITH_COL.length;
      const nextItem = ALL_NODES_WITH_COL[nextIdx];
      setSpotlightNodeId(nextItem.node.id);
      setActiveStep(nextItem.col.stepIndex);
    },
    [activeSpotlightIndex]
  );

  // Keyboard navigation (ESC to close, Left/Right arrows to step through nodes in Spotlight Modal)
  useEffect(() => {
    if (!spotlightNodeId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSpotlightNodeId(null);
      } else if (e.key === "ArrowRight") {
        handleStepNode(1);
      } else if (e.key === "ArrowLeft") {
        handleStepNode(-1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [spotlightNodeId, handleStepNode]);

  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages]);

  const handleToggleWalkthrough = () => {
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

  const handleScrollToConsole = () => {
    consoleSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSelectStep = (stepNum: number) => {
    setActiveStep(stepNum);
  };

  const handleSelectNode = (colStepIndex: number, node: ArchNode) => {
    setActiveStep(colStepIndex);
    setSpotlightNodeId(node.id);
  };

  const sendQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const priorHistory = [...messages];

    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "assistant", content: "" },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(MRO_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: priorHistory,
        }),
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
            "[Connection Notice: Local MRO FastAPI backend not detected on port 8001. Because this sandbox processes customer ERP exports locally in an isolated zero-trust environment, start Uvicorn locally with `python -m uvicorn server_mro:app --reload --port 8001` to run live queries.]",
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
            Enterprise MRO Solutions Architecture
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
            Dynamic SQL Introspection + Vector RAG
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
            Zero-Hallucination Airworthiness Guardrails
          </span>
        </div>

        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl">
          Enterprise MRO Data & AI Operations Engine
        </h1>
        <p className="mt-4 text-xl leading-relaxed text-slate-400">
          A schema-agnostic pre-sales and operational AI pipeline engineered for commercial aviation, avionics, and MRO providers. Ingests raw multi-system ERP exports (CORRIDOR, Quantum Control, Pentagon 2000SQL) alongside FAA Airworthiness Directives—fusing deterministic SQLite fleet analytics with hybrid vector retrieval and Human-in-the-Loop (HITL) safety gates.
        </p>

        {/* Tech Stack Pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            "FastAPI (Port 8001)",
            "Dynamic SQLite Introspection (PRAGMA)",
            "ChromaDB Hybrid Store",
            "Python / pandas ETL",
            "Ollama (Llama 3.2)",
            "nomic-embed-text",
            "Multi-Turn Filter Memory",
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

        {/* Hero Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleScrollToConsole}
            className="inline-flex items-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm hover:bg-emerald-400 transition-colors cursor-pointer"
          >
            Jump to Live MRO Query Console ↓
          </button>

          <button
            type="button"
            onClick={handleToggleWalkthrough}
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
            INTERACTIVE 4-COLUMN ARCHITECTURE WALKTHROUGH (ZERO-SCROLL SPOTLIGHT)
           ===================================================================== */}
        {showArchModal && (
          <section
            ref={archSectionRef}
            className="mt-10 rounded-xl border border-emerald-500/40 bg-slate-900/80 p-6 sm:p-8 shadow-2xl space-y-6 transition-all"
          >
            {/* Top Bar: Title & Step Controls */}
            <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-400">
                  <span>Interactive System Blueprint</span>
                  <span>•</span>
                  <span>Click Any Node for Instant Spotlight Inspection</span>
                </div>
                <h2 className="mt-1 text-2xl font-bold text-slate-50">
                  End-to-End Aviation Data Lake, AI Technician & Operations Pipeline
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
                  Solutions Engineering Callout:{" "}
                </strong>
                {currentWalkthrough.callout}
              </div>
            </div>

            {/* 4-COLUMN INTERACTIVE PIPELINE CANVAS */}
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
                      "border-sky-400 bg-sky-950/70 shadow-md shadow-sky-500/15",
                    nodeIdle:
                      "border-slate-800 bg-slate-950/80 hover:border-sky-400/60 hover:bg-sky-950/30",
                    ctaText: "text-sky-400",
                  },
                  emerald: {
                    border: "border-emerald-500/40",
                    bg: "bg-emerald-950/20",
                    badge:
                      "bg-emerald-950/80 text-emerald-300 border-emerald-700/50",
                    headerText: "text-emerald-300",
                    nodeActive:
                      "border-emerald-400 bg-emerald-950/70 shadow-md shadow-emerald-500/15",
                    nodeIdle:
                      "border-slate-800 bg-slate-950/80 hover:border-emerald-400/60 hover:bg-emerald-950/30",
                    ctaText: "text-emerald-400",
                  },
                  amber: {
                    border: "border-amber-500/40",
                    bg: "bg-amber-950/20",
                    badge:
                      "bg-amber-950/80 text-amber-300 border-amber-700/50",
                    headerText: "text-amber-300",
                    nodeActive:
                      "border-amber-400 bg-amber-950/70 shadow-md shadow-amber-500/15",
                    nodeIdle:
                      "border-slate-800 bg-slate-950/80 hover:border-amber-400/60 hover:bg-amber-950/30",
                    ctaText: "text-amber-400",
                  },
                  purple: {
                    border: "border-purple-500/40",
                    bg: "bg-purple-950/20",
                    badge:
                      "bg-purple-950/80 text-purple-300 border-purple-700/50",
                    headerText: "text-purple-300",
                    nodeActive:
                      "border-purple-400 bg-purple-950/70 shadow-md shadow-purple-500/15",
                    nodeIdle:
                      "border-slate-800 bg-slate-950/80 hover:border-purple-400/60 hover:bg-purple-950/30",
                    ctaText: "text-purple-400",
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

                      <div className="space-y-3">
                        {col.nodes.map((node, idx) => {
                          const isSelected = spotlightNodeId === node.id;
                          return (
                            <div key={node.id}>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSelectNode(col.stepIndex, node)
                                }
                                className={`group w-full text-left p-3.5 transition-all cursor-pointer border ${
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
                                  <span className="text-xs font-bold text-slate-100 group-hover:text-white">
                                    {node.title}
                                  </span>
                                  <span
                                    className={`font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity ${themeClasses.ctaText}`}
                                  >
                                    Inspect ↗
                                  </span>
                                </div>
                                <p className="mt-1 font-mono text-[11px] text-slate-400 leading-snug">
                                  {node.subtitle}
                                </p>
                              </button>

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

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Stage 0{col.stepIndex}</span>
                      <span>
                        {col.stepIndex < 4 ? "Flows Right →" : "HITL Verified ✓"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* =====================================================================
            ZERO-SCROLL SPOTLIGHT MODAL (OPENS IMMEDIATELY ON NODE CLICK)
           ===================================================================== */}
        {activeSpotlight && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn"
            onClick={() => setSpotlightNodeId(null)}
          >
            <div
              className="relative w-full max-w-3xl rounded-2xl border border-emerald-500/50 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-emerald-500/40 bg-emerald-950/80 px-3 py-0.5 font-mono text-xs font-semibold text-emerald-300">
                      {activeSpotlight.col.columnNumber}: {activeSpotlight.col.title}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      • {activeSpotlight.col.boundaryBadge}
                    </span>
                  </div>
                  <h3 className="mt-2 text-2xl font-extrabold text-slate-50">
                    {activeSpotlight.node.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-emerald-400">
                    {activeSpotlight.node.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSpotlightNodeId(null)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 font-mono text-xs font-semibold text-slate-300 hover:border-emerald-500/50 hover:text-white cursor-pointer"
                >
                  Close (ESC) ✕
                </button>
              </div>

              {/* Local Pre-Sales Sandbox vs. Enterprise Production Comparison */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/30 bg-slate-950/90 p-4">
                  <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                    Local Pre-Sales Sandbox Implementation
                  </div>
                  <div className="text-sm font-bold text-slate-100">
                    {activeSpotlight.node.localStack}
                  </div>
                </div>

                <div className="rounded-xl border border-sky-500/30 bg-slate-950/90 p-4">
                  <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-sky-400 mb-1">
                    Enterprise MRO Cloud Production Equivalent
                  </div>
                  <div className="text-sm font-bold text-slate-100">
                    {activeSpotlight.node.prodEquivalent}
                  </div>
                </div>
              </div>

              {/* Operational Role & Deep-Dive Engineering Notes */}
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Operational & Pre-Sales Role
                  </div>
                  <p className="text-sm leading-relaxed text-slate-200">
                    {activeSpotlight.node.narrative}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    Engineering Deep-Dive & Guardrail Mechanics
                  </div>
                  <p className="font-mono text-xs leading-relaxed text-emerald-100/90">
                    {activeSpotlight.node.technicalDeepDive}
                  </p>
                </div>
              </div>

              {/* Modal Footer: Hands-Free Prev / Next Component Navigation */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => handleStepNode(-1)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300 cursor-pointer"
                >
                  ← Prev Component
                </button>

                <span className="font-mono text-xs text-slate-400">
                  Component {activeSpotlightIndex + 1} of {ALL_NODES_WITH_COL.length} (Use ← / → Keys)
                </span>

                <button
                  type="button"
                  onClick={() => handleStepNode(1)}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 cursor-pointer"
                >
                  Next Component →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            2. INTERACTIVE MRO AI OPERATIONS CONSOLE
           ===================================================================== */}
        <div ref={consoleSectionRef}>
          <h2 className="mt-16 border-b border-slate-800 pb-2 text-2xl font-bold text-slate-200">
            Interactive MRO AI Operations Console
          </h2>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-400">
              Select a pre-calibrated fleet analytics or airworthiness prompt below (supports multi-turn follow-ups):
            </p>
            <span className="font-mono text-xs text-slate-500">
              Endpoint: {MRO_API_URL}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_MRO_PROMPTS.map((promptText, idx) => (
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

          <div className="flex h-[500px] flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-900/60 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-semibold text-slate-200">
                  Enterprise MRO Hybrid Engine (Port 8001 | Live SQL + Vector + HITL Gate)
                </span>
              </div>
              <span className="font-mono text-xs text-emerald-400/90">
                120 Verified MRO Records Active
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
                        Introspecting SQLite schema, validating part anchors & streaming...
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
                placeholder="Ask about fleet counts, repairable labor hours, part numbers, or AD compliance..."
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

        {/* =====================================================================
            3. CORE ENGINEERING & RETRIEVAL ARCHITECTURE (4-CARD GRID)
           ===================================================================== */}
        <h2 className="mt-16 border-b border-slate-800 pb-2 text-2xl font-bold text-slate-200">
          Core Engineering & Retrieval Architecture
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-400">
              Layer 01 // Schema-Agnostic ETL & Trial Onboarding
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-200">
              Multi-Source ERP Normalization (.csv & .sql)
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Prospects exporting data from legacy aviation ERPs rarely share identical column names.{" "}
              <code className="text-emerald-300">ingest_mro.py</code> scans{" "}
              <code className="text-slate-300">prospect_exports/</code> for both flat CSVs and SQL dumps, resolves column aliases, deduplicates colliding{" "}
              <code className="text-slate-300">work_order_id</code> primary keys, preserves custom columns, and exports both a readable{" "}
              <code className="text-emerald-300">canonical_camp_datalake_ready.csv</code>{" "}
              file for analyst review and a portable{" "}
              <code className="text-emerald-300">canonical.sql</code>{" "}
              DDL/DML script for direct Data Lake hydration.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-400">
              Layer 02 // Dual-Engine SQL + Vector Fusion
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-200">
              Live PRAGMA Introspection + ChromaDB Hybrid Search
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Standard Top-K vector search cannot count records or sum labor hours across a fleet. At runtime,{" "}
              <code className="text-emerald-300">introspect_live_schema()</code> runs{" "}
              <code className="text-slate-300">PRAGMA table_info</code> and{" "}
              <code className="text-slate-300">SELECT DISTINCT</code> to dynamically build exact SQLite{" "}
              <code className="text-emerald-300">COUNT / SUM / AVG</code> queries while pairing results with semantic AMM/AD vector chunks.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-400">
              Layer 03 // Conversational State & Lexical Precision
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-200">
              Multi-Turn Filter Inheritance & Stopword Guardrails
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              When an operator asks a follow-up question (e.g.,{" "}
              <em>&quot;How many total labor hours are required for all 11 repairable parts?&quot;</em>), the router inherits the active{" "}
              <code className="text-emerald-300">aircraft_model</code> filter from conversation history and blocks common English words like{" "}
              <code className="text-slate-300">&quot;required&quot;</code> from falsely triggering{" "}
              <code className="text-slate-300">Review Required</code> status filters.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-400">
              Layer 04 // Airworthiness Safety & HITL Governance
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-200">
              Deterministic Part-Number Tripwire & Review Gates
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Hallucinating an aircraft part number or torque specification is a critical airworthiness hazard. The backend enforces regex part-number verification against SQLite inventory alongside a strict vector distance ceiling, automatically tripping a{" "}
              <code className="text-emerald-300">Human-in-the-Loop (HITL)</code> engineering review flag on unverified queries.
            </p>
          </div>
        </div>

        {/* =====================================================================
            4. ITERATIVE ENGINEERING PROGRESSION TABLE (v1 to v4)
           ===================================================================== */}
        <h2 className="mt-16 border-b border-slate-800 pb-2 text-2xl font-bold text-slate-200">
          Iterative Engineering Progression (v1 to v4)
        </h2>
        <p className="mt-4 text-sm text-slate-400">
          Documented progression from a single-file vector prototype to a schema-agnostic, multi-turn SQL + Vector MRO engine.
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
                <tr
                  key={idx}
                  className="hover:bg-slate-900/40 transition-colors"
                >
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

        {/* =====================================================================
            5. ACTIVE SANDBOX DATASET & CANONICAL SCHEMA MANIFEST
           ===================================================================== */}
        <h2 className="mt-16 border-b border-slate-800 pb-2 text-2xl font-bold text-slate-200">
          Active Pre-Sales Sandbox Schema & Telemetry Manifest
        </h2>
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/40 p-6">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <p className="text-xs text-slate-400">
            120 Sanitized MRO Work Orders • 5 Aircraft Models • 6 MRO Stations (AUS, TEB, VNY, MIA, PBI, DAL) • Dual Trial Export (.csv + canonical.sql)
            </p>
            <span className="inline-flex items-center gap-1.5 rounded bg-emerald-950/80 border border-emerald-800/50 px-2.5 py-1 font-mono text-xs text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SQLite + ChromaDB Synchronized
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 font-mono text-xs text-slate-300 sm:grid-cols-2">
            {[
              "1. work_order_id (PK — Deduplicated Alphanumeric)",
              "2. tail_number & aircraft_model (G650, Falcon 8X, Challenger 350, Citation X+)",
              "3. part_number & serial_number (Exact Uppercase Lexical Anchor)",
              "4. category (Repairable, Rotable, Expendable)",
              "5. labor_hours & quoted_price (Deterministic SUM/AVG Rollups)",
              "6. ata_chapter & ad_reference (FAA Airworthiness Directives)",
              "7. squawk_text & corrective_action (AMM Task Cross-References)",
              "8. compliance_status & quality_risk_score (HITL Gate & Escape Risk)",
            ].map((fieldItem) => (
              <div
                key={fieldItem}
                className="rounded border border-slate-800/80 bg-slate-950/70 px-3 py-2"
              >
                {fieldItem}
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}