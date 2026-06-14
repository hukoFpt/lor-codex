import { LevelMilestone } from "@/types";

interface LevelTabProps {
  level: number;
  levelRoadmap?: LevelMilestone[];
  maxLevel: number;
}

export default function LevelTab({ level, levelRoadmap = [], maxLevel }: LevelTabProps) {
  const milestones = levelRoadmap.length > 0
    ? levelRoadmap.map(m => ({ lvl: m.level, title: m.title, desc: m.reward }))
    : [
        { lvl: 1, title: "Unlock Champion", desc: "Unlock starter deck and basic items." },
        { lvl: 5, title: "Relic Slot I", desc: "Unlock first Common relic slot." },
        { lvl: 10, title: "Champion Upgrade", desc: "Starter champion gains an item upgrade." },
        { lvl: 15, title: "Relic Slot II", desc: "Unlock first Rare relic slot." },
        { lvl: 20, title: "Champion Draw", desc: "Game Start: Draw a Champion." },
        { lvl: 25, title: "Relic Slot III", desc: "Unlock second Rare relic slot." },
        { lvl: 30, title: "Max Level Mastery", desc: "Unlock Epic relic slot and maximum stats." }
      ];

  const nextMilestone = levelRoadmap.find(m => m.level === level + 1);
  const unlockedMilestones = levelRoadmap.filter(m => m.level <= level && m.title);

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-5 h-full">
      {/* Left Column - Roadmap Timeline */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <h3 className="text-sm text-slate-400 font-bold tracking-widest uppercase">Level Roadmap (Max {maxLevel})</h3>
        <div className="max-h-[450px] overflow-y-auto pr-3 pl-4 scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-900">
          <div className="relative border-l border-slate-900 pl-6 flex flex-col gap-7 py-3">
            {milestones.map((m) => {
              const isUnlocked = level >= m.lvl;
              return (
                <div key={m.lvl} className="relative">
                  {/* Dot */}
                  <div className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 ${isUnlocked
                    ? "bg-[#c29d53] border-[#0a0f1d] shadow-[0_0_8px_rgba(194,157,83,0.6)]"
                    : "bg-slate-950 border-slate-800"
                    }`} />
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className={`px-2.5 py-1 rounded text-xs font-mono font-extrabold border ${isUnlocked
                      ? "bg-[#c29d53]/10 text-[#e5c17d] border-[#c29d53]/30"
                      : "bg-slate-900/60 text-slate-500 border-slate-800"
                      }`}>
                      LVL {m.lvl}
                    </span>
                    <h4 className={`text-base font-bold ${isUnlocked ? "text-[#e5c17d]" : "text-slate-500"}`}>
                      {m.title || `Level ${m.lvl} Upgrade`}
                    </h4>
                  </div>
                  <p className="text-sm text-[#8c9bb4] mt-0.5 whitespace-pre-line leading-relaxed">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column - Status Summary & Next Milestone */}
      <div className="w-full md:w-[380px] flex flex-col gap-6 shrink-0">
        {/* Next Unlock Card */}
        {nextMilestone && (
          <div className="bg-gradient-to-br from-[#c29d53]/10 to-transparent border border-[#c29d53]/20 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c29d53]/5 rounded-full blur-2xl pointer-events-none" />
            <span className="text-xs text-amber-500 font-bold uppercase tracking-wider font-mono">Next Milestone</span>
            <div className="flex items-baseline gap-2 mt-2.5">
              <span className="text-3xl font-black text-amber-500 font-mono">LVL {nextMilestone.level}</span>
              <span className="text-xs text-slate-400 font-medium">unlocks:</span>
            </div>
            <h4 className="text-base font-extrabold text-slate-100 mt-2">{nextMilestone.title}</h4>
            <p className="text-sm text-slate-350 mt-2.5 whitespace-pre-line leading-relaxed">{nextMilestone.reward}</p>
          </div>
        )}

        {/* Unlocked Perks List */}
        <div className="bg-[#090d16]/30 border border-slate-900/60 rounded-xl p-6">
          <h4 className="text-sm text-slate-400 font-bold tracking-widest uppercase mb-4">Active Perks ({unlockedMilestones.length})</h4>
          {unlockedMilestones.length > 0 ? (
            <div className="flex flex-col gap-3.5 pr-1">
              {unlockedMilestones.map((m) => (
                <div key={m.level} className="flex gap-3 items-start">
                  <svg className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-200 leading-snug">{m.title}</span>
                    <span className="text-[11px] text-slate-500 font-mono mt-0.5">Level {m.level}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No level perks unlocked yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
