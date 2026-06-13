import { Champion, ConstellationNode } from "@/types";
import { isNodeUnlockable } from "@/utils/constellation";
import ConstellationPowerCard from "./ConstellationPowerCard";

interface ConstellationPowersListProps {
  champion: Champion;
  constellation: NonNullable<Champion["constellation"]>;
  selectedNodeId: string;
  setSelectedNodeId: (id: string) => void;
  onToggleNode?: (nodeId: string) => void;
  isListCollapsed?: boolean;
  activeSubTab?: "star" | "bonus";
  setActiveSubTab?: (tab: "star" | "bonus") => void;
  mapHeight: number | null;
}

export default function ConstellationPowersList({
  champion,
  constellation,
  selectedNodeId,
  setSelectedNodeId,
  onToggleNode,
  isListCollapsed = false,
  activeSubTab = "star",
  setActiveSubTab,
  mapHeight
}: ConstellationPowersListProps) {
  const starPowers = constellation.nodes.filter((n) => n.upgradeType === "Star Power");
  const bonusStats = constellation.nodes.filter((n) => n.upgradeType !== "Star Power");

  const renderCard = (n: ConstellationNode) => {
    const isUnlocked = champion.unlockedNodes?.includes(n.id) || false;
    const isUnlockable = !isUnlocked && isNodeUnlockable(n.id, constellation, champion.unlockedNodes || []);
    const isSelected = selectedNodeId === n.id;

    return (
      <ConstellationPowerCard
        key={n.id}
        node={n}
        isUnlocked={isUnlocked}
        isUnlockable={isUnlockable}
        isSelected={isSelected}
        onSelect={() => setSelectedNodeId(n.id)}
        onToggleNode={onToggleNode}
      />
    );
  };

  return (
    <div
      className={`flex flex-col gap-4 ${isListCollapsed ? "lg:w-2/5 mt-0" : "w-full mt-2"}`}
      style={isListCollapsed && mapHeight ? { maxHeight: `${mapHeight}px` } : undefined}
    >
      <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
        <h3 className="text-xs text-slate-400 font-bold tracking-widest uppercase">Constellation Powers</h3>
        {setActiveSubTab && activeSubTab && (
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSubTab("star")}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${activeSubTab === "star"
                ? "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                : "text-slate-500 hover:text-slate-350"
                }`}
            >
              Star Powers
            </button>
            <button
              onClick={() => setActiveSubTab("bonus")}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${activeSubTab === "bonus"
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                : "text-slate-500 hover:text-slate-350"
                }`}
            >
              Bonus Stats
            </button>
          </div>
        )}
      </div>

      <div className={`flex flex-col gap-3 ${isListCollapsed ? "lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:pr-2" : ""}`}>
        {activeSubTab === "star" ? (
          starPowers.length > 0 ? (
            starPowers.map(renderCard)
          ) : (
            <div className="text-center py-4 text-xs text-slate-500 italic">No Star Powers configured.</div>
          )
        ) : (
          bonusStats.length > 0 ? (
            bonusStats.map(renderCard)
          ) : (
            <div className="text-center py-4 text-xs text-slate-500 italic">No Bonus Stats configured.</div>
          )
        )}
      </div>
    </div>
  );
}
