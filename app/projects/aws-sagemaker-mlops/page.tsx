import Link from "next/link";

export default function AwsSagemakerProject() {
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
          AWS SageMaker MLOps
        </h1>
        <p className="mt-4 text-xl text-slate-400">
          An enterprise cloud-native deployment pipeline demonstrating IAM security compliance, model registry orchestration, and endpoint provisioning within AWS ecosystem constraints.
        </p>

        <div className="mt-12 space-y-12">
          
          {/* Executive Summary Section */}
          <section className="pt-2">
            <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-4">
              Executive Summary
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Moving machine learning models from local experimentation to production requires rigorous infrastructure management. This architecture outlines a standard enterprise deployment flow within AWS, focusing on secure endpoint creation, model versioning, and strict access controls to ensure compliance with commercial cloud security standards.
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
                  <span className="text-slate-200 font-bold">Model Registry:</span> AWS SageMaker utilized to version and track model artifacts, establishing a clear lineage from training data to production deployment.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Cloud Infrastructure (IaC):</span> Provisioning of S3 buckets and SageMaker endpoints mapped via Terraform or CloudFormation for repeatable, code-driven deployments.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Security & Identity:</span> Strict adherence to AWS IAM least-privilege principles, ensuring decoupled execution roles for training jobs and endpoint hosting.
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
                  <span className="text-slate-200 font-bold">Enterprise Scalability:</span> Establishes a foundational pattern for deploying highly available ML endpoints capable of auto-scaling to meet production traffic demands.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-0.5 text-sm font-bold">▷</span>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-bold">Infrastructure Governance:</span> Translates manual console configurations into auditable IaC, aligning with modern site reliability engineering (SRE) practices.
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
              <span className="h-2 w-2 rounded-full bg-blue-500 mr-3 animate-pulse"></span>
              Currently Architecting — Implementation Planned
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}