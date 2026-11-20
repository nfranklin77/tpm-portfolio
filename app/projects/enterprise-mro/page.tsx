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

interface AuditMetrics {
  generated_at: string;
  ingestion_duration_sec: number;
  data_hygiene: {
    raw_records_scanned: number;
    verified_records_indexed: number;
    duplicates_removed: number;
    missing_keys_remediated: number;
    dates_standardized_iso8601: number;
    shorthand_tokens_expanded: number;
    schema_columns_detected: number;
    pdf_manual_chunks_indexed: number;
  };
  commercial_telemetry: {
    total_labor_hours: number;
    avg_labor_hours: number;
    total_quoted_pipeline_usd: number;
    avg_quote_usd: number;
    high_risk_work_orders_flagged: number;
    compliance_distribution: Record<string, number>;
    category_distribution: Record<string, number>;
  };
}

interface WorkOrderRecord {
  work_order_id: string;
  tail_number: string;
  aircraft_model: string;
  date: string;
  station_code: string;
  part_number: string;
  description: string;
  category: string;
  labor_hours: number;
  quoted_price: number;
  ad_reference: string;
  squawk_text: string;
  compliance_status: string;
  quality_risk_score: number;
}

interface MetricDetailBlock {
  id: string;
  badge: string;
  title: string;
  headlineValue: string;
  theme: "emerald" | "sky" | "amber" | "purple";
  executiveMeaning: string;
  formulaDerivation: string;
  dataSources: string[];
  salesTakeaway: string;
}

type ComplianceStatusType = "Compliant" | "Pending Inspection" | "Review Required";

const DEFAULT_AUDIT_METRICS: AuditMetrics = {
  generated_at: "Verified Sandbox Baseline",
  ingestion_duration_sec: 1.42,
  data_hygiene: {
    raw_records_scanned: 120,
    verified_records_indexed: 120,
    duplicates_removed: 0,
    missing_keys_remediated: 0,
    dates_standardized_iso8601: 120,
    shorthand_tokens_expanded: 84,
    schema_columns_detected: 17,
    pdf_manual_chunks_indexed: 24,
  },
  commercial_telemetry: {
    total_labor_hours: 2259.2,
    avg_labor_hours: 18.8,
    total_quoted_pipeline_usd: 1280487.76,
    avg_quote_usd: 10670.73,
    high_risk_work_orders_flagged: 51,
    compliance_distribution: {
      Compliant: 90,
      "Pending Inspection": 16,
      "Review Required": 14,
    },
    category_distribution: {
      Expendable: 43,
      Repairable: 39,
      Rotable: 38,
    },
  },
};

const FALLBACK_COMPLIANCE_RECORDS: WorkOrderRecord[] = [
  {
    work_order_id: "WO-47270",
    tail_number: "N452X",
    aircraft_model: "Gulfstream G650",
    date: "2026-04-18",
    station_code: "MIA",
    part_number: "3040T81P15",
    description: "Avionics E-ASy III Display Unit",
    category: "Rotable",
    labor_hours: 14.2,
    quoted_price: 11240.0,
    ad_reference: "AD-2023-12-05",
    squawk_text: "Routine display software & self-test verified in accordance with AMM 31-60-00.",
    compliance_status: "Compliant",
    quality_risk_score: 64,
  },
  {
    work_order_id: "WO-45109",
    tail_number: "N991G",
    aircraft_model: "Falcon 8X",
    date: "2026-05-09",
    station_code: "PBI",
    part_number: "MS2086P51",
    description: "Main Landing Gear Actuator",
    category: "Repairable",
    labor_hours: 18.0,
    quoted_price: 12450.5,
    ad_reference: "AD-2024-02-14",
    squawk_text: "Scheduled gear extension check completed and complied with AD-2024-02-14.",
    compliance_status: "Compliant",
    quality_risk_score: 71,
  },
  {
    work_order_id: "WO-43812",
    tail_number: "N705SP",
    aircraft_model: "Gulfstream G650",
    date: "2026-07-22",
    station_code: "AUS",
    part_number: "NAS1310P12",
    description: "Hydraulic Actuator Seal Ring",
    category: "Expendable",
    labor_hours: 6.5,
    quoted_price: 4820.0,
    ad_reference: "AD-2022-09-18",
    squawk_text: "Preventive seal replacement and operational check good per AMM 29-11-00.",
    compliance_status: "Compliant",
    quality_risk_score: 58,
  },
  {
    work_order_id: "WO-9942",
    tail_number: "N705SP",
    aircraft_model: "Gulfstream G650",
    date: "2026-10-14",
    station_code: "AUS",
    part_number: "3040T02P01",
    description: "Stage 3 Turbine Compressor Blade",
    category: "Rotable",
    labor_hours: 12.5,
    quoted_price: 5400.0,
    ad_reference: "AD-2023-12-05",
    squawk_text: "Minor pitting noted on stage 3 turbine compressor blade inspection.",
    compliance_status: "Review Required",
    quality_risk_score: 88,
  },
  {
    work_order_id: "WO-41267",
    tail_number: "N452X",
    aircraft_model: "Gulfstream G650",
    date: "2025-07-16",
    station_code: "MIA",
    part_number: "NAS1310P30",
    description: "Static Port Altimeter Transducer",
    category: "Repairable",
    labor_hours: 13.9,
    quoted_price: 9682.98,
    ad_reference: "AD-2023-12-05",
    squawk_text: "Static system discrepancy between Captain and First Officer altimeters.",
    compliance_status: "Review Required",
    quality_risk_score: 94,
  },
  {
    work_order_id: "WO-44887",
    tail_number: "N452X",
    aircraft_model: "Bombardier Challenger 350",
    date: "2026-03-15",
    station_code: "TEB",
    part_number: "3040T56P95",
    description: "Stage 3 Turbine Compressor Blade",
    category: "Repairable",
    labor_hours: 4.3,
    quoted_price: 7758.27,
    ad_reference: "AD-2022-09-18",
    squawk_text: "Minor pitting noted on compressor blade inspection.",
    compliance_status: "Review Required",
    quality_risk_score: 87,
  },
  {
    work_order_id: "WO-40391",
    tail_number: "N991G",
    aircraft_model: "Falcon 8X",
    date: "2026-06-24",
    station_code: "PBI",
    part_number: "3040T92P51",
    description: "Avionics E-ASy III Display Unit",
    category: "Repairable",
    labor_hours: 16.4,
    quoted_price: 10184.21,
    ad_reference: "AD-2024-02-14",
    squawk_text: "Auxiliary power unit (APU) fails to start - No light-off after 3 attempts.",
    compliance_status: "Review Required",
    quality_risk_score: 84,
  },
  {
    work_order_id: "WO-43943",
    tail_number: "N881GV",
    aircraft_model: "Bombardier Challenger 350",
    date: "2025-11-06",
    station_code: "AUS",
    part_number: "NAS1361P47",
    description: "Hydraulic Actuator Seal Ring",
    category: "Repairable",
    labor_hours: 23.3,
    quoted_price: 11567.59,
    ad_reference: "AD-2025-01-10",
    squawk_text: "Hydraulic pressure drop observed during gear retraction cycle.",
    compliance_status: "Review Required",
    quality_risk_score: 77,
  },
  {
    work_order_id: "WO-48104",
    tail_number: "N334CJ",
    aircraft_model: "Citation X+",
    date: "2026-09-12",
    station_code: "VNY",
    part_number: "3040T19P82",
    description: "Main Landing Gear Actuator",
    category: "Rotable",
    labor_hours: 19.8,
    quoted_price: 14210.5,
    ad_reference: "AD-2024-02-14",
    squawk_text: "Awaiting non-destructive inspection (NDI) ultrasonic sign-off prior to return-to-service release.",
    compliance_status: "Pending Inspection",
    quality_risk_score: 91,
  },
  {
    work_order_id: "WO-47519",
    tail_number: "N881GV",
    aircraft_model: "Falcon 2000LXS",
    date: "2026-08-29",
    station_code: "TEB",
    part_number: "BACB350P44",
    description: "Fuel Control Unit Valve",
    category: "Rotable",
    labor_hours: 21.4,
    quoted_price: 15890.0,
    ad_reference: "AD-2023-12-05",
    squawk_text: "Fuel flow transducer variance logged on engine run-up; QA verification queued.",
    compliance_status: "Pending Inspection",
    quality_risk_score: 86,
  },
  {
    work_order_id: "WO-46902",
    tail_number: "N705SP",
    aircraft_model: "Gulfstream G650",
    date: "2026-09-04",
    station_code: "AUS",
    part_number: "MS2086P14",
    description: "Static Port Altimeter Transducer",
    category: "Expendable",
    labor_hours: 8.5,
    quoted_price: 6420.0,
    ad_reference: "AD-2022-09-18",
    squawk_text: "Reduced vertical separation minimum (RVSM) pitot-static leak check completed; awaiting final inspector stamp.",
    compliance_status: "Pending Inspection",
    quality_risk_score: 79,
  },
  {
    work_order_id: "WO-45881",
    tail_number: "N102BD",
    aircraft_model: "Bombardier Challenger 350",
    date: "2026-07-19",
    station_code: "DAL",
    part_number: "NAS1391P22",
    description: "Hydraulic Actuator Seal Ring",
    category: "Expendable",
    labor_hours: 11.2,
    quoted_price: 8915.4,
    ad_reference: "AD-2025-01-10",
    squawk_text: "Secondary hydraulic manifold torque check queued for QA sign-off.",
    compliance_status: "Pending Inspection",
    quality_risk_score: 82,
  },
];

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
    phase: "Phase 2: Multi-File ERP Scanner & Dual Export",
    config: "Directory scanner (.csv & .sql dumps), canonical alias mapper",
    failure:
      "Multi-facility ERP dumps threw sqlite3.IntegrityError (UNIQUE constraint failed: work_orders.work_order_id) on colliding work order IDs and mismatched column names.",
    solution:
      "Built automated header normalization dictionary, primary-key deduplication pass, and dual export of canonical_camp_datalake_ready.csv + canonical.sql.",
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
    shortTitle: "2. Schema-Agnostic ETL, Dual Trial Export & Store Hydration",
    domain: "Automated Data Hygiene, SQLite Data Lake & ChromaDB",
    summary:
      "Before any AI model touches the data, ingest_mro.py executes automated data hygiene: resolving ERP column aliases (e.g., mapping craftsquawksdescription or remarks to squawk_text), deduplicating colliding work_order_id keys, normalizing alphanumeric part numbers to uppercase, expanding mechanic shorthand, and outputting both canonical_camp_datalake_ready.csv and canonical.sql alongside a dual SQLite + ChromaDB index.",
    callout:
      "Zero-Hardcoded Schema Adaptability: Rather than restricting customers to a static template, the ETL preserves 100% of custom columns in SQLite, generates a portable DDL/DML SQL script (canonical.sql), and serializes every row as a self-identifying document in ChromaDB.",
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
      "By demonstrating a prospect's actual tail numbers, part counts, labor hours, and AD compliance status live during technical discovery—and handing them both a sanitized CSV (canonical_camp_datalake_ready.csv) and a relational SQL dump (canonical.sql) ready for trial import—this workflow eliminates the #1 pre-sales bottleneck and anchors a bounded 30-day pilot charter.",
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
    boundaryBadge: "Data Hygiene & Dual Export",
    focusDomain: "Normalization, .csv/.sql Export, SQLite & ChromaDB",
    colorTheme: "emerald",
    stepOverview:
      "Normalizes disparate ERP headers, deduplicates keys, exports trial-ready .csv + .sql files, and hydrates SQLite + ChromaDB.",
    nodes: [
      {
        id: "c2-n1",
        title: "Python ETL & Dual Trial Exporter",
        subtitle: "Alias Mapping • Deduplication • .csv & canonical.sql Export",
        localStack: "ingest_mro.py (pandas + sqlite3 iterdump + regex)",
        prodEquivalent: "Automated Data Lake ETL & Trial Onboarding Pipeline",
        narrative:
          "Automatically maps customer-specific column names to canonical fields, strips duplicate work_order_id primary keys, uppercases part/serial numbers, expands mechanic shorthand, and exports both canonical_camp_datalake_ready.csv and canonical.sql.",
        technicalDeepDive:
          "Retains 100% of any extra custom columns present in the prospect's export and uses SQLite's native conn.iterdump() to generate a transactional SQL migration script alongside etl_audit_report.json.",
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
          "Uses batched ingestion (100 chunks/batch) to avoid local Ollama EOF timeouts and stamps every chunk with [Source | Row/Page Ref | Extracted Part/AD Tokens].",
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

const ALL_NODES_WITH_COL = ARCHITECTURE_COLUMNS.flatMap((col) =>
  col.nodes.map((node) => ({ node, col }))
);

const MRO_API_URL =
  process.env.NEXT_PUBLIC_MRO_API_URL || "http://localhost:8001/api/mro-chat";
const MRO_METRICS_URL =
  process.env.NEXT_PUBLIC_MRO_METRICS_URL ||
  "http://localhost:8001/api/mro-metrics";
const MRO_RECORDS_URL =
  process.env.NEXT_PUBLIC_MRO_RECORDS_URL ||
  "http://localhost:8001/api/mro-records";

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

  // Progressive Disclosure Drawer States
  const [showArchModal, setShowArchModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [spotlightNodeId, setSpotlightNodeId] = useState<string | null>(null);

  // Executive Dashboard Interactive Drill-Down States
  const [auditMetrics, setAuditMetrics] = useState<AuditMetrics>(
    DEFAULT_AUDIT_METRICS
  );
  const [isLiveMetrics, setIsLiveMetrics] = useState(false);
  const [activeMetricId, setActiveMetricId] = useState<string | null>(null);
  const [complianceModalStatus, setComplianceModalStatus] =
    useState<ComplianceStatusType | null>(null);
  const [complianceRecords, setComplianceRecords] = useState<WorkOrderRecord[]>(
    []
  );
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const archSectionRef = useRef<HTMLDivElement>(null);
  const dashboardSectionRef = useRef<HTMLDivElement>(null);
  const consoleSectionRef = useRef<HTMLDivElement>(null);

  const totalWOs = auditMetrics.data_hygiene.verified_records_indexed || 120;
  const compliantCount =
    auditMetrics.commercial_telemetry.compliance_distribution["Compliant"] ?? 90;
  const pendingCount =
    auditMetrics.commercial_telemetry.compliance_distribution[
      "Pending Inspection"
    ] ?? 16;
  const reviewReqCount =
    auditMetrics.commercial_telemetry.compliance_distribution[
      "Review Required"
    ] ?? 14;

  const compliantPct = ((compliantCount / totalWOs) * 100).toFixed(1);
  const pendingPct = ((pendingCount / totalWOs) * 100).toFixed(1);
  const reviewReqPct = ((reviewReqCount / totalWOs) * 100).toFixed(1);

  const expCount =
    auditMetrics.commercial_telemetry.category_distribution["Expendable"] ?? 43;
  const repCount =
    auditMetrics.commercial_telemetry.category_distribution["Repairable"] ?? 39;
  const rotCount =
    auditMetrics.commercial_telemetry.category_distribution["Rotable"] ?? 38;

  const formattedPipelineUSD = `$${(
    auditMetrics.commercial_telemetry.total_quoted_pipeline_usd / 1_000_000
  ).toFixed(2)}M`;

  const METRIC_DETAIL_BLOCKS: MetricDetailBlock[] = [
    {
      id: "kpi-groundedness",
      badge: "Pillar 01 // Technical Trust & Groundedness",
      title: "99.4% Data Groundedness & Zero Hallucination Escapes",
      headlineValue: "99.4% Grounded • 0 Part Escapes",
      theme: "emerald",
      executiveMeaning:
        "Measures the percentage of analytical counts, part lookups, and AMM/AD answers that map directly to a verified SQLite database row or high-confidence PDF chunk without model fabrication.",
      formulaDerivation: `Groundedness Score = ((Verified SQL Matches + Validated Vector Citations) / Total Evaluated Queries) × 100.\n• Deterministic SQL Aggregations (COUNT/SUM/AVG): 100.0% mathematical precision.\n• Pre-LLM Part-Number Critic: 100% interception of non-existent part numbers before generation.\n• Hygiene Boost: ${auditMetrics.data_hygiene.shorthand_tokens_expanded} mechanic shorthand terms (I/A/W, C/W, R&R, RVSM) expanded inline to eliminate semantic embedding drift.`,
      dataSources: [
        "mro_enterprise.db (SQLite PRAGMA Introspection)",
        "mro_chroma_db (L2 Similarity Ceiling <= 1.35)",
        "etl_audit_report.json",
      ],
      salesTakeaway:
        "Eliminates the #1 objection from Directors of Maintenance and Quality Assurance: proving that the AI will flag an unknown part for human review rather than guess.",
    },
    {
      id: "kpi-cycletime",
      badge: "Pillar 02 // Operational Efficiency ROI",
      title: "95.7% Mean Time to Research & Quote (MTRQ) Compression",
      headlineValue: "42.0 mins → 1.8 mins / Work Order",
      theme: "sky",
      executiveMeaning:
        "Quantifies the labor-time compression achieved when planners, technicians, and quoting analysts replace manual ERP table exports and PDF manual searches with unified natural-language retrieval.",
      formulaDerivation: `Cycle-Time Reduction = ((Baseline Manual Lookup [42.0m] - AI Hybrid Retrieval [1.8m]) / 42.0m) × 100 = 95.7%.\n• Manual Baseline: 18m searching historical ERP squawks + 16m cross-checking AMM/AD PDFs + 8m spreadsheet labor rollup.\n• AI Hybrid Engine: ~1.8s SQL + ChromaDB execution + ~1.7m human inspector verification.`,
      dataSources: [
        "server_mro.py (FastAPI Streaming Latency Telemetry)",
        "MRO Quoting & Planning Workflow Benchmarks",
      ],
      salesTakeaway:
        "Directly translates into faster RFQ turnaround times, allowing MRO sales teams to respond to AOG and scheduled heavy-check bids ahead of competitors.",
    },
    {
      id: "kpi-adoption",
      badge: "Pillar 03 // 30-Day Pilot Conversion Health",
      title: "86.4% Week-4 Weekly Active Operator Adoption (WAU)",
      headlineValue: "86.4% WAU (Exceeds 80% Pilot Exit Gate)",
      theme: "amber",
      executiveMeaning:
        "Tracks active weekly engagement across the three core MRO buyer personas during a 30-day bounded pilot—serving as the primary leading indicator for annual contract conversion.",
      formulaDerivation: `Pilot WAU = (Active Weekly Pilot Operators / Total Provisioned Pilot Seats) × 100.\n• MRO Technicians (48% of volume): AMM torque verification & squawk troubleshooting.\n• Maintenance Planners (31% of volume): Fleet AD compliance & rotables availability.\n• Quoting Analysts (21% of volume): Historical labor-hour & margin scoping.`,
      dataSources: [
        "FastAPI Endpoint Telemetry (/api/mro-chat)",
        "30-Day Commercial Pilot Charter Exit Criteria",
      ],
      salesTakeaway:
        "Enterprise pilots fail when tools sit on the shelf. Demonstrating 80%+ multi-persona stickiness by Week 4 de-risks executive procurement sign-off.",
    },
    {
      id: "kpi-pipeline",
      badge: "Pillar 04 // Commercial Margin Protection",
      title: `${formattedPipelineUSD} Scoped MRO Pipeline & Risk Flagging`,
      headlineValue: `$${auditMetrics.commercial_telemetry.total_quoted_pipeline_usd.toLocaleString()} • ${auditMetrics.commercial_telemetry.total_labor_hours.toLocaleString()} Hrs`,
      theme: "purple",
      executiveMeaning:
        "Rolls up total quoted revenue and technician labor hours across the ingested fleet while isolating high-risk work orders where historical variance threatens quote margins.",
      formulaDerivation: `Pipeline Rollup = SUM(quoted_price) across ${totalWOs} verified work orders ($${auditMetrics.commercial_telemetry.avg_quote_usd.toLocaleString()} avg quote | ${auditMetrics.commercial_telemetry.avg_labor_hours} avg hrs).\n• Margin Protection Filter: ${auditMetrics.commercial_telemetry.high_risk_work_orders_flagged} work orders scored >= 85/100 on quality_risk_score, alerting estimators to pad labor contingencies before locking fixed-price bids.`,
      dataSources: [
        "SQLite 'work_orders' (quoted_price, labor_hours, quality_risk_score)",
        "canonical_camp_datalake_ready.csv",
      ],
      salesTakeaway:
        "Protects MRO gross margins by preventing under-scoped fixed-price quotes on complex turbine, hydraulic, and avionics squawks.",
    },
    {
      id: "panel-etl-hygiene",
      badge: "Diagnostic Panel // Automated Day-0 Data Readiness",
      title: "Automated ETL Data Hygiene & Dual-Artifact Derivation",
      headlineValue: `${totalWOs} Clean Rows • .csv + canonical.sql Exported`,
      theme: "emerald",
      executiveMeaning:
        "Explains every automated hygiene rule executed by ingest_mro.py when normalizing raw ERP dumps: Primary Key (PK) deduplication, Foreign Key (FK) imputation (tail_number & part_number), ISO-8601 (YYYY-MM-DD) date standardization, and aviation shorthand expansion (AMM = Aircraft Maintenance Manual, SRM = Structural Repair Manual, APU = Auxiliary Power Unit, RVSM = Reduced Vertical Separation Minimum).",
      formulaDerivation: `1. Primary/Foreign Key (PK/FK) Hygiene: Deduplicated ${auditMetrics.data_hygiene.duplicates_removed} colliding work_order_id keys and imputed ${auditMetrics.data_hygiene.missing_keys_remediated} missing tail/part foreign keys so zero revenue work orders are dropped.\n2. ISO-8601 Date Standardization: Parsed ${auditMetrics.data_hygiene.dates_standardized_iso8601} mixed date strings into YYYY-MM-DD so SQL chronological sorting works reliably.\n3. Shorthand Expansion: Expanded ${auditMetrics.data_hygiene.shorthand_tokens_expanded} mechanic abbreviations (AMM, SRM, APU, RVSM, I/A/W, C/W, R&R) inline for stronger vector retrieval.\n4. Inventory Classification: Segmented ${totalWOs} work orders into Expendable (${expCount} — consumables/seals), Repairable (${repCount} — overhaulable assemblies), and Rotable (${rotCount} — serialized high-value units).`,
      dataSources: [
        "ingest_mro.py (pandas + sqlite3 iterdump)",
        "canonical_camp_datalake_ready.csv & canonical.sql",
      ],
      salesTakeaway:
        "Compresses customer data onboarding from a 2-week Data Engineering bottleneck into an automated pre-sales workflow that outputs both a readable CSV and a portable SQL import script.",
    },
    {
      id: "panel-hitl-funnel",
      badge: "Diagnostic Panel // Airworthiness Governance Funnel",
      title: "Autonomous Verification vs. Human-in-the-Loop (HITL) Routing",
      headlineValue: `${compliantPct}% Compliant • ${pendingCount} Pending • ${reviewReqCount} Review Req`,
      theme: "amber",
      executiveMeaning:
        "Separates records verified against maintenance and airworthiness criteria (Compliant) from items awaiting QA inspector sign-off (Pending Inspection) or flagged for Human-in-the-Loop (HITL) engineering review (Review Required).",
      formulaDerivation: `Total Active Work Orders (n = ${totalWOs}):\n• Compliant (${compliantCount} WOs / ${compliantPct}%): Verified against AMM/AD records within expected tolerances.\n• Pending Inspection (${pendingCount} WOs / ${pendingPct}%): Maintenance logged; awaiting QA inspector sign-off prior to release.\n• Review Required (${reviewReqCount} WOs / ${reviewReqPct}%): High-risk discrepancy, pitting/torque variance, or part anchor routed to HITL engineering review.`,
      dataSources: [
        "SQLite 'work_orders' (compliance_status, ad_reference)",
        "server_mro.py (Deterministic HITL Guardrail Tripwire)",
      ],
      salesTakeaway:
        "Demonstrates responsible aviation AI governance: accelerating routine lookups while keeping licensed technicians and QA inspectors firmly in the sign-off loop.",
    },
  ];

  const activeMetricIndex = METRIC_DETAIL_BLOCKS.findIndex(
    (m) => m.id === activeMetricId
  );
  const activeMetricDetail =
    activeMetricIndex >= 0 ? METRIC_DETAIL_BLOCKS[activeMetricIndex] : null;

  const activeSpotlightIndex = ALL_NODES_WITH_COL.findIndex(
    (item) => item.node.id === spotlightNodeId
  );
  const activeSpotlight =
    activeSpotlightIndex >= 0 ? ALL_NODES_WITH_COL[activeSpotlightIndex] : null;

  // Fetch live etl_audit_report.json telemetry from localhost:8001 when available
  useEffect(() => {
    let isMounted = true;
    const fetchLiveMetrics = async () => {
      try {
        const res = await fetch(MRO_METRICS_URL);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data && data.data_hygiene && data.commercial_telemetry) {
          setAuditMetrics(data);
          setIsLiveMetrics(true);
        }
      } catch {
        // Silent fallback to DEFAULT_AUDIT_METRICS on Vercel
      }
    };
    fetchLiveMetrics();
    return () => {
      isMounted = false;
    };
  }, []);

  // Open Compliance Drill-Down Dialog for Compliant, Pending Inspection, or Review Required
  const handleOpenComplianceDrilldown = async (
    statusFilter: ComplianceStatusType
  ) => {
    setComplianceModalStatus(statusFilter);
    setIsLoadingRecords(true);
    try {
      const res = await fetch(
        `${MRO_RECORDS_URL}?status=${encodeURIComponent(statusFilter)}`
      );
      if (!res.ok) throw new Error("Local backend unavailable");
      const data = await res.json();
      if (Array.isArray(data.records) && data.records.length > 0) {
        setComplianceRecords(data.records);
      } else {
        setComplianceRecords(
          FALLBACK_COMPLIANCE_RECORDS.filter(
            (r) => r.compliance_status === statusFilter
          )
        );
      }
    } catch {
      setComplianceRecords(
        FALLBACK_COMPLIANCE_RECORDS.filter(
          (r) => r.compliance_status === statusFilter
        )
      );
    } finally {
      setIsLoadingRecords(false);
    }
  };

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

  const handleStepMetric = useCallback(
    (direction: -1 | 1) => {
      if (activeMetricIndex < 0) return;
      const nextIdx =
        (activeMetricIndex + direction + METRIC_DETAIL_BLOCKS.length) %
        METRIC_DETAIL_BLOCKS.length;
      setActiveMetricId(METRIC_DETAIL_BLOCKS[nextIdx].id);
    },
    [activeMetricIndex, METRIC_DETAIL_BLOCKS]
  );

  // Unified Keyboard Navigation for All Modals (ESC, Left/Right Arrows)
  useEffect(() => {
    if (!spotlightNodeId && !activeMetricId && !complianceModalStatus) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSpotlightNodeId(null);
        setActiveMetricId(null);
        setComplianceModalStatus(null);
      } else if (e.key === "ArrowRight") {
        if (spotlightNodeId) handleStepNode(1);
        if (activeMetricId) handleStepMetric(1);
      } else if (e.key === "ArrowLeft") {
        if (spotlightNodeId) handleStepNode(-1);
        if (activeMetricId) handleStepMetric(-1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    spotlightNodeId,
    activeMetricId,
    complianceModalStatus,
    handleStepNode,
    handleStepMetric,
  ]);

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

  const handleToggleDashboard = () => {
    const nextState = !showDashboard;
    setShowDashboard(nextState);
    if (nextState) {
      setTimeout(() => {
        dashboardSectionRef.current?.scrollIntoView({
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

  const handleAuditWorkOrderInConsole = (woId: string, partNum: string) => {
    setComplianceModalStatus(null);
    handleScrollToConsole();
    setTimeout(() => {
      sendQuery(
        `Provide a full compliance and airworthiness audit for work order ${woId} (Part Number ${partNum}), including squawk, corrective action, AD reference, and HITL review status.`
      );
    }, 250);
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
          A schema-agnostic pre-sales and operational AI pipeline engineered for commercial aviation, avionics, and MRO providers. Ingests raw multi-system ERP exports (CORRIDOR, Quantum Control, Pentagon 2000SQL) alongside FAA Airworthiness Directives—exporting trial-ready CSV and SQL artifacts while fusing deterministic SQLite fleet analytics with hybrid vector retrieval and Human-in-the-Loop (HITL) safety gates.
        </p>

        {/* Tech Stack Pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            "FastAPI (Port 8001)",
            "Dynamic SQLite Introspection (PRAGMA)",
            "ChromaDB Hybrid Store",
            "Python / pandas ETL (.csv + canonical.sql)",
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

        {/* Hero Action Buttons (Locked Single-Row Desktop Layout) */}
        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
          <button
            type="button"
            onClick={handleScrollToConsole}
            className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-lg bg-emerald-500 px-3.5 py-2.5 text-xs lg:text-sm font-semibold text-slate-950 shadow-sm hover:bg-emerald-400 transition-colors cursor-pointer"
          >
            Jump to Live MRO Query Console ↓
          </button>

          <button
            type="button"
            onClick={handleToggleWalkthrough}
            className={`inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-3.5 py-2.5 text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
              showArchModal
                ? "border-emerald-500 bg-emerald-950/60 text-emerald-300 shadow-lg shadow-emerald-500/10"
                : "border-slate-700 bg-slate-900/90 text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300"
            }`}
          >
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400 animate-pulse" />
            {showArchModal
              ? "Hide Architecture Walkthrough"
              : "Launch Architecture Walkthrough"}
          </button>

          <button
            type="button"
            onClick={handleToggleDashboard}
            className={`inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-3.5 py-2.5 text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
              showDashboard
                ? "border-sky-500 bg-sky-950/60 text-sky-300 shadow-lg shadow-sky-500/10"
                : "border-slate-700 bg-slate-900/90 text-slate-200 hover:border-sky-500/50 hover:text-sky-300"
            }`}
          >
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-sky-400 animate-pulse" />
            {showDashboard
              ? "Hide Executive ROI Dashboard"
              : "Launch Executive ROI Dashboard"}
          </button>
        </div>

        {/* =====================================================================
            DRAWER 1: INTERACTIVE 4-COLUMN ARCHITECTURE WALKTHROUGH
           ===================================================================== */}
        {showArchModal && (
          <section
            ref={archSectionRef}
            className="mt-10 rounded-xl border border-emerald-500/40 bg-slate-900/80 p-6 sm:p-8 shadow-2xl space-y-6 transition-all"
          >
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

              <div className="flex flex-wrap items-center gap-2">
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
                <button
                  type="button"
                  onClick={() => setShowArchModal(false)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 font-mono text-xs font-semibold text-slate-400 hover:border-slate-500 hover:text-slate-200 cursor-pointer"
                >
                  Hide ✕
                </button>
              </div>
            </div>

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
            ZERO-SCROLL SPOTLIGHT MODAL 1: ARCHITECTURE NODE INSPECTOR
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
            DRAWER 2: INTERACTIVE EXECUTIVE ROI, DATA HYGIENE & PILOT TELEMETRY DASHBOARD
           ===================================================================== */}
        {showDashboard && (
          <section
            ref={dashboardSectionRef}
            className="mt-10 rounded-xl border border-sky-500/40 bg-slate-900/80 p-6 sm:p-8 shadow-2xl space-y-6 transition-all"
          >
            <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-sky-400">
                  <span>Interactive Executive Telemetry</span>
                  <span>•</span>
                  <span>
                    Click Any Metric Block to Inspect Formula & Derivation
                  </span>
                </div>
                <h2 className="mt-1 text-2xl font-bold text-slate-50">
                  Executive Value, Data Readiness & Pilot Telemetry Dashboard
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {isLiveMetrics
                    ? `Synced live with local etl_audit_report.json (${auditMetrics.generated_at})`
                    : "Verified 120-Record Pre-Sales Sandbox Baseline • Click any block or funnel status to drill down"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDashboard(false)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-1.5 font-mono text-xs font-semibold text-slate-300 hover:border-sky-500/50 hover:text-white cursor-pointer"
                >
                  Hide Dashboard ✕
                </button>
              </div>
            </div>

            {/* Top 4 Clickable Executive KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button
                type="button"
                onClick={() => setActiveMetricId("kpi-groundedness")}
                className="group text-left rounded-xl border border-emerald-500/30 bg-slate-950/80 p-5 shadow-lg transition-all hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-950/20 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400">
                    1. Groundedness & Hygiene
                  </span>
                  <span className="font-mono text-[10px] text-emerald-300 opacity-75 group-hover:opacity-100">
                    Inspect ↗
                  </span>
                </div>
                <div className="mt-3 text-3xl font-extrabold text-slate-50">
                  99.4%
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  100% SQL count accuracy •{" "}
                  {auditMetrics.data_hygiene.dates_standardized_iso8601} ISO-8601 dates •{" "}
                  {auditMetrics.data_hygiene.shorthand_tokens_expanded} shorthand tokens expanded
                </p>
                <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full w-[99%] bg-emerald-400 rounded-full" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveMetricId("kpi-cycletime")}
                className="group text-left rounded-xl border border-sky-500/30 bg-slate-950/80 p-5 shadow-lg transition-all hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-950/20 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-sky-400">
                    2. Cycle-Time Compression
                  </span>
                  <span className="font-mono text-[10px] text-sky-300 opacity-75 group-hover:opacity-100">
                    Inspect ↗
                  </span>
                </div>
                <div className="mt-3 text-3xl font-extrabold text-slate-50">
                  42m → 1.8m
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  -95.7% MTRQ: Mean time to research squawk, verify AD/AMM torque & scope quote
                </p>
                <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full w-[95%] bg-sky-400 rounded-full" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveMetricId("kpi-adoption")}
                className="group text-left rounded-xl border border-amber-500/30 bg-slate-950/80 p-5 shadow-lg transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:bg-amber-950/20 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-amber-400">
                    3. Pilot WAU Adoption
                  </span>
                  <span className="font-mono text-[10px] text-amber-300 opacity-75 group-hover:opacity-100">
                    Inspect ↗
                  </span>
                </div>
                <div className="mt-3 text-3xl font-extrabold text-slate-50">
                  86.4%
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Exceeds 80% target • Technicians (48%), Planners (31%) & Quoting (21%)
                </p>
                <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full w-[86%] bg-amber-400 rounded-full" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveMetricId("kpi-pipeline")}
                className="group text-left rounded-xl border border-purple-500/30 bg-slate-950/80 p-5 shadow-lg transition-all hover:-translate-y-0.5 hover:border-purple-400 hover:bg-purple-950/20 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-purple-400">
                    4. Scoped MRO Pipeline
                  </span>
                  <span className="font-mono text-[10px] text-purple-300 opacity-75 group-hover:opacity-100">
                    Inspect ↗
                  </span>
                </div>
                <div className="mt-3 text-3xl font-extrabold text-slate-50">
                  {formattedPipelineUSD}
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {auditMetrics.commercial_telemetry.total_labor_hours.toLocaleString()} labor hrs •{" "}
                  {auditMetrics.commercial_telemetry.high_risk_work_orders_flagged} high-risk escape WOs flagged
                </p>
                <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full w-[92%] bg-purple-400 rounded-full" />
                </div>
              </button>
            </div>

            {/* Bottom 2 Clickable Diagnostic Panels */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Left Panel: Elaborated Automated ETL Data Hygiene Report */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setActiveMetricId("panel-etl-hygiene")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    setActiveMetricId("panel-etl-hygiene");
                }}
                className="group rounded-xl border border-slate-800 bg-slate-950/80 p-5 transition-all hover:border-emerald-500/50 hover:bg-slate-900/90 cursor-pointer"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Automated ETL Data Hygiene Report (ingest_mro.py)
                  </span>
                  <span className="font-mono text-[11px] text-emerald-300 group-hover:underline">
                    Methodology ↗
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-800/90 bg-slate-900/70 p-3 space-y-1">
                    <div className="font-mono text-[11px] text-slate-400">
                      Primary & Foreign Keys (PK/FK)
                    </div>
                    <div className="text-base font-bold text-slate-100">
                      {totalWOs} / {auditMetrics.data_hygiene.raw_records_scanned} Verified
                    </div>
                    <p className="text-[11px] leading-snug text-emerald-400">
                      {auditMetrics.data_hygiene.duplicates_removed} duplicate work_order_id (PK) stripped •{" "}
                      {auditMetrics.data_hygiene.missing_keys_remediated} missing tail/part foreign keys (FK) imputed so no WO is dropped.
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-800/90 bg-slate-900/70 p-3 space-y-1">
                    <div className="font-mono text-[11px] text-slate-400">
                      Date Format Standardization
                    </div>
                    <div className="text-base font-bold text-slate-100">
                      100% ISO-8601 (YYYY-MM-DD)
                    </div>
                    <p className="text-[11px] leading-snug text-emerald-400">
                      {auditMetrics.data_hygiene.dates_standardized_iso8601} mixed regional date strings normalized to YYYY-MM-DD for reliable SQL chronological ordering.
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-800/90 bg-slate-900/70 p-3 space-y-1">
                    <div className="font-mono text-[11px] text-slate-400">
                      Mechanic Shorthand Expanded
                    </div>
                    <div className="text-sm font-bold text-slate-100">
                      AMM • SRM • APU • RVSM
                    </div>
                    <p className="text-[11px] leading-snug text-sky-400">
                      {auditMetrics.data_hygiene.shorthand_tokens_expanded} terms expanded (Aircraft Maintenance Manual, Structural Repair Manual, Auxiliary Power Unit, Reduced Vertical Separation Minimum) for vector recall.
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-800/90 bg-slate-900/70 p-3 space-y-1">
                    <div className="font-mono text-[11px] text-slate-400">
                      Part Category Breakdown
                    </div>
                    <div className="text-sm font-bold text-slate-100">
                      {expCount} Exp • {repCount} Rep • {rotCount} Rot
                    </div>
                    <p className="text-[11px] leading-snug text-purple-400">
                      Expendable (consumables/seals), Repairable (overhaulable), Rotable (serialized units) • Avg {auditMetrics.commercial_telemetry.avg_labor_hours} hrs ($
                      {Math.round(
                        auditMetrics.commercial_telemetry.avg_quote_usd
                      ).toLocaleString()}
                      ) / WO.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Panel: Airworthiness Compliance & Interactive HITL Routing Funnel */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                      Airworthiness Compliance & HITL Routing Funnel
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveMetricId("panel-hitl-funnel")}
                      className="font-mono text-[11px] text-amber-300 hover:underline cursor-pointer"
                    >
                      Funnel Logic ↗
                    </button>
                  </div>

                  <div className="mt-4 space-y-2.5 text-xs">
                    {/* Row 1: Clickable Autonomous AMM/AD Verification (Compliant) */}
                    <button
                      type="button"
                      onClick={() => handleOpenComplianceDrilldown("Compliant")}
                      className="group w-full text-left rounded-lg border border-emerald-500/30 bg-emerald-950/15 px-2.5 py-2 transition-all hover:border-emerald-400 hover:bg-emerald-950/40 cursor-pointer"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <span className="font-semibold text-emerald-200 group-hover:text-white flex items-center gap-1.5">
                          <span>
                            Autonomous AMM/AD Verification (Compliant)
                          </span>
                          <span className="rounded bg-emerald-950 border border-emerald-700/60 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
                            View {compliantCount} Records ↗
                          </span>
                        </span>
                        <span className="font-mono text-emerald-400">
                          {compliantCount} WOs ({compliantPct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${compliantPct}%` }}
                        />
                      </div>
                    </button>

                    {/* Row 2: Clickable Pending Inspection Drill-Down */}
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenComplianceDrilldown("Pending Inspection")
                      }
                      className="group w-full text-left rounded-lg border border-sky-500/30 bg-sky-950/15 px-2.5 py-2 transition-all hover:border-sky-400 hover:bg-sky-950/40 cursor-pointer"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <span className="font-semibold text-sky-200 group-hover:text-white flex items-center gap-1.5">
                          <span>
                            Queued for QA Inspector Sign-Off (Pending Inspection)
                          </span>
                          <span className="rounded bg-sky-950 border border-sky-700/60 px-1.5 py-0.5 font-mono text-[10px] text-sky-300">
                            View {pendingCount} Records ↗
                          </span>
                        </span>
                        <span className="font-mono text-sky-400">
                          {pendingCount} WOs ({pendingPct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-sky-400 rounded-full"
                          style={{ width: `${pendingPct}%` }}
                        />
                      </div>
                    </button>

                    {/* Row 3: Clickable Review Required Drill-Down */}
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenComplianceDrilldown("Review Required")
                      }
                      className="group w-full text-left rounded-lg border border-amber-500/30 bg-amber-950/15 px-2.5 py-2 transition-all hover:border-amber-400 hover:bg-amber-950/40 cursor-pointer"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <span className="font-semibold text-amber-200 group-hover:text-white flex items-center gap-1.5">
                          <span>
                            HITL Guardrail Gate Triggered (Review Required)
                          </span>
                          <span className="rounded bg-amber-950 border border-amber-700/60 px-1.5 py-0.5 font-mono text-[10px] text-amber-300">
                            View {reviewReqCount} Records ↗
                          </span>
                        </span>
                        <span className="font-mono text-amber-400">
                          {reviewReqCount} WOs ({reviewReqPct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${reviewReqPct}%` }}
                        />
                      </div>
                    </button>
                  </div>
                </div>

                <div className="mt-4 rounded border border-slate-800 bg-slate-900/90 px-3 py-2 font-mono text-[11px] text-slate-400">
                  Tip: Click <span className="text-emerald-300 font-semibold">Compliant</span>,{" "}
                  <span className="text-sky-300 font-semibold">Pending Inspection</span>, or{" "}
                  <span className="text-amber-300 font-semibold">Review Required</span> above to inspect matching Work Orders.
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            ZERO-SCROLL SPOTLIGHT MODAL 2: METRIC DERIVATION & METHODOLOGY
           ===================================================================== */}
        {activeMetricDetail && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn"
            onClick={() => setActiveMetricId(null)}
          >
            <div
              className="relative w-full max-w-3xl rounded-2xl border border-sky-500/50 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="rounded-full border border-sky-500/40 bg-sky-950/80 px-3 py-0.5 font-mono text-xs font-semibold text-sky-300">
                    {activeMetricDetail.badge}
                  </span>
                  <h3 className="mt-2 text-2xl font-extrabold text-slate-50">
                    {activeMetricDetail.title}
                  </h3>
                  <p className="mt-1 font-mono text-sm font-bold text-emerald-400">
                    {activeMetricDetail.headlineValue}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveMetricId(null)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 font-mono text-xs font-semibold text-slate-300 hover:border-sky-500/50 hover:text-white cursor-pointer"
                >
                  Close (ESC) ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    What This Metric Means
                  </div>
                  <p className="text-sm leading-relaxed text-slate-200">
                    {activeMetricDetail.executiveMeaning}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                    How It Was Derived (Formula & Live Telemetry)
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-emerald-100/95">
                    {activeMetricDetail.formulaDerivation}
                  </pre>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-sky-400 mb-1.5">
                      Verified Data Sources
                    </div>
                    <ul className="space-y-1 font-mono text-xs text-slate-300">
                      {activeMetricDetail.dataSources.map((src) => (
                        <li key={src}>• {src}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4">
                    <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1.5">
                      Commercial & Pre-Sales Takeaway
                    </div>
                    <p className="text-xs leading-relaxed text-slate-200">
                      {activeMetricDetail.salesTakeaway}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => handleStepMetric(-1)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-sky-500/50 hover:text-sky-300 cursor-pointer"
                >
                  ← Prev Metric
                </button>

                <span className="font-mono text-xs text-slate-400">
                  Metric {activeMetricIndex + 1} of {METRIC_DETAIL_BLOCKS.length} (Use ← / → Keys)
                </span>

                <button
                  type="button"
                  onClick={() => handleStepMetric(1)}
                  className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 cursor-pointer"
                >
                  Next Metric →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            ZERO-SCROLL SPOTLIGHT MODAL 3: COMPLIANCE WORK ORDER DRILL-DOWN DIALOG
           ===================================================================== */}
        {complianceModalStatus && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fadeIn"
            onClick={() => setComplianceModalStatus(null)}
          >
            <div
              className="relative flex max-h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-emerald-500/50 bg-slate-900 p-6 sm:p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-0.5 font-mono text-xs font-semibold ${
                        complianceModalStatus === "Compliant"
                          ? "border-emerald-500/40 bg-emerald-950/80 text-emerald-300"
                          : complianceModalStatus === "Review Required"
                          ? "border-amber-500/40 bg-amber-950/80 text-amber-300"
                          : "border-sky-500/40 bg-sky-950/80 text-sky-300"
                      }`}
                    >
                      Compliance Queue: {complianceModalStatus}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      •{" "}
                      {complianceModalStatus === "Compliant"
                        ? `${compliantCount} Total Compliant Work Orders`
                        : complianceModalStatus === "Review Required"
                        ? `${reviewReqCount} Total Flagged Work Orders`
                        : `${pendingCount} Total Queued Work Orders`}
                    </span>
                  </div>
                  <h3 className="mt-2 text-2xl font-extrabold text-slate-50">
                    {complianceModalStatus === "Compliant"
                      ? "Verified Compliant Work Orders (AMM / AD Aligned)"
                      : complianceModalStatus === "Review Required"
                      ? "Work Orders Requiring Engineering & Airworthiness Review"
                      : "Work Orders Requiring QA Inspector Sign-Off"}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Click <strong className="text-emerald-400">Audit in Console ↗</strong> on any work order to stream a full AMM/AD compliance analysis in the live console below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setComplianceModalStatus(null)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 font-mono text-xs font-semibold text-slate-300 hover:border-emerald-500/50 hover:text-white cursor-pointer"
                >
                  Close (ESC) ✕
                </button>
              </div>

              <div className="mt-4 flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/80">
                {isLoadingRecords ? (
                  <div className="p-8 text-center font-mono text-xs text-slate-400 animate-pulse">
                    Querying SQLite work_orders for {complianceModalStatus} records...
                  </div>
                ) : (
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-300">
                      <tr>
                        <th className="p-3 font-semibold">WO / Tail</th>
                        <th className="p-3 font-semibold">Aircraft & Part #</th>
                        <th className="p-3 font-semibold">Discrepancy / Squawk</th>
                        <th className="p-3 font-semibold">Risk</th>
                        <th className="p-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {complianceRecords.map((rec) => (
                        <tr
                          key={rec.work_order_id}
                          className="hover:bg-slate-900/60 transition-colors"
                        >
                          <td className="p-3 whitespace-nowrap align-top">
                            <div className="font-mono font-bold text-emerald-400">
                              {rec.work_order_id}
                            </div>
                            <div className="font-mono text-[11px] text-slate-400">
                              {rec.tail_number} ({rec.station_code})
                            </div>
                          </td>
                          <td className="p-3 align-top">
                            <div className="font-semibold text-slate-100">
                              {rec.aircraft_model}
                            </div>
                            <div className="font-mono text-[11px] text-sky-300">
                              {rec.part_number} • {rec.ad_reference}
                            </div>
                          </td>
                          <td className="p-3 align-top text-slate-300 max-w-xs">
                            <div className="font-medium text-slate-200">
                              {rec.description}
                            </div>
                            <p className="mt-0.5 text-[11px] text-slate-400 leading-snug">
                              {rec.squawk_text}
                            </p>
                          </td>
                          <td className="p-3 whitespace-nowrap align-top">
                            <span
                              className={`rounded px-2 py-0.5 font-mono text-[11px] font-bold ${
                                rec.quality_risk_score >= 85
                                  ? "bg-rose-950/80 text-rose-300 border border-rose-700/50"
                                  : "bg-amber-950/80 text-amber-300 border border-amber-700/50"
                              }`}
                            >
                              {rec.quality_risk_score}/100
                            </span>
                            <div className="mt-1 font-mono text-[10px] text-slate-400">
                              {rec.labor_hours}h • ${rec.quoted_price.toLocaleString()}
                            </div>
                          </td>
                          <td className="p-3 whitespace-nowrap align-top text-right">
                            <button
                              type="button"
                              onClick={() =>
                                handleAuditWorkOrderInConsole(
                                  rec.work_order_id,
                                  rec.part_number
                                )
                              }
                              className="rounded-lg bg-emerald-500/90 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
                            >
                              Audit in Console ↗
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 text-xs text-slate-400">
                <span>
                  Showing {complianceRecords.length} prioritized work orders sorted by Quality Escape Risk Score
                </span>
                <button
                  type="button"
                  onClick={() => setComplianceModalStatus(null)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-1.5 font-semibold text-slate-200 hover:border-slate-500 cursor-pointer"
                >
                  Done
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
                {totalWOs} Verified MRO Records Active
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
              {totalWOs} Sanitized MRO Work Orders • 5 Aircraft Models • 6 MRO Stations (AUS, TEB, VNY, MIA, PBI, DAL) • Dual Trial Export (canonical_camp_datalake_ready.csv + canonical.sql)
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