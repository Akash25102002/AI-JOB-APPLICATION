"use client";

import React, { useState } from "react";

export default function OutreachPage() {
  const [recipient, setRecipient] = useState("Hiring Manager");
  const [company, setCompany] = useState("Vercel");
  const [role, setRole] = useState("Senior Full Stack Developer");
  const [tone, setTone] = useState("Professional");
  const [outreachType, setOutreachType] = useState("LinkedIn");

  const [generatedText, setGeneratedText] = useState("");

  const handleGenerate = () => {
    let text = "";
    if (outreachType === "LinkedIn") {
      text = `Hi [Recruiter Name] (or hiring team at ${company}),\n\nI noticed you are hiring for a ${role}. Given my background building high-converting full-stack apps in TypeScript and Next.js, I wanted to connect.\n\nI've worked on similar products and optimized core user pipelines, which I believe is highly relevant to your team's mission. I would love to connect for 10 minutes to discuss how I can add value from day one.\n\nBest,\nJohn Doe`;
    } else if (outreachType === "Email") {
      text = `Subject: Application Follow-up: ${role} - John Doe\n\nDear ${recipient},\n\nI recently submitted my application for the ${role} position at ${company}. Having parsed the requirements of the job description, I am confident that my technical skills in full-stack application development make me an outstanding fit.\n\nThroughout my career, I have dedicated myself to building responsive, scalable software solutions. At my previous roles, I prioritized codebase cleanliness, high Lighthouse scores, and secure authentication models. The opportunities at ${company} to build tools directly maps onto my professional objectives.\n\nThank you for your time and consideration. I look forward to discussing how my skills align with your growth metrics.\n\nSincerely,\nJohn Doe`;
    } else {
      text = `Hi [Friend/Connection Name],\n\nHope you're doing well! I'm applying for the ${role} position at ${company} and saw that you're connected to the hiring team. Would you be open to introducing me? I have attached my customized resume and a brief intro paragraph for your convenience.\n\nLet me know if you can assist, and I'd be happy to buy you a coffee to catch up!\n\nBest,\nJohn Doe`;
    }
    setGeneratedText(text);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">AI Cold Outreach Generator</h1>
        <p className="text-xs text-neutral-400 mt-1">Draft high-converting follow-ups, LinkedIn connection letters, and referral requests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Panel */}
        <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Outreach Configuration</h3>

          <div>
            <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Message Platform</label>
            <div className="grid grid-cols-3 gap-2">
              {["LinkedIn", "Email", "Referral"].map((type) => (
                <button
                  key={type}
                  onClick={() => setOutreachType(type)}
                  className={`py-2 px-3 rounded-lg text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                    outreachType === type
                      ? "bg-teal-500 text-neutral-950"
                      : "bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Recipient Role</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Target Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Target Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Tone profile</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-teal-500"
            >
              <option>Professional</option>
              <option>Friendly</option>
              <option>Formal</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full rounded-lg bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold py-2.5 px-4 text-xs transition-colors cursor-pointer"
          >
            Generate Templates
          </button>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl h-full flex flex-col justify-between min-h-[300px]">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-850 pb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">AI Drafted Output</span>
                {generatedText && (
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedText)}
                    className="text-[10px] text-neutral-500 hover:text-white underline cursor-pointer"
                  >
                    Copy to Clipboard
                  </button>
                )}
              </div>

              {generatedText ? (
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-850 font-sans text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                  {generatedText}
                </div>
              ) : (
                <div className="text-center py-20 text-neutral-600 text-xs">
                  Configure the settings on the left sidebar and click "Generate Templates" to construct your outreach text.
                </div>
              )}
            </div>

            {generatedText && (
              <div className="text-[10px] text-neutral-500 italic pt-4 border-t border-neutral-850/40">
                ⚡ Draft customized automatically using parsing keywords. Always verify target recipient name before dispatching.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
