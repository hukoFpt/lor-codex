import React from "react";
import { Champion } from "@/types";
import { isNodeUnlockable } from "@/utils/constellation";
import ConstellationNodeIcon from "./ConstellationNodeIcon";
import ConstellationNodeModal from "./ConstellationNodeModal";

interface ConstellationMapProps {
  champion: Champion;
  constellation: NonNullable<Champion["constellation"]>;
  selectedNodeId: string;
  setSelectedNodeId: (id: string) => void;
  onToggleNode?: (nodeId: string) => void;
  isListCollapsed?: boolean;
  mapRef: React.RefObject<HTMLDivElement | null>;
}

export default function ConstellationMap({
  champion,
  constellation,
  selectedNodeId,
  setSelectedNodeId,
  onToggleNode,
  isListCollapsed = false,
  mapRef
}: ConstellationMapProps) {
  const modalNode = selectedNodeId ? constellation.nodes.find((n) => n.id === selectedNodeId) : null;
  const isModalNodeUnlocked = modalNode ? champion.unlockedNodes?.includes(modalNode.id) || false : false;
  const isModalNodeUnlockable = modalNode ? !isModalNodeUnlocked && isNodeUnlockable(modalNode.id, constellation, champion.unlockedNodes || []) : false;

  const leftPct = modalNode ? parseFloat(modalNode.left) || 50 : 50;
  const isTopClose = modalNode ? (parseInt(modalNode.top) || 50) < 45 : false;
  const translateY = isTopClose ? "24px" : "calc(-100% - 24px)";

  return (
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
                  <ConstellationNodeIcon
                    nodeId={node.id}
                    type={node.iconType}
                    isUnlocked={isUnlocked}
                    color={nodeColor}
                    isStarPower={isStarPower}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <ConstellationNodeIcon
                    nodeId={node.id}
                    type={node.iconType}
                    isUnlocked={isUnlocked}
                    color={undefined}
                    isStarPower={isStarPower}
                  />
                </div>
              )}
            </button>
          );
        })}

        {/* Floating Node Info Modal */}
        {modalNode && (
          <ConstellationNodeModal
            modalNode={modalNode}
            isModalNodeUnlocked={isModalNodeUnlocked}
            isModalNodeUnlockable={isModalNodeUnlockable}
            leftPct={leftPct}
            translateY={translateY}
            isTopClose={isTopClose}
            onToggleNode={onToggleNode}
          />
        )}
      </div>
    </div>
  );
}
