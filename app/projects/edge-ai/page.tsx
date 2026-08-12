import Link from "next/link";

export default function EdgeAiProject() {
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
          Silicon-Optimized Edge AI
        </h1>
        <p className="mt-4 text-xl text-slate-400">
          A hardware-constrained deployment utilizing model quantization (4-bit) and portable Docker containerization to run GenAI inferences on low-power edge devices with zero cloud latency.
        </p>

        <div className="mt-12 space-y-12">
          
          {/* Executive Summary Section */}
          <section className="pt-2">
            <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-4">
              Executive Summary
            </h2>
            <p className="text-slate-400 leading-relaxed">
              For mission-critical operations where internet connectivity is degraded, denied, or insecure, reliance on cloud-based LLM inferences is a fatal single point of failure. This project shrinks advanced AI models to operate entirely on localized edge hardware, demonstrating the intersection of embedded systems engineering and modern Generative AI.
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
                  <span className="text-slate-200 font-bold">Model Quantization:</span> Implementing GGUF/4-bit quantization techniques to compress LLM weights, drastically reducing VRAM footprint without catastrophic precision loss.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Containerized Delivery:</span> Leveraging Docker to create a lightweight, portable inference engine that can be flashed onto IoT edge devices or field laptops uniformly.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Inference Server:</span> Setting up a localized API endpoint (FastAPI) to handle internal device requests and execute prompts purely on available edge compute.
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
                  <span className="text-slate-200 font-bold">Disconnected/Tactical Operations:</span> Guarantees system availability in zero-connectivity environments, critical for defense and remote commercial deployments.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Zero-Latency Execution:</span> Removes network traversal time (API round trips), delivering immediate AI insights essential for time-sensitive operational environments.
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