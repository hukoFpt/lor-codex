import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-[#c29d53]/20 bg-[#0a0f1d]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Custom Runeterra Hex Emblem SVG */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-full h-full text-[#c29d53]" viewBox="0 0 100 100" fill="currentColor">
              <polygon points="50,5 95,28 95,72 50,95 5,72 5,28" stroke="currentColor" strokeWidth="4" fill="none" />
              <polygon points="50,15 83,34 83,66 50,85 17,66 17,34" fill="currentColor" fillOpacity="0.15" />
              <circle cx="50" cy="50" r="12" fill="currentColor" />
            </svg>
            <div className="absolute inset-0 bg-[#c29d53]/20 rounded-full blur-md" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-widest text-[#e5c17d] uppercase">Runeterra Monitor</h1>
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
