import { Champion } from "@/types";

interface DeckTabProps {
  champion: Champion;
}

export default function DeckTab({ champion }: DeckTabProps) {
  const deck = champion.deck;
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
}
