"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ChampionsTab from "@/components/ChampionsTab";
import InventoryTab from "@/components/InventoryTab";
import AdventuresTab from "@/components/AdventuresTab";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"champions" | "inventory" | "adventures">("champions");

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-sans select-none selection:bg-amber-600/30 selection:text-amber-200">

      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Header */}
      <Header />

      {/* Main Layout Container */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 pb-2 gap-4">
          <div className="flex items-center gap-2 bg-[#090d16] p-1.5 rounded-xl border border-slate-800/80 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("champions")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg text-sm font-medium ${activeTab === "champions"
                  ? "bg-slate-900 text-[#e5c17d] border border-[#c29d53]/40 shadow-[0_0_15px_rgba(194,157,83,0.1)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-950/40"
                }`}
            >
              {/* Champion Icon SVG */}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Champions
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg text-sm font-medium ${activeTab === "inventory"
                  ? "bg-slate-900 text-[#e5c17d] border border-[#c29d53]/40 shadow-[0_0_15px_rgba(194,157,83,0.1)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-950/40"
                }`}
            >
              {/* Inventory Icon SVG */}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Inventory
            </button>
            <button
              onClick={() => setActiveTab("adventures")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg text-sm font-medium ${activeTab === "adventures"
                  ? "bg-slate-900 text-[#e5c17d] border border-[#c29d53]/40 shadow-[0_0_15px_rgba(194,157,83,0.1)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-950/40"
                }`}
            >
              {/* World Adventure Icon SVG */}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              World Adventure
            </button>
          </div>

          {/* Subtitle / Context indicator */}
          <span className="text-xs text-slate-400 tracking-wider hidden md:inline-block font-mono bg-slate-900/40 border border-slate-800 px-3 py-1.5 rounded-md">
            CODEX DATABASE :: {activeTab.toUpperCase()}
          </span>
        </div>

        {/* Tab Views */}
        {activeTab === "champions" && <ChampionsTab />}
        {activeTab === "inventory" && <InventoryTab />}
        {activeTab === "adventures" && <AdventuresTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#050810] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Runeterra Monitor. All rights reserved. For user monitor purposes.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#e5c17d]">API Docs</a>
            <a href="#" className="hover:text-[#e5c17d]">Settings</a>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 font-mono">Connected: Localhost</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
