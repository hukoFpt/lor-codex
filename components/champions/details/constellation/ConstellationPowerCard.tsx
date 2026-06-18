import { ConstellationNode } from "@/types";
import { CURRENCY_INFO, CurrencyType } from "./constants";

interface ConstellationPowerCardProps {
  node: ConstellationNode;
  isUnlocked: boolean;
  isUnlockable: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onToggleNode?: (nodeId: string) => void;
}

export default function ConstellationPowerCard({
  node,
  isUnlocked,
  isUnlockable,
  isSelected,
  onSelect,
  onToggleNode
}: ConstellationPowerCardProps) {
  const isPurple = node.color === "purple" || node.iconType === "purple-star";
  const nodeColorClass = node.upgradeType === "Star Power"
    ? "text-[#e5c17d]"
    : isPurple
      ? "text-purple-400"
      : "text-blue-400";
  const dotColorClass = node.upgradeType === "Star Power"
    ? "bg-amber-500"
    : isPurple
      ? "bg-purple-500"
      : "bg-blue-500";
  const iconBorderColorClass = isUnlocked
    ? node.upgradeType === "Star Power"
      ? "border-[#e5c17d]"
      : isPurple
        ? "border-purple-400"
        : "border-blue-400"
    : isSelected
      ? "border-slate-300"
      : "border-slate-800";

  return (
    <div
      onClick={onSelect}
      onDoubleClick={() => {
        if (onToggleNode) {
          onToggleNode(node.id);
        }
      }}
      className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-3 cursor-pointer ${isSelected
        ? "bg-[#c29d53]/10 border-[#c29d53]/80"
        : isUnlocked
          ? "bg-[#c29d53]/5 border-[#c29d53]/25 hover:border-[#c29d53]/45"
          : "bg-[#090d16]/40 border-slate-900/60 hover:bg-[#090d16] hover:border-slate-800"
        }`}
    >
      {/* Title & Header */}
      <div className="flex justify-between items-center">
        <h5 className={`font-bold text-xs flex items-center gap-2 ${isUnlocked
          ? nodeColorClass
          : isSelected
            ? "text-slate-200 font-semibold"
            : "text-slate-400"
          }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotColorClass}`} />
          {node.title}
        </h5>
        <div className="flex items-center gap-1.5">
          {!isUnlocked && node.cost && node.cost.length > 0 && (
            node.cost.map((item, idx) => {
              const info = CURRENCY_INFO[item.currency as CurrencyType];
              if (!info) return null;
              return (
                <div key={idx} className="flex items-center gap-1 bg-[#090d16]/85 border border-slate-900 px-2 py-0.5 rounded text-[10px]">
                  <img src={info.icon} alt={info.name} className="w-3.5 h-3.5 object-contain" />
                  <span className="font-bold font-mono text-[#e5c17d] text-[9px] leading-none mt-px">x{item.amount}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Icon + Description */}
      <div className="flex gap-3 items-start">
        {node.imageUrl && (
          <div className={`w-10 h-10 rounded-full overflow-hidden border ${iconBorderColorClass} bg-slate-950 flex-shrink-0`}>
            <img
              src={node.imageUrl}
              alt={node.title}
              className={`w-full h-full object-cover ${isUnlocked ? "" : "grayscale opacity-40"}`}
            />
          </div>
        )}
        <p className="text-[11px] text-[#8c9bb4] leading-relaxed italic">
          &quot;{node.effect}&quot;
        </p>
      </div>

      {/* Upgrade Button inside item if selected and locked */}
      {isSelected && !isUnlocked && isUnlockable && onToggleNode && (
        <div className="border-t border-slate-900/60 pt-2.5 flex flex-col mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleNode(node.id);
            }}
            className="w-full py-2 px-3 rounded-lg border border-[#c29d53]/40 bg-[#c29d53]/15 hover:bg-[#c29d53]/25 text-[#e5c17d] font-bold text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
          >
            Upgrade
          </button>
        </div>
      )}
    </div>
  );
}
