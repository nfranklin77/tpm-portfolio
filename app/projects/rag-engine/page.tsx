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
          Air-Gapped AI RAG Engine: A Responsible AI (RAI) Architecture
        </h1>
        <p className="mt-4 text-xl text-slate-400">
          A secure, locally hosted Retrieval-Augmented Generation (RAG) pipeline built to bridge commercial AI agility with rigorous enterprise and federal governance standards.
        </p>
        
        {/* Content Sections */}
        <div className="mt-16 space-y-16">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">Executive Summary</h2>
            <p className="mt-6 text-slate-400 leading-relaxed">
              Designed and deployed a fully air-gapped Large Language Model (LLM) architecture utilizing agentic workflows to synthesize proprietary documents without transmitting sensitive data to external APIs. Drawing on experience managing complex, high-stakes deployments in disconnected and secure environments, this project demonstrates how to rapidly field commercial-grade AI while maintaining zero-trust data privacy. It serves as a blueprint for organizations—from defense-tech startups to commercial hyperscalers—seeking to deploy AI responsibly and securely.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">Technical Architecture & Data Foundation</h2>
            <ul className="mt-6 space-y-4 text-slate-400">
              <li className="flex items-start">
                <span className="mr-3 text-emerald-400">▹</span>
                <div><strong className="text-slate-200">LLM Engine:</strong> Llama 3.2 running locally via Ollama for zero-latency, private inference, aligning with modern decentralized computing needs.</div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-emerald-400">▹</span>
                <div><strong className="text-slate-200">Vector Database:</strong> ChromaDB utilized for generating, storing, and querying document embeddings locally, ensuring high-quality foundational data management.</div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-emerald-400">▹</span>
                <div><strong className="text-slate-200">Orchestration:</strong> LangChain framework employed for multi-document vector retrieval and recursive character text splitting.</div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">TPM Impact: Governance, Trust, & Continuous Deployment</h2>
            <p className="mt-6 text-slate-400 leading-relaxed">
              As a Technical Program Manager, successfully scaling AI requires moving beyond basic implementation and establishing a "journey to trust." This pipeline was engineered with strict adherence to established AI governance frameworks, including the NIST AI RMF and the DoD's Responsible AI (RAI) guidelines. 
            </p>
            <ul className="mt-4 space-y-4 text-slate-400 list-disc pl-6">
              <li><strong>Test, Evaluation, Verification, and Validation (TEVV):</strong> The system mitigates AI hallucinations through continuous retrieval tuning, expanded context windows, and strict synthesis prompts, ensuring operator confidence and reliability.</li>
              <li><strong>Iterative Prototyping:</strong> Built to support a fast, flexible, and collaborative mechanism that lowers barriers to entry, allowing rapid capability delivery at commercial speeds without sacrificing compliance.</li>
              <li><strong>Agile Adoption:</strong> The architecture supports an agile feedback loop, allowing for continuous integration and deployment while treating data securely as a foundational enterprise product.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">Source Code & CI/CD Pipeline</h2>
            <p className="mt-6 text-slate-400 leading-relaxed">
              The full Python architecture and continuous deployment configuration are available for review.
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