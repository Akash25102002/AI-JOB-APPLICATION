"use client";

import React, { useState, useEffect } from "react";

export default function SettingsPage() {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [linkedin, setLinkedin] = useState("https://linkedin.com/in/johndoe");
  const [github, setGithub] = useState("https://github.com/johndoe");
  const [currentTier, setCurrentTier] = useState("PRO");

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Check if redirecting back from Stripe checkout completion
    const params = new URLSearchParams(window.location.search);
    if (params.get("session_id")) {
      setSuccessMsg("✓ Thank you for subscribing! Your Pro member privileges are now active.");
      setCurrentTier("PRO");
    }
  }, []);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  const triggerStripeCheckout = async (priceId: string) => {
    try {
      setBillingLoading(true);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          // Redirect to stripe checkout
          window.location.href = data.url;
        } else {
          // If stripe key is placeholder, simulate immediate local upgrade (extremely helpful for local testing!)
          setTimeout(() => {
            setCurrentTier(priceId === "price_pro_test" ? "PRO" : "STARTER");
            setSuccessMsg("⚡ Simulated offline upgrade successful! (Local developer fallback)");
            setBillingLoading(false);
          }, 1000);
        }
      } else {
        setBillingLoading(false);
      }
    } catch (err) {
      console.error(err);
      setBillingLoading(false);
    }
  };

  const invoiceHistory = [
    { id: "INV-0012", date: "2026-07-01", amount: "$39.00", status: "Paid" },
    { id: "INV-0011", date: "2026-06-01", amount: "$39.00", status: "Paid" },
    { id: "INV-0010", date: "2026-05-01", amount: "$39.00", status: "Paid" },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">Account & Billing Settings</h1>
        <p className="text-xs text-neutral-400 mt-1">Manage profile parameters, track invoices, and inspect active subscription plans.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-teal-950/60 border border-teal-900 text-teal-400 text-xs rounded-xl font-bold font-mono">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Settings Form */}
        <div className="md:col-span-2 bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Candidate Profile</h3>
            <p className="text-neutral-500 text-[10px] mt-0.5">Parameters are used by the AI Agent to build customized outreach communications.</p>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-neutral-400 mb-1 font-semibold">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-850 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] text-neutral-400 mb-1 font-semibold">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-850 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-neutral-400 mb-1 font-semibold">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-neutral-850 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] text-neutral-400 mb-1 font-semibold">LinkedIn Profile URL</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full rounded-lg border border-neutral-850 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] text-neutral-400 mb-1 font-semibold">GitHub Profile URL</label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full rounded-lg border border-neutral-850 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="rounded bg-teal-500 hover:bg-teal-400 text-neutral-950 px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
              >
                Save Profile Parameters
              </button>
              {saveSuccess && (
                <span className="text-teal-400 text-[10px] font-semibold animate-pulse">✓ Saved successfully!</span>
              )}
            </div>
          </form>
        </div>

        {/* Subscription Status Card */}
        <div className="space-y-6">
          <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Subscription</h3>
            
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-900 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase tracking-wider">Plan Tier</span>
                <span className="text-sm font-black text-white">{currentTier} PILOT</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-teal-950 border border-teal-800 text-teal-400 rounded font-mono font-bold">RECURRING</span>
            </div>

            <div className="text-[10px] text-neutral-400 leading-relaxed font-mono">
              Next billing cycle: <span className="text-white block mt-0.5">Aug 1, 2026 ($39.00)</span>
            </div>

            {currentTier !== "PRO" ? (
              <button
                onClick={() => triggerStripeCheckout("price_pro_test")}
                disabled={billingLoading}
                className="w-full rounded-lg bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold py-2 px-4 text-xs transition-colors cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-500"
              >
                {billingLoading ? "Loading Payment..." : "Upgrade to Pro Unlimited"}
              </button>
            ) : (
              <button
                onClick={() => setCurrentTier("FREE")}
                className="w-full rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white font-bold py-2 px-4 text-xs transition-colors cursor-pointer"
              >
                Cancel Subscription
              </button>
            )}
          </div>

          {/* Invoices List */}
          <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Billing History</h3>
            <div className="space-y-2">
              {invoiceHistory.map((inv) => (
                <div key={inv.id} className="flex justify-between items-center text-[10px] p-2 rounded bg-neutral-950 border border-neutral-900 font-mono">
                  <div>
                    <span className="text-white block">{inv.id}</span>
                    <span className="text-neutral-500">{inv.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white block">{inv.amount}</span>
                    <span className="text-teal-400 text-[9px]">{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
