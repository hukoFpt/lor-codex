import { Champion } from "@/types";
import { getConstellationMaxStars } from "@/utils/constellation";
import OverviewTab from "./details/OverviewTab";
import LevelTab from "./details/LevelTab";
import DeckTab from "./details/DeckTab";
import RelicTab from "./details/RelicTab";
import ConstellationTab from "./details/ConstellationTab";

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
  setActiveDetailTab
}: ChampionDetailProps) {
  return (
    <div className={`w-full transition-all duration-300 ${isListCollapsed ? "flex-1" : "md:w-2/3"} h-auto md:h-auto flex flex-col`}>
      {activeChamp ? (
        <div className={`rounded-2xl bg-gradient-to-b ${activeChamp.color} p-0.5 h-auto flex flex-col`}>
          <div className="bg-[#0b0f1a]/95 rounded-2xl p-6 md:p-8 flex flex-col gap-5 relative h-auto">
            {/* Grid background mesh overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40 rounded-2xl" />

            {/* Detail Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 z-10">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#e5c17d] font-semibold bg-[#c29d53]/10 px-2.5 py-1 rounded border border-[#c29d53]/20">
                  {activeChamp.region}
                </span>
                <h2 className="text-3xl font-extrabold mt-2 text-slate-100">
                  {activeChamp.name}
                </h2>
              </div>
              <div className="flex flex-col items-start md:items-end gap-1.5">
                <span className="text-xs text-slate-400 font-mono">Star Power</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: getConstellationMaxStars(activeChamp) }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < activeChamp.stars ? "text-[#e5c17d]" : "text-slate-800"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            {/* Level and XP Meter (Always Visible & Editable) */}
            <div className="flex flex-col gap-3.5 z-10 bg-[#090d16]/30 border border-slate-900/60 p-4 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400 font-bold uppercase tracking-widest font-mono">
                    Level
                  </span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={activeChamp.maxLevel}
                      value={activeChamp.level}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(activeChamp.maxLevel, parseInt(e.target.value) || 1));
                        updateChampionProgress(activeChamp.id, { level: val });
                      }}
                      className="w-16 px-2.5 py-1 text-center bg-slate-950 border border-slate-850 focus:border-[#c29d53] focus:ring-1 focus:ring-[#c29d53]/50 rounded-lg text-lg font-black font-mono text-[#e5c17d] outline-none"
                    />
                    <span className="text-xs text-slate-550 font-mono pl-1">
                      / {activeChamp.maxLevel}
                    </span>
                  </div>
                </div>

                {activeChamp.maxXp > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Current XP:</span>
                    <input
                      type="number"
                      min={0}
                      max={activeChamp.maxXp}
                      value={activeChamp.xp}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(activeChamp.maxXp, parseInt(e.target.value) || 0));
                        updateChampionProgress(activeChamp.id, { xp: val });
                      }}
                      className="w-20 px-2 py-1 bg-slate-950 border border-slate-850 focus:border-[#c29d53] focus:ring-1 focus:ring-[#c29d53]/50 rounded-lg text-xs font-mono text-slate-200 outline-none"
                    />
                    <span className="text-xs text-slate-550 font-mono">
                      / {activeChamp.maxXp} XP
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    MAX LEVEL Reached
                  </span>
                )}
              </div>

              {activeChamp.maxXp > 0 ? (
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-900">
                  <div
                    className="bg-gradient-to-r from-amber-600 to-[#e5c17d] h-full rounded-full"
                    style={{ width: `${(activeChamp.xp / activeChamp.maxXp) * 100}%` }}
                  />
                </div>
              ) : (
                <div className="w-full bg-emerald-600/20 border border-emerald-550/20 rounded-full h-2">
                  <div className="bg-emerald-450 h-full rounded-full w-full shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                </div>
              )}
            </div>

            {/* Detail Tabs */}
            <div className="flex border-b border-slate-900 gap-4 mt-2 pb-px overflow-x-auto z-10 scrollbar-none">
              {(["overview", "constellation", "level", "deck", "relic"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDetailTab(tab)}
                  className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${activeDetailTab === tab
                    ? "border-[#c29d53] text-[#e5c17d]"
                    : "border-transparent text-slate-500 hover:text-slate-350"
                    }`}
                >
                  {tab === "level" ? "Champion Level" : tab === "deck" ? "Starting Deck" : tab === "relic" ? "Relic" : tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="z-10 mt-1 flex-1 overflow-y-auto pr-1">
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
                <LevelTab level={activeChamp.level} />
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
              <span>STATUS: SYNCED</span>
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
