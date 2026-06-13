export const CURRENCY_INFO = {
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
} as const;

export type CurrencyType = keyof typeof CURRENCY_INFO;
