import { Champion } from "@/types";
import { getConstellationMaxStars } from "@/utils/constellation";

interface ChampionListProps {
  filteredChampions: Champion[];
  activeChamp: Champion | undefined;
  setSelectedChampId: (id: string) => void;
  isListCollapsed: boolean;
  setIsListCollapsed: (collapsed: boolean) => void;
  champSearch: string;
  setChampSearch: (search: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  regions: string[];
}

const getRegionIconPath = (regionName: string) => {
  switch (regionName) {
    case "Demacia":
      return "/icons/region/120px-Demacia_LoR_Region.png";
    case "Freljord":
      return "/icons/region/120px-Freljord_LoR_Region.png";
    case "Ionia":
      return "/icons/region/120px-Ionia_LoR_Region.png";
    case "Noxus":
      return "/icons/region/120px-Noxus_LoR_Region.png";
    case "Piltover & Zaun":
    case "Piltover":
    case "Zaun":
      return "/icons/region/120px-Piltover_Zaun_LoR_Region.png";
    case "Runeterra":
      return "/icons/region/120px-Runeterra_LoR_Region.png";
    case "Shadow Isles":
      return "/icons/region/120px-Shadow_Isles_LoR_Region.png";
    case "Shurima":
      return "/icons/region/120px-Shurima_LoR_Region.png";
    case "Targon":
      return "/icons/region/120px-Targon_LoR_Region.png";
    case "Bandle City":
      return "/icons/region/Bandle_City_LoR_Region.png";
    case "Bilgewater":
      return "/icons/region/Bilgewater_LoR_Region.png";
    default:
      return null;
  }
};

export default function ChampionList({
  filteredChampions,
  activeChamp,
  setSelectedChampId,
  isListCollapsed,
  setIsListCollapsed,
  champSearch,
  setChampSearch,
  selectedRegion,
  setSelectedRegion,
  regions
}: ChampionListProps) {
  return (
    <div className={`w-full transition-all duration-300 ${isListCollapsed ? "md:w-[80px]" : "md:w-1/3"} flex flex-col gap-4 h-auto md:h-[700px]`}>
      {/* Search and Filters inside Left Column */}
      <div className="flex flex-col gap-3 bg-[#0a0f1d]/75 border border-slate-800/80 p-3.5 rounded-2xl backdrop-blur-sm">
        {/* Header / Collapse Toggle */}
        <div className={`flex items-center ${isListCollapsed ? "justify-center" : "justify-between"} border-b border-slate-900/60`}>
          {!isListCollapsed && (
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Champions</span>
          )}
          <button
            onClick={() => setIsListCollapsed(!isListCollapsed)}
            className="p-1.5 rounded-lg border border-slate-800 bg-[#050810] hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title={isListCollapsed ? "Expand List" : "Collapse List"}
          >
            {isListCollapsed ? (
              // Expand icon (chevron right)
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            ) : (
              // Collapse icon (chevron left)
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
              </svg>
            )}
          </button>
        </div>

        {!isListCollapsed && (
          <>
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
                {regions.map((reg) => {
                  const iconPath = getRegionIconPath(reg);
                  if (iconPath) {
                    return (
                      <button
                        key={reg}
                        onClick={() => setSelectedRegion(reg)}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer ${selectedRegion === reg
                          ? "bg-[#c29d53]/15 border-[#c29d53] shadow-[0_0_10px_rgba(194,157,83,0.25)]"
                          : "bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40"
                          }`}
                        title={reg}
                      >
                        <img
                          src={iconPath}
                          alt={reg}
                          className={`w-6 h-6 object-contain transition-all duration-200 ${selectedRegion === reg ? "opacity-100 scale-110 drop-shadow-[0_0_3px_#c29d53]" : "opacity-60 hover:opacity-90"}`}
                        />
                      </button>
                    );
                  }
                  return (
                    <button
                      key={reg}
                      onClick={() => setSelectedRegion(reg)}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer ${selectedRegion === reg
                        ? "bg-[#c29d53]/15 border-[#c29d53] shadow-[0_0_10px_rgba(194,157,83,0.25)] text-[#e5c17d]"
                        : "bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 text-slate-400 hover:text-slate-200"
                        }`}
                      title="All Regions"
                    >
                      <span className="text-[10px] font-mono font-black uppercase tracking-tighter">ALL</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
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
                className={`w-full text-left rounded-xl border flex items-center group cursor-pointer relative overflow-hidden transition-all duration-300 ${isListCollapsed ? "p-2 justify-center" : "p-3.5"
                  } ${isSelected
                    ? "bg-gradient-to-r from-slate-900 to-slate-950 border-[#c29d53] shadow-[0_0_12px_rgba(194,157,83,0.08)] text-[#e5c17d]"
                    : "bg-[#0b0f1a]/60 border-slate-900 text-slate-300 hover:bg-[#0b0f1a] hover:border-slate-800 hover:text-slate-100"
                  }`}
                title={isListCollapsed ? champ.name : undefined}
              >
                {/* Faded Background Art */}
                {!isListCollapsed && champ.backgroundImage && (
                  <div
                    className="absolute right-0 top-0 bottom-0 w-2/3 pointer-events-none opacity-80 mix-blend-lighten z-0 bg-cover transition-opacity group-hover:opacity-75"
                    style={{
                      backgroundImage: `url(${champ.backgroundImage})`,
                      backgroundPosition: champ.backgroundPosition || 'right top',
                      maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)',
                      WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)'
                    }}
                  />
                )}

                {isListCollapsed ? (
                  <div className="relative z-10 flex items-center justify-center">
                    {champ.backgroundImage ? (
                      <div className={`w-11 h-11 rounded-full overflow-hidden border flex-shrink-0 relative transition-colors ${isSelected ? "border-[#c29d53]" : "border-slate-800 group-hover:border-slate-700"
                        }`}>
                        <div
                          className="absolute inset-0 bg-cover scale-[2.2] origin-[50%_25%]"
                          style={{
                            backgroundImage: `url(${champ.backgroundImage})`,
                            backgroundPosition: champ.backgroundPosition || 'center',
                          }}
                        />
                      </div>
                    ) : (
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${champ.color} flex items-center justify-center border transition-colors ${isSelected ? "border-[#c29d53]" : "border-slate-800 group-hover:border-slate-700"
                        }`}>
                        <span className="text-sm font-bold text-slate-100 font-mono">
                          {champ.level}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 relative z-10">
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
                        {Array.from({ length: getConstellationMaxStars(champ) }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-2.5 h-2.5 ${i < champ.stars ? "text-[#e5c17d]" : "text-slate-800"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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
  );
}
