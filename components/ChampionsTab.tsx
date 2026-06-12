"use client";

import { useState, useEffect } from "react";
import {
  Champion,
  CurrencyCost,
  ConstellationNode,
  ConstellationConnection,
  ChampionConstellation,
  ChampOverviewData
} from "@/types";
import championData from "@/data/champions.json";

const CHAMPIONS: Champion[] = (championData.champions as any[]).map((c) => ({
  ...c,
  level: 1,
  stars: 0,
  xp: 0,
  maxXp: 500,
  maxLevel: 30,
  relics: [],
  color: "from-stone-900 via-red-950 to-slate-950",
  goldBorder: false,
  unlockedNodes: [],
}));

const isNodeUnlockable = (
  nodeId: string,
  constellation: ChampionConstellation,
  unlockedNodes: string[]
): boolean => {
  if (unlockedNodes.includes(nodeId)) return false;

  const incoming = constellation.connections.filter((c) => c.to === nodeId);
  if (incoming.length === 0) return true;

  return incoming.some((c) => unlockedNodes.includes(c.from));
};

const lockNodeAndDownstream = (
  nodeId: string,
  constellation: ChampionConstellation,
  unlockedNodes: string[]
): string[] => {
  let nextUnlocked = unlockedNodes.filter((id) => id !== nodeId);
  
  const roots = constellation.nodes.filter((n) => {
    const incoming = constellation.connections.filter((c) => c.to === n.id);
    return incoming.length === 0;
  });

  let changed = true;
  while (changed) {
    const prevLength = nextUnlocked.length;
    nextUnlocked = nextUnlocked.filter((id) => {
      if (roots.some((r) => r.id === id)) return true;
      const incoming = constellation.connections.filter((c) => c.to === id);
      return incoming.some((c) => nextUnlocked.includes(c.from));
    });
    if (nextUnlocked.length === prevLength) {
      changed = false;
    }
  }

  return nextUnlocked;
};

const computeStarsFromUnlockedNodes = (
  unlockedNodes: string[],
  nodes: ConstellationNode[]
): number => {
  return nodes.filter((n) => n.upgradeType === "Star Power" && unlockedNodes.includes(n.id)).length;
};

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

const getFragmentName = (champId: string): string => {
  const nameMap: Record<string, string> = {
    asol: "Aurelion Sol",
    jinx: "Jinx",
    yasuo: "Yasuo",
    lux: "Lux",
    mf: "Miss Fortune",
    elder: "Elder Dragon"
  };
  return `${nameMap[champId] || "Champion"} Fragments`;
};

const getConstellationMaxStars = (champ: Champion) => {
  return champ.constellation?.nodes?.filter((n) => n.upgradeType === "Star Power").length || 0;
};

const renderOverviewTab = (activeChamp: Champion) => {
  const details = activeChamp.overview;
  return (
    <div className="flex flex-col gap-5 mt-2">
      {/* Play Style & Difficulty Summary */}
      {details && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-4 flex flex-col gap-1 items-center text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Play Style</span>
            <span className="text-xs text-[#e5c17d] font-semibold leading-normal">{details.playStyle}</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-4 flex flex-col gap-1 items-center text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Difficulty</span>
            <span className={`text-xs font-bold tracking-wide ${details.difficulty === "Easy"
              ? "text-emerald-400"
              : details.difficulty === "Medium"
                ? "text-amber-400"
                : "text-rose-500"
              }`}>
              {details.difficulty}
            </span>
          </div>
        </div>
      )}

      {/* Lore Description */}
      {details && (
        <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-4">
          <h3 className="text-xs text-center text-slate-400 font-bold tracking-widest uppercase mb-1.5">Biography</h3>
          <p className="text-xs text-slate-300 leading-relaxed italic">
            "{details.description}"
          </p>
        </div>
      )}
    </div>
  );
};

export const computeNodeStarLevel = (
  node: ConstellationNode,
  nodes: ConstellationNode[],
  connections: ConstellationConnection[]
): number => {
  if (node.upgradeType === "Star Power") {
    const idMatch = node.id.match(/_(\d+)$/);
    if (idMatch) {
      return parseInt(idMatch[1], 10);
    }
    const match = node.id.match(/\d+/);
    if (match) {
      return parseInt(match[0], 10);
    }
    // Fallback: Compute based on the longest path of Star Power nodes leading to this node
    const getLongestStarPowerPath = (currId: string, visited: Set<string>): number => {
      if (visited.has(currId)) return 0;
      visited.add(currId);

      const currNode = nodes.find((n) => n.id === currId);
      const isStar = currNode?.upgradeType === "Star Power" ? 1 : 0;

      const incoming = connections.filter((c) => c.to === currId);
      if (incoming.length === 0) {
        return isStar;
      }

      let maxPredecessorStars = 0;
      for (const edge of incoming) {
        maxPredecessorStars = Math.max(
          maxPredecessorStars,
          getLongestStarPowerPath(edge.from, new Set(visited))
        );
      }

      return isStar + maxPredecessorStars;
    };

    return Math.max(1, getLongestStarPowerPath(node.id, new Set<string>()));
  }

  const visited = new Set<string>([node.id]);
  const queue: string[] = [];

  for (const conn of connections) {
    if (conn.from === node.id) {
      queue.push(conn.to);
      visited.add(conn.to);
    }
  }

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentNode = nodes.find((n) => n.id === currentId);
    if (currentNode) {
      if (currentNode.upgradeType === "Star Power") {
        const idMatch = currentNode.id.match(/_(\d+)$/);
        if (idMatch) return parseInt(idMatch[1], 10);
        const match = currentNode.id.match(/\d+/);
        if (match) return parseInt(match[0], 10);
        return 1;
      }
      for (const conn of connections) {
        if (conn.from === currentId && !visited.has(conn.to)) {
          queue.push(conn.to);
          visited.add(conn.to);
        }
      }
    }
  }

  const predVisited = new Set<string>([node.id]);
  const predQueue: string[] = [];
  for (const conn of connections) {
    if (conn.to === node.id) {
      predQueue.push(conn.from);
      predVisited.add(conn.from);
    }
  }

  while (predQueue.length > 0) {
    const currentId = predQueue.shift()!;
    const currentNode = nodes.find((n) => n.id === currentId);
    if (currentNode) {
      if (currentNode.upgradeType === "Star Power") {
        const idMatch = currentNode.id.match(/_(\d+)$/);
        if (idMatch) return parseInt(idMatch[1], 10);
        const match = currentNode.id.match(/\d+/);
        if (match) return parseInt(match[0], 10);
        return 1;
      }
      for (const conn of connections) {
        if (conn.to === currentId && !predVisited.has(conn.from)) {
          predQueue.push(conn.from);
          predVisited.add(conn.from);
        }
      }
    }
  }

  return 1;
};

const renderNodeIcon = (nodeId: string, type: string, isUnlocked: boolean, color?: "blue" | "purple", isStarPower?: boolean) => {
  const isPurpleStar = type === "purple-star";
  const gradId = `star-glow-${nodeId}`;

  if (!isStarPower) {
    // Bonus Stat node: render a 4-point star made of lines (inherits theme text color from parent)
    return (
      <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <defs>
          <radialGradient id={gradId} gradientUnits="userSpaceOnUse" cx="12" cy="12" r="8">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="30%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M12 5v14M5 12h14" stroke={`url(#${gradId})`} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Star Power node: render a 5-point star made of lines
  if (isPurpleStar) {
    return (
      <svg className="w-[30px] h-[30px] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <defs>
          <radialGradient id={gradId} gradientUnits="userSpaceOnUse" cx="12" cy="12" r="8">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="30%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M12 12L12 4.5M12 12L19.1 9.7M12 12L16.4 18.1M12 12L7.6 18.1M12 12L4.9 9.7" stroke={`url(#${gradId})`} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className="w-[26px] h-[26px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <defs>
        <radialGradient id={gradId} gradientUnits="userSpaceOnUse" cx="12" cy="12" r="8">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="30%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M12 12L12 4.5M12 12L19.1 9.7M12 12L16.4 18.1M12 12L7.6 18.1M12 12L4.9 9.7" stroke={`url(#${gradId})`} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};


const renderConstellationTab = (
  stars: number,
  activeChamp: Champion,
  selectedNodeId: string,
  setSelectedNodeId: (id: string) => void,
  onToggleNode?: (nodeId: string) => void,
  isListCollapsed?: boolean,
  activeSubTab?: "star" | "bonus",
  setActiveSubTab?: (tab: "star" | "bonus") => void
) => {
  const constellation = activeChamp.constellation;
  if (!constellation) return null;

  const selectedNode = constellation.nodes.find((n) => n.id === selectedNodeId) || constellation.nodes[0];
  const targetLevel = selectedNode
    ? computeNodeStarLevel(selectedNode, constellation.nodes, constellation.connections)
    : 1;

  const modalNode = selectedNodeId ? constellation.nodes.find((n) => n.id === selectedNodeId) : null;
  const isModalNodeUnlocked = modalNode ? activeChamp.unlockedNodes?.includes(modalNode.id) || false : false;
  const isModalNodeUnlockable = modalNode ? !isModalNodeUnlocked && isNodeUnlockable(modalNode.id, constellation, activeChamp.unlockedNodes || []) : false;

  const leftPct = modalNode ? parseFloat(modalNode.left) || 50 : 50;
  const isTopClose = modalNode ? (parseInt(modalNode.top) || 50) < 45 : false;
  const translateY = isTopClose ? "24px" : "calc(-100% - 24px)";

  const renderPowerCard = (n: ConstellationNode) => {
    const isUnlocked = activeChamp.unlockedNodes?.includes(n.id) || false;
    const isUnlockable = !isUnlocked && isNodeUnlockable(n.id, constellation, activeChamp.unlockedNodes || []);
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
            "{n.effect}"
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
    <div className={`flex mt-2 ${isListCollapsed ? "flex-col lg:flex-row gap-6" : "flex-col gap-6"}`}>
      {/* Map Area */}
      <div className={`flex flex-col gap-3 ${isListCollapsed ? "lg:w-3/5" : "w-full"}`}>
        <h3 className="text-xs text-slate-400 font-bold tracking-widest uppercase">Constellation Map</h3>

        <div
          onClick={() => setSelectedNodeId("")}
          className="relative w-full aspect-video bg-slate-950/70 border border-slate-900 rounded-2xl backdrop-blur-sm cursor-default z-10"
        >
          {/* Ambient Grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#c29d53_0.03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40 rounded-2xl" />

          {/* Connection Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {constellation.connections.map((conn, index) => {
              const fromNode = constellation.nodes.find((n) => n.id === conn.from);
              const toNode = constellation.nodes.find((n) => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const isLinkUnlocked = (activeChamp.unlockedNodes?.includes(fromNode.id) && activeChamp.unlockedNodes?.includes(toNode.id)) || false;
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
            const isUnlocked = activeChamp.unlockedNodes?.includes(node.id) || false;
            const isUnlockable = !isUnlocked && isNodeUnlockable(node.id, constellation, activeChamp.unlockedNodes || []);
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
                  ? "w-11 h-11 border bg-slate-900"
                  : "w-[34px] h-[34px] border-2 bg-[#090d16] p-0.5"
                  } ${isUnlocked
                    ? isPurpleStar
                      ? "border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.4)] text-purple-400 hover:scale-105"
                      : !isStarPower
                        ? nodeColor === "purple"
                          ? "border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.4)] text-purple-400 hover:scale-105"
                          : "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)] text-blue-400 hover:scale-105"
                        : "border-[#c29d53] text-[#e5c17d] shadow-[0_0_12px_rgba(194,157,83,0.25)] hover:scale-105"
                    : isUnlockable
                      ? isPurpleStar || nodeColor === "purple"
                        ? "border-purple-900/60 text-slate-400 hover:border-purple-500/50 hover:text-purple-300 hover:scale-105"
                        : !isStarPower
                          ? "border-blue-900/60 text-slate-400 hover:border-blue-500/50 hover:text-blue-300 hover:scale-105"
                          : "border-amber-900/60 text-slate-400 hover:border-[#c29d53]/50 hover:text-[#e5c17d] hover:scale-105"
                      : "border-slate-950 text-slate-700 opacity-40 hover:border-slate-800 hover:text-slate-500"
                  } ${isSelected
                    ? isPurpleStar || (!isStarPower && nodeColor === "purple")
                      ? "ring-2 ring-purple-400 ring-offset-2 ring-offset-[#0b0f1a] scale-110"
                      : !isStarPower && nodeColor === "blue"
                        ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0b0f1a] scale-110"
                        : "ring-2 ring-[#c29d53] ring-offset-2 ring-offset-[#0b0f1a] scale-110"
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
                className={`absolute -translate-x-1/2 w-0 h-0 border-solid border-transparent ${
                  isTopClose
                    ? "top-0 -translate-y-full border-b-8 border-b-[#070b16]/98 border-t-0 border-x-8"
                    : "bottom-0 translate-y-full border-t-8 border-t-[#070b16]/98 border-b-0 border-x-8"
                }`}
              />

              {/* Header */}
              <div className="flex flex-col items-center text-center">
                <span className={`text-[9px] font-bold uppercase tracking-wider font-mono ${
                  modalNode.upgradeType === "Star Power" ? "text-amber-500" : "text-blue-400"
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
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          isModalNodeUnlocked ? "" : "grayscale opacity-40"
                        }`}
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center bg-slate-950/80 transition-all duration-300 ${
                        isModalNodeUnlocked ? "" : "opacity-45"
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
                "{modalNode.effect}"
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
                  className={`w-full py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 ${
                    isModalNodeUnlocked
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
      <div className={`flex flex-col gap-4 ${isListCollapsed ? "lg:w-2/5 mt-0" : "w-full mt-2"}`}>
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

        <div className="flex flex-col gap-3">
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
};

const renderLevelTab = (level: number) => {
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
};

const renderDeckTab = (activeChamp: Champion) => {
  const deck = activeChamp.deck;
  if (!deck) return null;

  return (
    <div className="flex flex-col gap-4 mt-2">
      <h3 className="text-xs text-slate-400 font-bold tracking-widest uppercase">Starter Cards</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {deck.map((card, idx) => (
          <div
            key={idx}
            className="bg-slate-950/80 border border-slate-900 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-800"
          >
            <div className="flex justify-between items-start gap-1">
              <span className="w-6 h-6 rounded-full bg-blue-950 border border-blue-900 text-blue-400 flex items-center justify-center text-[10px] font-mono font-bold">
                {card.cost}
              </span>
              <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${card.rarity === "Epic"
                ? "bg-purple-950/40 text-purple-400 border-purple-800/40"
                : card.rarity === "Rare"
                  ? "bg-blue-950/40 text-blue-400 border-blue-800/40"
                  : "bg-slate-900 text-slate-400 border-slate-800"
                }`}>
                {card.rarity}
              </span>
            </div>
            <div className="mt-3">
              <h4 className="font-bold text-xs text-slate-200">{card.name}</h4>
              <span className="text-[9px] text-[#5b6e8f] font-mono mt-0.5 block">{card.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const renderRelicTab = (relics: string[], onUpdateRelics: (newRelics: string[]) => void) => {
  return (
    <div className="flex flex-col gap-4 mt-2">
      <h3 className="text-xs text-slate-400 font-bold tracking-widest uppercase">Equipped Relic Slots</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {relics.map((relic, idx) => (
          <div
            key={idx}
            className="bg-slate-950/80 border border-slate-900 rounded-xl p-4 flex flex-col gap-3 hover:border-slate-800 transition-all group relative"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <input
                  type="text"
                  value={relic}
                  onChange={(e) => {
                    const nextRelics = [...relics];
                    nextRelics[idx] = e.target.value;
                    onUpdateRelics(nextRelics);
                  }}
                  placeholder={`Relic #${idx + 1}`}
                  className="bg-transparent border-b border-transparent hover:border-slate-800 focus:border-[#c29d53] text-xs font-bold text-[#e5c17d] outline-none py-0.5 w-full transition-all"
                />
              </div>
              <button
                onClick={() => {
                  const nextRelics = relics.filter((_, i) => i !== idx);
                  onUpdateRelics(nextRelics);
                }}
                className="text-slate-500 hover:text-rose-450 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1"
                title="Remove Relic"
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <p className="text-[11px] text-[#8c9bb4] leading-relaxed italic">
              Equipped in slot {idx + 1}
            </p>
          </div>
        ))}
        {relics.length < 3 && (
          <button
            onClick={() => {
              onUpdateRelics([...relics, ""]);
            }}
            className="flex flex-col items-center justify-center border border-dashed border-slate-850 hover:border-[#c29d53]/55 hover:bg-[#c29d53]/5 rounded-xl p-6 text-slate-500 hover:text-[#e5c17d] transition-all gap-1.5 cursor-pointer min-h-[92px]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs font-bold font-mono uppercase tracking-wider">Add Relic Slot</span>
          </button>
        )}
      </div>
      {relics.length === 0 && (
        <div className="text-center py-6 bg-slate-950/40 border border-slate-900 border-dashed text-slate-500 text-xs italic rounded-xl">
          No relics equipped. Add one above!
        </div>
      )}
    </div>
  );
};

export default function ChampionsTab() {
  const [champSearch, setChampSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedChampId, setSelectedChampId] = useState(CHAMPIONS[0].id);
  const [activeDetailTab, setActiveDetailTab] = useState<"overview" | "constellation" | "level" | "deck" | "relic">("overview");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");
  const [championsList, setChampionsList] = useState<Champion[]>(CHAMPIONS);
  const [isListCollapsed, setIsListCollapsed] = useState(false);
  const [activeConstellationSubTab, setActiveConstellationSubTab] = useState<"star" | "bonus">("star");

  // Initialize progress from localStorage client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lor-codex:champion-progress");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Record<string, Partial<Champion>>;
          const merged = CHAMPIONS.map((c) => {
            const userState = parsed[c.id];
            if (!userState) return c;
            const level = userState.level !== undefined ? userState.level : c.level;
            const maxLevel = c.maxLevel || 30;
            const nextMaxXp = level >= maxLevel ? 0 : 500 + (level - 1) * 100;
            const xp = userState.xp !== undefined ? Math.min(userState.xp, nextMaxXp) : (level >= maxLevel ? 0 : Math.min(c.xp, nextMaxXp));
            return {
              ...c,
              level,
              stars: userState.stars !== undefined ? userState.stars : c.stars,
              xp,
              maxXp: nextMaxXp,
              relics: userState.relics !== undefined ? userState.relics : c.relics,
              unlockedNodes: userState.unlockedNodes !== undefined ? userState.unlockedNodes : [],
            };
          });
          setChampionsList(merged);
        } catch (e) {
          console.error("Failed to parse champion progress:", e);
        }
      }
    }
  }, []);

  const updateChampionProgress = (id: string, updates: Partial<Champion>) => {
    setChampionsList((prev) => {
      const nextList = prev.map((c) => {
        if (c.id === id) {
          const level = updates.level !== undefined ? updates.level : c.level;
          const maxLevel = c.maxLevel || 30;
          const nextMaxXp = level >= maxLevel ? 0 : 500 + (level - 1) * 100;
          const xp = updates.xp !== undefined ? Math.min(updates.xp, nextMaxXp) : (updates.level !== undefined ? (level >= maxLevel ? 0 : Math.min(c.xp, nextMaxXp)) : c.xp);
          return {
            ...c,
            ...updates,
            level,
            maxXp: nextMaxXp,
            xp,
          };
        }
        return c;
      });

      if (typeof window !== "undefined") {
        const progressMap = nextList.reduce((acc, c) => {
          acc[c.id] = {
            level: c.level,
            stars: c.stars,
            xp: c.xp,
            relics: c.relics,
            unlockedNodes: c.unlockedNodes || [],
          };
          return acc;
        }, {} as Record<string, Partial<Champion>>);
        localStorage.setItem("lor-codex:champion-progress", JSON.stringify(progressMap));
      }
      return nextList;
    });
  };

  const handleToggleNode = (champId: string, nodeId: string) => {
    const champ = championsList.find((c) => c.id === champId);
    if (!champ) return;
    
    const unlocked = champ.unlockedNodes || [];
    const isUnlocked = unlocked.includes(nodeId);
    
    let nextUnlocked: string[];
    if (isUnlocked) {
      nextUnlocked = lockNodeAndDownstream(nodeId, champ.constellation, unlocked);
    } else {
      if (isNodeUnlockable(nodeId, champ.constellation, unlocked)) {
        nextUnlocked = [...unlocked, nodeId];
      } else {
        return;
      }
    }
    
    const nextStars = computeStarsFromUnlockedNodes(nextUnlocked, champ.constellation.nodes);
    updateChampionProgress(champId, {
      unlockedNodes: nextUnlocked,
      stars: nextStars
    });
  };


  const filteredChampions = championsList.filter((champ) => {
    const matchesSearch = champ.name.toLowerCase().includes(champSearch.toLowerCase());
    const matchesRegion = selectedRegion === "All" || champ.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const regions = ["All", ...Array.from(new Set(championsList.map((c) => c.region)))];

  // Derive the active champion. Fallback to first filtered champion if current selection is filtered out.
  const activeChamp = filteredChampions.find((c) => c.id === selectedChampId) || filteredChampions[0];

  // Reset selected constellation node when champion selection changes
  useEffect(() => {
    if (activeChamp) {
      const config = activeChamp.constellation;
      if (config && config.nodes.length > 0) {
        setSelectedNodeId(config.nodes[0].id);
      }
    }
  }, [selectedChampId]);

  return (
    <div className="flex flex-col gap-6">
      {/* Split Layout Container */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* Left Column: Search & Vertical Champion List (1/3 width or collapsed width) */}
        <div className={`w-full transition-all duration-300 ${isListCollapsed ? "md:w-[80px]" : "md:w-1/3"} flex flex-col gap-4 h-auto md:h-[700px]`}>

          {/* Search and Filters inside Left Column */}
          <div className="flex flex-col gap-3 bg-[#0a0f1d]/75 border border-slate-800/80 p-3.5 rounded-2xl backdrop-blur-sm">
            {/* Header / Collapse Toggle */}
            <div className={`flex items-center ${isListCollapsed ? "justify-center" : "justify-between"} border-b border-slate-900/60 pb-2`}>
              {!isListCollapsed && (
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Champions</span>
              )}
              <button
                onClick={() => setIsListCollapsed(!isListCollapsed)}
                className="p-1.5 rounded-lg border border-slate-800 bg-[#050810] hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title={isListCollapsed ? "Expand List" : "Collapse List"}
              >
                {isListCollapsed ? (
                  // Expand icon (chevron right)
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                ) : (
                  // Collapse icon (chevron left)
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
                  </svg>
                )}
              </button>
            </div>

            {!isListCollapsed && (
              <>
                {/* Search Input */}
                <div className="relative w-full">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search Champions..."
                    value={champSearch}
                    onChange={(e) => setChampSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#050810] border border-slate-800 hover:border-slate-700 focus:border-[#c29d53]/60 focus:ring-1 focus:ring-[#c29d53]/60 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 outline-none"
                  />
                </div>

                {/* Region Filters */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">Region:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {regions.map((reg) => (
                      <button
                        key={reg}
                        onClick={() => setSelectedRegion(reg)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${selectedRegion === reg
                          ? "bg-[#c29d53]/10 text-[#e5c17d] border-[#c29d53]/50"
                          : "bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200"
                          }`}
                      >
                        {reg}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Vertical Champion List Container */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
            {filteredChampions.length > 0 ? (
              filteredChampions.map((champ) => {
                const isSelected = activeChamp && champ.id === activeChamp.id;
                return (
                  <div
                    key={champ.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedChampId(champ.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedChampId(champ.id);
                      }
                    }}
                    className={`w-full text-left rounded-xl border flex items-center group cursor-pointer relative overflow-hidden transition-all duration-300 ${isListCollapsed ? "p-2 justify-center" : "p-3.5"
                      } ${isSelected
                        ? "bg-gradient-to-r from-slate-900 to-slate-950 border-[#c29d53] shadow-[0_0_12px_rgba(194,157,83,0.08)] text-[#e5c17d]"
                        : "bg-[#0b0f1a]/60 border-slate-900 text-slate-300 hover:bg-[#0b0f1a] hover:border-slate-800 hover:text-slate-100"
                      }`}
                    title={isListCollapsed ? champ.name : undefined}
                  >
                    {/* Faded Background Art */}
                    {!isListCollapsed && champ.backgroundImage && (
                      <div
                        className="absolute right-0 top-0 bottom-0 w-2/3 pointer-events-none opacity-80 mix-blend-lighten z-0 bg-cover transition-opacity group-hover:opacity-75"
                        style={{
                          backgroundImage: `url(${champ.backgroundImage})`,
                          backgroundPosition: champ.backgroundPosition || 'right top',
                          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)',
                          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)'
                        }}
                      />
                    )}

                    {isListCollapsed ? (
                      <div className="relative z-10 flex items-center justify-center">
                        {champ.backgroundImage ? (
                          <div className={`w-11 h-11 rounded-full overflow-hidden border flex-shrink-0 relative transition-colors ${isSelected ? "border-[#c29d53]" : "border-slate-800 group-hover:border-slate-700"
                            }`}>
                            <div
                              className="absolute inset-0 bg-cover scale-[2.2] origin-[50%_25%]"
                              style={{
                                backgroundImage: `url(${champ.backgroundImage})`,
                                backgroundPosition: champ.backgroundPosition || 'center',
                              }}
                            />
                          </div>
                        ) : (
                          <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${champ.color} flex items-center justify-center border transition-colors ${isSelected ? "border-[#c29d53]" : "border-slate-800 group-hover:border-slate-700"
                            }`}>
                            <span className="text-sm font-bold text-slate-100 font-mono">
                              {champ.level}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 relative z-10">
                        {/* Simplified avatar/emblem block showing level number */}
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${champ.color} flex items-center justify-center border ${isSelected ? "border-[#c29d53]/60" : "border-slate-800"
                          }`}>
                          <span className="text-md font-bold text-slate-100 font-mono">
                            {champ.level}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-md">{champ.name}</h4>
                          {/* Star rating moved under name */}
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {Array.from({ length: getConstellationMaxStars(champ) }).map((_, i) => (
                              <svg
                                key={i}
                                className={`w-2.5 h-2.5 ${i < champ.stars ? "text-[#e5c17d]" : "text-slate-850"
                                  }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 bg-[#0a0f1d]/20 rounded-xl border border-slate-900 border-dashed text-slate-500 text-sm">
                No champions match filters.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed View (2/3 width or flex-1) */}
        <div className={`w-full transition-all duration-300 ${isListCollapsed ? "flex-1" : "md:w-2/3"} h-auto md:h-[950px] flex flex-col`}>
          {activeChamp ? (
            <div className={`rounded-2xl bg-gradient-to-b ${activeChamp.color} p-0.5 h-full flex flex-col`}>
              <div className="bg-[#0b0f1a]/95 rounded-2xl p-6 md:p-8 flex flex-col gap-5 relative h-full">
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
                  {activeDetailTab === "overview" && renderOverviewTab(activeChamp)}
                  {activeDetailTab === "constellation" && renderConstellationTab(
                    activeChamp.stars,
                    activeChamp,
                    selectedNodeId,
                    setSelectedNodeId,
                    (nodeId) => handleToggleNode(activeChamp.id, nodeId),
                    isListCollapsed,
                    activeConstellationSubTab,
                    setActiveConstellationSubTab
                  )}
                  {activeDetailTab === "level" && renderLevelTab(activeChamp.level)}
                  {activeDetailTab === "deck" && renderDeckTab(activeChamp)}
                  {activeDetailTab === "relic" && renderRelicTab(activeChamp.relics, (newRelics) => updateChampionProgress(activeChamp.id, { relics: newRelics }))}
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

      </div>
    </div>
  );
}
