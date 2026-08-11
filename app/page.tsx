import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-24 text-slate-50 sm:px-12">
      <div className="mx-auto max-w-5xl text-center">
        
        {/* Eyebrow Badges */}
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <span className="rounded-full bg-slate-800/60 px-4 py-1.5 text-sm font-medium text-slate-300 ring-1 ring-inset ring-slate-700/60">
            Solutions Engineering & Technical Program Management
          </span>
          <span className="rounded-full bg-emerald-950/50 px-4 py-1.5 text-sm font-medium text-emerald-400 ring-1 ring-inset ring-emerald-800/50">
            Enterprise AI Workflows & Mission-Critical Delivery
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          Bridging Complex Engineering & <br className="hidden sm:block" />
          <span className="text-emerald-400">Strategic Program Leadership</span>
        </h1>

        {/* Executive Summary */}
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-400">
          Solutions Engineer and Technical Program Manager with over 15 years of experience turning complex AI initiatives, cloud architecture, and enterprise software into delivered, scalable products.
        </p>

        {/* Interactive Navigation Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 text-left">
          
          {/* Project Card */}
          <Link 
            href="/projects/rag-engine" 
            className="block group rounded-lg border border-slate-800 bg-slate-900/40 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-2xl font-bold text-slate-200 transition-colors group-hover:text-emerald-300">
                Air-Gapped AI RAG Engine
              </h3>
              <span className="text-slate-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-emerald-400">
                &rarr;
              </span>
            </div>
            <p className="text-emerald-400 font-medium mb-3">Technical Architecture Showcase</p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Explore a fully localized, secure Large Language Model pipeline utilizing agentic workflows, built to align with NIST AI RMF and DoD RAI frameworks.
            </p>
          </Link>

          {/* Experience Card */}
          <Link 
            href="/experience" 
            className="block group rounded-lg border border-slate-800 bg-slate-900/40 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-2xl font-bold text-slate-200 transition-colors group-hover:text-emerald-300">
                Leadership & Experience
              </h3>
              <span className="text-slate-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-emerald-400">
                &rarr;
              </span>
            </div>
            <p className="text-emerald-400 font-medium mb-3">20+ Year Professional Timeline</p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Review my trajectory from USAF active duty to leading massive-scale federal software deployments and managing defense enterprise portfolios.
            </p>
          </Link>

        </div>
      </div>
    </main>
  );
}