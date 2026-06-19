export interface CurrencyCost {
  currency: "fragment" | "gemstone" | "nova" | "star_crystal" | "wild";
  amount: number;
}

export interface ConstellationNode {
  id: string;
  title: string;
  effect: string;
  left: string;
  top: string;
  iconType: "star" | "purple-star" | "mana" | "relic" | "card" | "buff" | "gold";
  unlockedAtStar?: number;
  upgradeType: "Star Power" | "Bonus Stat";
  color?: "blue" | "purple";
  cost?: CurrencyCost[];
  imageUrl?: string;
}

export interface ConstellationConnection {
  from: string;
  to: string;
}

export interface ChampionConstellation {
  nodes: ConstellationNode[];
  connections: ConstellationConnection[];
}

export interface ChampOverviewData {
  description: string;
  playStyle: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface LevelMilestone {
  level: number;
  xpNeeded: number;
  title: string;
  reward: string;
}

export interface PerkCurves {
  health?: Record<string, number>;
  regen?: Record<string, number>;
  gold?: Record<string, number>;
  revives?: Record<string, number>;
  rareChance?: Record<string, number>;
  epicChance?: Record<string, number>;
  legendaryChance?: Record<string, number>;
  startingDraw?: Record<string, number>;
}

export interface Champion {
  id: string;
  name: string;
  region: string;
  level: number;
  stars: number;
  xp: number;
  maxXp: number;
  maxLevel: number;
  relics: string[];
  color: string;
  goldBorder: boolean;
  backgroundImage?: string;
  backgroundPosition?: string;
  overview: ChampOverviewData;
  constellation: ChampionConstellation;
  deck?: { name: string; cost: number; type: string; rarity: string }[];
  unlockedNodes?: string[];
  levelRoadmap?: LevelMilestone[];
  perkCurves?: PerkCurves;
}

export interface Relic {
  id: string;
  name: string;
  rarity: string; // 'epic' | 'rare' | 'common'
  effect: string;
  quantity: number;
}

export interface Currency {
  id: string;
  name: string;
  amount: number;
  description: string;
  rarity: string;
}

export interface Adventure {
  id: string;
  name: string;
  stars: number;
  region: string;
  completed: boolean;
  completedWith: string[];
  rewards: string[];
  status: string; // 'Completed' | 'In Progress' | 'Locked'
}
