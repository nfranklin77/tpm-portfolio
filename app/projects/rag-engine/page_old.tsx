import Link from "next/link";
import RagChatbot from "@/components/RagChatbot";

export default function RagEngineProject() {
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
          Air-Gapped AI RAG Engine: A Responsible AI (RAI) Architecture
        </h1>
        <p className="mt-4 text-xl text-slate-400">
          A secure, locally hosted Retrieval-Augmented Generation (RAG) pipeline built to bridge commercial AI agility with rigorous enterprise and federal governance standards.
        </p>

        <div className="mt-12 space-y-12">
          
          {/* Executive Summary Section */}
          <section className="pt-2">
            <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-4">
              Executive Summary
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Designed and deployed a fully air-gapped Large Language Model (LLM) architecture utilizing agentic workflows to synthesize proprietary documents without transmitting sensitive data to external APIs. Drawing on experience managing complex, high-stakes deployments in disconnected and secure environments, this project demonstrates how to rapidly field commercial-grade AI while maintaining zero-trust data privacy. It serves as a blueprint for organizations—from defense-tech startups to commercial hyperscalers—seeking to deploy AI responsibly and securely.
            </p>
	    {/* Interactive Chat UI */}
            <RagChatbot />
          </section>

          {/* Technical Architecture Section */}
          <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-8">
            <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-2">
              Technical Architecture & Data Foundation
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">LLM Engine:</span> Llama 3.2 running locally via Ollama for zero-latency, private inference, aligning with modern decentralized computing needs.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Vector Database:</span> ChromaDB utilized for generating, storing, and querying document embeddings locally, ensuring high-quality foundational data management.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Orchestration:</span> LangChain framework employed for multi-document vector retrieval and recursive character text splitting.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Embeddings (Nomic):</span> Implemented local Nomic embeddings to transform unstructured text into high-dimensional vectors efficiently on consumer hardware.
                </p>
              </li>
            </ul>
          </section>

          {/* TPM Impact Section */}
          <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-8">
            <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-2">
              TPM Impact: Governance, Trust, & Continuous Deployment
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              As a Technical Program Manager, successfully scaling AI requires moving beyond basic implementation and establishing a &quot;journey to trust.&quot; This pipeline was engineered with strict adherence to established AI governance frameworks, including the NIST AI RMF and the DoD&apos;s Responsible AI (RAI) guidelines.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Zero-Trust Security & Compliance:</span> Eliminated data leakage risks by processing all queries and documents locally, meeting strict defense-grade security protocols.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">NIST AI RMF Alignment:</span> Mapped system architecture and data handling processes directly to the NIST AI Risk Management Framework to establish baseline governance.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Cloud Cost Avoidance:</span> Shifted inference and embedding workloads away from metered cloud APIs, resulting in a 100% reduction in per-token operational cloud costs.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Rapid Prototyping & Delivery:</span> Accelerated the discovery-to-deployment lifecycle by utilizing open-source models, allowing for rapid iteration without procurement blockers.
                </p>
              </li>
            </ul>
          </section>

          {/* Source Code & CI/CD Pipeline Section */}
          <section className="pt-4">
            <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-4">
              Source Code & CI/CD Pipeline
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              The full Python architecture and continuous deployment configuration are available for review.
            </p>
            <a 
              href="https://github.com/nfranklin77/airgapped-rag-pipeline" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              View Repository on GitHub &rarr;
            </a>
          </section>

        </div>
      </div>
    </main>
  );
}