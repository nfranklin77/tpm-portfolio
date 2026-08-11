import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-24 text-slate-50 sm:px-12">
      <div className="mx-auto max-w-4xl text-center">
        
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

        {/* Call to Action Buttons */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="#projects"
            className="rounded-md bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 transition-colors"
          >
            Explore AI RAG Pipeline
          </Link>
          <Link
            href="#experience"
            className="text-sm font-semibold leading-6 text-slate-200 hover:text-white transition-colors"
          >
            View Program Experience <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}