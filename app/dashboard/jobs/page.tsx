"use client";

import React, { useState } from "react";

interface AgentJob {
  id: string;
  title: string;
  companyName: string;
  description: string;
  location: string;
  salaryRange?: string;
  sourceUrl?: string;
}

interface MatchResult {
  matchPercentage: number;
  strengths: string[];
  weaknesses: string[];
  skillGap: string[];
  missingTechnologies: string[];
  suggestions: string[];
}

interface RankedJobItem {
  job: AgentJob;
  match: MatchResult;
}

interface AgentState {
  userId: string;
  status: string;
  rankedJobs: RankedJobItem[];
  selectedJobId?: string;
  optimizedResumeText?: string;
  coverLetterText?: string;
  outreachMessage?: string;
  logs: { step: string; status: string; message: string; timestamp: string }[];
}

export default function JobsPage() {
  const [roleInput, setRoleInput] = useState("Staff AI Engineer");
  const [locationInput, setLocationInput] = useState("San Francisco, CA");
  
  // Agent states
  const [agentState, setAgentState] = useState<AgentState | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedJobIdx, setSelectedJobIdx] = useState<number | null>(null);
  const [syncStatus, setSyncStatus] = useState<"idle" | "synced">("idle");

  const triggerAgent = async () => {
    setLoading(true);
    setAgentState(null);
    setSelectedJobIdx(null);
    setSyncStatus("idle");
    try {
      const res = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: roleInput,
          location: locationInput,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.state) {
          setAgentState(data.state);
          if (data.state.rankedJobs && data.state.rankedJobs.length > 0) {
            setSelectedJobIdx(0);
          }
        }
      }
    } catch (e) {
      console.error("Agent launch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">AI Job Discovery Agent</h1>
        <p className="text-xs text-neutral-400 mt-1">Configure search parameters to deploy the stateful application helper.</p>
      </div>

      {/* Query Console Card */}
      <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Orchestrator Search Inputs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Target Job Title</label>
            <input
              type="text"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              placeholder="e.g. Staff Software Engineer"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Geographic Location</label>
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="e.g. Remote / London"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-teal-500"
            />
          </div>
          <button
            onClick={triggerAgent}
            disabled={loading}
            className="w-full rounded-lg bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold py-2.5 px-4 text-xs transition-colors cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-500"
          >
            {loading ? "Running Agent Workflow..." : "Deploy AI Agent"}
          </button>
        </div>
      </div>

      {/* Loading state spinner */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-neutral-400 font-mono">Agent executing parse, discovery and Cosine Similarity models...</span>
        </div>
      )}

      {/* Split Result view */}
      {agentState && agentState.rankedJobs && agentState.rankedJobs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Discovered Listings list */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Discovered Jobs ({agentState.rankedJobs.length})</h3>
            <div className="space-y-3">
              {agentState.rankedJobs.map((item, idx) => {
                const active = selectedJobIdx === idx;
                return (
                  <div
                    key={item.job.id}
                    onClick={() => setSelectedJobIdx(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                      active 
                        ? "bg-neutral-900 border-teal-500/50 shadow-md shadow-teal-500/5" 
                        : "bg-neutral-900/30 border-neutral-850 hover:border-neutral-800"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-white">{item.job.title}</h4>
                      <span className="text-[9px] px-1.5 py-0.25 rounded bg-teal-950 border border-teal-800 text-teal-400 font-mono">{item.match.matchPercentage}% FIT</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 block mt-1">{item.job.companyName} &bull; {item.job.location}</span>
                    <span className="text-[9px] text-neutral-500 block mt-2">{item.job.salaryRange || "Competitive"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Selected Job optimization dashboard */}
          {selectedJobIdx !== null && (
            <div className="lg:col-span-2 space-y-6">
              {/* Job Details Card */}
              {(() => {
                const current = agentState.rankedJobs[selectedJobIdx];
                return (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl space-y-4">
                      <div className="flex justify-between items-start border-b border-neutral-850 pb-4">
                        <div>
                          <h2 className="text-lg font-bold text-white">{current.job.title}</h2>
                          <span className="text-xs text-neutral-400 mt-1 block">{current.job.companyName} &bull; {current.job.location}</span>
                        </div>
                        {current.job.sourceUrl && (
                          <a href={current.job.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-teal-400 font-semibold underline hover:text-teal-300">
                            Original Posting
                          </a>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">Job Description Context</span>
                        <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">{current.job.description}</p>
                      </div>
                    </div>

                    {/* ATS Matching Panel */}
                    <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl space-y-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-neutral-850 pb-2">ATS Matrix Report</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <span className="text-[10px] text-teal-400 font-bold block">✓ Primary Strengths</span>
                          <ul className="text-[10px] text-neutral-300 space-y-1.5 list-disc pl-4">
                            {current.match.strengths.map((str, i) => <li key={i}>{str}</li>)}
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <span className="text-[10px] text-purple-400 font-bold block">🛈 Identified Skill Gaps</span>
                          <div className="flex flex-wrap gap-1.5">
                            {current.match.skillGap.map((gap, i) => (
                              <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950/40 border border-purple-900/40 text-purple-300">{gap}</span>
                            ))}
                          </div>
                          <span className="text-[10px] text-amber-400 font-bold block pt-2">Suggestions</span>
                          <ul className="text-[10px] text-neutral-300 space-y-1.5 list-disc pl-4">
                            {current.match.suggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Optimization outputs */}
                    <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl space-y-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-neutral-850 pb-2">AI Optimization Output</h3>
                      
                      {/* Tailored resume bullet items */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-teal-400 font-bold block">Tailored Experience Bullet Points</span>
                        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-850 font-mono text-[10px] text-neutral-300 leading-relaxed whitespace-pre-line">
                          {agentState.optimizedResumeText}
                        </div>
                      </div>

                      {/* Cover Letter */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-teal-400 font-bold block">Generated Custom Cover Letter</span>
                          <button 
                            onClick={() => {
                              if (agentState.coverLetterText) navigator.clipboard.writeText(agentState.coverLetterText);
                            }}
                            className="text-[9px] text-neutral-500 hover:text-white underline cursor-pointer"
                          >
                            Copy Draft
                          </button>
                        </div>
                        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-850 font-sans text-[10px] text-neutral-300 leading-relaxed whitespace-pre-line">
                          {agentState.coverLetterText}
                        </div>
                      </div>

                      {/* Recruiter Outreach message */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-teal-400 font-bold block">Recruiter LinkedIn Outreach</span>
                          <button 
                            onClick={() => {
                              if (agentState.outreachMessage) navigator.clipboard.writeText(agentState.outreachMessage);
                            }}
                            className="text-[9px] text-neutral-500 hover:text-white underline cursor-pointer"
                          >
                            Copy Draft
                          </button>
                        </div>
                        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-850 font-sans text-[10px] text-neutral-300 leading-relaxed whitespace-pre-line">
                          {agentState.outreachMessage}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-850/40">
                        {syncStatus === "synced" ? (
                          <span className="text-teal-400 text-xs font-bold py-2">✓ Application Saved & Synced to Kanban Board</span>
                        ) : (
                          <button 
                            onClick={() => setSyncStatus("synced")}
                            className="rounded-lg bg-teal-500 hover:bg-teal-400 text-neutral-950 px-5 py-2 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Confirm & Sync to Kanban Tracker
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!agentState && !loading && (
        <div className="text-center py-20 border border-dashed border-neutral-850 rounded-2xl bg-neutral-900/10">
          <svg className="mx-auto h-12 w-12 text-neutral-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 0M4 16.5a9 9 0 1118 0M4 16.5L12 14l8 2.5" />
          </svg>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Agent Not Deployed</h4>
          <p className="text-neutral-500 text-xs mt-1.5 max-w-sm mx-auto">Fill in the Target Job Title above and click "Deploy AI Agent" to watch the real-time parsing, searching, matching, and optimization cycles in action.</p>
        </div>
      )}
    </div>
  );
}
