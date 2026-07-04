"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ResumePage() {
  const [activeTab, setActiveTab] = useState<"analysis" | "builder">("analysis");

  const [skills, setSkills] = useState([
    { name: "TypeScript", status: "present" },
    { name: "React", status: "present" },
    { name: "Next.js", status: "present" },
    { name: "PostgreSQL", status: "present" },
    { name: "Docker", status: "missing" },
    { name: "AWS Cloud", status: "missing" },
    { name: "Kubernetes", status: "missing" },
  ]);

  const [bullets, setBullets] = useState([
    {
      original: "Worked on billing backend using stripe.",
      rating: "weak",
      reason: "Lacks measurable impact, action verbs, or technical depth.",
      improved: "Engineered high-throughput checkout microservices leveraging Stripe API and Redis caching, processing $15M+ in volume while reducing transaction processing latency by 35%.",
    },
    {
      original: "Fixed bugs and added route parameters in Next.js.",
      rating: "weak",
      reason: "Fails to explain architectural scale or optimization results.",
      improved: "Refactored client routing architectures using Next.js App Router and dynamic caching mechanisms, elevating overall Lighthouse optimization scores from 72 to 96.",
    },
  ]);

  const addSkill = (name: string) => {
    setSkills(skills.map(s => s.name === name ? { ...s, status: "present" } : s));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-neutral-900 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">AI Resume Studio</h1>
          <p className="text-xs text-neutral-400 mt-1">Refine, score, and optimize your resume bullet points for ATS compliance.</p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-neutral-900/60 border border-neutral-850 p-1 rounded-full">
          <button
            onClick={() => setActiveTab("analysis")}
            className={`rounded-full px-4 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === "analysis" ? "bg-teal-500 text-neutral-950" : "text-neutral-400 hover:text-white"
            }`}
          >
            ATS Analysis
          </button>
          <button
            onClick={() => setActiveTab("builder")}
            className={`rounded-full px-4 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === "builder" ? "bg-teal-500 text-neutral-950" : "text-neutral-400 hover:text-white"
            }`}
          >
            Template Builder
          </button>
        </div>
      </div>

      {activeTab === "analysis" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scoring Panel */}
          <div className="space-y-6">
            <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl text-center space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Overall Resume Score</span>
              
              {/* Score circle */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1f1f1f" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#14b8a6" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="55" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-4xl font-black text-white">78</span>
                  <span className="text-neutral-500 text-xs block">/ 100</span>
                </div>
              </div>

              <p className="text-neutral-400 text-xs px-2 leading-relaxed">
                Your resume meets basic ATS standards but is missing key cloud infrastructure keywords.
              </p>
            </div>

            {/* Keyword checklists */}
            <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl space-y-4">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">ATS Keyword Checklist</h3>
                <p className="text-neutral-500 text-[9px] mt-0.5">Core industry skills required for target vacancies.</p>
              </div>

              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.name} className="flex justify-between items-center p-2 rounded bg-neutral-950 text-xs border border-neutral-900">
                    <span className="text-neutral-300 font-mono text-[10px]">{skill.name}</span>
                    {skill.status === "present" ? (
                      <span className="text-[9px] text-teal-400 font-bold px-2 py-0.25 bg-teal-950 border border-teal-900 rounded">PRESENT</span>
                    ) : (
                      <button
                        onClick={() => addSkill(skill.name)}
                        className="text-[9px] text-purple-400 hover:text-white font-bold px-2 py-0.25 bg-purple-950/40 border border-purple-900/40 rounded transition-colors"
                      >
                        + ADD SKILL
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bullet point optimizer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Bullet Point Refinement</h3>
                <p className="text-neutral-500 text-[10px] mt-0.5">Strengthen weak phrases with action verbs and quantifiable results.</p>
              </div>

              <div className="space-y-4">
                {bullets.map((bullet, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-neutral-950 border border-neutral-900 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] px-2 py-0.5 rounded bg-rose-950 border border-rose-900 text-rose-400 font-bold uppercase">WEAK OUTLINE</span>
                      <span className="text-[9px] text-neutral-500 font-mono">Deduction: -12 pts</span>
                    </div>

                    <p className="text-xs text-neutral-400 italic">"{bullet.original}"</p>

                    <div className="text-[10px] bg-neutral-900 p-2.5 rounded border border-neutral-850 text-neutral-400 leading-relaxed">
                      <strong className="text-white block mb-0.5">Reason:</strong>
                      {bullet.reason}
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-neutral-900">
                      <span className="text-[9px] px-2 py-0.5 rounded bg-teal-950 border border-teal-900 text-teal-400 font-bold uppercase">AI IMPROVED SUGGESTION</span>
                      <p className="text-xs text-white font-medium leading-relaxed font-sans">{bullet.improved}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-900/40 border border-neutral-850 p-8 rounded-2xl text-center py-24 space-y-4">
          <svg className="mx-auto h-12 w-12 text-neutral-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 11.518 1.358L12 12.75v1.5m-3-6h.008v.008H9V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12 21a9 9 0 110-18 9 9 0 010 18z" />
          </svg>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Templates Locked</h3>
          <p className="text-neutral-500 text-xs max-w-sm mx-auto">Dynamic PDF compiler & template exports are available for Premium Pro accounts. Upgrade subscription details under settings.</p>
          <div className="pt-4">
            <Link href="/dashboard/settings" className="rounded-full bg-teal-500 hover:bg-teal-400 px-6 py-2.5 text-xs font-bold text-neutral-950 transition-colors shadow-lg shadow-teal-500/20">
              Upgrade Subscription
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
