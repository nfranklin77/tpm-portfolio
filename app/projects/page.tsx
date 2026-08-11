import Link from "next/link";

export default function ProjectsHub() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-24 text-slate-50 sm:px-12">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Technical Architecture & AI Delivery
        </h1>
        <p className="mt-4 text-xl text-slate-400">
          A portfolio of secure AI deployments, MLOps infrastructure, and agentic workflows built to bridge the gap between commercial innovation and enterprise compliance.
        </p>

        {/* Deployed Projects */}
        <h2 className="mt-16 text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">Deployed Architecture</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          
          <Link 
            href="/projects/rag-engine" 
            className="block group rounded-lg border border-slate-700 bg-slate-900/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold text-slate-200 transition-colors group-hover:text-emerald-300">
                Air-Gapped AI RAG Engine
              </h3>
              <span className="rounded-full bg-emerald-950/80 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-800/50">
                Live
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A fully localized, zero-trust Large Language Model (Llama 3.2) pipeline utilizing ChromaDB and LangChain, mapped to NIST AI RMF and DoD RAI guidelines.
            </p>
          </Link>

        </div>

        {/* In Development Pipeline */}
        <h2 className="mt-16 text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">Pipeline & In-Development</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          
          {/* Agentic PMO */}
          <div className="rounded-lg border border-slate-800 border-dashed bg-slate-950 p-8 opacity-80">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold text-slate-300">Agentic PMO Orchestrator</h3>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400 border border-slate-700">
                In Progress
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              A multi-agent workflow utilizing LangGraph and the Model Context Protocol (MCP) to automate dependency tracking, risk escalation, and executive reporting across simulated Agile delivery tools.
            </p>
          </div>

          {/* AWS SageMaker */}
          <div className="rounded-lg border border-slate-800 border-dashed bg-slate-950 p-8 opacity-80">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold text-slate-300">AWS SageMaker MLOps</h3>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400 border border-slate-700">
                Architecting
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              An enterprise cloud-native deployment pipeline demonstrating IAM security compliance, model registry orchestration, and endpoint provisioning within AWS ecosystem constraints.
            </p>
          </div>

          {/* LLMOps Governance */}
          <div className="rounded-lg border border-slate-800 border-dashed bg-slate-950 p-8 opacity-80">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold text-slate-300">LLMOps Governance Pipeline</h3>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400 border border-slate-700">
                Planned
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              A continuous integration guardrail system utilizing LangSmith and LlamaGuard to track inference latency, token cloud costs, and output safety for commercial GA readiness.
            </p>
          </div>

          {/* Edge AI */}
          <div className="rounded-lg border border-slate-800 border-dashed bg-slate-950 p-8 opacity-80">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold text-slate-300">Silicon-Optimized Edge AI</h3>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400 border border-slate-700">
                Planned
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              A hardware-constrained deployment utilizing model quantization (4-bit) and portable Docker containerization to run GenAI inferences on low-power edge devices with zero cloud latency.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}