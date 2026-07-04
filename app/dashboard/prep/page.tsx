"use client";

import React, { useState } from "react";

export default function PrepPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const mockQuestions = [
    {
      category: "System Design",
      q: "How would you design a real-time tracking dashboard for an autonomous agent applying to 10k+ jobs simultaneously?",
      ans: "Utilize an event-driven serverless architecture. Queue incoming job applications using an AWS SQS queue. Use AWS Lambda or Node.js worker pools to process the parsing and optimization workflows. Cache transient worker states in a Redis clusters to support live web socket updates back to the Client dashboard view, committing final states into Neon serverless PostgreSQL.",
    },
    {
      category: "Behavioral",
      q: "Tell me about a time you had to deal with a failing deployment process.",
      ans: "Use the STAR method: \n- Situation: Our Vercel deployment builds were failing intermittently due to static route hydration mismatches.\n- Task: I was responsible for restoring pipeline stability within 24 hours.\n- Action: I integrated isolated Vitest check steps inside the pre-commit hook and disabled default dynamic route caches during build runtime.\n- Result: Solved the build bug, improving client pipeline uptime to 99.9%.",
    },
    {
      category: "React 19 / Next.js",
      q: "How do React 19 Server Actions prevent race conditions or CSRF vulnerabilities?",
      ans: "Next.js Server Actions execute POST requests under the hood. They automatically verify host headers to guard against CSRF attacks. React 19 introduces form action hooks like `useActionState` and `useTransition` which manage state updates natively, preventing duplicate submissions.",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">AI Interview Coaching</h1>
        <p className="text-xs text-neutral-400 mt-1">Review predicted behavioral prompts, system design queries, and technical Q&As.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Question selectors list */}
        <div className="space-y-4 lg:col-span-1">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Common Interview Prompts</h3>
          <div className="space-y-3">
            {mockQuestions.map((q, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedQuestion(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                  selectedQuestion === idx
                    ? "bg-neutral-900 border-teal-500/50 shadow-md shadow-teal-500/5"
                    : "bg-neutral-900/30 border-neutral-850 hover:border-neutral-800"
                }`}
              >
                <span className="text-[9px] px-1.5 py-0.25 bg-teal-950 border border-teal-800 text-teal-400 rounded font-mono font-bold">{q.category}</span>
                <p className="text-xs font-bold text-white mt-2 leading-relaxed">{q.q}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Question Answers & Coach suggestions */}
        <div className="lg:col-span-2 space-y-6">
          {selectedQuestion !== null ? (
            <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl space-y-6">
              <div>
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Coach breakdown</span>
                <h2 className="text-sm font-black text-white mt-1 leading-relaxed">
                  "{mockQuestions[selectedQuestion].q}"
                </h2>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] text-teal-400 font-bold block">Suggested Model Response Outline</span>
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-850 text-xs text-neutral-300 leading-relaxed whitespace-pre-line font-sans">
                  {mockQuestions[selectedQuestion].ans}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-900/40 space-y-2">
                <span className="text-[9px] px-2 py-0.5 rounded bg-teal-950 border border-teal-800 text-teal-400 font-bold uppercase">PRO INTERVIEW TIP</span>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  When answering system architecture topics, focus on how you handle scaling limits, cache eviction, and credit cost. Always speak to the trade-offs (e.g. read speed vs write latency).
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl h-full flex items-center justify-center text-center py-32 text-neutral-600 text-xs">
              Select an interview question on the left to reveal model responses and strategic insights.
            </div>
          )}

          {/* Career roadmap section */}
          <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Generated Career Roadmap</h3>
            <div className="space-y-3">
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 flex-shrink-0 flex items-center justify-center text-xs font-bold font-mono">1</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Consolidate Core Cloud Architecture Skills</h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Focus on AWS SQS, Docker, and caching patterns using Redis clusters.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start border-t border-neutral-900 pt-3">
                <div className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 flex-shrink-0 flex items-center justify-center text-xs font-bold font-mono">2</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Build 2 Production-Grade Open Source Projects</h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Develop full-stack packages utilizing React 19, server actions, and Neon DB.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
