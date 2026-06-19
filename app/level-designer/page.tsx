"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import championData from "@/data/champions.json";
import { Champion, LevelMilestone, PerkCurves } from "@/types";

export default function LevelDesigner() {
  const champions: Champion[] = (championData.champions as any[]).map((c) => {
    const { level: levelArray, ...rest } = c;
    return {
      level: 1,
      stars: 0,
      xp: 0,
      maxXp: 500,
      maxLevel: 50,
      relics: [],
      color: "from-stone-900 via-red-950 to-slate-950",
      goldBorder: false,
      unlockedNodes: [],
      levelRoadmap: levelArray || [],
      ...rest,
    };
  });

  const [selectedBaseId, setSelectedBaseId] = useState(champions[0]?.id || "");
  const [championName, setChampionName] = useState("New Champion");
  const [milestones, setMilestones] = useState<LevelMilestone[]>([]);
  const [perkCurves, setPerkCurves] = useState<PerkCurves>({});

  // Global Replace states
  const [findCard, setFindCard] = useState("");
  const [replaceCard, setReplaceCard] = useState("");
  const [findItem, setFindItem] = useState("");
  const [replaceItem, setReplaceItem] = useState("");

  const [copiedLevel, setCopiedLevel] = useState(false);
  const [copiedCurves, setCopiedCurves] = useState(false);
  const [copiedPreview, setCopiedPreview] = useState(false);

  // Initialize/clone milestones from template
  useEffect(() => {
    const baseChamp = champions.find(c => c.id === selectedBaseId);
    if (baseChamp) {
      // Create a copy of milestones
      const cloned = JSON.parse(JSON.stringify(baseChamp.levelRoadmap || [])) as LevelMilestone[];
      
      // Ensure we have milestones up to level 50
      const fullList: LevelMilestone[] = [];
      for (let l = 1; l <= 50; l++) {
        const existing = cloned.find(m => m.level === l);
        if (existing) {
          fullList.push(existing);
        } else {
          fullList.push({
            level: l,
            xpNeeded: 0,
            title: `Level ${l} Upgrade`,
            reward: `Upgrade description for level ${l}.`
          });
        }
      }
      setMilestones(fullList);
      setChampionName(`Custom ${baseChamp.name}`);
    }
  }, [selectedBaseId]);

  // Run dynamic perk curve generator whenever milestones change
  useEffect(() => {
    generateCurves();
  }, [milestones]);

  const handleMilestoneChange = (index: number, key: keyof LevelMilestone, value: any) => {
    setMilestones(prev => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [key]: value
      };
      return next;
    });
  };

  // Perform bulk find and replace
  const applyReplacements = () => {
    setMilestones(prev => {
      return prev.map(m => {
        let reward = m.reward;
        if (findCard && replaceCard) {
          reward = reward.replaceAll(findCard, replaceCard);
        }
        if (findItem && replaceItem) {
          reward = reward.replaceAll(findItem, replaceItem);
        }
        return {
          ...m,
          reward
        };
      });
    });
    // Reset replace fields
    setFindCard("");
    setReplaceCard("");
    setFindItem("");
    setReplaceItem("");
  };

  // Parse rewards dynamically to build the curves
  const generateCurves = () => {
    const curves: PerkCurves = {
      health: {},
      regen: {},
      gold: {},
      revives: {},
      rareChance: {},
      epicChance: {},
      legendaryChance: {},
      startingDraw: {}
    };

    let currentHealth = 20;
    let currentRegen = 0;
    let currentGold = 200;
    let currentRevives = 0;
    let currentRare = 0;
    let currentEpic = 0;
    let currentLegendary = 0;
    let currentDraw = 0;

    milestones.forEach(m => {
      const lvlStr = m.level.toString();
      let hasChanges = false;

      // 1. Health
      const hpMatch = m.reward.match(/(\d+)\s+Starting\s+Nexus\s+health/i);
      const hpAddMatch = m.reward.match(/\+(\d+)\s+Nexus\s+Health/i);
      if (hpMatch) {
        currentHealth = parseInt(hpMatch[1], 10);
        curves.health![lvlStr] = currentHealth;
      } else if (hpAddMatch) {
        currentHealth += parseInt(hpAddMatch[1], 10);
        curves.health![lvlStr] = currentHealth;
      } else if (m.level === 1) {
        curves.health!["1"] = currentHealth;
      }

      // 2. Regen
      const regenMatch = m.reward.match(/\+(\d+)\s+(?:Nexus\s+Health\s+)?Regen/i);
      if (regenMatch) {
        currentRegen += parseInt(regenMatch[1], 10);
        curves.regen![lvlStr] = currentRegen;
      } else if (m.level === 1) {
        curves.regen!["1"] = currentRegen;
      }

      // 3. Gold
      const goldMatch = m.reward.match(/\+(\d+)\s+Starting\s+Gold/i);
      if (m.level === 2 && currentGold === 200) {
        currentGold = 250; // Fallback PoC standard +50 gold
        curves.gold!["2"] = currentGold;
      } else if (m.level === 23 && currentGold === 250) {
        currentGold = 350; // Fallback PoC standard +100 gold
        curves.gold!["23"] = currentGold;
      }
      if (goldMatch) {
        currentGold += parseInt(goldMatch[1], 10);
        curves.gold![lvlStr] = currentGold;
      } else if (m.level === 1) {
        curves.gold!["1"] = currentGold;
      }

      // 4. Revives
      const reviveMatch = m.reward.match(/(\d+)\s+Revive\s+Token/i);
      if (m.level === 7 && currentRevives === 0) {
        currentRevives = 1;
        curves.revives!["7"] = currentRevives;
      } else if (m.level === 21 && currentRevives === 1) {
        currentRevives = 2;
        curves.revives!["21"] = currentRevives;
      }
      if (reviveMatch) {
        currentRevives = parseInt(reviveMatch[1], 10);
        curves.revives![lvlStr] = currentRevives;
      } else if (m.level === 1) {
        curves.revives!["1"] = currentRevives;
      }

      // 5. Rare Chance
      const rareMatch = m.reward.match(/\+?(\d+(?:\.\d+)?)\%\s+to\s+find\s+Rare\s+items/i);
      if (rareMatch) {
        currentRare = parseFloat(rareMatch[1]);
        curves.rareChance![lvlStr] = currentRare;
      } else if (m.level === 1) {
        curves.rareChance!["1"] = currentRare;
      }

      // 6. Epic Chance
      const epicMatch = m.reward.match(/\+?(\d+(?:\.\d+)?)\%\s+to\s+find\s+Epic\s+items/i);
      if (epicMatch) {
        currentEpic = parseFloat(epicMatch[1]);
        curves.epicChance![lvlStr] = currentEpic;
      } else if (m.level === 1) {
        curves.epicChance!["1"] = currentEpic;
      }

      // 7. Legendary Chance
      const legendaryMatch = m.reward.match(/\+?(\d+(?:\.\d+)?)\%\s+to\s+find\s+Legendary\s+powers/i);
      if (legendaryMatch) {
        currentLegendary = parseFloat(legendaryMatch[1]);
        curves.legendaryChance![lvlStr] = currentLegendary;
      } else if (m.level === 1) {
        curves.legendaryChance!["1"] = currentLegendary;
      }

      // 8. Starting Draw
      const drawMatch = m.reward.match(/Draw\s+a\s+champion/i);
      if (m.level === 20 && currentDraw === 0) {
        currentDraw = 1;
        curves.startingDraw!["20"] = currentDraw;
      }
      if (drawMatch) {
        currentDraw = 1;
        curves.startingDraw![lvlStr] = currentDraw;
      } else if (m.level === 1) {
        curves.startingDraw!["1"] = currentDraw;
      }
    });

    setPerkCurves(curves);
  };

  const copyToClipboard = (text: string, flagSetter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    flagSetter(true);
    setTimeout(() => flagSetter(false), 2000);
  };

  const downloadJson = () => {
    const fullChampJson = {
      id: championName.toLowerCase().replace(/\s+/g, "_"),
      name: championName,
      level: milestones.map(({ level, xpNeeded, title, reward }) => ({ level, xpNeeded, title, reward })),
      perkCurves
    };
    const blob = new Blob([JSON.stringify(fullChampJson, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fullChampJson.id}_level_roadmap.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col font-sans select-none selection:bg-amber-600/30 selection:text-amber-200">
      {/* Header */}
      <Header />

      {/* Main Designer Layout */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Title Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-900 pb-4 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Level Progression Designer
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Clone templates, globally modify deck upgrade targets, and auto-generate perk scaling configurations.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">Clone Template:</span>
            <select
              value={selectedBaseId}
              onChange={(e) => setSelectedBaseId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-sm rounded-lg px-3 py-1.5 text-[#e5c17d] font-bold outline-none focus:border-[#c29d53]"
            >
              {champions.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dashboard Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Utilities & Export Output (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
            
            {/* Champion Settings */}
            <div className="bg-[#090d16]/40 border border-slate-900 rounded-xl p-5 flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Champion Info</h3>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Name</label>
                <input
                  type="text"
                  value={championName}
                  onChange={(e) => setChampionName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-2 text-sm font-bold text-slate-200 outline-none focus:border-[#c29d53]"
                  placeholder="e.g. Jailbreak Jinx"
                />
              </div>
            </div>

            {/* Global Swap / Replace Utility */}
            <div className="bg-[#090d16]/40 border border-slate-900 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Deck Card & Item Swapper</h3>
                <span className="text-[9px] text-[#c29d53] uppercase font-mono">Bulk Replacer</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Easily rename starter deck cards and items globally across all level roadmap milestones.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-500 font-bold uppercase">Find Card</label>
                  <input
                    type="text"
                    value={findCard}
                    onChange={(e) => setFindCard(e.target.value)}
                    className="bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-[#c29d53]"
                    placeholder="e.g. Furious Wielder"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-500 font-bold uppercase">Replace Card</label>
                  <input
                    type="text"
                    value={replaceCard}
                    onChange={(e) => setReplaceCard(e.target.value)}
                    className="bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-[#c29d53]"
                    placeholder="e.g. Scrapheap"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-500 font-bold uppercase">Find Item</label>
                  <input
                    type="text"
                    value={findItem}
                    onChange={(e) => setFindItem(e.target.value)}
                    className="bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-[#c29d53]"
                    placeholder="e.g. Mana Potion"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-500 font-bold uppercase">Replace Item</label>
                  <input
                    type="text"
                    value={replaceItem}
                    onChange={(e) => setReplaceItem(e.target.value)}
                    className="bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-[#c29d53]"
                    placeholder="e.g. Tear of Goddess"
                  />
                </div>
              </div>

              <button
                onClick={applyReplacements}
                className="w-full bg-[#c29d53]/10 hover:bg-[#c29d53]/20 border border-[#c29d53]/40 text-[#e5c17d] font-bold text-xs py-2.5 rounded-lg transition-colors cursor-pointer text-center"
              >
                Apply Replacements Globally
              </button>
            </div>

            {/* Export Pane */}
            <div className="bg-[#090d16]/40 border border-slate-900 rounded-xl p-5 flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Export & Copy configuration</h3>
              
              <div className="flex flex-col gap-3">
                {/* Copy Level Milestones */}
                <div className="flex justify-between items-center bg-slate-950/80 border border-slate-900 p-3 rounded-lg">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-200">Level Roadmaps JSON</h4>
                    <p className="text-[9px] text-slate-500 truncate mt-0.5">Custom levels 1-50 array</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(milestones.map(({ level, xpNeeded, title, reward }) => ({ level, xpNeeded, title, reward })), null, 2), setCopiedLevel)}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      copiedLevel ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {copiedLevel ? "Copied!" : "Copy JSON"}
                  </button>
                </div>

                {/* Copy Auto Curves */}
                <div className="flex justify-between items-center bg-slate-950/80 border border-slate-900 p-3 rounded-lg">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-200">Generated Perk Curves</h4>
                    <p className="text-[9px] text-slate-500 truncate mt-0.5">Auto-computed health/regen/gold milestones</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(perkCurves, null, 2), setCopiedCurves)}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      copiedCurves ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {copiedCurves ? "Copied!" : "Copy JSON"}
                  </button>
                </div>
              </div>

              <button
                onClick={downloadJson}
                className="w-full bg-[#c29d53] hover:bg-[#b08d45] text-slate-950 font-black text-xs py-3 rounded-lg transition-colors cursor-pointer shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Level Roadmap JSON
              </button>
            </div>

            {/* Live JSON Preview */}
            <div className="bg-[#090d16]/40 border border-slate-900 rounded-xl p-5 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Live JSON Preview</h3>
                <button
                  onClick={() => copyToClipboard(JSON.stringify({
                    id: championName.toLowerCase().replace(/\s+/g, "_"),
                    name: championName,
                    level: milestones.map(({ level, xpNeeded, title, reward }) => ({ level, xpNeeded, title, reward })),
                    perkCurves
                  }, null, 2), setCopiedPreview)}
                  className={`px-2 py-1 rounded text-[9px] font-bold font-mono transition-all cursor-pointer ${
                    copiedPreview ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-900 text-slate-350 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {copiedPreview ? "Copied!" : "Copy Full JSON"}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Real-time generated configuration structure including milestones and perk progression curves.
              </p>
              <div className="bg-slate-950/85 border border-slate-900 rounded-lg p-3 h-[280px] overflow-y-auto scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-900 select-text">
                <pre className="text-[10px] font-mono text-[#cbd5e1] leading-normal whitespace-pre-wrap break-all">
                  {JSON.stringify({
                    id: championName.toLowerCase().replace(/\s+/g, "_"),
                    name: championName,
                    level: milestones.map(({ level, xpNeeded, title, reward }) => ({ level, xpNeeded, title, reward })),
                    perkCurves
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Scrollable 1-50 Milestone Editor Grid (Span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-sm font-bold text-slate-350 tracking-wider uppercase font-mono">Milestone Configuration</h3>
              <span className="text-xs font-mono font-bold text-[#e5c17d]">LVL 1 - 50</span>
            </div>

            <div className="flex flex-col gap-4 max-h-[750px] overflow-y-auto pr-3 pl-1 scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-900 border border-slate-900/60 p-4 rounded-xl bg-slate-950/20">
              {milestones.map((m, idx) => {
                // Quick indicators for perk updates to highlight them visually
                const isHpUpgrade = m.reward.toLowerCase().includes("health");
                const isRegenUpgrade = m.reward.toLowerCase().includes("regen");
                const isGoldUpgrade = m.reward.toLowerCase().includes("gold");
                const isRareUpgrade = m.reward.toLowerCase().includes("rare");
                const isEpicUpgrade = m.reward.toLowerCase().includes("epic");
                const isLegendaryUpgrade = m.reward.toLowerCase().includes("legendary");

                return (
                  <div
                    key={m.level}
                    className={`border rounded-xl p-4 flex flex-col gap-3 transition-all ${
                      isHpUpgrade || isRegenUpgrade || isGoldUpgrade
                        ? "bg-slate-950/40 border-slate-900/80 hover:border-slate-800"
                        : "bg-slate-950/10 border-slate-900/40 hover:border-slate-900/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Level Indicator Badge */}
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded bg-[#c29d53]/10 border border-[#c29d53]/25 text-xs font-mono font-extrabold text-[#e5c17d]">
                          LVL {m.level}
                        </span>
                        
                        {/* Perk upgrade tags */}
                        <div className="flex gap-1">
                          {isHpUpgrade && <span className="text-[7.5px] font-black uppercase font-mono px-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">HP</span>}
                          {isRegenUpgrade && <span className="text-[7.5px] font-black uppercase font-mono px-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">REGEN</span>}
                          {isGoldUpgrade && <span className="text-[7.5px] font-black uppercase font-mono px-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">GOLD</span>}
                          {(isRareUpgrade || isEpicUpgrade || isLegendaryUpgrade) && (
                            <span className="text-[7.5px] font-black uppercase font-mono px-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">FIND</span>
                          )}
                        </div>
                      </div>

                      {/* XP needed Input */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">XP Needed:</span>
                        <input
                          type="number"
                          value={m.xpNeeded}
                          onChange={(e) => handleMilestoneChange(idx, "xpNeeded", Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-16 px-1.5 py-0.5 text-center bg-slate-950 border border-slate-900 rounded font-mono text-xs text-slate-300 focus:border-[#c29d53] outline-none"
                        />
                      </div>
                    </div>

                    {/* Milestone Title Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-slate-500 font-bold uppercase">Upgrade Title</label>
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => handleMilestoneChange(idx, "title", e.target.value)}
                        className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-300 focus:border-[#c29d53] outline-none"
                      />
                    </div>

                    {/* Milestone Reward Textarea */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-slate-500 font-bold uppercase">Reward Description</label>
                      <textarea
                        value={m.reward}
                        onChange={(e) => handleMilestoneChange(idx, "reward", e.target.value)}
                        rows={2}
                        className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-2 text-xs text-slate-300 focus:border-[#c29d53] outline-none resize-none font-sans leading-relaxed"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
