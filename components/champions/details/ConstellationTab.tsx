import { useState, useEffect, useRef } from "react";
import { Champion } from "@/types";
import ConstellationMap from "./constellation/ConstellationMap";
import ConstellationPowersList from "./constellation/ConstellationPowersList";

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

  return (
    <div className={`flex mt-2 items-stretch ${isListCollapsed ? "flex-col lg:flex-row gap-6" : "flex-col gap-6"}`}>
      {/* Map Area */}
      <ConstellationMap
        champion={champion}
        constellation={constellation}
        selectedNodeId={selectedNodeId}
        setSelectedNodeId={setSelectedNodeId}
        onToggleNode={onToggleNode}
        isListCollapsed={isListCollapsed}
        mapRef={mapRef}
      />

      {/* Constellation Powers List */}
      <ConstellationPowersList
        champion={champion}
        constellation={constellation}
        selectedNodeId={selectedNodeId}
        setSelectedNodeId={setSelectedNodeId}
        onToggleNode={onToggleNode}
        isListCollapsed={isListCollapsed}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        mapHeight={mapHeight}
      />
    </div>
  );
}
