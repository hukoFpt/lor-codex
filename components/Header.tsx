import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-[hsla(222,14%,13%,0.75)] bg-[#13151B]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Custom Runeterra Hex Emblem SVG */}
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
            <div className="absolute inset-0 bg-[#c29d53]/15 rounded-full blur-md pointer-events-none" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-widest text-[#e5c17d] uppercase">Runeterra Codex</h1>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono opacity-80">Codex Live v1.0.4</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold text-slate-350 hover:text-[#e5c17d] tracking-wide transition-colors">
            Database
          </Link>
          <Link href="/constellation-designer" className="text-sm font-semibold text-slate-350 hover:text-[#e5c17d] tracking-wide transition-colors">
            Constellation Designer
          </Link>
          <Link href="/level-designer" className="text-sm font-semibold text-slate-350 hover:text-[#e5c17d] tracking-wide transition-colors">
            Level Designer
          </Link>
        </div>

        {/* Quick Profile Summary */}
        <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-lg">
          <div className="text-right">
            <p className="text-xs text-slate-400">Path of Champions</p>
            <p className="text-sm font-semibold text-[#e5c17d]">Aurelion Sol's Host</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-indigo-900 flex items-center justify-center border border-[#c29d53]/40 shadow-inner">
            <span className="text-xs font-bold text-amber-100">AS</span>
          </div>
        </div>
      </div>
    </header>
  );
}
