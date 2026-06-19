interface RelicTabProps {
  relics: string[];
  onUpdateRelics: (newRelics: string[]) => void;
}

export default function RelicTab({ relics, onUpdateRelics }: RelicTabProps) {
  return (
    <div className="flex flex-col gap-4 mt-2">
      <h3 className="text-xs text-slate-400 font-bold tracking-widest uppercase">Equipped Relic Slots</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {relics.map((relic, idx) => (
          <div
            key={idx}
            className="bg-slate-950/80 border border-slate-900 rounded-xl p-4 flex flex-col gap-3 hover:border-slate-800 transition-all group relative"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <input
                  type="text"
                  value={relic}
                  onChange={(e) => {
                    const nextRelics = [...relics];
                    nextRelics[idx] = e.target.value;
                    onUpdateRelics(nextRelics);
                  }}
                  placeholder={`Relic #${idx + 1}`}
                  className="bg-transparent border-b border-transparent hover:border-slate-800 focus:border-[#c29d53] text-xs font-bold text-[#e5c17d] outline-none py-0.5 w-full transition-all"
                />
              </div>
              <button
                onClick={() => {
                  const nextRelics = relics.filter((_, i) => i !== idx);
                  onUpdateRelics(nextRelics);
                }}
                className="text-slate-500 hover:text-rose-450 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1"
                title="Remove Relic"
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <p className="text-[11px] text-[#8c9bb4] leading-relaxed italic">
              Equipped in slot {idx + 1}
            </p>
          </div>
        ))}
        {relics.length < 3 && (
          <button
            onClick={() => {
              onUpdateRelics([...relics, ""]);
            }}
            className="flex flex-col items-center justify-center border border-dashed border-slate-800 hover:border-[#c29d53]/55 hover:bg-[#c29d53]/5 rounded-xl p-6 text-slate-500 hover:text-[#e5c17d] transition-all gap-1.5 cursor-pointer min-h-[92px]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs font-bold font-mono uppercase tracking-wider">Add Relic Slot</span>
          </button>
        )}
      </div>
      {relics.length === 0 && (
        <div className="text-center py-6 bg-slate-950/40 border border-slate-900 border-dashed text-slate-500 text-xs italic rounded-xl">
          No relics equipped. Add one above!
        </div>
      )}
    </div>
  );
}
