"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ChampionsTab from "@/components/ChampionsTab";
import InventoryTab from "@/components/InventoryTab";
import AdventuresTab from "@/components/AdventuresTab";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"champions" | "inventory" | "adventures">("champions");

  // Read the ?tab query parameter on mount/URL change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "champions" || tabParam === "inventory" || tabParam === "adventures") {
        setActiveTab(tabParam);
      }
    }
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-[#000000] text-slate-100 flex flex-col font-sans select-none selection:bg-amber-600/30 selection:text-amber-200">

      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Header with active tab controller */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Layout Container */}
      <main className={`flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 flex flex-col min-h-0 ${activeTab === "champions" ? "overflow-hidden" : "overflow-y-auto"}`}>

        {/* Tab Views */}
        {activeTab === "champions" && <ChampionsTab />}
        {activeTab === "inventory" && <InventoryTab />}
        {activeTab === "adventures" && <AdventuresTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#050810] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Runeterra Codex. All rights reserved. Progress tracking database.</p>
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
