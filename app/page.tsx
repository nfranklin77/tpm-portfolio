import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-24 text-slate-50 sm:px-12">
      <div className="mx-auto max-w-5xl">
        {/* Top Executive Positioning Section */}
        <div className="text-center">
          {/* Eyebrow Badges */}
          <div className="mb-6 flex flex-wrap justify-center gap-3">
            <span className="rounded-full bg-slate-800/60 px-4 py-1.5 text-sm font-medium text-slate-300 ring-1 ring-inset ring-slate-700/60">
              AI Solutions Engineering &amp; Technical Program Leadership
            </span>
            <span className="rounded-full bg-emerald-950/50 px-4 py-1.5 text-sm font-medium text-emerald-400 ring-1 ring-inset ring-emerald-800/50">
              Enterprise AI Architecture • Mission-Critical Delivery
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Bridging Complex AI Engineering &amp;{" "}
            <span className="text-emerald-400">
              Strategic Delivery Leadership
            </span>
          </h1>

          {/* Executive Summary */}
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-400">
            Solutions Engineer and Technical Program Manager with 15+ years of
            experience turning complex AI initiatives, cloud modernization, and
            regulated enterprise programs into production-ready systems.
          </p>
        </div>

        {/* Primary Interactive Navigation Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 text-left">
          {/* Projects Hub Card */}
          <div className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-emerald-500/10">
            <div>
              <Link href="/projects" className="block">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-slate-100 transition-colors group-hover:text-emerald-300">
                    Enterprise AI Architecture Hub
                  </h3>
                  <span className="text-slate-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-emerald-400">
                    &rarr;
                  </span>
                </div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-emerald-800/60 bg-emerald-950/70 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-400">
                    2 Live Production Blueprints
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    • 6 Total Architectures
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Explore end-to-end applied AI systems spanning our{" "}
                  <strong className="text-slate-200">
                    Enterprise MRO Data &amp; AI Operations Engine
                  </strong>{" "}
                  (schema-agnostic ETL, dynamic SQLite introspection, and HITL
                  airworthiness guardrails),{" "}
                  <strong className="text-slate-200">
                    Air-Gapped Localized RAG
                  </strong>{" "}
                  (NIST AI RMF / DoD RAI), multi-agent{" "}
                  <strong className="text-slate-200">LangGraph / MCP</strong>{" "}
                  orchestration, AWS SageMaker MLOps, and silicon-optimized edge
                  AI.
                </p>
              </Link>
            </div>

            {/* Direct Quick-Launch Deep Links to Live Interactive Blueprints */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs font-mono">
              <Link
                href="/projects/enterprise-mro"
                className="rounded-md border border-emerald-500/40 bg-emerald-950/50 px-2.5 py-1.5 text-emerald-300 hover:bg-emerald-900/60 hover:text-white transition-colors"
              >
                Enterprise MRO Engine ↗
              </Link>
              <Link
                href="/projects/rag-engine"
                className="rounded-md border border-slate-700 bg-slate-950/80 px-2.5 py-1.5 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
              >
                Air-Gapped RAG Engine ↗
              </Link>
            </div>
          </div>

          {/* Experience Card */}
          <Link
            href="/experience"
            className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-bold text-slate-100 transition-colors group-hover:text-emerald-300">
                  Leadership &amp; Delivery Track Record
                </h3>
                <span className="text-slate-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-emerald-400">
                  &rarr;
                </span>
              </div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-sky-800/60 bg-sky-950/70 px-2.5 py-0.5 font-mono text-xs font-medium text-sky-300">
                  Active Secret Clearance
                </span>
                <span className="font-mono text-xs text-slate-400">
                  • 20+ Year Career Timeline
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Review my trajectory from U.S. Air Force active duty to
                serving as government-designated Key Personnel on the{" "}
                <strong className="text-slate-200">
                  $370M U.S. Army IPPS-A
                </strong>{" "}
                deployment, leading Navy and{" "}
                <strong className="text-slate-200">MHS Genesis</strong>{" "}
                portfolios, and driving Solutions Engineering and Technical Delivery across
                defense, financial, and enterprise portfolios.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs text-slate-400">
              <span>Enterprise IT • Federal Defense • Regulated Finance</span>
              <span className="text-emerald-400 group-hover:underline">
                View Timeline →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}