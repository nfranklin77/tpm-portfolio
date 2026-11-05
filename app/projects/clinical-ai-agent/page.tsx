import Link from "next/link";

export default function ClinicalAIAgentProject() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-24 text-slate-50 sm:px-12">
      <div className="mx-auto max-w-5xl">
        
        {/* Navigation */}
        <Link 
          href="/projects" 
          className="group mb-8 inline-flex items-center text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
          Back to Projects Hub
        </Link>

        {/* Header & Badges */}
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <span className="rounded-full bg-emerald-950/80 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-800/50">
            LangGraph State Machine
          </span>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300 border border-slate-700">
            UT Austin Postgrad Deliverable
          </span>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300 border border-slate-700">
            Healthcare / PHI Compliance
          </span>
        </div>

        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-50">
          Guardrailed Clinical AI & EHR Navigation Agent
        </h1>
        <p className="mt-4 text-xl text-slate-400 leading-relaxed">
          An auditable, privacy-preserving single-agent architecture built with LangGraph that translates complex Electronic Health Record (EHR) telemetry into plain-language patient education while enforcing strict deterministic clinical boundaries.
        </p>

        {/* Action Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="https://github.com/nfranklin77/clinical-guardrail-agent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm hover:bg-emerald-400 transition-colors"
          >
            View GitHub Repository & Codebase →
          </a>
          <a
            href="https://colab.research.google.com/github/nfranklin77/clinical-guardrail-agent/blob/main/Nickolas_Franklin_Project_2.ipynb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900/80 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
          >
            Launch Notebook in Google Colab
          </a>
        </div>

        {/* Executive Problem & Architectural Solution */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8">
            <h2 className="text-lg font-bold text-slate-200 mb-3">The Operational Challenge</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Healthcare networks face surging portal message volumes because patients struggle to interpret raw lab flags, discharge summaries, and medication regimens. However, deploying unconstrained LLMs over EHR databases introduces severe liabilities: hallucinated medical diagnoses, unsafe dosing advice, and unauthorized PHI exposure.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8">
            <h2 className="text-lg font-bold text-emerald-400 mb-3">Safe-by-Design Architecture</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Rather than relying on fragile prompt engineering alone, this system decouples safety enforcement from generative synthesis. It pairs a deterministic policy router with parameterized SQLite EHR tools, curated citation catalogs (NIH/CDC/NHS), and an asymmetric Dual-LLM generator/validator loop.
            </p>
          </div>
        </div>

        {/* System Architecture Breakdown */}
        <h2 className="mt-16 text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">
          Core Engineering Pillars
        </h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">Layer 01 // Guardrails</div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Deterministic Policy Router</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              The <code className="text-emerald-300">policy_route</code> tool evaluates incoming patient prompts against <code className="text-slate-300">safety_policy_rules.csv</code> using strict priority hierarchy (<code className="text-slate-300">escalate_emergency &gt; escalate_clinician &gt; refuse &gt; answer</code>) to hard-block diagnostic or dose-modification requests.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">Layer 02 // Data & Grounding</div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Scoped EHR & Citation Tools</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Eight specialized LangChain tools query the relational <code className="text-slate-300">health_portal.db</code> (141 labs, 56 medications, 43 clinical notes) with strict row caps and join outputs against vetted NIH MedlinePlus and CDC reference catalogs.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">Layer 03 // Verification</div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Asymmetric Dual-LLM Loop</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Optimizes unit economics and clinical safety by routing tool-calling and draft synthesis through <code className="text-emerald-300">gpt-4o-mini</code> (<code className="text-slate-300">temp=0</code>) while reserving <code className="text-emerald-300">gpt-4o</code> (<code className="text-slate-300">temp=0</code>) as an independent compliance and grounding validator.
            </p>
          </div>
        </div>

        {/* Data & Tooling Inventory */}
        <h2 className="mt-16 text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">
          EHR Schema & Agent Tooling Interface
        </h2>
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/40 p-6 font-mono text-xs text-slate-300 overflow-x-auto">
          <pre className="leading-relaxed">{`├── SQLite Operational Store (health_portal.db)
│   ├── get_patient_profile(patient_id)               -> Demographics, language, health_literacy_level
│   ├── list_patient_encounters(patient_id, limit=5)  -> Visit history, specialty, follow-up instructions
│   ├── get_recent_clinical_note(patient_id, type)    -> Latest visit_note or discharge_summary
│   ├── get_clinical_notes_for_encounter(encounter_id)-> Encounter-scoped clinical documentation
│   ├── get_labs(patient_id, test_name, limit=10)     -> LOINC results, numeric values, reference flags
│   ├── get_medications(patient_id, status="active")  -> RxNorm active/stopped regimens & indications
│   └── get_allergies(patient_id)                     -> Recorded substances, reactions, & severities
│
└── Curated Reference & Governance Catalogs (CSV)
    ├── policy_route(user_text)                       -> Evaluates safety_policy_rules.csv
    ├── lookup_lab_education(test_name)               -> Queries patient_friendly_lab_explanations.csv
    ├── lookup_medication_education(med_name)         -> Queries medication_education.csv
    └── lookup_trusted_source(source_id)              -> Verifies citation URLs via trusted_sources_catalog.csv`}</pre>
        </div>

      </div>
    </main>
  );
}