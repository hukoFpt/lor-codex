import { Champion } from "@/types";

interface OverviewTabProps {
  champion: Champion;
}

export default function OverviewTab({ champion }: OverviewTabProps) {
  const details = champion.overview;
  
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
          <h3 className="text-xs text-center text-slate-400 font-bold tracking-widest uppercase mb-1.5">Biography</h3>
          <p className="text-xs text-slate-300 leading-relaxed italic">
            &quot;{details.description}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
