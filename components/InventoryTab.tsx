"use client";

import { useState } from "react";
import { Relic, Currency } from "@/types";

const INVENTORY = {
  relics: [
    {
      id: "r1",
      name: "The Star Forge",
      rarity: "epic",
      effect: "+1 Starting Mana. Titanic allies have +1/+1 and Overwhelm.",
      quantity: 1,
    },
    {
      id: "r2",
      name: "Corrupted Star Fragment",
      rarity: "rare",
      effect: "Support: Kill my supported ally and grant me their stats and keywords.",
      quantity: 1,
    },
    {
      id: "r3",
      name: "Luden's Tempest",
      rarity: "rare",
      effect: "All your spells and skills deal 1 additional damage.",
      quantity: 2,
    },
    {
      id: "r4",
      name: "Loose Cannon's Payload",
      rarity: "rare",
      effect: "Play: Discard your hand, then replace it with Super Mega Death Rockets!",
      quantity: 1,
    },
    {
      id: "r5",
      name: "Tempest Blade",
      rarity: "rare",
      effect: "Level Up: Stun all enemies.",
      quantity: 1,
    },
    {
      id: "r6",
      name: "Everfrost",
      rarity: "common",
      effect: "When I'm summoned, Stun the strongest enemy.",
      quantity: 3,
    },
    {
      id: "r7",
      name: "Warmog's Armor",
      rarity: "common",
      effect: "Regeneration.",
      quantity: 2,
    },
  ] as Relic[],
  currencies: [
    {
      id: "c1",
      name: "Stardust",
      amount: 3450,
      description: "Used to buy Epic Relics and Golden Relic Reliquaries in the Emporium.",
      rarity: "epic",
    },
    {
      id: "c2",
      name: "Wild Fragments",
      amount: 32,
      description: "Universal fragments used to unlock or star-up any champion.",
      rarity: "rare",
    },
    {
      id: "c3",
      name: "Orange Essence",
      amount: 150,
      description: "Used for cosmetic skins, card styling, and premium upgrades.",
      rarity: "common",
    },
    {
      id: "c4",
      name: "Silver Vaults",
      amount: 2,
      description: "Unopened champion vaults containing random fragments and shards.",
      rarity: "common",
    },
  ] as Currency[],
};

export default function InventoryTab() {
  const [inventoryFilter, setInventoryFilter] = useState<"all" | "relics" | "currencies">("all");

  return (
    <div className="flex flex-col gap-8">
      {/* Filter Toggle */}
      <div className="flex gap-2 bg-[#090d16] p-1 border border-slate-800 rounded-xl w-fit self-center">
        <button
          onClick={() => setInventoryFilter("all")}
          className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase ${
            inventoryFilter === "all"
              ? "bg-[#c29d53]/15 text-[#e5c17d] border border-[#c29d53]/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setInventoryFilter("relics")}
          className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase ${
            inventoryFilter === "relics"
              ? "bg-[#c29d53]/15 text-[#e5c17d] border border-[#c29d53]/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Relics
        </button>
        <button
          onClick={() => setInventoryFilter("currencies")}
          className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase ${
            inventoryFilter === "currencies"
              ? "bg-[#c29d53]/15 text-[#e5c17d] border border-[#c29d53]/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Currencies
        </button>
      </div>

      {/* Currencies Section */}
      {(inventoryFilter === "all" || inventoryFilter === "currencies") && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-slate-200 uppercase tracking-widest">Resources & Currencies</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INVENTORY.currencies.map((curr) => (
              <div
                key={curr.id}
                className="bg-[#0b0f1a] border border-slate-800/80 hover:border-[#c29d53]/40 hover:shadow-[0_0_15px_rgba(194,157,83,0.05)] rounded-2xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      curr.rarity === "epic"
                        ? "bg-purple-950/40 text-purple-400 border-purple-800/40"
                        : curr.rarity === "rare"
                        ? "bg-blue-950/40 text-blue-400 border-blue-800/40"
                        : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}>
                      {curr.rarity}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-200 text-lg">{curr.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{curr.description}</p>
                </div>
                <div className="text-2xl font-extrabold font-mono text-[#e5c17d] tracking-tight bg-slate-950/50 p-2.5 rounded-lg text-center border border-slate-900">
                  {curr.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Relics Section */}
      {(inventoryFilter === "all" || inventoryFilter === "relics") && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-bold text-slate-200 uppercase tracking-widest">Relics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INVENTORY.relics.map((relic) => (
              <div
                key={relic.id}
                className="bg-[#0b0f1a] border border-slate-800/80 hover:border-slate-700 hover:-translate-y-0.5 rounded-2xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      relic.rarity === "epic"
                        ? "bg-purple-950/40 text-purple-400 border-purple-800/40 shadow-[0_0_10px_rgba(147,51,234,0.1)]"
                        : relic.rarity === "rare"
                        ? "bg-blue-950/40 text-blue-400 border-blue-800/40"
                        : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}>
                      {relic.rarity}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Qty: {relic.quantity}</span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-lg group-hover:text-[#e5c17d]">{relic.name}</h4>
                  <div className="bg-[#05070e] border border-slate-900 rounded-lg p-3">
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{relic.effect}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
