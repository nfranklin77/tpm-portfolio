import Link from "next/link";

export default function LlmOpsProject() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-24 text-slate-50 sm:px-12">
      <div className="mx-auto max-w-4xl">
        
        {/* Back Navigation */}
        <Link 
          href="/projects" 
          className="group mb-8 inline-flex items-center text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
          Back to Projects
        </Link>

        {/* Header */}
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-200">
          LLMOps Governance Pipeline
        </h1>
        <p className="mt-4 text-xl text-slate-400">
          A continuous integration guardrail system utilizing LangSmith and LlamaGuard to track inference latency, token cloud costs, and output safety for commercial GA readiness.
        </p>

        <div className="mt-12 space-y-12">
          
          {/* Executive Summary Section */}
          <section className="pt-2">
            <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-4">
              Executive Summary
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Generative AI introduces unpredictable outputs and dynamic cloud costs. This project architects a robust LLMOps pipeline designed to instrument observability across every AI invocation. By implementing programmatic guardrails and cost-tracking mechanisms, it ensures enterprise AI deployments remain aligned with brand safety, compliance mandates, and budgetary constraints.
            </p>
          </section>

          {/* Technical Architecture Section */}
          <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-8">
            <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-2">
              Proposed Technical Architecture & Data Foundation
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Observability & Tracing:</span> LangSmith integrated into the application layer to capture deep execution traces, latency metrics, and human-in-the-loop feedback loops.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Automated Guardrails:</span> LlamaGuard deployed as an intermediary validation layer to classify and intercept harmful, out-of-scope, or prompt-injected user inputs.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Evaluation Metrics:</span> CI/CD pipelines configured to run deterministic and LLM-as-a-judge evaluations against a golden dataset prior to production release.
                </p>
              </li>
            </ul>
          </section>

          {/* TPM Impact Section */}
          <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-8">
            <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-2">
              TPM Impact: Governance, Trust, & Continuous Deployment
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Cost Control & FinOps:</span> Extracts exact token usage per transaction, allowing programmatic throttling and detailed cost attribution for finance and product stakeholders.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Commercial Readiness (GA):</span> Provides the quantitative assurance and safety alignment required to move experimental AI features into user-facing general availability.
                </p>
              </li>
            </ul>
          </section>

          {/* Status Section */}
          <section className="pt-4">
            <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-4">
              Development Status
            </h2>
            <div className="inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-400">
              <span className="h-2 w-2 rounded-full bg-slate-500 mr-3"></span>
              Future Pipeline Initiative
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}