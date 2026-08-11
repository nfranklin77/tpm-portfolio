import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-24 text-slate-50 sm:px-12">
      <div className="mx-auto max-w-4xl text-center">
        
        {/* Eyebrow Label */}
        <div className="mb-6 flex justify-center">
          <span className="rounded-full bg-slate-800/50 px-4 py-1.5 text-sm font-medium text-slate-300 ring-1 ring-inset ring-slate-700/50">
            Enterprise Architecture & Solutions Engineering
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
          Architecting <span className="text-emerald-400">Secure AI</span> <br className="hidden sm:block" />
          & Mission-Critical Systems
        </h1>

        {/* Executive Summary */}
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-400">
          Over 15 years of experience leading complex technical programs, managing massive enterprise portfolios, and building resilient, air-gapped machine learning workflows. 
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="#projects"
            className="rounded-md bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 transition-colors"
          >
            View Technical Architecture
          </Link>
          <Link
            href="#experience"
            className="text-sm font-semibold leading-6 text-slate-200 hover:text-white transition-colors"
          >
            Leadership Experience <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}