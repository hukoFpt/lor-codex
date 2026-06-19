import { Champion, LevelMilestone } from "@/types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LevelTabProps {
  champion: Champion;
}

export default function LevelTab({ champion }: LevelTabProps) {
  const { level, levelRoadmap = [], maxLevel = 30 } = champion;
  const perkCurves = champion.perkCurves;

  const [selectedPerkKey, setSelectedPerkKey] = useState<string | null>(null);
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);

  // Unified helper to get a perk's value at any specific level
  const getPerkValueAtLevel = (perkKey: string, lvl: number): number | string => {
    // 1. Check custom perkCurves JSON structure first
    if (perkCurves && perkCurves[perkKey as keyof typeof perkCurves]) {
      const curve = perkCurves[perkKey as keyof typeof perkCurves]!;
      let bestKey = -1;
      let bestVal: number | string = 0;
      
      Object.entries(curve).forEach(([k, val]) => {
        const kNum = parseInt(k, 10);
        if (kNum <= lvl && kNum > bestKey) {
          bestKey = kNum;
          bestVal = val;
        }
      });
      if (bestKey !== -1) {
        return bestVal;
      }
    }

    // 2. Fallback to dynamic parsing of milestone rewards or standard Path of Champions progression
    if (perkKey === "health") {
      const healthMilestones = levelRoadmap
        .filter(m => m.level <= lvl)
        .map(m => {
          const match = m.reward.match(/(\d+)\s+Starting\s+Nexus\s+health/i);
          return match ? { lvl: m.level, val: parseInt(match[1], 10) } : null;
        })
        .filter(Boolean) as { lvl: number; val: number }[];
      if (healthMilestones.length > 0) {
        healthMilestones.sort((a, b) => b.lvl - a.lvl);
        return healthMilestones[0].val;
      }
      if (lvl >= 16) return 35;
      if (lvl >= 4) return 30;
      if (lvl >= 2) return 25;
      return 20;
    }

    if (perkKey === "regen") {
      let regen = 0;
      levelRoadmap
        .filter(m => m.level <= lvl)
        .forEach(m => {
          const match = m.reward.match(/\+(\d+)\s+(?:Nexus\s+Health\s+)?Regen/i);
          if (match) {
            regen += parseInt(match[1], 10);
          }
        });
      if (regen > 0) return regen;
      if (lvl >= 22) return 4;
      if (lvl >= 10) return 2;
      return 0;
    }

    if (perkKey === "gold") {
      if (lvl >= 23) return 350;
      if (lvl >= 2) return 250;
      return 200;
    }

    if (perkKey === "revives") {
      if (lvl >= 21) return 2;
      if (lvl >= 7) return 1;
      return 0;
    }

    if (perkKey === "rareChance") {
      const rareMilestones = levelRoadmap
        .filter(m => m.level <= lvl)
        .map(m => {
          const match = m.reward.match(/\+?(\d+(?:\.\d+)?)\%\s+to\s+find\s+Rare\s+items/i);
          return match ? { lvl: m.level, val: parseFloat(match[1]) } : null;
        })
        .filter(Boolean) as { lvl: number; val: number }[];
      if (rareMilestones.length > 0) {
        rareMilestones.sort((a, b) => b.lvl - a.lvl);
        return rareMilestones[0].val;
      }
      if (lvl >= 22) return 15;
      if (lvl >= 14) return 10;
      return 0;
    }

    if (perkKey === "epicChance") {
      const epicMilestones = levelRoadmap
        .filter(m => m.level <= lvl)
        .map(m => {
          const match = m.reward.match(/\+?(\d+(?:\.\d+)?)\%\s+to\s+find\s+Epic\s+items/i);
          return match ? { lvl: m.level, val: parseFloat(match[1]) } : null;
        })
        .filter(Boolean) as { lvl: number; val: number }[];
      if (epicMilestones.length > 0) {
        epicMilestones.sort((a, b) => b.lvl - a.lvl);
        return epicMilestones[0].val;
      }
      if (lvl >= 24) return 7.5;
      if (lvl >= 16) return 5;
      return 0;
    }

    if (perkKey === "legendaryChance") {
      const legendaryMilestones = levelRoadmap
        .filter(m => m.level <= lvl)
        .map(m => {
          const match = m.reward.match(/\+?(\d+(?:\.\d+)?)\%\s+to\s+find\s+Legendary\s+powers/i);
          return match ? { lvl: m.level, val: parseFloat(match[1]) } : null;
        })
        .filter(Boolean) as { lvl: number; val: number }[];
      if (legendaryMilestones.length > 0) {
        legendaryMilestones.sort((a, b) => b.lvl - a.lvl);
        return legendaryMilestones[0].val;
      }
      if (lvl >= 26) return 3;
      if (lvl >= 18) return 2;
      if (lvl >= 10) return 1;
      return 0;
    }

    if (perkKey === "startingDraw") {
      return lvl >= 20 ? 1 : 0;
    }

    return 0;
  };

  // Current values at the champion's current level
  const nexusHealth = getPerkValueAtLevel("health", level) as number;
  const regen = getPerkValueAtLevel("regen", level) as number;
  const startingGold = getPerkValueAtLevel("gold", level) as number;
  const revives = getPerkValueAtLevel("revives", level) as number;
  const rareChance = getPerkValueAtLevel("rareChance", level) as number;
  const epicChance = getPerkValueAtLevel("epicChance", level) as number;
  const legendaryChance = getPerkValueAtLevel("legendaryChance", level) as number;
  const startingDrawVal = getPerkValueAtLevel("startingDraw", level);
  const hasChampionDraw = startingDrawVal === 1 || startingDrawVal === "Champion";

  // Roadmaps/Milestones list
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

  // Perks Config definitions with visual tokens and helper information
  const perks = [
    {
      key: "health",
      label: "Starting Health",
      value: `${nexusHealth} HP`,
      rawVal: nexusHealth,
      unit: " HP",
      color: "text-rose-500",
      accentColor: "#f43f5e",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      glowColor: "rgba(244,63,94,0.6)",
      description: "Starting Nexus health at the beginning of an adventure.",
      icon: (
        <svg className="w-4 h-4 text-rose-500 fill-current drop-shadow-[0_0_4px_rgba(244,63,94,0.6)]" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )
    },
    {
      key: "regen",
      label: "Health Regen",
      value: regen > 0 ? `+${regen} HP` : "0 HP",
      rawVal: regen,
      unit: " HP",
      color: "text-rose-500",
      accentColor: "#f43f5e",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      glowColor: "rgba(244,63,94,0.6)",
      description: "Nexus health restored upon completing an encounter.",
      icon: (
        <svg className="w-4 h-4 text-rose-500 fill-current drop-shadow-[0_0_4px_rgba(244,63,94,0.6)]" viewBox="0 0 24 24">
          <path d="M 4 1 H 6 V 4 H 9 V 6 H 6 V 9 H 4 V 6 H 1 V 4 H 4 Z" />
          <path d="M 15 20 C 11 16.5 9 14 9 11.5 C 9 9.5 10.5 8 12.5 8 C 13.7 8 14.5 8.7 15 9.5 C 15.5 8.7 16.3 8 17.5 8 C 19.5 8 21 9.5 21 11.5 C 21 14 19 16.5 15 20 Z" />
        </svg>
      )
    },
    {
      key: "gold",
      label: "Starting Gold",
      value: `${startingGold} G`,
      rawVal: startingGold,
      unit: " G",
      color: "text-amber-400",
      accentColor: "#fbbf24",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      glowColor: "rgba(251,191,36,0.6)",
      description: "Gold available at the start of each adventure to purchase items/powers.",
      icon: (
        <svg className="w-4 h-4 text-amber-400 fill-current drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 8v8M9 12h6" />
        </svg>
      )
    },
    {
      key: "revives",
      label: "Revive Tokens",
      value: `x${revives}`,
      rawVal: revives,
      unit: " Revives",
      color: "text-emerald-400",
      accentColor: "#34d399",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      glowColor: "rgba(52,211,153,0.6)",
      description: "Tokens available to revive and retry a battle upon defeat.",
      icon: (
        <svg className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.6)]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3L22 4" />
        </svg>
      )
    },
    {
      key: "rareChance",
      label: "Rare Find",
      value: `${rareChance}%`,
      rawVal: rareChance,
      unit: "%",
      color: "text-blue-400",
      accentColor: "#60a5fa",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      glowColor: "rgba(96,165,250,0.8)",
      description: "Bonus chance to find Rare items and powers during adventures.",
      icon: (
        <svg className="w-4 h-4 text-blue-400 fill-current drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]" viewBox="0 0 24 24">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" />
        </svg>
      )
    },
    {
      key: "epicChance",
      label: "Epic Find",
      value: `${epicChance}%`,
      rawVal: epicChance,
      unit: "%",
      color: "text-purple-400",
      accentColor: "#c084fc",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      glowColor: "rgba(192,132,252,0.8)",
      description: "Bonus chance to find Epic items and powers during adventures.",
      icon: (
        <svg className="w-4 h-4 text-purple-400 fill-current drop-shadow-[0_0_5px_rgba(192,132,252,0.8)]" viewBox="0 0 24 24">
          <path d="M12 2L15 9L22 9L16.5 14L18.5 21L12 17L5.5 21L7.5 14L2 9L9 9Z" />
        </svg>
      )
    },
    {
      key: "legendaryChance",
      label: "Legendary Find",
      value: `${legendaryChance}%`,
      rawVal: legendaryChance,
      unit: "%",
      color: "text-amber-500",
      accentColor: "#f59e0b",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      glowColor: "rgba(245,158,11,0.8)",
      description: "Bonus chance to find Legendary powers at reward screens.",
      icon: (
        <svg className="w-4 h-4 text-amber-500 fill-current drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]" viewBox="0 0 24 24">
          <path d="M12 2L14.5 7.7L20.7 7L17 12L20.7 17L14.5 16.3L12 22L9.5 16.3L3.3 17L7 12L3.3 7L9.5 7.7Z" />
        </svg>
      )
    },
    {
      key: "startingDraw",
      label: "Starting Draw",
      value: hasChampionDraw ? "Champion" : "Normal",
      rawVal: hasChampionDraw ? 1 : 0,
      unit: "",
      color: "text-orange-500",
      accentColor: "#f97316",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      glowColor: "rgba(249,115,22,0.6)",
      description: "Guarantees drawing a copy of your Champion at the start of combat.",
      icon: (
        <svg className="w-4 h-4 text-orange-500 drop-shadow-[0_0_4px_rgba(249,115,22,0.6)]" viewBox="0 0 24 24">
          <rect x="2" y="6" width="9" height="13" rx="1" transform="rotate(-12 6.5 12.5)" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
          <rect x="13" y="6" width="9" height="13" rx="1" transform="rotate(12 17.5 12.5)" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
          <rect x="7.5" y="4" width="9" height="14" rx="1" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    }
  ];

  const perksLeft = perks.slice(0, 4);
  const perksRight = perks.slice(4, 8);

  const selectedPerk = perks.find(p => p.key === selectedPerkKey) || perks[0];

  // SVG configuration
  const width = 340;
  const height = 160;
  const PaddingLeft = 45;
  const PaddingRight = 12;
  const PaddingTop = 15;
  const PaddingBottom = 22;
  const GraphWidth = width - PaddingLeft - PaddingRight;
  const GraphHeight = height - PaddingTop - PaddingBottom;

  // Build the progression curve (from level 1 to maxLevel)
  const curvePoints: { level: number; value: number | string }[] = [];
  for (let l = 1; l <= maxLevel; l++) {
    curvePoints.push({
      level: l,
      value: getPerkValueAtLevel(selectedPerk.key, l)
    });
  }

  // Derive dynamic Y axis range
  const rawValues = curvePoints.map(pt =>
    typeof pt.value === "string" ? (pt.value === "Champion" ? 1 : 0) : (pt.value as number)
  );
  const minVal = Math.min(...rawValues);
  const maxVal = Math.max(...rawValues);

  // Dynamic scale limits
  const yMin = 0;
  const yMax = maxVal === 0 ? 10 : maxVal * 1.15;

  // X ticks: L1, L15 (mid), L30 (max)
  const xLabels = [
    { lvl: 1, text: "L1" },
    { lvl: Math.round(maxLevel / 2), text: `L${Math.round(maxLevel / 2)}` },
    { lvl: maxLevel, text: `L${maxLevel}` }
  ];

  // Derive custom Y ticks for cleaner display
  let ticks: number[] = [];
  if (selectedPerk.key === "startingDraw") {
    ticks = [0, 1];
  } else if (maxVal <= 4) {
    // Revives or Regen
    for (let t = 0; t <= maxVal; t++) ticks.push(t);
  } else {
    // Large values (Health / Gold / Chances)
    const gap = (maxVal - minVal) / 3;
    ticks = [
      minVal,
      Math.round(minVal + gap),
      Math.round(minVal + gap * 2),
      maxVal
    ].filter((v, i, self) => self.indexOf(v) === i); // Deduplicate
  }

  // Format tick labels
  const formatTickVal = (val: number) => {
    if (selectedPerk.key === "startingDraw") {
      return val === 1 ? "Champ" : "Normal";
    }
    if (selectedPerk.key === "gold") return `${val}G`;
    if (selectedPerk.key === "health" || selectedPerk.key === "regen") return `${val}HP`;
    if (selectedPerk.key.endsWith("Chance")) return `${val}%`;
    return val.toString();
  };

  // SVG coordinates calculations
  const getCoords = (lvl: number, val: number | string) => {
    const xCoord = PaddingLeft + ((lvl - 1) / (maxLevel - 1)) * GraphWidth;
    const yVal = typeof val === "string" ? (val === "Champion" ? 1 : 0) : (val as number);
    const yCoord = PaddingTop + GraphHeight - (yVal / yMax) * GraphHeight;
    return { x: xCoord, y: yCoord };
  };

  // Build step line SVG path string
  let pathD = "";
  curvePoints.forEach((pt, i) => {
    const coords = getCoords(pt.level, pt.value);
    if (i === 0) {
      pathD = `M ${coords.x} ${coords.y}`;
    } else {
      pathD += ` H ${coords.x} V ${coords.y}`;
    }
  });

  const xStart = PaddingLeft;
  const xEnd = PaddingLeft + GraphWidth;
  const yBaseline = PaddingTop + GraphHeight;
  const fillD = `${pathD} L ${xEnd} ${yBaseline} L ${xStart} ${yBaseline} Z`;

  // Coordinates for the current level marker
  const safeLevel = Math.max(1, Math.min(maxLevel, level));
  const currentCoords = getCoords(safeLevel, selectedPerk.rawVal);

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

      {/* Right Column - Status Summary & Curves */}
      <div className="w-full md:w-[380px] flex flex-col gap-6 shrink-0">
        {/* Perks Card */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-baseline">
            <h4 className="text-sm text-slate-400 font-bold tracking-widest uppercase">Perks</h4>
            <span className="text-[10px] text-slate-500 font-mono italic">
              {selectedPerkKey ? "Click selected perk to close curve" : "Click a perk to view its curve"}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-x-5 gap-y-3.5">
            {/* Left Column Perks */}
            <div className="flex flex-col gap-2.5">
              {perksLeft.map((p) => {
                const isSelected = selectedPerkKey === p.key;
                return (
                  <button
                    key={p.key}
                    onClick={() => {
                      if (selectedPerkKey === p.key) {
                        setSelectedPerkKey(null);
                      } else {
                        setSelectedPerkKey(p.key);
                      }
                    }}
                    className={`flex items-center justify-between border rounded-lg px-3 py-2 text-left cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-[#c29d53]/10 border-[#c29d53]/50 shadow-[0_0_10px_rgba(194,157,83,0.15)]"
                        : "bg-slate-950/20 border-slate-900 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="shrink-0">{p.icon}</div>
                      <span className="text-[11px] font-bold truncate text-slate-350">{p.label}</span>
                    </div>
                    <span className={`text-xs font-black font-mono shrink-0 ml-1.5 ${p.color}`}>{p.value}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Column Perks */}
            <div className="flex flex-col gap-2.5">
              {perksRight.map((p) => {
                const isSelected = selectedPerkKey === p.key;
                return (
                  <button
                    key={p.key}
                    onClick={() => {
                      if (selectedPerkKey === p.key) {
                        setSelectedPerkKey(null);
                      } else {
                        setSelectedPerkKey(p.key);
                      }
                    }}
                    className={`flex items-center justify-between border rounded-lg px-3 py-2 text-left cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-[#c29d53]/10 border-[#c29d53]/50 shadow-[0_0_10px_rgba(194,157,83,0.15)]"
                        : "bg-slate-950/20 border-slate-900 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="shrink-0">{p.icon}</div>
                      <span className="text-[11px] font-bold truncate text-slate-350">{p.label}</span>
                    </div>
                    <span className={`text-xs font-black font-mono shrink-0 ml-1.5 ${p.color}`}>{p.value}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Details Area */}
        <AnimatePresence mode="wait">
          {selectedPerkKey ? (
            <motion.div
              key="perk-curve-visualization"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#090d16]/30 border border-slate-900/60 rounded-xl p-4 flex flex-col justify-between relative h-[268px] min-h-[268px]"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h5 className="text-xs font-bold text-slate-300 font-mono tracking-wider uppercase flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${selectedPerk.bgColor} border ${selectedPerk.borderColor} shadow-[0_0_6px_currentColor] shrink-0`} style={{ color: selectedPerk.accentColor }} />
                    {selectedPerk.label} Curve
                  </h5>
                  <p className="text-[10px] text-slate-350 mt-1 leading-normal">
                    {selectedPerk.description}
                  </p>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <button
                    onClick={() => setSelectedPerkKey(null)}
                    className="text-[9px] text-[#e5c17d] hover:text-[#ffffff] transition-colors font-mono cursor-pointer border border-[#c29d53]/30 bg-[#c29d53]/5 hover:bg-[#c29d53]/15 rounded px-2 py-0.5"
                  >
                    ✕ Close
                  </button>
                  <span className="text-[9px] text-slate-400 font-mono block">LVL {level} val</span>
                  <span className={`text-base font-black font-mono ${selectedPerk.color}`}>{selectedPerk.value}</span>
                </div>
              </div>

              {/* Interactive SVG Chart */}
              <div className="relative select-none">
                <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                  <defs>
                    <linearGradient id={`gradient-${selectedPerk.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={selectedPerk.accentColor} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={selectedPerk.accentColor} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines & Y-ticks */}
                  {ticks.map((t) => {
                    const tickY = PaddingTop + GraphHeight - (t / yMax) * GraphHeight;
                    return (
                      <g key={t} className="transition-all duration-300">
                        <line x1={PaddingLeft} y1={tickY} x2={PaddingLeft + GraphWidth} y2={tickY} stroke="#1e293b" strokeWidth="1" strokeDasharray="2 4" opacity="0.4" />
                        <text x={PaddingLeft - 6} y={tickY + 3} fill="#cbd5e1" fontSize="8.5" textAnchor="end" fontFamily="monospace" fontWeight="bold" opacity="0.95">
                          {formatTickVal(t)}
                        </text>
                      </g>
                    );
                  })}

                  {/* X Axis labels */}
                  {xLabels.map((l) => {
                    const labelX = PaddingLeft + ((l.lvl - 1) / (maxLevel - 1)) * GraphWidth;
                    return (
                      <g key={l.lvl}>
                        <line x1={labelX} y1={PaddingTop} x2={labelX} y2={PaddingTop + GraphHeight} stroke="#1e293b" strokeWidth="1" strokeDasharray="2 4" opacity="0.4" />
                        <text x={labelX} y={PaddingTop + GraphHeight + 14} fill="#cbd5e1" fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold" opacity="0.95">
                          {l.text}
                        </text>
                      </g>
                    );
                  })}

                  {/* Axis lines */}
                  <line x1={PaddingLeft} y1={PaddingTop + GraphHeight} x2={PaddingLeft + GraphWidth} y2={PaddingTop + GraphHeight} stroke="#1e293b" strokeWidth="1.2" opacity="0.5" />
                  <line x1={PaddingLeft} y1={PaddingTop} x2={PaddingLeft} y2={PaddingTop + GraphHeight} stroke="#1e293b" strokeWidth="1.2" opacity="0.5" />

                  {/* Gradient Area Fill */}
                  <path d={fillD} fill={`url(#gradient-${selectedPerk.key})`} className="transition-all duration-300 ease-out" />

                  {/* Step Path Stroke */}
                  <path d={pathD} fill="none" stroke={selectedPerk.accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 ease-out filter drop-shadow-[0_0_3px_var(--glow)]" style={{ "--glow": selectedPerk.glowColor } as any} />

                  {/* Current Level Line Indicator */}
                  <line x1={currentCoords.x} y1={PaddingTop} x2={currentCoords.x} y2={PaddingTop + GraphHeight} stroke="#c29d53" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

                  {/* Current Level Dot */}
                  <g>
                    <circle cx={currentCoords.x} cy={currentCoords.y} r="8" fill={selectedPerk.accentColor} opacity="0.35" className="animate-ping" style={{ transformOrigin: `${currentCoords.x}px ${currentCoords.y}px` }} />
                    <circle cx={currentCoords.x} cy={currentCoords.y} r="4" fill={selectedPerk.accentColor} stroke="#090d16" strokeWidth="1.5" />
                  </g>

                  {/* Transparent Hover Rectangles (Interactive Zones) */}
                  {curvePoints.map((pt) => {
                    const xCoord = PaddingLeft + ((pt.level - 1) / (maxLevel - 1)) * GraphWidth;
                    const hoverWidth = GraphWidth / (maxLevel - 1);
                    const rectX = xCoord - hoverWidth / 2;
                    return (
                      <rect
                        key={pt.level}
                        x={rectX}
                        y={PaddingTop}
                        width={hoverWidth}
                        height={GraphHeight}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredLevel(pt.level)}
                        onMouseLeave={() => setHoveredLevel(null)}
                      />
                    );
                  })}

                  {/* Hover Tooltip Overlay inside SVG */}
                  {hoveredLevel !== null && (() => {
                    const pt = curvePoints[hoveredLevel - 1];
                    const hCoords = getCoords(pt.level, pt.value);
                    const valNum = typeof pt.value === "string" ? (pt.value === "Champion" ? 1 : 0) : (pt.value as number);

                    // Tooltip box positioning
                    const tooltipWidth = 110;
                    const tooltipHeight = 50;
                    const tooltipX = hCoords.x > PaddingLeft + GraphWidth / 2 ? hCoords.x - tooltipWidth - 10 : hCoords.x + 10;
                    const tooltipY = Math.min(Math.max(hCoords.y - tooltipHeight / 2, PaddingTop), PaddingTop + GraphHeight - tooltipHeight);

                    const milestone = levelRoadmap.find(m => m.level === pt.level);

                    return (
                      <g className="pointer-events-none transition-all duration-75">
                        {/* Hover vertical grid line */}
                        <line x1={hCoords.x} y1={PaddingTop} x2={hCoords.x} y2={PaddingTop + GraphHeight} stroke={selectedPerk.accentColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.75" />
                        
                        {/* Hover point circle */}
                        <circle cx={hCoords.x} cy={hCoords.y} r="5" fill={selectedPerk.accentColor} stroke="#090d16" strokeWidth="1.5" className="shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                        
                        {/* Tooltip background card */}
                        <rect x={tooltipX} y={tooltipY} width={tooltipWidth} height={tooltipHeight} rx="6" fill="#0b0f1a" stroke={selectedPerk.accentColor} strokeWidth="1.5" opacity="0.96" />
                        
                        {/* Tooltip Content */}
                        <text x={tooltipX + 8} y={tooltipY + 16} fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="monospace">LVL {pt.level}</text>
                        <text x={tooltipX + 8} y={tooltipY + 31} fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                          {formatTickVal(valNum)}
                        </text>
                        {milestone && (
                          <text x={tooltipX + 8} y={tooltipY + 42} fill="#c29d53" fontSize="7.5" fontWeight="bold" opacity="0.9">
                            {milestone.title.length > 20 ? milestone.title.substring(0, 18) + ".." : milestone.title}
                          </text>
                        )}
                      </g>
                    );
                  })()}
                </svg>
              </div>
              <div className="flex justify-between items-center text-[9px] text-slate-550 font-mono mt-1 px-1">
                <span>Level 1</span>
                <span>Level {maxLevel}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="next-level-milestone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {nextMilestone ? (
                <div className="bg-gradient-to-br from-[#c29d53]/10 to-transparent border border-[#c29d53]/20 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-[268px] min-h-[268px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#c29d53]/5 rounded-full blur-2xl pointer-events-none" />
                  <div>
                    <span className="text-xs text-amber-500 font-bold uppercase tracking-wider font-mono">Next Milestone</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-black text-amber-500 font-mono">LVL {nextMilestone.level}</span>
                      <span className="text-xs text-slate-400 font-medium">unlocks:</span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center my-2 min-h-0">
                    <h4 className="text-sm font-extrabold text-slate-100">{nextMilestone.title}</h4>
                    <p className="text-xs text-slate-350 mt-1.5 whitespace-pre-line leading-relaxed overflow-y-auto pr-1 scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-900">{nextMilestone.reward}</p>
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono italic mt-1 border-t border-slate-900/60 pt-2 shrink-0">
                    Earn XP through encounters to level up.
                  </div>
                </div>
              ) : (
                <div className="bg-[#090d16]/30 border border-slate-900/60 rounded-xl p-6 relative overflow-hidden flex flex-col items-center justify-center text-center h-[268px] min-h-[268px]">
                  <div className="w-10 h-10 rounded-full bg-[#c29d53]/10 flex items-center justify-center text-[#e5c17d] mb-3 border border-[#c29d53]/20 shadow-[0_0_10px_rgba(194,157,83,0.1)]">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-extrabold text-[#e5c17d]">Max Level Reached</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    This champion has achieved the legendary level {maxLevel} mastery!
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
