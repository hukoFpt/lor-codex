"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { ConstellationNode, ConstellationConnection, computeNodeStarLevel } from "@/components/ChampionsTab";

// Helper function to render vector SVGs inside nodes
const renderDesignerNodeIcon = (nodeId: string, isStarPower: boolean, color?: "blue" | "purple", isPurpleStar?: boolean) => {
  const gradId = `designer-star-glow-${nodeId}`;

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

const INITIAL_NODES: ConstellationNode[] = [
  {
    id: "star_1",
    label: "1★",
    title: "Astral Might",
    effect: "Gain +1/+1 when playing a created card.",
    left: "15%",
    top: "50%",
    iconType: "star",
    upgradeType: "Star Power",
  },
  {
    id: "mana_1",
    label: "Mana",
    title: "Cosmic Core",
    effect: "+1 Starting Mana.",
    left: "45%",
    top: "50%",
    iconType: "mana",
    upgradeType: "Bonus Stat",
    color: "blue",
  },
  {
    id: "star_2",
    label: "2★",
    title: "Second Star",
    effect: "Double the effect of all spells.",
    left: "75%",
    top: "50%",
    iconType: "star",
    upgradeType: "Star Power",
  },
];

const INITIAL_CONNECTIONS: ConstellationConnection[] = [
  { from: "star_1", to: "mana_1" },
  { from: "mana_1", to: "star_2" },
];

export default function ConstellationDesigner() {
  const [nodes, setNodes] = useState<ConstellationNode[]>(INITIAL_NODES);
  const [connections, setConnections] = useState<ConstellationConnection[]>(INITIAL_CONNECTIONS);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [importText, setImportText] = useState("");
  const [copied, setCopied] = useState(false);
  const [hoverCoords, setHoverCoords] = useState<{ left: string; top: string } | null>(null);
  
  // Canvas settings states
  const [bgImageUrl, setBgImageUrl] = useState<string>("");
  const [bgOpacity, setBgOpacity] = useState<number>(40);
  const [bgScaleMode, setBgScaleMode] = useState<"cover" | "contain" | "fill">("cover");

  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Clear dragged node ID on mouse up
  useEffect(() => {
    const handleMouseUp = () => {
      setDraggedNodeId(null);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const leftPct = Math.max(0, Math.min(100, Math.round((x / rect.width) * 100)));
    const topPct = Math.max(0, Math.min(100, Math.round((y / rect.height) * 100)));

    setHoverCoords({ left: `${leftPct}%`, top: `${topPct}%` });

    if (draggedNodeId) {
      setNodes(
        nodes.map((n) =>
          n.id === draggedNodeId
            ? { ...n, left: `${leftPct}%`, top: `${topPct}%` }
            : n
        )
      );
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Spawn node on double click of empty canvas space
    if (e.target !== canvasRef.current && e.target !== svgRef.current) return;
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const left = Math.max(0, Math.min(100, Math.round((x / rect.width) * 100))) + "%";
    const top = Math.max(0, Math.min(100, Math.round((y / rect.height) * 100))) + "%";

    const newId = `node_${Date.now()}`;
    const newNode: ConstellationNode = {
      id: newId,
      label: "Node",
      title: "New Upgrade",
      effect: "Grant allies a bonus when summoned.",
      left,
      top,
      iconType: "star",
      upgradeType: "Star Power",
    };

    setNodes([...nodes, newNode]);
    setSelectedNodeId(newId);
  };

  const addNodeAtCenter = () => {
    const newId = `node_${Date.now()}`;
    const newNode: ConstellationNode = {
      id: newId,
      label: "Mana",
      title: "New Cosmic Star",
      effect: "Cosmic blessing upgrade effect.",
      left: "50%",
      top: "50%",
      iconType: "mana",
      upgradeType: "Bonus Stat",
      color: "blue",
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeId(newId);
  };

  const startConnection = (id: string) => {
    setConnectingFromId(id);
  };

  const handleNodeClick = (nodeId: string) => {
    if (connectingFromId) {
      if (connectingFromId === nodeId) {
        setConnectingFromId(null);
        return;
      }
      // Draw connection
      const exists = connections.some(
        (c) =>
          (c.from === connectingFromId && c.to === nodeId) ||
          (c.from === nodeId && c.to === connectingFromId)
      );
      if (!exists) {
        setConnections([...connections, { from: connectingFromId, to: nodeId }]);
      }
      setConnectingFromId(null);
    } else {
      setSelectedNodeId(nodeId);
    }
  };

  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;
    setNodes(nodes.filter((n) => n.id !== selectedNodeId));
    setConnections(
      connections.filter(
        (c) => c.from !== selectedNodeId && c.to !== selectedNodeId
      )
    );
    setSelectedNodeId(null);
  };

  const deleteConnection = (index: number) => {
    setConnections(connections.filter((_, idx) => idx !== index));
  };

  const updateSelectedNode = (fields: Partial<ConstellationNode>) => {
    if (!selectedNodeId) return;
    setNodes(nodes.map((n) => (n.id === selectedNodeId ? { ...n, ...fields } : n)));
  };

  const handleIdChange = (newId: string) => {
    if (!selectedNodeId) return;
    const oldId = selectedNodeId;
    if (!newId || newId === oldId) return;

    const idExists = nodes.some((n) => n.id === newId && n.id !== oldId);
    if (idExists) return;

    setNodes(
      nodes.map((n) => (n.id === oldId ? { ...n, id: newId } : n))
    );
    setConnections(
      connections.map((c) => ({
        from: c.from === oldId ? newId : c.from,
        to: c.to === oldId ? newId : c.to,
      }))
    );
    setSelectedNodeId(newId);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!selectedNodeId) return;
    const oldId = selectedNodeId;

    const newId = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    if (newId && newId !== oldId) {
      const idExists = nodes.some((n) => n.id === newId && n.id !== oldId);
      const finalId = idExists ? `${newId}_${Date.now().toString().slice(-4)}` : newId;

      setNodes(
        nodes.map((n) =>
          n.id === oldId ? { ...n, title: newTitle, id: finalId } : n
        )
      );
      setConnections(
        connections.map((c) => ({
          from: c.from === oldId ? finalId : c.from,
          to: c.to === oldId ? finalId : c.to,
        }))
      );
      setSelectedNodeId(finalId);
    } else {
      updateSelectedNode({ title: newTitle });
    }
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (parsed.nodes && Array.isArray(parsed.nodes)) {
        setNodes(parsed.nodes);
        setConnections(parsed.connections || []);
        setSelectedNodeId(null);
        setImportText("");
      } else {
        alert("Invalid format: Must contain a 'nodes' array.");
      }
    } catch (err) {
      alert("Invalid JSON format. Check brackets and trailing commas.");
    }
  };

  const copyToClipboard = () => {
    const code = JSON.stringify({ nodes, connections }, null, 2);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-sans select-none">
      <Header />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-slate-400 hover:text-[#e5c17d] transition-colors text-sm font-medium">
              &larr; Back to Database
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-sm font-semibold text-[#e5c17d] tracking-wide">Constellation Designer</span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded">
            Editor Mode
          </span>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Center Area: Canvas (2/3 width) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex justify-between items-center bg-[#0a0f1d]/60 border border-slate-900 px-4 py-3 rounded-xl">
              <div>
                <h2 className="text-sm font-bold text-[#e5c17d]">Constellation Canvas</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Double-click empty space to create a node, or drag nodes to reposition them.
                </p>
              </div>
              <div className="flex gap-2.5">
                <button
                  onClick={addNodeAtCenter}
                  className="bg-[#c29d53]/15 hover:bg-[#c29d53]/25 text-[#e5c17d] border border-[#c29d53]/40 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                >
                  + Spawn Node
                </button>
              </div>
            </div>

            {/* Visual Canvas Container */}
            <div
              ref={canvasRef}
              onMouseMove={handleCanvasMouseMove}
              onDoubleClick={handleDoubleClick}
              className="relative w-full h-[450px] bg-slate-950/70 border border-slate-900 rounded-2xl overflow-hidden backdrop-blur-sm shadow-inner cursor-crosshair select-none"
            >
              {/* Custom uploaded/pasted background */}
              {bgImageUrl && (
                <div
                  style={{
                    backgroundImage: `url(${bgImageUrl})`,
                    backgroundSize: bgScaleMode === "fill" ? "100% 100%" : bgScaleMode,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    opacity: bgOpacity / 100,
                  }}
                  className="absolute inset-0 pointer-events-none z-0"
                />
              )}
              {/* Ambient Grid overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#c29d53_0.03_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-25" />

              {/* Coord floating indicator */}
              {hoverCoords && (
                <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-900 px-2.5 py-1 rounded text-[10px] font-mono text-slate-400 z-30 pointer-events-none shadow-md">
                  X: {hoverCoords.left} | Y: {hoverCoords.top}
                </div>
              )}

              {connectingFromId && (
                <div className="absolute top-3 left-3 bg-indigo-950/80 border border-indigo-900 text-indigo-300 px-3 py-1.5 rounded text-[11px] font-semibold z-30 pointer-events-none animate-pulse">
                  Click another node to draw an edge connection...
                </div>
              )}

              {/* SVG Link Connections */}
              <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {connections.map((conn, index) => {
                  const fromNode = nodes.find((n) => n.id === conn.from);
                  const toNode = nodes.find((n) => n.id === conn.to);
                  if (!fromNode || !toNode) return null;

                  return (
                    <line
                      key={index}
                      x1={fromNode.left}
                      y1={fromNode.top}
                      x2={toNode.left}
                      y2={toNode.top}
                      stroke="#c29d53"
                      strokeWidth="1.2"
                      className="transition-all duration-300"
                    />
                  );
                })}
              </svg>

              {/* Nodes */}
              {nodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isConnectingSource = connectingFromId === node.id;
                const isStarPower = node.upgradeType === "Star Power";
                const nodeStarLevel = computeNodeStarLevel(node, nodes, connections);
                const isPurpleStar = node.iconType === "purple-star" || nodeStarLevel === 4;
                const nodeColor = node.color || "blue";

                return (
                  <div
                    key={node.id}
                    onMouseDown={(e) => {
                      // Only trigger drag on left-click if not in connecting mode
                      if (e.button === 0 && !connectingFromId) {
                        setDraggedNodeId(node.id);
                        setSelectedNodeId(node.id);
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNodeClick(node.id);
                    }}
                    style={{ left: node.left, top: node.top }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-move transition-shadow z-10 hover:scale-105 active:scale-105 ${
                      isStarPower
                        ? "w-11 h-11 border bg-slate-900"
                        : "w-[34px] h-[34px] border-2 bg-[#090d16] p-0.5"
                    } ${
                      isPurpleStar
                        ? "border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.3)] text-purple-450"
                        : !isStarPower
                          ? nodeColor === "purple"
                            ? "border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.3)] text-purple-450"
                            : "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)] text-blue-455"
                          : "border-[#c29d53] text-[#e5c17d] shadow-[0_0_12px_rgba(194,157,83,0.2)]"
                    } ${
                      isSelected
                        ? isPurpleStar || (!isStarPower && nodeColor === "purple")
                          ? "ring-2 ring-purple-400 ring-offset-2 ring-offset-[#0b0f1a]"
                          : !isStarPower && nodeColor === "blue"
                            ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0b0f1a]"
                            : "ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0b0f1a]"
                        : ""
                    } ${
                      isConnectingSource
                        ? "ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#0b0f1a] animate-pulse"
                        : ""
                    }`}
                  >
                    {/* Inner content */}
                    {!isStarPower ? (
                      <div className="w-full h-full rounded-full border border-slate-900 flex items-center justify-center bg-slate-950/80">
                        {renderDesignerNodeIcon(node.id, isStarPower, nodeColor, isPurpleStar)}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        {renderDesignerNodeIcon(node.id, isStarPower, undefined, isPurpleStar)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Property Editor & Import/Export (1/3 width) */}
          <div className="flex flex-col gap-6">
            {/* Properties Editor */}
            <div className="bg-[#0b0f1a]/95 border border-slate-900 p-5 rounded-2xl flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <h3 className="text-sm font-bold text-[#e5c17d] uppercase tracking-wider">Node Customizer</h3>
                {selectedNodeId && (
                  <button
                    onClick={deleteSelectedNode}
                    className="text-xs text-rose-500 hover:text-rose-400 font-semibold transition-colors cursor-pointer"
                  >
                    Delete Node
                  </button>
                )}
              </div>

              {selectedNode ? (
                <div className="flex flex-col gap-4 text-xs">
                  {/* ID & Label */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 font-mono">Node ID</label>
                      <input
                        type="text"
                        value={selectedNode.id}
                        onChange={(e) => handleIdChange(e.target.value)}
                        className="bg-[#050810] border border-slate-800 p-2.5 rounded-lg text-slate-100 outline-none focus:border-[#c29d53]/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 font-mono">Short Label</label>
                      <input
                        type="text"
                        value={selectedNode.label}
                        onChange={(e) => updateSelectedNode({ label: e.target.value })}
                        className="bg-[#050810] border border-slate-800 p-2.5 rounded-lg text-slate-100 outline-none focus:border-[#c29d53]/50"
                        placeholder="e.g. 1★"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 font-mono">Title</label>
                    <input
                      type="text"
                      value={selectedNode.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full bg-[#050810] border border-slate-800 p-2.5 rounded-lg text-slate-100 outline-none focus:border-[#c29d53]/50"
                    />
                  </div>

                  {/* Effect / Description */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 font-mono">Upgrade Effect Description</label>
                    <textarea
                      value={selectedNode.effect}
                      onChange={(e) => updateSelectedNode({ effect: e.target.value })}
                      rows={3}
                      className="w-full bg-[#050810] border border-slate-800 p-2.5 rounded-lg text-slate-100 outline-none focus:border-[#c29d53]/50 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Node Classification & Unlock Condition */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-slate-400 font-mono">Classification</label>
                      <select
                        value={selectedNode.upgradeType}
                        onChange={(e) => {
                          const val = e.target.value as "Star Power" | "Bonus Stat";
                          updateSelectedNode({
                            upgradeType: val,
                            color: val === "Bonus Stat" ? "blue" : undefined
                          });
                        }}
                        className="bg-[#050810] border border-slate-800 p-2.5 rounded-lg text-slate-100 outline-none focus:border-[#c29d53]/50 text-xs"
                      >
                        <option value="Star Power">Star Power</option>
                        <option value="Bonus Stat">Bonus Stat</option>
                      </select>
                    </div>
                  </div>

                  {/* Theme Color Picker for Bonus Stats */}
                  {selectedNode.upgradeType === "Bonus Stat" && (
                    <div className="flex flex-col gap-2 border-t border-slate-900/60 pt-3 mt-1">
                      <span className="text-slate-400 font-mono">Theme Color</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => updateSelectedNode({ color: "blue" })}
                          className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            selectedNode.color !== "purple"
                              ? "bg-blue-950/45 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.15)]"
                              : "bg-[#050810] border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          Blue
                        </button>
                        <button
                          type="button"
                          onClick={() => updateSelectedNode({ color: "purple" })}
                          className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            selectedNode.color === "purple"
                              ? "bg-purple-950/45 border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                              : "bg-[#050810] border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                          Purple
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Upgrade Cost Editor */}
                  <div className="border-t border-slate-900 pt-3 mt-1 flex flex-col gap-2">
                    <span className="text-slate-400 font-mono text-xs">Upgrade Cost</span>
                    
                    {/* List of current costs */}
                    <div className="flex flex-col gap-2">
                      {selectedNode.cost?.map((c, idx) => {
                        const curNames: Record<string, string> = {
                          fragment: "Champion Fragment",
                          gemstone: "Gemstone",
                          nova: "Nova Crystal",
                          star_crystal: "Star Crystal",
                          wild: "Wild Fragment"
                        };
                        return (
                          <div key={idx} className="flex justify-between items-center bg-[#050810] border border-slate-800 px-3 py-2 rounded-lg">
                            <span className="text-[11px] font-medium text-slate-300">
                              {curNames[c.currency]} <span className="font-bold text-[#e5c17d]">x{c.amount}</span>
                            </span>
                            <button
                              onClick={() => {
                                const newCosts = (selectedNode.cost || []).filter((_, i) => i !== idx);
                                updateSelectedNode({ cost: newCosts });
                              }}
                              className="text-rose-500 hover:text-rose-400 font-semibold cursor-pointer text-[10px]"
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })}
                      {(!selectedNode.cost || selectedNode.cost.length === 0) && (
                        <span className="text-[10px] text-slate-500 italic">No upgrade cost set (Free).</span>
                      )}
                    </div>

                    {/* Form to add a new cost */}
                    <div className="grid grid-cols-12 gap-2 mt-1">
                      <select
                        id="new-currency-select"
                        className="col-span-6 bg-[#050810] border border-slate-800 p-2 rounded-lg text-slate-100 outline-none text-[11px]"
                      >
                        <option value="fragment">Champion Fragment</option>
                        <option value="gemstone">Gemstone</option>
                        <option value="nova">Nova Crystal</option>
                        <option value="star_crystal">Star Crystal</option>
                        <option value="wild">Wild Fragment</option>
                      </select>
                      <input
                        id="new-amount-input"
                        type="number"
                        defaultValue={10}
                        min={1}
                        className="col-span-3 bg-[#050810] border border-slate-800 p-2 rounded-lg text-slate-100 outline-none font-mono text-[11px]"
                      />
                      <button
                        onClick={() => {
                          const currencySelect = document.getElementById("new-currency-select") as HTMLSelectElement;
                          const amountInput = document.getElementById("new-amount-input") as HTMLInputElement;
                          if (currencySelect && amountInput) {
                            const currency = currencySelect.value as any;
                            const amount = parseInt(amountInput.value, 10) || 1;
                            
                            const currentCosts = selectedNode.cost || [];
                            const existingIdx = currentCosts.findIndex(c => c.currency === currency);
                            let newCosts = [...currentCosts];
                            if (existingIdx > -1) {
                              newCosts[existingIdx] = { ...newCosts[existingIdx], amount: newCosts[existingIdx].amount + amount };
                            } else {
                              newCosts.push({ currency, amount });
                            }
                            updateSelectedNode({ cost: newCosts });
                          }
                        }}
                        className="col-span-3 bg-[#c29d53]/15 hover:bg-[#c29d53]/25 text-[#e5c17d] border border-[#c29d53]/40 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center justify-center"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  {/* Edge Connection Buttons */}
                  <div className="border-t border-slate-900 pt-3 mt-1 flex gap-2">
                    <button
                      onClick={() => startConnection(selectedNode.id)}
                      className="flex-1 bg-indigo-950/50 hover:bg-indigo-900/50 text-indigo-400 border border-indigo-800/40 p-2.5 rounded-xl font-bold transition-colors cursor-pointer"
                    >
                      Connect to...
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-950/20 border border-slate-900 border-dashed rounded-xl text-slate-500 text-xs italic">
                  Select a node on the canvas to configure properties or link connections.
                </div>
              )}
            </div>

            {/* Edge Links Manager */}
            <div className="bg-[#0b0f1a]/95 border border-slate-900 p-5 rounded-2xl flex flex-col gap-4">
              <h3 className="text-sm font-bold text-[#e5c17d] uppercase tracking-wider border-b border-slate-900 pb-3">
                Edge Links ({connections.length})
              </h3>
              <div className="max-h-[120px] overflow-y-auto pr-1 flex flex-col gap-2">
                {connections.map((conn, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-slate-950/60 border border-slate-900 px-3 py-2 rounded-lg text-xs"
                  >
                    <span className="font-mono text-slate-350">
                      {conn.from} &rarr; {conn.to}
                    </span>
                    <button
                      onClick={() => deleteConnection(idx)}
                      className="text-rose-500 hover:text-rose-400 font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {connections.length === 0 && (
                  <span className="text-[11px] text-slate-500 italic text-center py-3">No edge connections drawn yet.</span>
                )}
              </div>
            </div>

            {/* Canvas Background Settings */}
            <div className="bg-[#0b0f1a]/95 border border-slate-900 p-5 rounded-2xl flex flex-col gap-4">
              <h3 className="text-sm font-bold text-[#e5c17d] uppercase tracking-wider border-b border-slate-900 pb-3">
                Canvas Background
              </h3>
              <div className="flex flex-col gap-3 text-xs">
                {/* File Upload */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono">Upload Background Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setBgImageUrl(event.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full bg-[#050810] border border-slate-800 p-2 rounded-lg text-slate-400 file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-[#c29d53]/20 file:text-[#e5c17d] hover:file:bg-[#c29d53]/30 cursor-pointer"
                  />
                </div>

                {/* Paste URL */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono">Or Image URL</label>
                  <input
                    type="text"
                    value={bgImageUrl.startsWith("data:") ? "Local Image Uploaded" : bgImageUrl}
                    disabled={bgImageUrl.startsWith("data:")}
                    onChange={(e) => setBgImageUrl(e.target.value)}
                    placeholder="https://example.com/image.png"
                    className="w-full bg-[#050810] border border-slate-800 p-2.5 rounded-lg text-slate-100 outline-none focus:border-[#c29d53]/50 disabled:opacity-50"
                  />
                </div>

                {bgImageUrl && (
                  <>
                    {/* Opacity Slider */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-slate-400 font-mono">
                        <span>Opacity</span>
                        <span>{bgOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={bgOpacity}
                        onChange={(e) => setBgOpacity(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-[#050810] border border-slate-800 rounded-lg appearance-none cursor-pointer accent-[#c29d53]"
                      />
                    </div>

                    {/* Scale Mode Selector & Clear */}
                    <div className="flex gap-2">
                      <div className="flex-1 flex flex-col gap-1">
                        <label className="text-slate-400 font-mono text-[10px]">Fit Mode</label>
                        <select
                          value={bgScaleMode}
                          onChange={(e) => setBgScaleMode(e.target.value as any)}
                          className="bg-[#050810] border border-slate-800 p-1.5 rounded-lg text-slate-100 outline-none focus:border-[#c29d53]/50 text-[11px]"
                        >
                          <option value="cover">Cover (Fill)</option>
                          <option value="contain">Contain (Fit)</option>
                          <option value="fill">Fill (Stretch)</option>
                        </select>
                      </div>
                      <button
                        onClick={() => setBgImageUrl("")}
                        className="self-end bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 border border-rose-800/40 px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Clear Image
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Import / Export JSON */}
            <div className="bg-[#0b0f1a]/95 border border-slate-900 p-5 rounded-2xl flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <h3 className="text-sm font-bold text-[#e5c17d] uppercase tracking-wider">Import & Export</h3>
                <button
                  onClick={copyToClipboard}
                  className="bg-[#c29d53]/15 hover:bg-[#c29d53]/25 text-[#e5c17d] border border-[#c29d53]/40 px-3 py-1 rounded text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                >
                  {copied ? "Copied!" : "Copy JSON"}
                </button>
              </div>

              {/* JSON preview */}
              <div className="relative">
                <textarea
                  readOnly
                  value={JSON.stringify({ nodes, connections }, null, 2)}
                  className="w-full h-[150px] bg-[#050810] border border-slate-800 p-3 rounded-lg text-[10px] font-mono text-slate-350 outline-none resize-none leading-normal"
                />
              </div>

              {/* Import Area */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-900">
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste your exported constellation JSON code here to edit it..."
                  className="w-full h-[80px] bg-[#050810] border border-slate-800 p-2.5 rounded-lg text-[10px] font-mono text-slate-300 outline-none resize-none placeholder:text-slate-650"
                />
                <button
                  onClick={handleImport}
                  className="w-full bg-slate-900 hover:bg-slate-850 text-slate-350 border border-slate-800 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Import JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
