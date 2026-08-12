import Link from "next/link";

export default function AgenticPmoProject() {
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
          Agentic PMO Orchestrator
        </h1>
        <p className="mt-4 text-xl text-slate-400">
          A multi-agent workflow utilizing LangGraph and the Model Context Protocol (MCP) to automate dependency tracking, risk escalation, and executive reporting across simulated Agile delivery tools.
        </p>

        <div className="mt-12 space-y-12">
          
          {/* Executive Summary Section */}
          <section className="pt-2">
            <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-4">
              Executive Summary
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Transitioning from reactive manual tracking to proactive autonomous governance, this architecture leverages AI agents to continuously monitor project management software. By ingesting live board states and cross-referencing dependencies, the system identifies bottlenecks before they impact release schedules, synthesizing complex delivery data into actionable executive insights.
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
                  <span className="text-slate-200 font-bold">Agent Orchestration:</span> LangGraph utilized to define multi-agent state machines, separating roles between blocker-hunting agents and velocity-tracking agents.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Tool Integration:</span> Model Context Protocol (MCP) and REST APIs implemented for secure, read-only ingestion of ticket data, epic linking, and sprint metrics.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Data Seeding:</span> Python-based synthetic data generation to populate highly realistic, flawed project environments for agent evaluation.
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
                  <span className="text-slate-200 font-bold">Autonomous Governance:</span> Eliminates hours of manual board-scrubbing by establishing persistent, automated oversight of cross-team dependencies and API contracts.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Proactive Risk Mitigation:</span> Calculates statistical slippage probabilities by comparing current sprint burndown against target release dates, flagging risks weeks in advance.
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
              <span className="h-2 w-2 rounded-full bg-amber-500 mr-3 animate-pulse"></span>
              Currently In Development — Repository Coming Soon
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}