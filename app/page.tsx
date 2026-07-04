"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Mock FAQ questions
const FAQS = [
  {
    q: "How does the autonomous job application agent work?",
    a: "JobPilot AI utilizes an agentic workflow that reads your parsed resume details, monitors job boards via secure API search tools, performs ATS keyword matching, optimizes your experience bullet points specifically for each position, and generates tailored cover letters and outreach messages automatically.",
  },
  {
    q: "Is it safe to use automated application tools?",
    a: "Absolutely. We follow strict platform compliance guidelines. The agent prepares all customization drafts (resume adjustments, cover letters, recruiter messages) and prompts you for review and approval before final logs are stored, ensuring you maintain absolute control over your applications.",
  },
  {
    q: "What is an ATS Match Score?",
    a: "An ATS (Applicant Tracking System) Match Score measures how closely your resume matches the requirements of a job description. JobPilot AI uses vector similarity and keyword overlap metrics to predict how a company's recruitment algorithm will rank your resume.",
  },
  {
    q: "Can I manage multiple versions of my resume?",
    a: "Yes! Our Pro plan lets you maintain different variations (e.g., Frontend, Backend, Full Stack) and automatically selects the version that aligns closest to the target vacancy before applying.",
  },
  {
    q: "What is the refund policy?",
    a: "We offer a 14-day money-back guarantee for all paid tiers if you're not satisfied with the match quality or recommendations.",
  },
];

// Interactive Agent Console steps
const SIMULATION_STEPS = [
  { id: "parse", name: "Parsing Profile", text: "Analyzing raw resume text. Extracted skills: TS, React, Next.js, Postgres." },
  { id: "search", name: "Job Discovery", text: "Polling LinkedIn, Adzuna, and Greenhouse APIs. Found 14 matching listings." },
  { id: "rank", name: "ATS Match Rating", text: "Semantic cosine similarity completed. Top match: Staff AI Engineer (94% Fit)." },
  { id: "optimize", name: "Bullet Tailoring", text: "Rewriting resume bullet points to emphasize distributed systems and API scaling." },
  { id: "outreach", name: "Collateral drafting", text: "Cover letter and cold recruiter outreach message drafted successfully." },
  { id: "track", name: "Kanban Integration", text: "Created Kanban application entry. Reminders scheduled. Task Completed!" },
];

export default function LandingPage() {
  // Billing cycle state
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  
  // FAQ active state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Agent simulator state
  const [simRole, setSimRole] = useState("Staff AI Engineer");
  const [simStatus, setSimStatus] = useState<"idle" | "running" | "completed">("idle");
  const [simStepIndex, setSimStepIndex] = useState(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  // Simulation script runner
  useEffect(() => {
    if (simStatus !== "running") return;

    if (simStepIndex < SIMULATION_STEPS.length) {
      const timer = setTimeout(() => {
        const step = SIMULATION_STEPS[simStepIndex];
        setSimLogs((prev) => [...prev, `[${simStepIndex + 1}/${SIMULATION_STEPS.length}] ${step.name}: ${step.text}`]);
        setSimStepIndex((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setSimStatus("completed");
    }
  }, [simStatus, simStepIndex]);

  const startSimulation = () => {
    setSimLogs([]);
    setSimStepIndex(0);
    setSimStatus("running");
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-200">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white tracking-tight">
            <svg className="w-6 h-6 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>JobPilot<span className="text-teal-400">.AI</span></span>
          </Link>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">AI Agent Console</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard" className="rounded-full bg-teal-500 hover:bg-teal-400 px-4 py-2 text-xs font-semibold text-neutral-950 transition-colors shadow-lg shadow-teal-500/20">
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-950/50 px-3 py-1 text-xs font-medium text-teal-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          Next-Gen AI Agent Platform
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl bg-gradient-to-b from-white via-neutral-100 to-neutral-500 bg-clip-text text-transparent">
          Automate Your Job Applications with AI
        </h1>
        <p className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          JobPilot AI is your autonomous career search co-pilot. Parse resumes, tailor experience details, match core skills, build dynamic cover letters, and track applications on a visual Kanban timeline automatically.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/dashboard" className="w-full sm:w-auto rounded-full bg-white hover:bg-neutral-100 px-8 py-4 text-sm font-semibold text-neutral-950 transition-all shadow-xl shadow-white/5">
            Launch Autonomous Agent
          </Link>
          <a href="#demo" className="w-full sm:w-auto rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-8 py-4 text-sm font-semibold text-white transition-all">
            Watch Simulator
          </a>
        </div>
      </section>

      {/* Interactive AI Agent Simulator Console */}
      <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Console Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs font-mono text-neutral-500 ml-2">jobpilot-agent-node.js</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-teal-950 border border-teal-800 text-teal-400 font-mono">STATUS: {simStatus.toUpperCase()}</span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Simulation Inputs</h3>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Target Role</label>
                <select 
                  value={simRole} 
                  onChange={(e) => setSimRole(e.target.value)}
                  disabled={simStatus === "running"}
                  className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-teal-500"
                >
                  <option>Staff AI Engineer</option>
                  <option>Senior Full Stack Developer</option>
                  <option>Software Engineer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Mock Resume Attachment</label>
                <div className="border border-dashed border-neutral-800 rounded-md p-4 text-center bg-neutral-950/40">
                  <svg className="mx-auto h-8 w-8 text-neutral-600 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span className="text-xs text-neutral-400 font-semibold block">resume_john_doe.pdf</span>
                  <span className="text-[10px] text-neutral-600 block mt-0.5">Size: 45 KB</span>
                </div>
              </div>
              <button
                onClick={startSimulation}
                disabled={simStatus === "running"}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-teal-500 hover:bg-teal-400 disabled:bg-neutral-800 text-neutral-950 font-bold py-2.5 px-4 text-sm transition-colors cursor-pointer"
              >
                {simStatus === "running" ? "Agent Running..." : "Execute AI Agent"}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            </div>

            {/* Output terminal */}
            <div className="md:col-span-2 bg-neutral-950 rounded-lg p-4 font-mono text-xs border border-neutral-850 flex flex-col h-64 justify-between">
              <div className="overflow-y-auto space-y-2 text-neutral-300">
                {simLogs.length === 0 && (
                  <div className="text-neutral-600 text-center py-16">
                    &gt; Select target role and click "Execute AI Agent" to watch the workflow output...
                  </div>
                )}
                {simLogs.map((log, idx) => (
                  <div key={idx} className="transition-all duration-300">
                    <span className="text-teal-400">&gt;</span> {log}
                  </div>
                ))}
                {simStatus === "running" && (
                  <div className="flex items-center gap-1.5 text-teal-400 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                    <span>Agent is thinking...</span>
                  </div>
                )}
              </div>
              {simStatus === "completed" && (
                <div className="mt-4 p-2 bg-teal-950/60 border border-teal-900 rounded text-teal-400 flex items-center justify-between">
                  <span>🚀 Agent completed successfully!</span>
                  <Link href="/dashboard" className="underline text-xs hover:text-white font-semibold">View Result</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-neutral-900 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">SaaS Capability Suite</h2>
            <p className="mt-4 text-neutral-400">Everything you need to bypass standard resumes filters and supercharge your landing rate.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Semantic Parser</h3>
              <p className="mt-2 text-neutral-400 text-sm leading-relaxed">
                Decodes and structures your skills, education, and career experience records securely without compromising privacy.
              </p>
            </div>

            <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">ATS Keyword Engine</h3>
              <p className="mt-2 text-neutral-400 text-sm leading-relaxed">
                Compares text elements dynamically against target descriptions to output Match %, highlights gaps, and lists technologies.
              </p>
            </div>

            <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Kanban Timeline</h3>
              <p className="mt-2 text-neutral-400 text-sm leading-relaxed">
                Keeps your submissions perfectly organized with specific stages: Applied, OA, Technical, Manager, Offer, or Archive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Workflow */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-neutral-900 bg-neutral-900/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">The Agent Pipeline</h2>
            <p className="mt-4 text-neutral-400">Streamline your applications from discovery to final salary negotiation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-teal-500 text-neutral-950 font-bold flex items-center justify-center text-lg mb-6 shadow-lg shadow-teal-500/20">1</div>
              <h3 className="text-xl font-semibold text-white mb-2">Upload Profile</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Drop your PDF or Word resume. Our parser instantly extracts skills and structures data fields.</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-teal-500 text-neutral-950 font-bold flex items-center justify-center text-lg mb-6 shadow-lg shadow-teal-500/20">2</div>
              <h3 className="text-xl font-semibold text-white mb-2">Match & Optimize</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">The agent analyzes job boards, matching skills against keywords and tailoring bullet points.</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-teal-500 text-neutral-950 font-bold flex items-center justify-center text-lg mb-6 shadow-lg shadow-teal-500/20">3</div>
              <h3 className="text-xl font-semibold text-white mb-2">Stage Outreach</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Get auto-generated custom cover letters and ready-to-send networking drafts in seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-neutral-900 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Client Success Logs</h2>
            <p className="mt-4 text-neutral-400">See how JobPilot AI users scaled their outreach response rates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-900/30 border border-neutral-800 p-6 rounded-2xl">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">★ ★ ★ ★ ★</div>
              <p className="text-neutral-300 text-sm italic">"The ATS Matching analysis was spot on. I tweaked my resume based on the suggestion lists and landed an interview at Stripe 3 days later."</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-500 text-neutral-950 font-bold flex items-center justify-center text-xs">AM</div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Alex M.</h4>
                  <span className="text-[10px] text-neutral-500 block">Senior Engineer</span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900/30 border border-neutral-800 p-6 rounded-2xl">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">★ ★ ★ ★ ★</div>
              <p className="text-neutral-300 text-sm italic">"I love the Kanban board dashboard. Having my resume, customized letter drafts, and recruiter outreach templates in one spot saved me hours."</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500 text-neutral-950 font-bold flex items-center justify-center text-xs">SK</div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Sarah K.</h4>
                  <span className="text-[10px] text-neutral-500 block">Frontend Lead</span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900/30 border border-neutral-800 p-6 rounded-2xl">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">★ ★ ★ ★ ★</div>
              <p className="text-neutral-300 text-sm italic">"The cold outreach generator is insane. Sending personalized messages to hiring managers boosted my initial call response rate by 3x."</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-neutral-950 font-bold flex items-center justify-center text-xs">DL</div>
                <div>
                  <h4 className="text-xs font-semibold text-white">David L.</h4>
                  <span className="text-[10px] text-neutral-500 block">AI Architect</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-neutral-900 bg-neutral-900/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Pricing Blueprints</h2>
            <p className="mt-4 text-neutral-400">Choose the execution rate that matches your application requirements.</p>

            {/* Toggle */}
            <div className="mt-8 inline-flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-full p-1">
              <button 
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${billingCycle === "monthly" ? "bg-teal-500 text-neutral-950" : "text-neutral-400 hover:text-white"}`}
              >
                Monthly billing
              </button>
              <button 
                onClick={() => setBillingCycle("yearly")}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${billingCycle === "yearly" ? "bg-teal-500 text-neutral-950" : "text-neutral-400 hover:text-white"}`}
              >
                Yearly billing (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-2xl relative flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Free Sandbox</h3>
                <p className="mt-2 text-xs text-neutral-500">Perfect to test matching vectors.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-neutral-500">/ forever</span>
                </div>
                <ul className="mt-8 space-y-4 text-xs text-neutral-400">
                  <li className="flex items-center gap-2">✔ Resume Parse (5 Uploads)</li>
                  <li className="flex items-center gap-2">✔ Heuristic ATS Matching Score</li>
                  <li className="flex items-center gap-2">✔ Manual Kanban Timeline</li>
                  <li className="flex items-center gap-2 text-neutral-600">✖ Custom bullet-point optimizer</li>
                  <li className="flex items-center gap-2 text-neutral-600">✖ Automator outreach generator</li>
                </ul>
              </div>
              <Link href="/dashboard" className="w-full text-center py-3 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-lg text-xs font-semibold text-white transition-colors mt-8">
                Get Started Free
              </Link>
            </div>

            {/* Starter */}
            <div className="bg-neutral-950 border border-teal-500/30 p-8 rounded-2xl relative flex flex-col justify-between shadow-xl shadow-teal-500/5">
              <span className="absolute top-0 right-8 -translate-y-1/2 bg-teal-500 text-neutral-950 text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase">Popular</span>
              <div>
                <h3 className="text-lg font-bold text-white">Starter Pilot</h3>
                <p className="mt-2 text-xs text-neutral-500">Enhanced matching & template generation.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">${billingCycle === "monthly" ? "19" : "15"}</span>
                  <span className="text-xs text-neutral-500">/ month</span>
                </div>
                <ul className="mt-8 space-y-4 text-xs text-neutral-400">
                  <li className="flex items-center gap-2">✔ 100 AI credits / month</li>
                  <li className="flex items-center gap-2">✔ Comprehensive ATS keyword reports</li>
                  <li className="flex items-center gap-2">✔ Cover letter customization panels</li>
                  <li className="flex items-center gap-2">✔ LinkedIn Outreach generation scripts</li>
                  <li className="flex items-center gap-2 text-neutral-600">✖ Priority proxy search engines</li>
                </ul>
              </div>
              <Link href="/dashboard" className="w-full text-center py-3 bg-teal-500 hover:bg-teal-400 rounded-lg text-xs font-semibold text-neutral-950 transition-colors mt-8 shadow-lg shadow-teal-500/20">
                Subscribe Now
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-2xl relative flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Pro Pilot</h3>
                <p className="mt-2 text-xs text-neutral-500">For aggressive active job searchers.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">${billingCycle === "monthly" ? "39" : "31"}</span>
                  <span className="text-xs text-neutral-500">/ month</span>
                </div>
                <ul className="mt-8 space-y-4 text-xs text-neutral-400">
                  <li className="flex items-center gap-2">✔ Unlimited AI pipeline actions</li>
                  <li className="flex items-center gap-2">✔ Autonomous Agentic workflows</li>
                  <li className="flex items-center gap-2">✔ Automatic custom resumes</li>
                  <li className="flex items-center gap-2">✔ Simulated QA interview prep boards</li>
                  <li className="flex items-center gap-2">✔ Auto-sync Google Calendar reminders</li>
                </ul>
              </div>
              <Link href="/dashboard" className="w-full text-center py-3 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-lg text-xs font-semibold text-white transition-colors mt-8">
                Go Pro Unlimited
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-neutral-900 bg-neutral-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">System Q&A</h2>
            <p className="mt-4 text-neutral-400">Everything you need to know about autonomous job pilot agents.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-neutral-900/40 border border-neutral-850 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-white hover:bg-neutral-900/80 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <svg className={`w-4 h-4 text-neutral-400 transform transition-transform ${openFaq === idx ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-sm text-neutral-400 leading-relaxed border-t border-neutral-850/30 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-neutral-900 bg-gradient-to-b from-neutral-950 to-neutral-900 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Ready to automate your application cycle?</h2>
          <p className="mt-4 text-neutral-400 text-sm max-w-lg mx-auto">
            Take flight with JobPilot AI today. Parse your resume and see your first custom ATS recommendations in under 60 seconds.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/dashboard" className="rounded-full bg-teal-500 hover:bg-teal-400 px-8 py-4 text-sm font-semibold text-neutral-950 shadow-xl shadow-teal-500/20 transition-all">
              Initialize Dashboard For Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-900 bg-neutral-950 text-xs text-neutral-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-teal-500/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-semibold text-neutral-400">JobPilot AI</span>
            <span>&copy; {new Date().getFullYear()} JobPilot Inc. All rights reserved.</span>
          </div>

          <div className="flex gap-6 text-neutral-500">
            <a href="#" className="hover:text-neutral-400">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-400">Terms of Service</a>
            <a href="#" className="hover:text-neutral-400">API Documentation</a>
            <a href="#" className="hover:text-neutral-400">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
