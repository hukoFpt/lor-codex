"use client";

import { useState, useEffect } from "react";
import { Champion } from "@/types";
import championData from "@/data/champions.json";

import ChampionList from "./champions/ChampionList";
import ChampionDetail from "./champions/ChampionDetail";
import {
  isNodeUnlockable,
  lockNodeAndDownstream,
  computeStarsFromUnlockedNodes,
  computeNodeStarLevel
} from "@/utils/constellation";

// Re-export for compatibility with other pages
export { computeNodeStarLevel };

const CHAMPIONS: Champion[] = (championData.champions as any[]).map((c) => {
  return {
    level: 1,
    stars: 0,
    xp: 0,
    maxXp: 500,
    maxLevel: 50,
    relics: [],
    goldBorder: false,
    unlockedNodes: [],
    levelRoadmap: [],
    overview: {
      description: "",
      playStyle: "",
      difficulty: "Medium"
    },
    constellation: {
      nodes: [],
      connections: []
    },
    ...c,
  };
});

export default function ChampionsTab() {
  const [champSearch, setChampSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedChampId, setSelectedChampId] = useState(CHAMPIONS[0].id);
  const [activeDetailTab, setActiveDetailTab] = useState<"overview" | "constellation" | "level" | "deck" | "relic">("overview");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");
  const [championsList, setChampionsList] = useState<Champion[]>(CHAMPIONS);
  const [isListCollapsed, setIsListCollapsed] = useState(false);
  const [activeConstellationSubTab, setActiveConstellationSubTab] = useState<"star" | "bonus">("star");

  // Dynamic Details caching and loading states
  const [detailsCache, setDetailsCache] = useState<Record<string, any>>({});
  const [loadingChampId, setLoadingChampId] = useState<string | null>(null);

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
            const nextMilestone = (c.levelRoadmap || []).find(m => m.level === level + 1);
            const nextMaxXp = level >= maxLevel ? 0 : (nextMilestone ? nextMilestone.xpNeeded : 500 + (level - 1) * 100);
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
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setChampionsList(merged);
        } catch (e) {
          console.error("Failed to parse champion progress:", e);
        }
      }
    }
  }, []);

  // Effect to fetch detailed data for selected champion if not cached
  useEffect(() => {
    if (!selectedChampId) return;
    if (detailsCache[selectedChampId]) return;

    let active = true;
    setLoadingChampId(selectedChampId);

    fetch(`/api/champions/${selectedChampId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch detailed codex entry");
        return res.json();
      })
      .then((data) => {
        if (active) {
          setDetailsCache((prev) => ({ ...prev, [selectedChampId]: data }));
          setLoadingChampId(null);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) {
          setLoadingChampId(null);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedChampId, detailsCache]);

  // Update static details once loaded from the API
  useEffect(() => {
    setChampionsList((prev) =>
      prev.map((c) => {
        const details = detailsCache[c.id];
        if (details && details.level && (!c.levelRoadmap || c.levelRoadmap.length === 0)) {
          const level = c.level;
          const maxLevel = c.maxLevel || 30;
          const roadmap = details.level;
          const nextMilestone = roadmap.find((m: any) => m.level === level + 1);
          const nextMaxXp = level >= maxLevel ? 0 : (nextMilestone ? nextMilestone.xpNeeded : 500 + (level - 1) * 100);
          return {
            ...c,
            levelRoadmap: roadmap,
            maxXp: nextMaxXp,
            constellation: details.constellation || c.constellation,
            overview: details.overview || c.overview,
            perkCurves: details.perkCurves || c.perkCurves,
          };
        }
        return c;
      })
    );
  }, [detailsCache]);

  const updateChampionProgress = (id: string, updates: Partial<Champion>) => {
    setChampionsList((prev) => {
      const nextList = prev.map((c) => {
        if (c.id === id) {
          const level = updates.level !== undefined ? updates.level : c.level;
          const maxLevel = c.maxLevel || 30;
          const nextMilestone = (c.levelRoadmap || []).find(m => m.level === level + 1);
          const nextMaxXp = level >= maxLevel ? 0 : (nextMilestone ? nextMilestone.xpNeeded : 500 + (level - 1) * 100);
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
    const matchesRegion = selectedRegion === "All" || (
      Array.isArray(champ.region)
        ? champ.region.includes(selectedRegion)
        : champ.region === selectedRegion
    );
    return matchesSearch && matchesRegion;
  });

  const regions = ["All", ...Array.from(new Set(championsList.flatMap((c) => Array.isArray(c.region) ? c.region : [c.region])))];

  // Derive the active champion. Fallback to first filtered champion if current selection is filtered out.
  const activeChamp = filteredChampions.find((c) => c.id === selectedChampId) || filteredChampions[0];

  // Reset selected constellation node when champion selection changes
  useEffect(() => {
    setSelectedNodeId("");
  }, [activeChamp]);

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Split Layout Container */}
      <div className="flex-grow min-h-0 flex flex-col md:flex-row gap-6">
        {/* Left Column: Search & Vertical Champion List */}
        <ChampionList
          filteredChampions={filteredChampions}
          activeChamp={activeChamp}
          setSelectedChampId={setSelectedChampId}
          isListCollapsed={isListCollapsed}
          setIsListCollapsed={setIsListCollapsed}
          champSearch={champSearch}
          setChampSearch={setChampSearch}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          regions={regions}
        />

        {/* Right Column: Detailed View */}
        <ChampionDetail
          activeChamp={activeChamp}
          updateChampionProgress={updateChampionProgress}
          handleToggleNode={handleToggleNode}
          isListCollapsed={isListCollapsed}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          activeConstellationSubTab={activeConstellationSubTab}
          setActiveConstellationSubTab={setActiveConstellationSubTab}
          activeDetailTab={activeDetailTab}
          setActiveDetailTab={setActiveDetailTab}
          isLoading={loadingChampId === selectedChampId || !detailsCache[selectedChampId]}
        />
      </div>
    </div>
  );
}
