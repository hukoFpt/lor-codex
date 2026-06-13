import { useState, useEffect, useRef } from "react";
import { Champion, ConstellationNode } from "@/types";
import { isNodeUnlockable } from "@/utils/constellation";

const CURRENCY_INFO = {
  fragment: {
    name: "Fragments",
    icon: "/icons/currencies/Champion_Fragment_icon.png",
    textColor: "text-[#e5c17d]"
  },
  gemstone: {
    name: "Gemstones",
    icon: "/icons/currencies/Gemstone_icon.png",
    textColor: "text-emerald-450"
  },
  nova: {
    name: "Nova Crystals",
    icon: "/icons/currencies/Nova_Crystal_icon.png",
    textColor: "text-purple-450 font-bold"
  },
  star_crystal: {
    name: "Star Crystals",
    icon: "/icons/currencies/Star_Crystal_icon.png",
    textColor: "text-blue-455"
  },
  wild: {
    name: "Wild Fragments",
    icon: "/icons/currencies/Wild_Fragment_icon.png",
    textColor: "text-amber-500"
  }
};

const renderNodeIcon = (nodeId: string, type: string, isUnlocked: boolean, color?: "blue" | "purple", isStarPower?: boolean) => {
  const isPurpleStar = type === "purple-star";
  const gradId = `star-glow-${nodeId}`;

  if (!isStarPower) {
    return (
      <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <defs>
          <radialGradient id={gradId} gradientUnits="userSpaceOnUse" cx="12" cy="12" r="10">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M12 5v14M5 12h14" stroke={`url(#${gradId})`} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (isPurpleStar) {
    return (
      <svg className="w-[30px] h-[30px] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <defs>
          <radialGradient id={gradId} gradientUnits="userSpaceOnUse" cx="12" cy="12" r="10">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M12 12L12 4.5M12 12L19.1 9.7M12 12L16.4 18.1M12 12L7.6 18.1M12 12L4.9 9.7" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className="w-[26px] h-[26px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <defs>
        <radialGradient id={gradId} gradientUnits="userSpaceOnUse" cx="12" cy="12" r="10">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M12 12L12 4.5M12 12L19.1 9.7M12 12L16.4 18.1M12 12L7.6 18.1M12 12L4.9 9.7" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

interface ConstellationTabProps {
  champion: Champion;
  selectedNodeId: string;
  setSelectedNodeId: (id: string) => void;
  onToggleNode?: (nodeId: string) => void;
  isListCollapsed?: boolean;
  activeSubTab?: "star" | "bonus";
  setActiveSubTab?: (tab: "star" | "bonus") => void;
}

export default function ConstellationTab({
  champion,
  selectedNodeId,
  setSelectedNodeId,
  onToggleNode,
  isListCollapsed = false,
  activeSubTab = "star",
  setActiveSubTab
}: ConstellationTabProps) {
  const constellation = champion.constellation;
  if (!constellation) return null;

  const [mapHeight, setMapHeight] = useState<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.height) {
          setMapHeight(entry.contentRect.height);
        }
      }
    });
    resizeObserver.observe(mapRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const modalNode = selectedNodeId ? constellation.nodes.find((n) => n.id === selectedNodeId) : null;
  const isModalNodeUnlocked = modalNode ? champion.unlockedNodes?.includes(modalNode.id) || false : false;
  const isModalNodeUnlockable = modalNode ? !isModalNodeUnlocked && isNodeUnlockable(modalNode.id, constellation, champion.unlockedNodes || []) : false;

  const leftPct = modalNode ? parseFloat(modalNode.left) || 50 : 50;
  const isTopClose = modalNode ? (parseInt(modalNode.top) || 50) < 45 : false;
  const translateY = isTopClose ? "24px" : "calc(-100% - 24px)";

  const renderPowerCard = (n: ConstellationNode) => {
    const isUnlocked = champion.unlockedNodes?.includes(n.id) || false;
    const isUnlockable = !isUnlocked && isNodeUnlockable(n.id, constellation, champion.unlockedNodes || []);
    const isSelected = selectedNodeId === n.id;
    const isPurple = n.color === "purple" || n.iconType === "purple-star";
    const nodeColorClass = n.upgradeType === "Star Power"
      ? "text-[#e5c17d]"
      : isPurple
        ? "text-purple-400"
        : "text-blue-400";
    const dotColorClass = n.upgradeType === "Star Power"
      ? "bg-amber-500"
      : isPurple
        ? "bg-purple-500"
        : "bg-blue-500";

    return (
      <div
        key={n.id}
        onClick={() => setSelectedNodeId(n.id)}
        onDoubleClick={() => {
          if (onToggleNode) {
            onToggleNode(n.id);
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
            {n.title}
          </h5>
          <div className="flex items-center gap-1.5">
            {!isUnlocked && n.cost && n.cost.length > 0 && (
              n.cost.map((item, idx) => {
                const info = CURRENCY_INFO[item.currency];
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
          {n.imageUrl && (
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-850 bg-slate-950 flex-shrink-0">
              <img
                src={n.imageUrl}
                alt={n.title}
                className={`w-full h-full object-cover ${isUnlocked ? "" : "grayscale opacity-40"}`}
              />
            </div>
          )}
          <p className="text-[11px] text-[#8c9bb4] leading-relaxed italic">
            &quot;{n.effect}&quot;
          </p>
        </div>

        {/* Upgrade Button inside item if selected and locked */}
        {isSelected && !isUnlocked && isUnlockable && onToggleNode && (
          <div className="border-t border-slate-900/60 pt-2.5 flex flex-col mt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleNode(n.id);
              }}
              className="w-full py-2 px-3 rounded-lg border border-[#c29d53]/40 bg-[#c29d53]/15 hover:bg-[#c29d53]/25 text-[#e5c17d] font-bold text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
            >
              Upgrade
            </button>
          </div>
        )}
      </div>
    );
  };

  const starPowers = constellation.nodes.filter((n) => n.upgradeType === "Star Power");
  const bonusStats = constellation.nodes.filter((n) => n.upgradeType !== "Star Power");

  return (
    <div className={`flex mt-2 items-stretch ${isListCollapsed ? "flex-col lg:flex-row gap-6" : "flex-col gap-6"}`}>
      {/* Map Area */}
      <div className={`flex flex-col gap-3 ${isListCollapsed ? "lg:w-3/5" : "w-full"}`}>
        <div
          ref={mapRef}
          onClick={() => setSelectedNodeId("")}
          className="relative w-full aspect-video bg-slate-950/70 border border-slate-900 rounded-2xl backdrop-blur-sm cursor-default z-10"
        >
          {/* Ambient Grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#c29d53_0.03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-15 rounded-2xl" />

          {/* Connection Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {constellation.connections.map((conn, index) => {
              const fromNode = constellation.nodes.find((n) => n.id === conn.from);
              const toNode = constellation.nodes.find((n) => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const isLinkUnlocked = (champion.unlockedNodes?.includes(fromNode.id) && champion.unlockedNodes?.includes(toNode.id)) || false;
              const strokeColor = isLinkUnlocked ? "#c29d53" : "#1e293b";
              const strokeDash = isLinkUnlocked ? "none" : "4,4";

              return (
                <line
                  key={index}
                  x1={fromNode.left}
                  y1={fromNode.top}
                  x2={toNode.left}
                  y2={toNode.top}
                  stroke={strokeColor}
                  strokeWidth="1.2"
                  strokeDasharray={strokeDash}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {constellation.nodes.map((node) => {
            const isUnlocked = champion.unlockedNodes?.includes(node.id) || false;
            const isUnlockable = !isUnlocked && isNodeUnlockable(node.id, constellation, champion.unlockedNodes || []);
            const isSelected = selectedNodeId === node.id;
            const isStarPower = node.upgradeType === "Star Power";
            const isPurpleStar = node.iconType === "purple-star";
            const nodeColor = node.color || "blue";

            return (
              <button
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNodeId(node.id);
                }}
                onDoubleClick={() => {
                  if (onToggleNode) {
                    onToggleNode(node.id);
                  }
                }}
                style={{ left: node.left, top: node.top }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-10 ${isStarPower
                  ? "w-11 h-11 border"
                  : "w-[34px] h-[34px] border-2 p-0.5"
                  } ${isUnlocked
                    ? isPurpleStar || nodeColor === "purple"
                      ? "bg-[#150a24] border-purple-300 shadow-[0_0_18px_rgba(168,85,247,0.7),_0_0_8px_rgba(168,85,247,0.4)] text-purple-200 hover:scale-105"
                      : !isStarPower
                        ? "bg-[#071124] border-blue-300 shadow-[0_0_18px_rgba(59,130,246,0.7),_0_0_8px_rgba(59,130,246,0.4)] text-blue-200 hover:scale-105"
                        : "bg-[#1e150a] border-[#e5c17d] text-[#fbebd0] shadow-[0_0_20px_rgba(229,193,125,0.6),_0_0_8px_rgba(229,193,125,0.3)] hover:scale-105"
                    : isUnlockable
                      ? "bg-[#14161f] border-slate-200 text-slate-100 shadow-[0_0_14px_rgba(255,255,255,0.35)] animate-pulse hover:animate-none hover:border-white hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] hover:scale-105"
                      : "bg-[#090d16]/50 border-slate-800 text-slate-500 opacity-65 hover:border-slate-700 hover:text-slate-400"
                  } ${isSelected
                    ? isPurpleStar || (!isStarPower && nodeColor === "purple")
                      ? "ring-2 ring-purple-300 ring-offset-2 ring-offset-[#0b0f1a] scale-110"
                      : !isStarPower && nodeColor === "blue"
                        ? "ring-2 ring-blue-300 ring-offset-2 ring-offset-[#0b0f1a] scale-110"
                        : "ring-2 ring-[#e5c17d] ring-offset-2 ring-offset-[#0b0f1a] scale-110"
                    : ""
                  }`}
              >
                {/* Inner content */}
                {!isStarPower ? (
                  <div className={`w-full h-full rounded-full border border-slate-900 flex items-center justify-center ${isUnlocked ? "bg-slate-950/80" : "bg-slate-950/40"}`}>
                    {renderNodeIcon(node.id, node.iconType, isUnlocked, nodeColor, isStarPower)}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {renderNodeIcon(node.id, node.iconType, isUnlocked, undefined, isStarPower)}
                  </div>
                )}
              </button>
            );
          })}
          {/* Floating Node Info Modal */}
          {modalNode && (
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
                        {renderNodeIcon(
                          modalNode.id,
                          modalNode.iconType,
                          isModalNodeUnlocked,
                          modalNode.color,
                        )}
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
                    const info = CURRENCY_INFO[item.currency];
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
          )}
        </div>
      </div>

      {/* Constellation Powers List */}
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
              starPowers.map(renderPowerCard)
            ) : (
              <div className="text-center py-4 text-xs text-slate-500 italic">No Star Powers configured.</div>
            )
          ) : (
            bonusStats.length > 0 ? (
              bonusStats.map(renderPowerCard)
            ) : (
              <div className="text-center py-4 text-xs text-slate-500 italic">No Bonus Stats configured.</div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
