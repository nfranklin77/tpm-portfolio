"use client";

import Link from "next/link";
import { useState } from "react";

// 1. Define the Timeline Data Structure
const timelineData = [
  {
    id: 1,
    title: "Solutions Engineer",
    company: "Nakupuna Companies | Jan 2024 – Aug 2026",
    summary: "Managed technical intake pipelines and program governance across enterprise defense portfolios. Served as the government-designated Key Personnel driving multi-team cloud modernization for the $370M Army IPPS-A deployment before transitioning internally to direct delivery cycles and cross-system alignment for a dedicated Navy portfolio.",
    extendedBullets: [
      "[Add your unpublished metric or outcome here... e.g., 'Scaled X teams to achieve Y% increase in deployment velocity.']",
      "[Add deep-dive technical accomplishment here... e.g., 'Architected zero-trust compliance framework across Z systems.']",
    ],
  },
  {
    id: 2,
    title: "Digital Transformation Lead",
    company: "DLH Corporation | Apr 2017 – Jan 2024",
    summary: "Accelerated the multi-billion-dollar MHS Genesis deployment by replacing heavy governance with lean execution playbooks. Aligned 60+ distributed product teams, upskilled 100+ developers, boosted overall software release velocity by 20%, and received a FedHealthIT Innovation Award for technical playbook design.",
    extendedBullets: [
      "[Insert specific Agile coaching breakthrough or metric...]",
      "[Detail the playbook creation process that won the FedHealthIT Innovation Award...]",
    ],
  },
  {
    id: 3,
    title: "Solutions Delivery Lead",
    company: "Franklin Consulting Group, LLC | Feb 2012 – Mar 2017",
    summary: "Established a Technical Delivery Office for cloud-native applications at FINRA. Managed distributed engineering teams at Capital One to accelerate legacy monolith-to-microservices migrations. Led executive steering and AWS cloud integrations for The Carlyle Group.",
    extendedBullets: [
      "[Highlight specific API blocker resolutions at Capital One...]",
      "[Discuss executive steering strategies used at The Carlyle Group...]",
    ],
  },
  {
    id: 4,
    title: "Federal IT & Technical Program Management",
    company: "VA, DTRA, AT&T, & PwC | Sep 2006 – Feb 2012",
    summary: "Built a foundation in enterprise scale integration, delivering a $10M classified VPN deployment for Joint Forces, executing NIST vulnerability assessments, and managing $11M enterprise Knowledge Management COTS solutions across multiple federal agencies.",
    extendedBullets: [
      "[Expand on the zero-downtime VPN deployment...]",
      "[Detail the 40% reduction in FISMA compliance deficiencies at the FBI...]",
    ],
  },
  {
    id: 5,
    title: "Computer & Communications Officer",
    company: "United States Air Force | Jan 2002 – Sep 2006",
    summary: "Exercised mission command and technical mentorship over 60+ active-duty engineers. Engineered secure, tactical infrastructure for 25K+ warfighters during forward-deployment missions in Afghanistan and Qatar during the initial months of Operation Enduring Freedom.",
    extendedBullets: [
      "[Share specific expeditionary systems delivery outcomes...]",
      "[Highlight leadership tactics used in forward-deployed environments...]",
    ],
  },
];

export default function Experience() {
  // 2. State to track which timeline item is expanded
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-24 text-slate-50 sm:px-12">
      <div className="mx-auto max-w-4xl">
        
        {/* Back Navigation */}
        <Link href="/" className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors">
          &larr; Back to Overview
        </Link>
        
        {/* Header */}
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Leadership & Experience
        </h1>
        <p className="mt-4 text-xl text-slate-400">
          A 20+ year trajectory bridging complex enterprise architecture, commercial SaaS delivery, and mission-critical program execution.
        </p>
        
        {/* Interactive Timeline Section */}
        <div className="mt-16 space-y-12 border-l-2 border-slate-800 ml-3 pl-8">
          {timelineData.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div key={item.id} className="relative group">
                
                {/* Dynamic Timeline Dot (Now fully driven by hover and expanded state) */}
                <div 
                  className={`absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-2 bg-slate-950 transition-all duration-300
                    ${isExpanded 
                      ? "border-emerald-400 scale-125 shadow-[0_0_10px_rgba(52,211,153,0.4)]" 
                      : "border-slate-700 group-hover:border-emerald-400 group-hover:scale-125 group-hover:shadow-[0_0_8px_rgba(52,211,153,0.2)]"
                    }
                  `}
                ></div>
                
                {/* Role & Company Header (Clickable) */}
                <button 
                  onClick={() => toggleExpand(item.id)}
                  className="w-full text-left focus:outline-none flex flex-col items-start"
                >
                  <div className="flex w-full items-center justify-between hover:opacity-80 transition-opacity">
                    <h3 className="text-2xl font-bold text-slate-200">{item.title}</h3>
                    
                    {/* Chevron Icon */}
                    <svg 
                      className={`w-6 h-6 text-slate-500 transform transition-transform duration-300 ${isExpanded ? "rotate-180 text-emerald-400" : "group-hover:text-emerald-400/70"}`} 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {/* Dynamic Text Color based on hover/expansion */}
                  <p className={`font-medium mt-1 transition-colors duration-300 ${isExpanded ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'}`}>
                    {item.company}
                  </p>
                </button>

                {/* High-Level Summary */}
                <p className="mt-4 text-slate-400 leading-relaxed">
                  {item.summary}
                </p>

                {/* Expandable Deep-Dive Bullets */}
                <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="rounded-lg bg-slate-900/50 p-6 border border-slate-800">
                      <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">Key Outcomes & Technical Depth</h4>
                      <ul className="list-disc pl-5 space-y-2 text-slate-300">
                        {item.extendedBullets.map((bullet, index) => (
                          <li key={index} className="leading-relaxed">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Education Section */}
        <h2 className="mt-24 text-3xl font-extrabold text-slate-200 border-b border-slate-800 pb-2">Education & Certifications</h2>
        
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          
          {/* Card 1 */}
          <div className="group rounded-lg border border-slate-800 bg-slate-900/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-emerald-500/10">
            <h3 className="text-lg font-bold text-slate-200 transition-colors group-hover:text-emerald-300">Post-Graduate Program in AI Agents</h3>
            <p className="text-emerald-400 font-medium mt-1">University of Texas at Austin</p>
            <p className="mt-2 text-sm text-slate-400">
              Focusing on multi-agent architectures (LangGraph), Agentic RAG, and AI evaluation metrics for enterprise business applications.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group rounded-lg border border-slate-800 bg-slate-900/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-emerald-500/10">
            <h3 className="text-lg font-bold text-slate-200 transition-colors group-hover:text-emerald-300">M.S. in Leadership (Strategic Mgt)</h3>
            <p className="text-emerald-400 font-medium mt-1">Boston University</p>
            <p className="mt-2 text-sm text-slate-400">
              Advanced study in strategic management, organizational behavior, and cross-functional leadership methodologies.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group rounded-lg border border-slate-800 bg-slate-900/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-emerald-500/10">
            <h3 className="text-lg font-bold text-slate-200 transition-colors group-hover:text-emerald-300">B.S. in Computer Information Systems</h3>
            <p className="text-emerald-400 font-medium mt-1">University of Detroit Mercy</p>
            <p className="mt-2 text-sm text-slate-400">
              Foundational degree in software engineering, database architecture, and systems analysis.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group rounded-lg border border-slate-800 bg-slate-900/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-emerald-500/10">
            <h3 className="text-lg font-bold text-slate-200 transition-colors group-hover:text-emerald-300">Professional Certifications</h3>
            <p className="text-emerald-400 font-medium mt-1">Agile & PMO</p>
            <p className="mt-2 text-sm text-slate-400">
              Scaled Agile Practice Consultant (SPC) <br/> Project Management Professional (PMP)
            </p>
          </div>
          
        </div>

      </div>
    </main>
  );
}