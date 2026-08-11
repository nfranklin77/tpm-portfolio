import Link from "next/link";

export default function RagEngineProject() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-24 text-slate-50 sm:px-12">
      <div className="mx-auto max-w-4xl">
        
        {/* Back Navigation */}
        <Link href="/" className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors">
          &larr; Back to Overview
        </Link>
        
        {/* Project Header */}
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Air-Gapped AI RAG Engine
        </h1>
        <p className="mt-4 text-xl text-slate-400">
          A secure, locally hosted Retrieval-Augmented Generation pipeline built to evaluate technical workflows against the NIST AI Risk Management Framework.
        </p>
        
        {/* Content Sections */}
        <div className="mt-16 space-y-16">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">Executive Summary</h2>
            <p className="mt-6 text-slate-400 leading-relaxed">
              Designed and deployed a fully air-gapped, local Large Language Model (LLM) architecture to synthesize and analyze proprietary documents without transmitting sensitive data to external APIs. This project demonstrates the intersection of modern AI solutions engineering and stringent enterprise compliance requirements, ensuring zero-trust data privacy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">Technical Architecture</h2>
            <ul className="mt-6 space-y-4 text-slate-400">
              <li className="flex items-start">
                <span className="mr-3 text-emerald-400">▹</span>
                <div><strong className="text-slate-200">LLM Engine:</strong> Llama 3.2 running locally via Ollama for zero-latency, private inference.</div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-emerald-400">▹</span>
                <div><strong className="text-slate-200">Vector Database:</strong> ChromaDB utilized for generating, storing, and querying document embeddings locally.</div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-emerald-400">▹</span>
                <div><strong className="text-slate-200">Orchestration & Data Ingestion:</strong> LangChain framework employed for PDF parsing, recursive character text splitting, and multi-document vector retrieval.</div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">TPM Impact & Compliance Integration</h2>
            <p className="mt-6 text-slate-400 leading-relaxed">
              Managing this pipeline required continuous retrieval tuning. By enforcing expanded context windows and designing strict synthesis prompts, the system successfully mitigates AI hallucinations. The architecture explicitly maps multi-document queries to the <strong>Govern, Map, Measure, and Manage</strong> functions of the NIST AI RMF, proving the deployment can handle audit-ready compliance standards for commercial tech giants and defense sectors alike.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">Source Code</h2>
            <p className="mt-6 text-slate-400 leading-relaxed">
              The full Python architecture and continuous deployment configuration are available for review in the public repository.
            </p>
            <div className="mt-4">
              <a 
                href="https://github.com/nfranklin77/airgapped-rag-pipeline" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
              >
                View Repository on GitHub &rarr;
              </a>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}