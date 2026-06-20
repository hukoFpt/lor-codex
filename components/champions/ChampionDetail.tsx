import { Champion } from "@/types";
import { getConstellationMaxStars } from "@/utils/constellation";
import OverviewTab from "./details/overview/OverviewTab";
import LevelTab from "./details/LevelTab";
import DeckTab from "./details/DeckTab";
import RelicTab from "./details/RelicTab";
import ConstellationTab from "./details/ConstellationTab";
import { motion } from "framer-motion";
import { getRegionGlowColor } from "./ChampionList";

interface ChampionDetailProps {
  activeChamp: Champion | undefined;
  updateChampionProgress: (id: string, updates: Partial<Champion>) => void;
  handleToggleNode: (champId: string, nodeId: string) => void;
  isListCollapsed: boolean;
  selectedNodeId: string;
  setSelectedNodeId: (id: string) => void;
  activeConstellationSubTab: "star" | "bonus";
  setActiveConstellationSubTab: (tab: "star" | "bonus") => void;
  activeDetailTab: "overview" | "constellation" | "level" | "deck" | "relic";
  setActiveDetailTab: (tab: "overview" | "constellation" | "level" | "deck" | "relic") => void;
  isLoading?: boolean;
}

export default function ChampionDetail({
  activeChamp,
  updateChampionProgress,
  handleToggleNode,
  isListCollapsed,
  selectedNodeId,
  setSelectedNodeId,
  activeConstellationSubTab,
  setActiveConstellationSubTab,
  activeDetailTab,
  setActiveDetailTab,
  isLoading
}: ChampionDetailProps) {
  return (
    <div className={`w-full transition-all duration-300 ${isListCollapsed ? "md:w-[calc(100%-104px)]" : "md:w-2/3"} h-auto md:h-full flex flex-col min-h-0`}>
      {isLoading ? (
        <div className="rounded-2xl bg-gradient-to-b from-[#c29d53]/40 via-slate-800/20 to-slate-950/10 p-0.5 h-full flex flex-col flex-grow min-h-0">
          <div className="bg-[#0b0f1a]/95 rounded-2xl w-full flex-grow flex flex-col items-center justify-center gap-4 relative p-6 md:p-8">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40 rounded-2xl" />
            <div className="w-12 h-12 border-4 border-dashed border-[#c29d53] rounded-full animate-spin z-10" />
            <p className="text-sm font-bold text-slate-400 font-mono tracking-wider animate-pulse z-10">Syncing Champion Codex...</p>
          </div>
        </div>
      ) : activeChamp ? (
        <div className="rounded-2xl bg-gradient-to-b from-[#c29d53]/40 via-slate-800/20 to-slate-950/10 p-0.5 h-auto md:h-full flex flex-col flex-grow min-h-0">
          <div className="bg-[#0b0f1a]/95 rounded-2xl p-6 md:p-8 flex flex-col gap-5 relative h-full flex-grow min-h-0">
            {/* Grid background mesh overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40 rounded-2xl" />

            {/* Detail Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 z-10">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#e5c17d] font-semibold bg-[#c29d53]/10 px-2.5 py-1 rounded border border-[#c29d53]/20">
                  {Array.isArray(activeChamp.region) ? activeChamp.region.join(" / ") : activeChamp.region}
                </span>
                <h2 className="text-3xl font-extrabold mt-2 text-slate-100">
                  {activeChamp.name}
                </h2>
              </div>
              
              {/* Level & Star Power Container (Side-by-Side) */}
              <div className="flex flex-row items-center gap-6 shrink-0">
                {/* Level Gauge Semicircle */}
                <div className="relative flex flex-col items-center justify-center w-20 h-20 shrink-0 select-none overflow-visible">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
                    <defs>
                      <linearGradient id="semicircle-progress-gradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#e5c17d" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 27.66 80.74 A 38 38 0 1 1 72.66 80.74"
                      fill="none"
                      stroke="#131b2e"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                    {(() => {
                      const progress = activeChamp.maxXp > 0 ? activeChamp.xp / activeChamp.maxXp : 1;
                      return (
                        <motion.path
                          d="M 27.66 80.74 A 38 38 0 1 1 72.66 80.74"
                          fill="none"
                          stroke="url(#semicircle-progress-gradient)"
                          strokeWidth="7"
                          strokeLinecap="round"
                          strokeDasharray="191"
                          initial={{ strokeDashoffset: 191, opacity: 0 }}
                          animate={{
                            strokeDashoffset: 191 * (1 - progress),
                            opacity: progress > 0 ? 1 : 0
                          }}
                          transition={{ type: "spring", stiffness: 80, damping: 15 }}
                        />
                      );
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-0.5">LVL</span>
                    <div className="flex items-center justify-center gap-0">
                      {/* Decrease Level Button (Left) */}
                      <button
                        onClick={() => {
                          const val = Math.max(1, activeChamp.level - 1);
                          updateChampionProgress(activeChamp.id, { level: val });
                        }}
                        disabled={activeChamp.level <= 1}
                        className="text-slate-555 hover:text-[#e5c17d] disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:text-slate-555 transition-colors cursor-pointer flex items-center justify-center"
                        title="Previous Level"
                      >
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      {/* Level Input (Middle) */}
                      <input
                        type="number"
                        min={1}
                        max={activeChamp.maxLevel}
                        value={activeChamp.level}
                        onChange={(e) => {
                          const val = Math.max(1, Math.min(activeChamp.maxLevel, parseInt(e.target.value) || 1));
                          updateChampionProgress(activeChamp.id, { level: val });
                        }}
                        className="w-5 text-center bg-transparent border-none p-0 text-lg font-black font-mono text-[#e5c17d] focus:outline-none focus:ring-0 outline-none select-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none leading-none"
                      />

                      {/* Increase Level Button (Right) */}
                      <button
                        onClick={() => {
                          const val = Math.min(activeChamp.maxLevel, activeChamp.level + 1);
                          updateChampionProgress(activeChamp.id, { level: val });
                        }}
                        disabled={activeChamp.level >= activeChamp.maxLevel}
                        className="text-slate-555 hover:text-[#e5c17d] disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:text-slate-555 transition-colors cursor-pointer flex items-center justify-center"
                        title="Next Level"
                      >
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* XP Details */}
                <div className="flex flex-col justify-center gap-0.5 w-28 shrink-0">
                  {activeChamp.maxXp > 0 ? (
                    <>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">XP</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <input
                          type="number"
                          min={0}
                          max={activeChamp.maxXp}
                          value={activeChamp.xp}
                          onChange={(e) => {
                            const val = Math.max(0, Math.min(activeChamp.maxXp, parseInt(e.target.value) || 0));
                            updateChampionProgress(activeChamp.id, { xp: val });
                          }}
                          className="w-14 px-1 py-0.25 text-center bg-slate-950 border border-slate-900 focus:border-[#c29d53] focus:ring-1 focus:ring-[#c29d53]/40 rounded text-xs font-mono text-slate-200 outline-none"
                        />
                        <span className="text-xs text-slate-400 font-mono">
                          / {activeChamp.maxXp}
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-emerald-400 font-bold font-mono">MAX LVL</span>
                  )}
                </div>

                {/* Star Power & Bonus Stats */}
                <div className="flex flex-col items-start md:items-end gap-1 shrink-0 pb-1">
                  <span className="text-[10px] text-slate-400 font-mono">Star Power</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: getConstellationMaxStars(activeChamp) }).map((_, i) => {
                      const activeColor = "#e5c17d";
                      return (
                        <svg
                          key={i}
                          className="w-5 h-5 transition-all duration-300"
                          style={{
                            color: i < activeChamp.stars ? activeColor : 'rgb(30, 41, 59)',
                            filter: i < activeChamp.stars ? `drop-shadow(0 0 3px ${activeColor})` : undefined
                          }}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      );
                    })}
                  </div>
                  {/* Bonus Stats Dots */}
                  {(() => {
                    const bonusNodes = activeChamp.constellation?.nodes?.filter(n => n.upgradeType === "Bonus Stat") || [];
                    if (bonusNodes.length === 0) return null;
                    return (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {bonusNodes.map((node) => {
                          const isUnlocked = activeChamp.unlockedNodes?.includes(node.id);
                          const dotColor = node.color === "blue" ? "#38bdf8" : node.color === "purple" ? "#b79ced" : "#e5c17d";
                          return (
                            <svg
                              key={node.id}
                              className="w-2.5 h-2.5 transition-all duration-300"
                              style={{
                                color: isUnlocked ? dotColor : '#1e293b',
                                filter: isUnlocked ? `drop-shadow(0 0 2px ${dotColor})` : undefined
                              }}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <title>{`${node.title}: ${isUnlocked ? 'Unlocked' : 'Locked'}`}</title>
                              <path d="M12 2c0 5.523 4.477 10 10 10-5.523 0-10 4.477-10 10 0-5.523-4.477-10-10-10 5.523 0 10-4.477 10-10z" />
                            </svg>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Detail Tabs */}
            <div className="flex border-b border-slate-900 gap-4 mt-2 pb-px overflow-x-auto z-10 scrollbar-none">
              {(["overview", "constellation", "level", "deck", "relic"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDetailTab(tab)}
                  className={`relative pb-2.5 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeDetailTab === tab
                    ? "text-[#e5c17d]"
                    : "text-slate-500 hover:text-slate-350"
                    }`}
                >
                  <span>{tab === "level" ? "Champion Level" : tab === "deck" ? "Starting Deck" : tab === "relic" ? "Relic" : tab}</span>
                  {activeDetailTab === tab && (
                    <motion.span
                      layoutId="activeDetailTabIndicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-[#c29d53] rounded-full shadow-[0_0_8px_#c29d53] opacity-90"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className={`z-10 mt-1 flex-1 pr-1 min-h-0 ${activeDetailTab === "level" ? "overflow-y-auto md:overflow-hidden md:flex md:flex-col" : "overflow-y-auto"}`}>
              {activeDetailTab === "overview" && (
                <OverviewTab champion={activeChamp} />
              )}
              {activeDetailTab === "constellation" && (
                <ConstellationTab
                  champion={activeChamp}
                  selectedNodeId={selectedNodeId}
                  setSelectedNodeId={setSelectedNodeId}
                  onToggleNode={(nodeId) => handleToggleNode(activeChamp.id, nodeId)}
                  isListCollapsed={isListCollapsed}
                  activeSubTab={activeConstellationSubTab}
                  setActiveSubTab={setActiveConstellationSubTab}
                />
              )}
              {activeDetailTab === "level" && (
                <LevelTab
                  champion={activeChamp}
                />
              )}
              {activeDetailTab === "deck" && (
                <DeckTab champion={activeChamp} />
              )}
              {activeDetailTab === "relic" && (
                <RelicTab
                  relics={activeChamp.relics}
                  onUpdateRelics={(newRelics) => updateChampionProgress(activeChamp.id, { relics: newRelics })}
                />
              )}
            </div>

            {/* Ambient Deck Overview Note */}
            <div className="mt-auto border-t border-slate-900/60 pt-4 text-xs text-slate-500 flex justify-between items-center z-10 font-mono">
              <span>SYSTEM_ID: LOR_CHAMP_{activeChamp.id.toUpperCase()}</span>
              <span className={activeChamp.stars === 0 ? "text-rose-500 font-bold" : "text-emerald-500 font-bold"}>
                STATUS: {activeChamp.stars === 0 ? "LOCKED" : "UNLOCKED"}
              </span>
            </div>

          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-[#0a0f1d]/20 rounded-2xl border border-slate-900 border-dashed text-slate-500 flex flex-col items-center justify-center min-h-[450px]">
          <svg className="w-12 h-12 text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Select a champion to inspect stats.
        </div>
      )}
    </div>
  );
}
