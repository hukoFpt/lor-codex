"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface HeaderProps {
  activeTab?: "champions" | "inventory" | "adventures";
  onTabChange?: (tab: "champions" | "inventory" | "adventures") => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderTab = (tabId: "champions" | "inventory" | "adventures", label: string) => {
    const isActive = activeTab === tabId;

    const baseClass = `relative h-full flex items-end pb-5 text-sm font-extrabold uppercase tracking-widest transition-all cursor-pointer select-none ${isActive ? "text-[#e5c17d]" : "text-slate-500 hover:text-slate-350"
      }`;

    const indicator = isActive && (
      <motion.span
        layoutId="activeHeaderTabIndicator"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#c29d53] rounded-full shadow-[0_0_8px_#c29d53] opacity-90"
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
      />
    );

    if (onTabChange) {
      return (
        <button onClick={() => onTabChange(tabId)} className={baseClass}>
          <span>{label}</span>
          {indicator}
        </button>
      );
    }

    return (
      <Link href={`/?tab=${tabId}`} className={baseClass}>
        <span>{label}</span>
        {indicator}
      </Link>
    );
  };

  return (
    <header className="border-b border-[hsla(222,14%,10%,0.8)] bg-[#08090d]/90 backdrop-blur-xl sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
      {/* Premium bottom gold glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c29d53]/45 to-transparent pointer-events-none" />

      <div className="max-w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
        {/* Logo and Emblem */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <svg className="w-full h-full text-[#e5c17d]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f7d08a" />
                  <stop offset="50%" stopColor="#c29d53" />
                  <stop offset="100%" stopColor="#8c6a24" />
                </linearGradient>
                <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#e5c17d" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#c29d53" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="40" fill="url(#innerGlow)" />
              <polygon points="50,8 86,29 86,71 50,92 14,71 14,29" stroke="url(#goldGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="50" cy="50" r="28" stroke="#c29d53" strokeWidth="1" strokeDasharray="5,4" opacity="0.6" />
              <path d="M50,22 L54,46 L78,50 L54,54 L50,78 L46,54 L22,50 L46,46 Z" fill="url(#goldGrad)" />
              <line x1="28" y1="28" x2="37" y2="37" stroke="#c29d53" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <line x1="72" y1="28" x2="63" y2="37" stroke="#c29d53" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <line x1="28" y1="72" x2="37" y2="63" stroke="#c29d53" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <line x1="72" y1="72" x2="63" y2="63" stroke="#c29d53" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <polygon points="50,44 56,50 50,56 44,50" fill="#ffffff" />
            </svg>
            <div className="absolute inset-0 bg-[#c29d53]/20 rounded-full blur-md pointer-events-none animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#f7d08a] via-[#e5c17d] to-[#b08d45] drop-shadow-sm">
              Runeterra Codex
            </h1>
            <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-emerald-400/90 font-semibold bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/30">
                Codex Live v1.0.4
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Tabs (Champions, Inventory, Adventure) */}
        <div className="hidden md:flex items-center gap-12 h-full">
          {renderTab("champions", "Champions")}
          {renderTab("inventory", "Inventory")}
          {renderTab("adventures", "World Adventure")}
        </div>

        {/* Quick Profile Summary and Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-4 bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800/80 hover:border-[#c29d53]/45 px-4 py-2.5 rounded-lg transition-all duration-200 text-left outline-none"
          >
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Path of Champions</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-xs font-bold text-[#e5c17d]">Aurelion Sol's Host</p>
                <svg className={`w-3.5 h-3.5 text-[#e5c17d] transition-transform duration-250 ${isDropdownOpen ? "rotate-180 text-amber-300" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-indigo-900 flex items-center justify-center border border-[#c29d53]/45 shadow-inner">
              <span className="text-xs font-bold text-amber-100">AS</span>
            </div>
          </button>

          {/* Premium Tool Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-[#0c0e18]/95 backdrop-blur-md border border-slate-800/80 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3.5 py-1.5 border-b border-slate-850 mb-1">
                <p className="text-[9px] uppercase font-mono tracking-widest text-slate-500 font-bold">Navigation Tools</p>
              </div>

              <Link
                href="/"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-start gap-3 px-3.5 py-2.5 hover:bg-slate-900/60 transition-colors"
              >
                <div className="mt-0.5 p-1 bg-amber-500/10 rounded-md text-amber-400 border border-amber-500/20">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Database</p>
                  <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Champions, items, maps & gear.</p>
                </div>
              </Link>

              <Link
                href="/constellation-designer"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-start gap-3 px-3.5 py-2.5 hover:bg-slate-900/60 transition-colors"
              >
                <div className="mt-0.5 p-1 bg-indigo-500/10 rounded-md text-indigo-400 border border-indigo-500/20">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Constellation Designer</p>
                  <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Design custom node maps.</p>
                </div>
              </Link>

              <Link
                href="/level-designer"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-start gap-3 px-3.5 py-2.5 hover:bg-slate-900/60 transition-colors"
              >
                <div className="mt-0.5 p-1 bg-emerald-500/10 rounded-md text-emerald-400 border border-emerald-500/20">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Progression Designer</p>
                  <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Edit level milestones & XP curves.</p>
                </div>
              </Link>

              <Link
                href="/toolkit"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-start gap-3 px-3.5 py-2.5 hover:bg-slate-900/60 transition-colors border-t border-slate-900/40"
              >
                <div className="mt-0.5 p-1 bg-rose-500/10 rounded-md text-rose-450 border border-rose-500/20">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Asset Toolkit</p>
                  <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Crop and align custom frames.</p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
