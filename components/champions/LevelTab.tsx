interface LevelTabProps {
  level: number;
}

export default function LevelTab({ level }: LevelTabProps) {
  const milestones = [
    { lvl: 1, title: "Unlock Champion", desc: "Unlock starter deck and basic items." },
    { lvl: 5, title: "Relic Slot I", desc: "Unlock first Common relic slot." },
    { lvl: 10, title: "Champion Upgrade", desc: "Starter champion gains an item upgrade." },
    { lvl: 15, title: "Relic Slot II", desc: "Unlock first Rare relic slot." },
    { lvl: 20, title: "Champion Draw", desc: "Game Start: Draw a Champion." },
    { lvl: 25, title: "Relic Slot III", desc: "Unlock second Rare relic slot." },
    { lvl: 30, title: "Max Level Mastery", desc: "Unlock Epic relic slot and maximum stats." }
  ];

  return (
    <div className="flex flex-col gap-4 mt-2">
      <h3 className="text-xs text-slate-400 font-bold tracking-widest uppercase">Level Roadmap (Max 30)</h3>
      <div className="relative border-l border-slate-900 ml-3 pl-6 flex flex-col gap-6">
        {milestones.map((m) => {
          const isUnlocked = level >= m.lvl;
          return (
            <div key={m.lvl} className="relative">
              {/* Dot */}
              <div className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 ${isUnlocked
                ? "bg-[#c29d53] border-[#0a0f1d] shadow-[0_0_8px_rgba(194,157,83,0.6)]"
                : "bg-slate-950 border-slate-800"
                }`} />
              <div className="flex justify-between items-baseline gap-2">
                <h4 className={`text-sm font-bold ${isUnlocked ? "text-[#e5c17d]" : "text-slate-500"}`}>
                  {m.title}
                </h4>
                <span className={`text-xs font-mono font-bold ${isUnlocked ? "text-amber-500/80" : "text-slate-600"}`}>
                  LVL {m.lvl}
                </span>
              </div>
              <p className="text-xs text-[#8c9bb4] mt-0.5">{m.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
