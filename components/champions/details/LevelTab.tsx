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

  // Parse dynamic status stats from level roadmaps or use fallbacks matching PoC progression
  let nexusHealth = 30;
  const healthMilestones = levelRoadmap
    .filter(m => m.level <= level)
    .map(m => {
      const match = m.reward.match(/(\d+)\s+Starting\s+Nexus\s+health/i);
      return match ? { lvl: m.level, val: parseInt(match[1], 10) } : null;
    })
    .filter(Boolean) as { lvl: number; val: number }[];
  if (healthMilestones.length > 0) {
    healthMilestones.sort((a, b) => b.lvl - a.lvl);
    nexusHealth = healthMilestones[0].val;
  } else {
    // Standard level fallback for Nexus Health
    if (level >= 16) nexusHealth = 35;
    else if (level >= 4) nexusHealth = 30;
    else if (level >= 2) nexusHealth = 25;
    else nexusHealth = 20;
  }

  // Path of Champions standard starting gold progression (+50 at Level 2, +100 at Level 23)
  let startingGold = 200;
  if (level >= 23) {
    startingGold = 350;
  } else if (level >= 2) {
    startingGold = 250;
  }

  // Revive tokens unlocked (+1 at Level 7, +1 at Level 21)
  let revives = 0;
  if (level >= 21) {
    revives = 2;
  } else if (level >= 7) {
    revives = 1;
  }

  // Game Start Champion Draw (Heroes' Welcome unlocked at Level 20)
  const hasChampionDraw = level >= 20;

  // Nexus Health Regen (cumulative)
  let regen = 0;
  levelRoadmap
    .filter(m => m.level <= level)
    .forEach(m => {
      const match = m.reward.match(/\+(\d+)\s+(?:Nexus\s+Health\s+)?Regen/i);
      if (match) {
        regen += parseInt(match[1], 10);
      }
    });
  if (levelRoadmap.length === 0 || regen === 0) {
    if (level >= 22) regen = 4;
    else if (level >= 10) regen = 2;
  }

  // Rare Item/Power Chance
  let rareChance = 0;
  const rareMilestones = levelRoadmap
    .filter(m => m.level <= level)
    .map(m => {
      const match = m.reward.match(/\+?(\d+(?:\.\d+)?)\%\s+to\s+find\s+Rare\s+items/i);
      return match ? { lvl: m.level, val: parseFloat(match[1]) } : null;
    })
    .filter(Boolean) as { lvl: number; val: number }[];
  if (rareMilestones.length > 0) {
    rareMilestones.sort((a, b) => b.lvl - a.lvl);
    rareChance = rareMilestones[0].val;
  } else {
    if (level >= 22) rareChance = 15;
    else if (level >= 14) rareChance = 10;
  }

  // Epic Item/Power Chance
  let epicChance = 0;
  const epicMilestones = levelRoadmap
    .filter(m => m.level <= level)
    .map(m => {
      const match = m.reward.match(/\+?(\d+(?:\.\d+)?)\%\s+to\s+find\s+Epic\s+items/i);
      return match ? { lvl: m.level, val: parseFloat(match[1]) } : null;
    })
    .filter(Boolean) as { lvl: number; val: number }[];
  if (epicMilestones.length > 0) {
    epicMilestones.sort((a, b) => b.lvl - a.lvl);
    epicChance = epicMilestones[0].val;
  } else {
    if (level >= 24) epicChance = 7.5;
    else if (level >= 16) epicChance = 5;
  }

  // Legendary Power Chance
  let legendaryChance = 0;
  const legendaryMilestones = levelRoadmap
    .filter(m => m.level <= level)
    .map(m => {
      const match = m.reward.match(/\+?(\d+(?:\.\d+)?)\%\s+to\s+find\s+Legendary\s+powers/i);
      return match ? { lvl: m.level, val: parseFloat(match[1]) } : null;
    })
    .filter(Boolean) as { lvl: number; val: number }[];
  if (legendaryMilestones.length > 0) {
    legendaryMilestones.sort((a, b) => b.lvl - a.lvl);
    legendaryChance = legendaryMilestones[0].val;
  } else {
    if (level >= 26) legendaryChance = 3;
    else if (level >= 18) legendaryChance = 2;
    else if (level >= 10) legendaryChance = 1;
  }

  const isRareActive = rareChance > 0;
  const isEpicActive = epicChance > 0;
  const isLegendaryActive = legendaryChance > 0;
  const isRegenActive = regen > 0;
  const isReviveActive = revives > 0;

  const perksLeft = [
    {
      label: "Starting Health",
      value: `${nexusHealth} HP`,
      isActive: true,
      icon: (
        <svg className="w-4 h-4 text-rose-500 fill-current drop-shadow-[0_0_4px_rgba(244,63,94,0.6)]" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )
    },
    {
      label: "Health Regen",
      value: regen > 0 ? `+${regen} HP` : "0 HP",
      isActive: true,
      icon: (
        <svg className="w-4 h-4 text-rose-500 fill-current drop-shadow-[0_0_4px_rgba(244,63,94,0.6)]" viewBox="0 0 24 24">
          {/* Plus sign (top-left, enlarged to 8x8) */}
          <path d="M 4 1 H 6 V 4 H 9 V 6 H 6 V 9 H 4 V 6 H 1 V 4 H 4 Z" />
          {/* Heart (bottom-right, scaled down to prevent cropping) */}
          <path d="M 15 20 C 11 16.5 9 14 9 11.5 C 9 9.5 10.5 8 12.5 8 C 13.7 8 14.5 8.7 15 9.5 C 15.5 8.7 16.3 8 17.5 8 C 19.5 8 21 9.5 21 11.5 C 21 14 19 16.5 15 20 Z" />
        </svg>
      )
    },
    {
      label: "Starting Gold",
      value: `${startingGold} G`,
      isActive: true,
      icon: (
        <svg className="w-4 h-4 text-amber-400 fill-current drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 8v8M9 12h6" />
        </svg>
      )
    },
    {
      label: "Revive Tokens",
      value: `x${revives}`,
      isActive: true,
      icon: (
        <svg className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.6)]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3L22 4" />
        </svg>
      )
    }
  ];

  const perksRight = [
    {
      label: "Rare Find",
      value: `${rareChance}%`,
      isActive: true,
      icon: (
        <svg className="w-4 h-4 text-blue-400 fill-current drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]" viewBox="0 0 24 24">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" />
        </svg>
      )
    },
    {
      label: "Epic Find",
      value: `${epicChance}%`,
      isActive: true,
      icon: (
        <svg className="w-4 h-4 text-purple-400 fill-current drop-shadow-[0_0_5px_rgba(192,132,252,0.8)]" viewBox="0 0 24 24">
          <path d="M12 2L15 9L22 9L16.5 14L18.5 21L12 17L5.5 21L7.5 14L2 9L9 9Z" />
        </svg>
      )
    },
    {
      label: "Legendary Find",
      value: `${legendaryChance}%`,
      isActive: true,
      icon: (
        <svg className="w-4 h-4 text-amber-500 fill-current drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]" viewBox="0 0 24 24">
          <path d="M12 2L14.5 7.7L20.7 7L17 12L20.7 17L14.5 16.3L12 22L9.5 16.3L3.3 17L7 12L3.3 7L9.5 7.7Z" />
        </svg>
      )
    },
    {
      label: "Starting Draw",
      value: hasChampionDraw ? "Champion" : "Normal",
      isActive: true,
      icon: (
        <svg className="w-4 h-4 text-orange-500 drop-shadow-[0_0_4px_rgba(249,115,22,0.6)]" viewBox="0 0 24 24">
          {/* Left Card */}
          <rect x="2" y="6" width="9" height="13" rx="1" transform="rotate(-12 6.5 12.5)" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
          {/* Right Card */}
          <rect x="13" y="6" width="9" height="13" rx="1" transform="rotate(12 17.5 12.5)" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
          {/* Center Card */}
          <rect x="7.5" y="4" width="9" height="14" rx="1" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    }
  ];

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

        {/* Perks Card */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm text-slate-400 font-bold tracking-widest uppercase">Perks</h4>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Left Column */}
            <div className="flex flex-col gap-3.5">
              {perksLeft.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-900/30 pb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="shrink-0">{p.icon}</div>
                    <span className={`text-[11px] font-bold truncate ${p.isActive ? "text-slate-400" : "text-slate-600"}`}>{p.label}</span>
                  </div>
                  <span className={`text-xs font-black font-mono shrink-0 ml-1.5 ${p.isActive ? "text-slate-200" : "text-slate-600"}`}>{p.value}</span>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-3.5">
              {perksRight.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-900/30 pb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="shrink-0">{p.icon}</div>
                    <span className={`text-[11px] font-bold truncate ${p.isActive ? "text-slate-400" : "text-slate-600"}`}>{p.label}</span>
                  </div>
                  <span className={`text-xs font-black font-mono shrink-0 ml-1.5 ${p.isActive ? "text-slate-200" : "text-slate-600"}`}>{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
