"use client";

import React, { useState } from "react";
import Link from "next/link";

// Explicitly type the timeline data so TypeScript allows HTML elements (Hyperlinks) in the bullets
type TimelineItem = {
  id: number;
  title: string;
  company: string;
  summary: string;
  extendedBullets: React.ReactNode[];
};

const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: "Solutions Engineer",
    company: "Nakupuna Companies | Jan 2024 – Aug 2026",
    summary: "Managed technical intake pipelines and program governance across enterprise defense portfolios. Served as Key Personnel driving multi-team cloud modernization efforts and cross-functional release readiness.",
    extendedBullets: [
      "Directed quarterly engineering roadmaps and delivery cycles from discovery through release for 20+ distributed development teams, owning dependency tracking, risk mitigation, and cross-system alignment.",
      "Built program-wide data capture strategies using Azure DevOps and Power BI for executive reporting, improving integrated delivery schedules by 30% and reducing post-release defects by 15%.",
      "Managed technical intake pipelines and established enterprise change control standards to ensure multi-team cloud modernization efforts tracked directly to intended business outcomes.",
      <span>
        Served as Key Personnel driving the <a href="https://www.washingtontechnology.com/contracts/2024/07/army-chooses-newcomer-370m-payroll-system-recompete/398047/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors font-semibold">$370M Army IPPS-A deployment</a>, overseeing capacity planning frameworks and post-launch value realization.
      </span>,
    ],
  },
  {
    id: 2,
    title: "Digital Transformation Lead",
    company: "DLH Corporation | Apr 2017 – Jan 2024",
    summary: "Accelerated the multi-billion-dollar MHS Genesis deployment by replacing heavy DoD governance with lean execution playbooks, aligning 60+ distributed product teams to sustain rapid engineering velocity.",
    extendedBullets: [
      <span>
        Accelerated the <a href="https://www.potomacofficersclub.com/articles/mhs-genesis-military-health-system-ehr/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors font-semibold">multi-billion-dollar MHS Genesis deployment</a> by replacing heavy DoD governance with lean execution playbooks, aligning 60+ distributed product teams.
      </span>,
      "Used delivery metrics to clear blocked initiatives and upskilled 100+ developers, boosting overall software release velocity by 20%.",
      "Won a FedHealthIT Innovation Award for designing a digital playbook that aligned technical construction methods with the organization's evolving maturity goals.",
      "Coached engineering leads and product managers, establishing standardized sprint planning, backlog refinement, and retrospective cadences.",
    ],
  },
  {
    id: 3,
    title: "Solutions Delivery Lead",
    company: "Franklin Consulting Group, LLC | Feb 2012 – Mar 2017",
    summary: "Established a Technical Delivery Office for cloud-native applications at FINRA. Managed distributed engineering teams at Capital One to accelerate legacy monolith-to-microservices migrations. Led executive steering and AWS cloud integrations for The Carlyle Group.",
    extendedBullets: [
      "FINRA (System-of-Record Governance): Established a Technical Delivery Office for cloud-native applications and built dashboards to track release burn-up, code quality, and backlog health.",
      "Capital One (Technical Orchestration): Managed delivery across distributed engineering teams, clearing API blockers to accelerate legacy monolith-to-microservices migrations.",
      "The Carlyle Group (Executive Steering): Led executive steering and managed vendor cloud (AWS) integrations to proactively escalate risks and deliver actionable recommendations.",
      "American Red Cross: Managed the end-to-end lifecycle replacement of on-premise document repository systems, migrating 30TB of data for 60K users to cloud infrastructure.",
    ],
  },
  {
    id: 4,
    title: "Technical Project Manager",
    company: "VA, DTRA, AT&T, & PwC | Sep 2006 – Feb 2012",
    summary: "Built a foundation in enterprise scale integration, delivering a $10M classified VPN deployment for Joint Forces, executing NIST vulnerability assessments, and managing $11M enterprise Knowledge Management COTS solutions across multiple federal agencies.",
    extendedBullets: [
      "Data Architecture (VA): Delivered an $11M enterprise Knowledge Management COTS solution, establishing integrated master schedules and managing performance metrics for project risk-related events.",
      "Enterprise Compliance (DTRA): Executed DoD 8510/NIST 800-series vulnerability assessments to maintain continuous system authorizations and authored foundational risk management policies.",
      "Enterprise Scale Integration (AT&T): Delivered a $10M classified VPN deployment and 60+ secure network projects for the DoD with a 100% success rate (zero downtime) in 3 years.",
      "Federal IT Governance (PwC): Directed federal IT control remediation and business process reengineering for the FBI, reducing FISMA compliance deficiencies by 40%.",
    ],
  },
  {
    id: 5,
    title: "Computer & Communications Officer",
    company: "United States Air Force | Jan 2002 – Sep 2006",
    summary: "Exercised mission command and technical mentorship over 60+ active-duty engineers. Engineered secure, tactical infrastructure for 25K+ warfighters during forward-deployment missions in Afghanistan and Qatar during the initial months of Operation Enduring Freedom.",
    extendedBullets: [
      "Expeditionary Systems Delivery: Exercised mission command and technical mentorship over 60+ active-duty engineers, managing over $123M in network assets.",
      "Engineered secure, tactical infrastructure for 25K+ warfighters during forward-deployment missions in Afghanistan and Qatar during the initial months of Operation Enduring Freedom.",
      "Directed a $3M network backbone upgrade and a $2M multi-vendor wireless VPN deployment, receiving the USAF Achievement Medal for successful implementation.",
      "Performed 24x7 computer network defense (CND) incident handling and co-authored the USCYBERCOM Network Watch Officer standard operating procedures.",
    ],
  },
];

export default function Experience() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-24 text-slate-50 sm:px-12">
      <div className="mx-auto max-w-4xl">
        
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
                
                {/* Dynamic Timeline Dot */}
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
            <h3 className="text-lg font-bold text-slate-200 transition-colors group-hover:text-emerald-300">Postgraduate Program in AI Agents</h3>
            <p className="text-emerald-400 font-medium mt-1">UT Austin (In Progress)</p>
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
            <p className="text-emerald-400 font-medium mt-1">PMO & Engineering Delivery</p>
            <p className="mt-2 text-sm text-slate-400">
              Project Management Professional (PMP) <br/> 
              Scaled Agile Practice Consultant (SPC)
            </p>
          </div>
          
        </div>

      </div>
    </main>
  );
}