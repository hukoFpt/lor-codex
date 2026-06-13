import { ConstellationNode } from "@/types";
import { CURRENCY_INFO, CurrencyType } from "./constants";
import ConstellationNodeIcon from "./ConstellationNodeIcon";

interface ConstellationNodeModalProps {
  modalNode: ConstellationNode;
  isModalNodeUnlocked: boolean;
  isModalNodeUnlockable: boolean;
  leftPct: number;
  translateY: string;
  isTopClose: boolean;
  onToggleNode?: (nodeId: string) => void;
}

export default function ConstellationNodeModal({
  modalNode,
  isModalNodeUnlocked,
  isModalNodeUnlockable,
  leftPct,
  translateY,
  isTopClose,
  onToggleNode
}: ConstellationNodeModalProps) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        left: modalNode.left,
        top: modalNode.top,
        transform: `translate(-${leftPct}%, ${translateY})`
      }}
      className="absolute w-[260px] bg-[#070b16]/98 border border-slate-800 p-4 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.95)] z-40 flex flex-col gap-2.5 backdrop-blur-md transition-all duration-200"
    >
      {/* Arrow pointer */}
      <div
        style={{ left: modalNode.left }}
        className={`absolute -translate-x-1/2 w-0 h-0 border-solid border-transparent ${isTopClose
          ? "top-0 -translate-y-full border-b-8 border-b-[#070b16]/98 border-t-0 border-x-8"
          : "bottom-0 translate-y-full border-t-8 border-t-[#070b16]/98 border-b-0 border-x-8"
          }`}
      />

      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <span className={`text-[9px] font-bold uppercase tracking-wider font-mono ${modalNode.upgradeType === "Star Power" ? "text-amber-500" : "text-blue-400"
          }`}>
          {modalNode.upgradeType}
        </span>
      </div>

      {/* Power Image/Icon Wrapper with Badge Overlay */}
      {modalNode.upgradeType !== "Bonus Stat" && (
        <div className="flex justify-center w-full">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-850 shadow-md">
            {modalNode.imageUrl ? (
              <img
                src={modalNode.imageUrl}
                alt={modalNode.title}
                className={`w-full h-full object-cover transition-all duration-300 ${isModalNodeUnlocked ? "" : "grayscale opacity-40"
                  }`}
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center bg-slate-950/80 transition-all duration-300 ${isModalNodeUnlocked ? "" : "opacity-45"
                }`}>
                <ConstellationNodeIcon
                  nodeId={modalNode.id}
                  type={modalNode.iconType}
                  isUnlocked={isModalNodeUnlocked}
                  color={modalNode.color}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Title / Power Name */}
      <div className="text-center px-1">
        <h4 className="text-xs font-bold text-slate-200">
          {modalNode.title}
        </h4>
      </div>

      {/* Effect Text */}
      <p className="text-[10px] text-slate-400 leading-relaxed italic bg-slate-950/40 p-2 rounded-lg border border-slate-900/30 text-center w-full">
        &quot;{modalNode.effect}&quot;
      </p>

      {/* Costs list */}
      {!isModalNodeUnlocked && modalNode.cost && modalNode.cost.length > 0 && (
        <div className="flex gap-1.5 justify-center flex-wrap">
          {modalNode.cost.map((item, idx) => {
            const info = CURRENCY_INFO[item.currency as CurrencyType];
            if (!info) return null;
            return (
              <div key={idx} className="flex items-center gap-1.5 bg-[#090d16] border border-slate-850 px-2 py-0.5 rounded text-[10px]">
                <img src={info.icon} alt={info.name} className="w-3.5 h-3.5 object-contain" />
                <span className="font-bold text-[#e5c17d] text-[9px] font-mono leading-none">x{item.amount}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Upgrade or Lock Button */}
      {onToggleNode && (isModalNodeUnlocked || isModalNodeUnlockable) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleNode(modalNode.id);
          }}
          className={`w-full py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 ${isModalNodeUnlocked
            ? "border-rose-950/40 bg-rose-950/15 hover:bg-rose-900/25 text-rose-400"
            : "border-[#c29d53]/40 bg-[#c29d53]/15 hover:bg-[#c29d53]/25 text-[#e5c17d]"
            }`}
        >
          {isModalNodeUnlocked ? "Lock Node" : "Upgrade"}
        </button>
      )}
    </div>
  );
}
