export interface Champion {
  id: string;
  name: string;
  region: string;
  level: number;
  stars: number;
  xp: number;
  maxXp: number;
  relics: string[];
  color: string;
  goldBorder: boolean;
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
