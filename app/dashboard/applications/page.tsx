"use client";

import React, { useState, useEffect } from "react";

interface ApplicationCard {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  date: string;
  notes: string;
  status: string;
}

const COLUMNS = [
  { key: "Applied", name: "Applied" },
  { key: "OA", name: "Online Assessment" },
  { key: "Technical", name: "Technical Interview" },
  { key: "Offer", name: "Offer" },
  { key: "Rejected", name: "Rejected" },
];

export default function ApplicationsPage() {
  const [apps, setApps] = useState<ApplicationCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ApplicationCard | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.applications && data.applications.length > 0) {
          setApps(data.applications);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load applications from API, loading mock data:", e);
    }

    // Heuristic mock data fallback
    const INITIAL_APPS: ApplicationCard[] = [
      {
        id: "app-1",
        company: "Google DeepMind",
        role: "Staff AI Engineer",
        location: "London, UK (Hybrid)",
        salary: "$180k - $240k",
        date: "2026-07-01",
        notes: "Reviewing code gen architectures. OA scheduled next week.",
        status: "OA",
      },
      {
        id: "app-2",
        company: "Vercel",
        role: "Senior Full Stack Dev",
        location: "Remote (Global)",
        salary: "$150k - $190k",
        date: "2026-06-28",
        notes: "Talked to engineering manager. Preparing Next.js core details.",
        status: "Technical",
      },
      {
        id: "app-3",
        company: "Stripe",
        role: "Software Engineer",
        location: "San Francisco (Onsite)",
        salary: "$140k - $175k",
        date: "2026-06-25",
        notes: "Applied via referral. Resume matched at 91%.",
        status: "Applied",
      },
      {
        id: "app-4",
        company: "Netflix",
        role: "UI Architect",
        location: "Los Gatos, CA",
        salary: "$210k - $260k",
        date: "2026-06-15",
        notes: "Offer received! Need to negotiate final compensation options.",
        status: "Offer",
      },
    ];
    setApps(INITIAL_APPS);
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const moveApp = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setApps(apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
      }
    } catch (err) {
      console.error("Failed to move application status:", err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    try {
      setSavingNotes(true);
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedApp.id, notes: noteText }),
      });
      if (res.ok) {
        setApps(apps.map(app => app.id === selectedApp.id ? { ...app, notes: noteText } : app));
        setSelectedApp({ ...selectedApp, notes: noteText });
      }
    } catch (err) {
      console.error("Failed to save application notes:", err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteApp = async (id: string) => {
    try {
      const res = await fetch(`/api/applications?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setApps(apps.filter(app => app.id !== id));
        setSelectedApp(null);
      }
    } catch (err) {
      console.error("Failed to delete application:", err);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-neutral-900 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">Submissions Kanban Board</h1>
          <p className="text-xs text-neutral-400 mt-1">Monitor, drag, and track your interviews and job offer pipelines.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <span className="text-xs text-neutral-500 block mt-4">Connecting to PostgreSQL and loading pipeline records...</span>
        </div>
      ) : (
        /* Kanban Board Grid */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {COLUMNS.map((col) => {
            const colApps = apps.filter(a => a.status.toUpperCase() === col.key.toUpperCase());
            return (
              <div key={col.key} className="bg-neutral-900/25 border border-neutral-850 p-4 rounded-xl space-y-3 min-h-[400px] flex flex-col justify-start">
                <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">{col.name}</span>
                  <span className="text-[9px] px-1.5 py-0.25 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded font-mono font-bold">{colApps.length}</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colApps.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => {
                        setSelectedApp(app);
                        setNoteText(app.notes);
                      }}
                      className="bg-neutral-950 border border-neutral-850 hover:border-teal-500/30 p-3 rounded-lg transition-all cursor-pointer space-y-2 text-left"
                    >
                      <h4 className="text-[11px] font-black text-white">{app.company}</h4>
                      <p className="text-[10px] text-neutral-400 truncate">{app.role}</p>
                      <span className="text-[9px] text-neutral-500 block">{app.location}</span>
                      <div className="flex justify-between items-center pt-2 border-t border-neutral-900">
                        <span className="text-[9px] text-neutral-500 font-mono">{app.date}</span>
                      </div>
                    </div>
                  ))}
                  {colApps.length === 0 && (
                    <div className="text-center py-12 text-[9px] text-neutral-600 font-mono">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-over details pane */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6 text-left">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Application Detail</h3>
                  <h2 className="text-lg font-black text-white mt-1">{selectedApp.company}</h2>
                  <p className="text-xs text-teal-400 font-semibold">{selectedApp.role}</p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-neutral-500 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Data fields */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Applied Date</span>
                  <span className="text-neutral-200 block font-semibold mt-0.5">{selectedApp.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">Target Salary</span>
                  <span className="text-neutral-200 block font-semibold mt-0.5">{selectedApp.salary}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">Location</span>
                  <span className="text-neutral-200 block font-semibold mt-0.5">{selectedApp.location}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">Workflow Column</span>
                  <select
                    value={selectedApp.status}
                    onChange={(e) => moveApp(selectedApp.id, e.target.value)}
                    className="mt-1 rounded bg-neutral-950 border border-neutral-800 text-[10px] text-neutral-200 focus:outline-none p-1 block w-full font-bold"
                  >
                    {COLUMNS.map(c => <option key={c.key} value={c.key}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <span className="text-[10px] text-neutral-500 block">Interview & Follow-up Notes</span>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={4}
                  className="w-full rounded bg-neutral-950 border border-neutral-850 text-xs text-neutral-300 focus:outline-none focus:border-teal-500 p-3"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="rounded bg-teal-500 hover:bg-teal-400 disabled:bg-neutral-850 text-neutral-950 px-4 py-1.5 text-[10px] font-bold transition-colors cursor-pointer"
                >
                  {savingNotes ? "Saving..." : "Save Notes"}
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-800">
              <button
                onClick={() => handleDeleteApp(selectedApp.id)}
                className="w-full text-center py-2.5 bg-rose-950/20 border border-rose-900/40 text-rose-400 rounded-lg text-xs font-bold hover:bg-rose-950/40 transition-colors"
              >
                Archive Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
