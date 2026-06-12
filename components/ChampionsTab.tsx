"use client";

import { useState, useEffect } from "react";
import { Champion } from "@/types";

const CHAMPIONS: Champion[] = [
  {
    id: "asol",
    name: "Aurelion Sol",
    region: "Targon",
    level: 30,
    stars: 4,
    xp: 0,
    maxXp: 0,
    relics: ["The Star Forge", "Corrupted Star Fragment", "Luden's Tempest"],
    color: "from-blue-900 via-indigo-950 to-slate-950",
    goldBorder: true,
  },
  {
    id: "jinx",
    name: "Jinx",
    region: "Zaun",
    level: 28,
    stars: 3,
    xp: 1200,
    maxXp: 2500,
    relics: ["Loose Cannon's Payload", "Garen's Lost Chapter"],
    color: "from-pink-950 via-purple-950 to-slate-950",
    goldBorder: false,
  },
  {
    id: "yasuo",
    name: "Yasuo",
    region: "Ionia",
    level: 20,
    stars: 3,
    xp: 800,
    maxXp: 1800,
    relics: ["Tempest Blade", "Everfrost"],
    color: "from-teal-950 via-slate-900 to-slate-950",
    goldBorder: false,
  },
  {
    id: "lux",
    name: "Lux: Illuminated",
    region: "Demacia",
    level: 15,
    stars: 2,
    xp: 350,
    maxXp: 1200,
    relics: ["Archangel's Staff"],
    color: "from-amber-950 via-yellow-950 to-slate-950",
    goldBorder: false,
  },
  {
    id: "mf",
    name: "Miss Fortune",
    region: "Bilgewater",
    level: 10,
    stars: 1,
    xp: 150,
    maxXp: 800,
    relics: ["Chameleon's Necklace"],
    color: "from-red-950 via-stone-900 to-slate-950",
    goldBorder: false,
  },
  {
    id: "elder",
    name: "Elder Dragon",
    region: "Runeterra",
    level: 5,
    stars: 2,
    xp: 200,
    maxXp: 500,
    relics: ["Warmog's Armor"],
    color: "from-emerald-950 via-amber-950 to-slate-950",
    goldBorder: false,
  },
];
export interface CurrencyCost {
  currency: "fragment" | "gemstone" | "nova" | "star_crystal" | "wild";
  amount: number;
}

export interface ConstellationNode {
  id: string;
  label: string;
  title: string;
  effect: string;
  left: string;
  top: string;
  iconType: "star" | "purple-star" | "mana" | "relic" | "card" | "buff" | "gold";
  unlockedAtStar?: number;
  upgradeType: "Star Power" | "Bonus Stat";
  color?: "blue" | "purple";
  cost?: CurrencyCost[];
}

export interface ConstellationConnection {
  from: string;
  to: string;
}

export interface ChampionConstellation {
  nodes: ConstellationNode[];
  connections: ConstellationConnection[];
}

const CHAMPION_CONSTELLATIONS: Record<string, ChampionConstellation> = {
  asol: {
    nodes: [
      {
        id: "asol_1",
        label: "1★",
        title: "Astral Radiance",
        effect: "When you play a created card, reduce the cost of allied champions everywhere by 1. When you play a champion, level them up. You're welcome.",
        left: "12%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 1,
        upgradeType: "Star Power",
      },
      {
        id: "asol_mana",
        label: "Mana",
        title: "Cosmic Core",
        effect: "Game Start: +1 Starting Mana.",
        left: "30%",
        top: "50%",
        iconType: "mana",
        unlockedAtStar: 2,
        upgradeType: "Bonus Stat",
        color: "blue",
        cost: [
          { currency: "fragment", amount: 40 },
          { currency: "wild", amount: 10 }
        ]
      },
      {
        id: "asol_2",
        label: "2★",
        title: "Cosmic Creator",
        effect: "Game Start: +1 Starting Mana. I graciously bestow a Rare or Epic item upon all your created cards.",
        left: "48%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 2,
        upgradeType: "Star Power",
      },
      {
        id: "asol_relic",
        label: "Relic Slot",
        title: "Celestial Forge",
        effect: "Unlock a bonus Rare relic slot for Aurelion Sol.",
        left: "65%",
        top: "25%",
        iconType: "relic",
        unlockedAtStar: 3,
        upgradeType: "Bonus Stat",
        color: "purple",
        cost: [
          { currency: "star_crystal", amount: 50 },
          { currency: "gemstone", amount: 10 }
        ]
      },
      {
        id: "asol_card",
        label: "Card Item",
        title: "Dragon Portal",
        effect: "Add +2 copies of Aurelion Sol with Fae Guide (Spells cost 1 less) to your starting deck.",
        left: "65%",
        top: "75%",
        iconType: "card",
        unlockedAtStar: 3,
        upgradeType: "Bonus Stat",
        color: "blue",
        cost: [
          { currency: "fragment", amount: 20 },
          { currency: "wild", amount: 15 }
        ]
      },
      {
        id: "asol_3",
        label: "3★",
        title: "Astral Radiance II",
        effect: "When you play a created card, reduce the cost of allied champions everywhere by 2. When you play a champion, level them up. You're welcome.",
        left: "82%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 3,
        upgradeType: "Star Power",
      },
      {
        id: "asol_4",
        label: "4★",
        title: "Breath of Light",
        effect: "When you play a unit, double its stats. If it's Aurelion Sol, The Skies Descend upon all your pathetic enemies.",
        left: "94%",
        top: "50%",
        iconType: "purple-star",
        unlockedAtStar: 4,
        upgradeType: "Star Power",
        cost: [
          { currency: "fragment", amount: 100 },
          { currency: "nova", amount: 1 }
        ]
      },
    ],
    connections: [
      { from: "asol_1", to: "asol_mana" },
      { from: "asol_mana", to: "asol_2" },
      { from: "asol_2", to: "asol_relic" },
      { from: "asol_2", to: "asol_card" },
      { from: "asol_relic", to: "asol_3" },
      { from: "asol_card", to: "asol_3" },
      { from: "asol_3", to: "asol_4" },
    ],
  },
  jinx: {
    nodes: [
      {
        id: "jinx_1",
        label: "1★",
        title: "What Could Go Wrong?",
        effect: "When you discard a card, deal 1 damage to the enemy Nexus.",
        left: "15%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 1,
        upgradeType: "Star Power",
      },
      {
        id: "jinx_mana",
        label: "Mana",
        title: "Powder's Pep",
        effect: "Game Start: +1 Starting Mana.",
        left: "35%",
        top: "50%",
        iconType: "mana",
        unlockedAtStar: 2,
        upgradeType: "Bonus Stat",
        color: "blue",
      },
      {
        id: "jinx_2",
        label: "2★",
        title: "Pow-Pow's Prep",
        effect: "+1 Starting Mana.",
        left: "55%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 2,
        upgradeType: "Star Power",
      },
      {
        id: "jinx_buff",
        label: "Card Buff",
        title: "Flame Chompers Upgrade",
        effect: "Flame Chompers in your deck gain +1/+1 and Quick Attack.",
        left: "70%",
        top: "30%",
        iconType: "buff",
        unlockedAtStar: 3,
        upgradeType: "Bonus Stat",
        color: "purple",
      },
      {
        id: "jinx_3",
        label: "3★",
        title: "Rocket Havoc",
        effect: "When you play or discard a card, deal 2 damage to a random enemy.",
        left: "85%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 3,
        upgradeType: "Star Power",
      },
    ],
    connections: [
      { from: "jinx_1", to: "jinx_mana" },
      { from: "jinx_mana", to: "jinx_2" },
      { from: "jinx_2", to: "jinx_buff" },
      { from: "jinx_buff", to: "jinx_3" },
    ],
  },
  yasuo: {
    nodes: [
      {
        id: "yasuo_1",
        label: "1★",
        title: "Way of the Wanderer",
        effect: "When you Stun or Recall an enemy, grant it -1/-0.",
        left: "15%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 1,
        upgradeType: "Star Power",
      },
      {
        id: "yasuo_mana",
        label: "Mana",
        title: "Zephyr Core",
        effect: "Game Start: +1 Starting Mana.",
        left: "35%",
        top: "50%",
        iconType: "mana",
        unlockedAtStar: 2,
        upgradeType: "Bonus Stat",
        color: "blue",
      },
      {
        id: "yasuo_2",
        label: "2★",
        title: "Wind's Grace",
        effect: "+1 Starting Mana.",
        left: "55%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 2,
        upgradeType: "Star Power",
      },
      {
        id: "yasuo_relic",
        label: "Relic Slot",
        title: "Steel Tempest Forge",
        effect: "Unlock a bonus Common relic slot.",
        left: "70%",
        top: "70%",
        iconType: "relic",
        unlockedAtStar: 3,
        upgradeType: "Bonus Stat",
        color: "purple",
      },
      {
        id: "yasuo_3",
        label: "3★",
        title: "Tempest Strike",
        effect: "When you Stun or Recall an enemy, Yasuo strikes it for 2 damage.",
        left: "85%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 3,
        upgradeType: "Star Power",
      },
    ],
    connections: [
      { from: "yasuo_1", to: "yasuo_mana" },
      { from: "yasuo_mana", to: "yasuo_2" },
      { from: "yasuo_2", to: "yasuo_relic" },
      { from: "yasuo_relic", to: "yasuo_3" },
    ],
  },
  lux: {
    nodes: [
      {
        id: "lux_1",
        label: "1★",
        title: "Illumination",
        effect: "For every 6+ mana of spells you cast, create a Golden Aegis.",
        left: "15%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 1,
        upgradeType: "Star Power",
      },
      {
        id: "lux_mana",
        label: "Mana",
        title: "Prismatic Catalyst",
        effect: "Game Start: +1 Starting Mana.",
        left: "35%",
        top: "50%",
        iconType: "mana",
        unlockedAtStar: 2,
        upgradeType: "Bonus Stat",
        color: "blue",
      },
      {
        id: "lux_2",
        label: "2★",
        title: "Crownguard Legacy",
        effect: "+1 Starting Mana.",
        left: "55%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 2,
        upgradeType: "Star Power",
      },
      {
        id: "lux_card",
        label: "Card Upgrade",
        title: "Radiant Light",
        effect: "Add +2 copies of Prismatic Barrier to your starting deck.",
        left: "70%",
        top: "30%",
        iconType: "card",
        unlockedAtStar: 3,
        upgradeType: "Bonus Stat",
        color: "purple",
      },
      {
        id: "lux_3",
        label: "3★",
        title: "Prismatic Shield",
        effect: "When you cast a spell, grant the weakest ally Barrier.",
        left: "85%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 3,
        upgradeType: "Star Power",
      },
    ],
    connections: [
      { from: "lux_1", to: "lux_mana" },
      { from: "lux_mana", to: "lux_2" },
      { from: "lux_2", to: "lux_card" },
      { from: "lux_card", to: "lux_3" },
    ],
  },
  mf: {
    nodes: [
      {
        id: "mf_1",
        label: "1★",
        title: "Love Tap",
        effect: "When allies attack, deal 1 damage to all battling enemies.",
        left: "15%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 1,
        upgradeType: "Star Power",
      },
      {
        id: "mf_mana",
        label: "Mana",
        title: "Siren's Call",
        effect: "Game Start: +1 Starting Mana.",
        left: "35%",
        top: "50%",
        iconType: "mana",
        unlockedAtStar: 2,
        upgradeType: "Bonus Stat",
        color: "blue",
      },
      {
        id: "mf_2",
        label: "2★",
        title: "Strut",
        effect: "+1 Starting Mana.",
        left: "55%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 2,
        upgradeType: "Star Power",
      },
      {
        id: "mf_gold",
        label: "Gold Bonus",
        title: "Gold Rush",
        effect: "Earn +20% more gold from adventures.",
        left: "70%",
        top: "70%",
        iconType: "gold",
        unlockedAtStar: 3,
        upgradeType: "Bonus Stat",
        color: "purple",
      },
      {
        id: "mf_3",
        label: "3★",
        title: "Bullet Time",
        effect: "When allies attack, deal 2 damage to all enemies and the Nexus.",
        left: "85%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 3,
        upgradeType: "Star Power",
      },
    ],
    connections: [
      { from: "mf_1", to: "mf_mana" },
      { from: "mf_mana", to: "mf_2" },
      { from: "mf_2", to: "mf_gold" },
      { from: "mf_gold", to: "mf_3" },
    ],
  },
  elder: {
    nodes: [
      {
        id: "elder_1",
        label: "1★",
        title: "Dragonic Might",
        effect: "Your units with 6+ base cost have +2/+2 and Tough.",
        left: "15%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 1,
        upgradeType: "Star Power",
      },
      {
        id: "elder_mana",
        label: "Mana",
        title: "Primordial Catalyst",
        effect: "Game Start: +1 Starting Mana.",
        left: "35%",
        top: "50%",
        iconType: "mana",
        unlockedAtStar: 2,
        upgradeType: "Bonus Stat",
        color: "blue",
      },
      {
        id: "elder_2",
        label: "2★",
        title: "Primeval Roar",
        effect: "+1 Starting Mana.",
        left: "55%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 2,
        upgradeType: "Star Power",
      },
      {
        id: "elder_buff",
        label: "Card Buff",
        title: "Titanic Scales",
        effect: "Titanic units in your deck gain +1/+1 and Overwhelm.",
        left: "70%",
        top: "30%",
        iconType: "buff",
        unlockedAtStar: 3,
        upgradeType: "Bonus Stat",
        color: "purple",
      },
      {
        id: "elder_3",
        label: "3★",
        title: "Dragonic Ascent",
        effect: "Your units with 6+ base cost cost 1 less.",
        left: "85%",
        top: "50%",
        iconType: "star",
        unlockedAtStar: 3,
        upgradeType: "Star Power",
      },
    ],
    connections: [
      { from: "elder_1", to: "elder_mana" },
      { from: "elder_mana", to: "elder_2" },
      { from: "elder_2", to: "elder_buff" },
      { from: "elder_buff", to: "elder_3" },
    ],
  },
};

interface ChampDetailData {
  description: string;
  playStyle: string;
  difficulty: "Easy" | "Medium" | "Hard";
  constellation: { star: number; title: string; effect: string }[];
  deck: { name: string; cost: number; type: string; rarity: string }[];
}

const CHAMPION_DETAILS_DB: Record<string, ChampDetailData> = {
  asol: {
    description: "The Star Forger. An ancient cosmic entity who creates stars and is bound to Targon's will.",
    playStyle: "Invoke Celestial units and ramp to high-cost cards",
    difficulty: "Medium",
    constellation: [
      { star: 1, title: "Astral Radiance", effect: "When you play a created card, reduce the cost of allied champions everywhere by 1. When you play a champion, level them up. You're welcome." },
      { star: 2, title: "Cosmic Creator", effect: "+1 Starting Mana. I graciously bestow a Rare or Epic item upon all your created cards." },
      { star: 3, title: "Astral Radiance II", effect: "When you play a created card, reduce the cost of allied champions everywhere by 2. When you play a champion, level them up. You're welcome." },
      { star: 4, title: "Breath of Light", effect: "When you play a unit, double its stats. If it's Aurelion Sol, The Skies Descend upon all your pathetic enemies." }
    ],
    deck: [
      { name: "Spacey Sketcher", cost: 1, type: "Unit", rarity: "Common" },
      { name: "Behold the Infinite", cost: 2, type: "Spell", rarity: "Common" },
      { name: "Messenger Sigil", cost: 2, type: "Spell", rarity: "Rare" },
      { name: "Solari Priestess", cost: 3, type: "Unit", rarity: "Rare" },
      { name: "Starshaping", cost: 5, type: "Spell", rarity: "Common" },
      { name: "Aurelion Sol", cost: 10, type: "Champion", rarity: "Epic" }
    ]
  },
  jinx: {
    description: "The Loose Cannon. A manic and impulsive criminal from Zaun who lives to wreak havoc.",
    playStyle: "Fast-paced aggression using empty-hand and discard synergies",
    difficulty: "Easy",
    constellation: [
      { star: 1, title: "What Could Go Wrong?", effect: "When you discard a card, deal 1 damage to the enemy Nexus." },
      { star: 2, title: "Pow-Pow's Prep", effect: "+1 Starting Mana." },
      { star: 3, title: "Rocket Havoc", effect: "When you play or discard a card, deal 2 damage to a random enemy." }
    ],
    deck: [
      { name: "Urchin", cost: 1, type: "Unit", rarity: "Common" },
      { name: "Zaunite Urchin", cost: 1, type: "Unit", rarity: "Common" },
      { name: "Rummage", cost: 2, type: "Spell", rarity: "Common" },
      { name: "Sump Dredger", cost: 3, type: "Unit", rarity: "Rare" },
      { name: "Get Excited!", cost: 3, type: "Spell", rarity: "Rare" },
      { name: "Jinx", cost: 4, type: "Champion", rarity: "Epic" }
    ]
  },
  yasuo: {
    description: "The Unforgiven. An agile swordsman accused of treason, wandering Runeterra to clear his name.",
    playStyle: "Control the board with Stuns and strike enemies using Yasuo's passive",
    difficulty: "Medium",
    constellation: [
      { star: 1, title: "Way of the Wanderer", effect: "When you Stun or Recall an enemy, grant it -1/-0." },
      { star: 2, title: "Wind's Grace", effect: "+1 Starting Mana." },
      { star: 3, title: "Tempest Strike", effect: "When you Stun or Recall an enemy, Yasuo strikes it for 2 damage." }
    ],
    deck: [
      { name: "Fae Sprout", cost: 1, type: "Spell", rarity: "Common" },
      { name: "Concussive Palm", cost: 4, type: "Spell", rarity: "Rare" },
      { name: "Steel Tempest", cost: 2, type: "Spell", rarity: "Common" },
      { name: "Deep Meditation", cost: 5, type: "Spell", rarity: "Rare" },
      { name: "Yone, Windchaser", cost: 7, type: "Unit", rarity: "Rare" },
      { name: "Yasuo", cost: 4, type: "Champion", rarity: "Epic" }
    ]
  },
  lux: {
    description: "The Lady of Luminosity. A mage who can bend light to her will, hiding her powers in Demacia.",
    playStyle: "Generate Barrier and cast high-cost spells to shoot lasers",
    difficulty: "Medium",
    constellation: [
      { star: 1, title: "Illumination", effect: "For every 6+ mana of spells you cast, create a Golden Aegis." },
      { star: 2, title: "Crownguard Legacy", effect: "+1 Starting Mana." },
      { star: 3, title: "Prismatic Shield", effect: "When you cast a spell, grant the weakest ally Barrier." }
    ],
    deck: [
      { name: "Mageseeker Conservator", cost: 1, type: "Unit", rarity: "Common" },
      { name: "Prismatic Barrier", cost: 3, type: "Spell", rarity: "Common" },
      { name: "Succession", cost: 3, type: "Spell", rarity: "Common" },
      { name: "Mageseeker Investigator", cost: 4, type: "Unit", rarity: "Rare" },
      { name: "Remember The Fallen", cost: 5, type: "Spell", rarity: "Rare" },
      { name: "Lux: Illuminated", cost: 5, type: "Champion", rarity: "Epic" }
    ]
  },
  mf: {
    description: "The Bounty Hunter. A Bilgewater captain renowned for her beauty but feared for her ruthlessness.",
    playStyle: "Attack wide and wear down opponents with direct skill damage",
    difficulty: "Easy",
    constellation: [
      { star: 1, title: "Love Tap", effect: "When allies attack, deal 1 damage to all battling enemies." },
      { star: 2, title: "Strut", effect: "+1 Starting Mana." },
      { star: 3, title: "Bullet Time", effect: "When allies attack, deal 2 damage to all enemies and the Nexus." }
    ],
    deck: [
      { name: "Jagged Butcher", cost: 1, type: "Unit", rarity: "Common" },
      { name: "Make It Rain", cost: 2, type: "Spell", rarity: "Common" },
      { name: "Marai Warden", cost: 2, type: "Unit", rarity: "Common" },
      { name: "Double Up", cost: 6, type: "Spell", rarity: "Rare" },
      { name: "Monster Harpoon", cost: 6, type: "Spell", rarity: "Rare" },
      { name: "Miss Fortune", cost: 3, type: "Champion", rarity: "Epic" }
    ]
  },
  elder: {
    description: "The Aspect of Dragon. An ancient primeval dragon whose raw power shakes the foundation of Runeterra.",
    playStyle: "Ramp mana to summon unstoppable, high-cost Titanic dragons",
    difficulty: "Hard",
    constellation: [
      { star: 1, title: "Dragonic Might", effect: "Your units with 6+ base cost have +2/+2 and Tough." },
      { star: 2, title: "Primeval Roar", effect: "+1 Starting Mana." },
      { star: 3, title: "Dragonic Ascent", effect: "Your units with 6+ base cost cost 1 less." }
    ],
    deck: [
      { name: "Dragon Chow", cost: 1, type: "Unit", rarity: "Common" },
      { name: "Strafing Strike", cost: 2, type: "Spell", rarity: "Common" },
      { name: "Ruined Dragonguard", cost: 3, type: "Unit", rarity: "Rare" },
      { name: "Fused Firebrand", cost: 5, type: "Unit", rarity: "Rare" },
      { name: "Cloud Drinker", cost: 6, type: "Unit", rarity: "Common" },
      { name: "Elder Dragon", cost: 12, type: "Champion", rarity: "Epic" }
    ]
  }
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

const renderOverviewTab = (activeChamp: Champion) => {
  const details = CHAMPION_DETAILS_DB[activeChamp.id];
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
          <h3 className="text-xs text-slate-400 font-bold tracking-widest uppercase mb-1.5">Biography</h3>
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
    const match = node.label.match(/\d+/);
    if (match) {
      return parseInt(match[0], 10);
    }
    const idMatch = node.id.match(/_(\d+)$/);
    if (idMatch) {
      return parseInt(idMatch[1], 10);
    }
    return 1;
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
        const match = currentNode.label.match(/\d+/);
        if (match) return parseInt(match[0], 10);
        const idMatch = currentNode.id.match(/_(\d+)$/);
        if (idMatch) return parseInt(idMatch[1], 10);
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
        const match = currentNode.label.match(/\d+/);
        if (match) return parseInt(match[0], 10);
        const idMatch = currentNode.id.match(/_(\d+)$/);
        if (idMatch) return parseInt(idMatch[1], 10);
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
  champId: string,
  selectedNodeId: string,
  setSelectedNodeId: (id: string) => void
) => {
  const constellation = CHAMPION_CONSTELLATIONS[champId];
  if (!constellation) return null;

  const selectedNode = constellation.nodes.find((n) => n.id === selectedNodeId) || constellation.nodes[0];

  return (
    <div className="flex flex-col gap-5 mt-2">
      <h3 className="text-xs text-slate-400 font-bold tracking-widest uppercase">Constellation Map</h3>

      {/* Map Area */}
      <div className="relative w-full h-[240px] bg-slate-950/70 border border-slate-900 rounded-2xl overflow-hidden backdrop-blur-sm">
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#c29d53_0.03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {constellation.connections.map((conn, index) => {
            const fromNode = constellation.nodes.find((n) => n.id === conn.from);
            const toNode = constellation.nodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            const toNodeStarLevel = computeNodeStarLevel(toNode, constellation.nodes, constellation.connections);
            const isLinkUnlocked = stars >= toNodeStarLevel;
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
          const nodeStarLevel = computeNodeStarLevel(node, constellation.nodes, constellation.connections);
          const isUnlocked = stars >= nodeStarLevel;
          const isSelected = selectedNodeId === node.id;
          const isStarPower = node.upgradeType === "Star Power";
          const isPurpleStar = node.iconType === "purple-star";
          const nodeColor = node.color || "blue";

          return (
            <button
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              style={{ left: node.left, top: node.top }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-10 ${
                isStarPower
                  ? "w-11 h-11 border bg-slate-900"
                  : "w-[34px] h-[34px] border-2 bg-[#090d16] p-0.5"
              } ${
                isUnlocked
                  ? isPurpleStar
                    ? "border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.4)] text-purple-400 hover:scale-105"
                    : !isStarPower
                      ? nodeColor === "purple"
                        ? "border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.4)] text-purple-400 hover:scale-105"
                        : "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)] text-blue-400 hover:scale-105"
                      : "border-[#c29d53] text-[#e5c17d] shadow-[0_0_12px_rgba(194,157,83,0.25)] hover:scale-105"
                  : "border-slate-900 text-slate-600 hover:border-slate-800 hover:text-slate-500"
              } ${
                isSelected
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
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-4 flex flex-col gap-2 relative">
          <div className="flex justify-between items-center border-b border-slate-900 pb-2 mb-1">
            <h4 className="font-bold text-sm text-[#e5c17d] flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                selectedNode.upgradeType === "Star Power"
                  ? selectedNode.iconType === "purple-star"
                    ? "bg-purple-500 animate-pulse"
                    : "bg-amber-500"
                  : selectedNode.color === "purple"
                    ? "bg-purple-500"
                    : "bg-blue-500"
              }`} />
              {selectedNode.title}
            </h4>
            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                selectedNode.upgradeType === "Star Power"
                  ? "bg-amber-950/45 text-amber-400 border-amber-800/40"
                  : selectedNode.color === "purple"
                    ? "bg-purple-950/45 text-purple-400 border-purple-800/40"
                    : "bg-blue-950/45 text-blue-400 border-blue-800/40"
              }`}>
                {selectedNode.upgradeType}
              </span>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${stars >= computeNodeStarLevel(selectedNode, constellation.nodes, constellation.connections)
                  ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/40"
                  : "bg-slate-900 text-slate-550 border border-slate-850"
                }`}>
                {stars >= computeNodeStarLevel(selectedNode, constellation.nodes, constellation.connections) ? "Unlocked" : "Locked"}
              </span>
            </div>
          </div>
          <p className="text-xs text-[#8c9bb4] leading-relaxed italic">
            "{selectedNode.effect}"
          </p>

          {/* Cost Section */}
          {selectedNode.cost && selectedNode.cost.length > 0 && (
            <div className="border-t border-slate-900/60 pt-3 flex flex-col gap-2 mt-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Unlock Cost</span>
              <div className="flex flex-wrap gap-3">
                {selectedNode.cost.map((item, idx) => {
                  const info = CURRENCY_INFO[item.currency];
                  if (!info) return null;
                  const displayName = item.currency === "fragment" ? getFragmentName(champId) : info.name;
                  return (
                    <div key={idx} className="flex items-center gap-2.5 bg-[#090d16]/80 border border-slate-900 px-3.5 py-1.5 rounded-xl">
                      <img src={info.icon} alt={displayName} className="w-5.5 h-5.5 object-contain" />
                      <div className="flex flex-col">
                        <span className="text-[8.5px] text-slate-500 font-semibold uppercase tracking-wider leading-none mb-1">{displayName}</span>
                        <span className={`text-xs font-black font-mono leading-none ${info.textColor}`}>
                          x{item.amount}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
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

const renderDeckTab = (champId: string) => {
  const details = CHAMPION_DETAILS_DB[champId];
  if (!details) return null;

  return (
    <div className="flex flex-col gap-4 mt-2">
      <h3 className="text-xs text-slate-400 font-bold tracking-widest uppercase">Starter Cards</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {details.deck.map((card, idx) => (
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

const renderRelicTab = (relics: string[]) => {
  return (
    <div className="flex flex-col gap-4 mt-2">
      <h3 className="text-xs text-slate-400 font-bold tracking-widest uppercase">Equipped Relic Slots</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {relics.map((relic, idx) => (
          <div
            key={idx}
            className="bg-slate-950/80 border border-slate-900 rounded-xl p-4 flex flex-col gap-2 hover:border-slate-800"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              <span className="text-xs font-bold text-[#e5c17d]">{relic}</span>
            </div>
            <p className="text-[11px] text-[#8c9bb4] leading-relaxed italic">
              Equipped in slot {idx + 1}
            </p>
          </div>
        ))}
        {relics.length === 0 && (
          <div className="col-span-2 text-center py-6 bg-slate-950/40 border border-slate-900 border-dashed text-slate-500 text-xs italic">
            No relics equipped on this champion.
          </div>
        )}
      </div>
    </div>
  );
};

export default function ChampionsTab() {
  const [champSearch, setChampSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedChampId, setSelectedChampId] = useState(CHAMPIONS[0].id);
  const [activeDetailTab, setActiveDetailTab] = useState<"overview" | "constellation" | "level" | "deck" | "relic">("overview");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");

  // Reset selected constellation node when champion selection changes
  useEffect(() => {
    if (activeChamp) {
      const config = CHAMPION_CONSTELLATIONS[activeChamp.id];
      if (config && config.nodes.length > 0) {
        setSelectedNodeId(config.nodes[0].id);
      }
    }
  }, [selectedChampId]);

  const filteredChampions = CHAMPIONS.filter((champ) => {
    const matchesSearch = champ.name.toLowerCase().includes(champSearch.toLowerCase());
    const matchesRegion = selectedRegion === "All" || champ.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const regions = ["All", ...Array.from(new Set(CHAMPIONS.map((c) => c.region)))];

  // Derive the active champion. Fallback to first filtered champion if current selection is filtered out.
  const activeChamp = filteredChampions.find((c) => c.id === selectedChampId) || filteredChampions[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Split Layout Container */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* Left Column: Search & Vertical Champion List (1/3 width) */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 h-auto md:h-[750px]">

          {/* Search and Filters inside Left Column */}
          <div className="flex flex-col gap-3 bg-[#0a0f1d]/75 border border-slate-800/80 p-3.5 rounded-2xl backdrop-blur-sm">
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
                    className={`w-full text-left p-3.5 rounded-xl border flex items-center group cursor-pointer ${isSelected
                      ? "bg-gradient-to-r from-slate-900 to-slate-950 border-[#c29d53] shadow-[0_0_12px_rgba(194,157,83,0.08)] text-[#e5c17d]"
                      : "bg-[#0b0f1a]/60 border-slate-900 text-slate-300 hover:bg-[#0b0f1a] hover:border-slate-800 hover:text-slate-100"
                      }`}
                  >
                    <div className="flex items-center gap-3">
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
                          {Array.from({ length: 4 }).map((_, i) => (
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

        {/* Right Column: Detailed View (2/3 width) */}
        <div className="w-full md:w-2/3 h-auto md:h-[750px] flex flex-col">
          {activeChamp ? (
            <div className={`rounded-2xl bg-gradient-to-b ${activeChamp.color} p-0.5 overflow-hidden h-full flex flex-col`}>
              <div className="bg-[#0b0f1a]/95 rounded-2xl p-6 md:p-8 flex flex-col gap-5 relative overflow-hidden h-full">
                {/* Grid background mesh overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

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
                      {Array.from({ length: 4 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < activeChamp.stars ? "text-[#e5c17d]" : "text-slate-800"
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

                {/* Level and XP Meter (Always Visible) */}
                <div className="flex flex-col gap-2 z-10">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black font-mono tracking-tight text-[#e5c17d]">
                      LEVEL {activeChamp.level}
                    </span>
                    {activeChamp.maxXp > 0 ? (
                      <span className="text-xs text-slate-450 font-mono">
                        {activeChamp.xp} / {activeChamp.maxXp} XP
                      </span>
                    ) : (
                      <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
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
                    <div className="w-full bg-emerald-600/20 border border-emerald-500/20 rounded-full h-2">
                      <div className="bg-emerald-400 h-full rounded-full w-full shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
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
                  {activeDetailTab === "constellation" && renderConstellationTab(activeChamp.stars, activeChamp.id, selectedNodeId, setSelectedNodeId)}
                  {activeDetailTab === "level" && renderLevelTab(activeChamp.level)}
                  {activeDetailTab === "deck" && renderDeckTab(activeChamp.id)}
                  {activeDetailTab === "relic" && renderRelicTab(activeChamp.relics)}
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
