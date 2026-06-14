import { Champion } from "@/types";
import PlayStyleIcon from "./PlayStyleIcon";

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
          {/* Play Style */}
          <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-4 flex flex-col items-center text-center justify-between min-h-[120px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Play Style</span>
            <div className="flex items-center justify-center h-6">
              <PlayStyleIcon playStyle={details.playStyle} />
            </div>
            <span className={`text-base font-bold leading-none ${
              details.playStyle === "Combo"
                ? "text-[#ff9f43]"
                : details.playStyle === "Aggressive"
                  ? "text-[#ff4d4d]"
                  : details.playStyle === "Defensive"
                    ? "text-[#00d0ff]"
                    : details.playStyle === "Balanced"
                      ? "text-[#c084fc]"
                      : "text-[#e5c17d]"
            }`}>
              {details.playStyle}
            </span>
          </div>

          {/* Difficulty */}
          <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-4 flex flex-col items-center text-center justify-between min-h-[120px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Difficulty</span>
            
            {/* Difficulty Bar Indicators (4 Levels) - Align height with playstyle icon */}
            <div className="flex gap-1 justify-center items-center h-6">
              {Array.from({ length: 4 }).map((_, idx) => {
                const step = idx + 1;
                const difficultyMap: Record<string, number> = {
                  Easy: 1,
                  Medium: 2,
                  Hard: 3,
                  Deadly: 4,
                  Epic: 4
                };
                const activeLevel = difficultyMap[details.difficulty] || 1;
                const isActive = step <= activeLevel;

                const activeColor = details.difficulty === "Easy"
                  ? "bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.9)]"
                  : details.difficulty === "Medium"
                    ? "bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.9)]"
                    : "bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.9)]";

                return (
                  <div
                    key={idx}
                    className={`w-[8px] h-6 rounded-[2px] -skew-x-12 transition-all duration-300 ${isActive
                        ? activeColor
                        : "bg-slate-500"
                      }`}
                  />
                );
              })}
            </div>

            <span className={`text-base font-extrabold tracking-wide leading-none ${details.difficulty === "Easy"
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
