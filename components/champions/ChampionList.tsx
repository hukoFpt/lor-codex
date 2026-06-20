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
      return "/icons/region/Demacia_LoR_Region.png";
    case "Freljord":
      return "/icons/region/Freljord_LoR_Region.png";
    case "Ionia":
      return "/icons/region/Ionia_LoR_Region.png";
    case "Noxus":
      return "/icons/region/Noxus_LoR_Region.png";
    case "Piltover & Zaun":
    case "Piltover":
    case "Zaun":
      return "/icons/region/Piltover_Zaun_LoR_Region.png";
    case "Runeterra":
      return "/icons/region/Runeterra_LoR_Region.png";
    case "Shadow Isles":
      return "/icons/region/Shadow_Isles_LoR_Region.png";
    case "Shurima":
      return "/icons/region/Shurima_LoR_Region.png";
    case "Targon":
      return "/icons/region/Targon_LoR_Region.png";
    case "Bandle City":
      return "/icons/region/Bandle_City_LoR_Region.png";
    case "Bilgewater":
      return "/icons/region/Bilgewater_LoR_Region.png";
    case "Spirit Blossom":
      return "/icons/region/Spirit_Blossom_LoR_Region.png";
    default:
      return null;
  }
};

export const getRegionGlowColor = (regionName: string) => {
  switch (regionName) {
    case "Demacia":
      return "#5d9cec"; // Steel Blue
    case "Freljord":
      return "#4fc1e9"; // Glacial Ice Cyan
    case "Ionia":
      return "#ff758f"; // Lotus Cherry Pink
    case "Noxus":
      return "#da4453"; // Crimson Red
    case "Piltover & Zaun":
    case "Piltover":
    case "Zaun":
      return "#f77f00"; // Tech Orange
    case "Shadow Isles":
      return "#37bc9b"; // Spectral Teal/Green
    case "Shurima":
      return "#e5c17d"; // Sun Disc Gold
    case "Targon":
      return "#b79ced"; // Cosmic Purple/Lilac
    case "Bandle City":
      return "#8cc152"; // Woodland Green
    case "Bilgewater":
      return "#d68c45"; // Amber Gold
    case "Spirit Blossom":
      return "#ffb3c6"; // Pastel Blossom Pink
    case "Runeterra":
    default:
      return "#c29d53"; // Runeterra Gold / Default
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
    <div className={`w-full transition-all duration-300 ${isListCollapsed ? "md:w-[80px]" : "md:w-1/3"} flex flex-col gap-4 h-auto md:h-full`}>
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
              <div className="flex overflow-x-auto gap-1.5 scrollbar-none pb-1 select-none">
                {regions.map((reg) => {
                  const iconPath = getRegionIconPath(reg);
                  const glowColor = getRegionGlowColor(reg);
                  const isSelected = selectedRegion === reg;

                  if (iconPath) {
                    return (
                      <button
                        key={reg}
                        onClick={() => setSelectedRegion(reg)}
                        className={`w-9 h-9 shrink-0 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? ""
                            : "bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40"
                        }`}
                        style={isSelected ? {
                          backgroundColor: `${glowColor}15`,
                          borderColor: glowColor,
                          boxShadow: `0 0 12px ${glowColor}40`
                        } : undefined}
                        title={reg}
                      >
                        <img
                          src={iconPath}
                          alt={reg}
                          className={`w-6 h-6 object-contain transition-all duration-200 ${isSelected ? "opacity-100 scale-110" : "opacity-60 hover:opacity-90"}`}
                          style={isSelected ? {
                            filter: `drop-shadow(0 0 4px ${glowColor})`
                          } : undefined}
                        />
                      </button>
                    );
                  }
                  return (
                    <button
                      key={reg}
                      onClick={() => setSelectedRegion(reg)}
                      className={`w-9 h-9 shrink-0 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? ""
                          : "bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 text-slate-400 hover:text-slate-200"
                      }`}
                      style={isSelected ? {
                        backgroundColor: `${glowColor}15`,
                        borderColor: glowColor,
                        color: glowColor,
                        boxShadow: `0 0 12px ${glowColor}40`
                      } : undefined}
                      title={reg}
                    >
                      <span className="text-[10px] font-mono font-black uppercase tracking-tighter">
                        {reg === "All" ? "ALL" : reg.substring(0, 3)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Vertical Champion List Container */}
      <div className="flex-1 min-h-0 relative">
        <div className="h-full overflow-y-auto pr-1 flex flex-col gap-2 pt-8 pb-10">
          {filteredChampions.length > 0 ? (
            filteredChampions.map((champ) => {
              const isSelected = activeChamp && champ.id === activeChamp.id;
              const isLocked = champ.stars === 0;
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
                  className={`w-full h-[74px] shrink-0 text-left rounded-xl border-2 flex items-center group cursor-pointer relative overflow-hidden transition-all duration-300 ${
                    isListCollapsed ? "p-1.5 justify-center" : "p-3"
                  } ${
                    isSelected
                      ? "bg-gradient-to-r from-slate-900 to-slate-950 border-[#c29d53] shadow-[0_0_12px_rgba(194,157,83,0.08)] text-[#e5c17d]"
                      : "bg-[#0b0f1a]/60 border-slate-900/60 text-slate-300 hover:bg-[#0b0f1a] hover:border-slate-800 hover:text-slate-100"
                  } ${isLocked ? "grayscale opacity-50 hover:grayscale-[40%] hover:opacity-80" : "opacity-100"}`}
                  title={isListCollapsed ? champ.name : undefined}
                >
                  {/* Faded Background Art */}
                  {!isListCollapsed && champ.backgroundImage && (
                    <div
                      className="absolute top-0 bottom-0 right-0 w-[380px] pointer-events-none opacity-80 mix-blend-lighten z-0 bg-cover transition-opacity group-hover:opacity-75"
                      style={{
                        backgroundImage: `url(${champ.backgroundImage})`,
                        backgroundPosition: 'right center',
                        maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                        WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
                      }}
                    />
                  )}

                  {isListCollapsed ? (
                    <div className="relative z-10 flex items-center justify-center">
                      {champ.portraitImage || champ.backgroundImage ? (
                        <div className={`w-11 h-11 rounded-full border-2 bg-slate-950 flex-shrink-0 relative transition-all duration-300 ${
                          isSelected ? "border-[#c29d53] scale-105" : "border-slate-800 group-hover:border-slate-700"
                        }`}>
                          <div
                            className={`absolute inset-0.5 rounded-full overflow-hidden bg-cover ${champ.portraitImage ? "scale-100" : "scale-[2.2] origin-[50%_25%]"}`}
                            style={{
                              backgroundImage: `url(${champ.portraitImage || champ.backgroundImage})`,
                              backgroundPosition: 'center',
                            }}
                          />
                        </div>
                      ) : (
                        <div className={`w-11 h-11 rounded-full bg-gradient-to-tr from-slate-900 via-slate-950 to-black flex items-center justify-center border transition-colors ${isSelected ? "border-[#c29d53]" : "border-slate-800 group-hover:border-slate-700"
                          }`}>
                          <span className="text-sm font-bold text-slate-100 font-mono">
                            {champ.level}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 relative z-10">
                      {/* Level emblem block showing XP progress with symmetrical square border fill */}
                      {(() => {
                        const isLocked = champ.stars === 0;
                        const xpPercent = isLocked ? 0 : (champ.maxXp > 0 ? (champ.xp / champ.maxXp) * 100 : 0);
                        const activeColor = isSelected ? "#e5c17d" : "#c29d53";
                        const baseColor = isLocked ? "#1e293b" : (isSelected ? "#1e293b" : "#0f172a");
                        return (
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden bg-[#0b0f1a]"
                            style={{
                              boxShadow: !isLocked && isSelected ? `0 0 8px ${activeColor}20` : undefined
                            }}
                          >
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                              {/* Background left half */}
                              <path
                                d="M 24 46.5 L 8 46.5 A 6.5 6.5 0 0 1 1.5 40 L 1.5 8 A 6.5 6.5 0 0 1 8 1.5 L 24 1.5"
                                fill="none"
                                stroke={baseColor}
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                              {/* Background right half */}
                              <path
                                d="M 24 46.5 L 40 46.5 A 6.5 6.5 0 0 0 46.5 40 L 46.5 8 A 6.5 6.5 0 0 0 40 1.5 L 24 1.5"
                                fill="none"
                                stroke={baseColor}
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                              {/* Progress left half */}
                              {!isLocked && xpPercent > 0 && (
                                <path
                                  d="M 24 46.5 L 8 46.5 A 6.5 6.5 0 0 1 1.5 40 L 1.5 8 A 6.5 6.5 0 0 1 8 1.5 L 24 1.5"
                                  fill="none"
                                  stroke={activeColor}
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeDasharray="85"
                                  strokeDashoffset={85 * (1 - xpPercent / 100)}
                                  className="transition-all duration-300"
                                />
                              )}
                              {/* Progress right half */}
                              {!isLocked && xpPercent > 0 && (
                                <path
                                  d="M 24 46.5 L 40 46.5 A 6.5 6.5 0 0 0 46.5 40 L 46.5 8 A 6.5 6.5 0 0 0 40 1.5 L 24 1.5"
                                  fill="none"
                                  stroke={activeColor}
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeDasharray="85"
                                  strokeDashoffset={85 * (1 - xpPercent / 100)}
                                  className="transition-all duration-300"
                                />
                              )}
                            </svg>
                            {isLocked ? (
                              <svg className="w-5 h-5 text-slate-500 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            ) : (
                              <span className="text-xl font-bold text-slate-100 font-mono z-10">
                                {champ.level}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                      
                      {/* Region Badge */}
                      {(() => {
                        const regions = Array.isArray(champ.region) ? champ.region : [champ.region];
                        if (regions.length === 1) {
                          const iconPath = getRegionIconPath(regions[0]);
                          const color = getRegionGlowColor(regions[0]);
                          return (
                            <div
                              className="w-12 h-12 flex items-center justify-center bg-[#0b0f1a]/45 border rounded-lg flex-shrink-0 relative transition-all duration-300"
                              style={{
                                borderColor: isSelected ? color : `${color}40`,
                                boxShadow: isSelected ? `0 0 10px ${color}50` : undefined
                              }}
                            >
                              {iconPath ? (
                                <img
                                  src={iconPath}
                                  alt={regions[0]}
                                  className="w-7.5 h-7.5 object-contain transition-all duration-300"
                                  style={{
                                    filter: isSelected ? `drop-shadow(0 0 4px ${color})` : undefined
                                  }}
                                />
                              ) : (
                                <span className="text-[10px] font-mono font-black uppercase text-slate-500">{regions[0].substring(0, 3)}</span>
                              )}
                            </div>
                          );
                        } else {
                          const icon1 = getRegionIconPath(regions[0]);
                          const icon2 = getRegionIconPath(regions[1]);
                          const color1 = getRegionGlowColor(regions[0]);
                          const color2 = getRegionGlowColor(regions[1]);
                          return (
                            <div
                              className="w-12 h-12 rounded-lg flex-shrink-0 relative overflow-hidden transition-all duration-300"
                              style={{
                                border: '1px solid transparent',
                                backgroundImage: `linear-gradient(to bottom right, #0b0f1a, #0b0f1a), linear-gradient(to bottom right, ${isSelected ? color1 : `${color1}40`}, ${isSelected ? color2 : `${color2}40`})`,
                                backgroundClip: 'padding-box, border-box',
                                backgroundOrigin: 'padding-box, border-box',
                                boxShadow: isSelected ? `0 0 10px ${color1}30` : undefined
                              }}
                            >
                              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 48 48">
                                <line x1="14" y1="34" x2="34" y2="14" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                              <div className="absolute top-0.5 left-0.5 w-6 h-6 flex items-center justify-center z-10">
                                {icon1 ? (
                                  <img
                                    src={icon1}
                                    alt={regions[0]}
                                    className="w-5 h-5 object-contain transition-all duration-300"
                                    style={{
                                      filter: isSelected ? `drop-shadow(0 0 3px ${color1})` : undefined
                                    }}
                                  />
                                ) : (
                                  <span className="text-[8px] font-mono font-black text-slate-500">{regions[0].substring(0, 2)}</span>
                                )}
                              </div>
                              <div className="absolute bottom-0.5 right-0.5 w-6 h-6 flex items-center justify-center z-10">
                                {icon2 ? (
                                  <img
                                    src={icon2}
                                    alt={regions[1]}
                                    className="w-5 h-5 object-contain transition-all duration-300"
                                    style={{
                                      filter: isSelected ? `drop-shadow(0 0 3px ${color2})` : undefined
                                    }}
                                  />
                                ) : (
                                  <span className="text-[8px] font-mono font-black text-slate-500">{regions[1].substring(0, 2)}</span>
                                )}
                              </div>
                            </div>
                          );
                        }
                      })()}
                      
                      <div>
                        <h4 className="font-bold text-md">{champ.name}</h4>
                        {/* Star rating moved under name */}
                        <div className="flex flex-col gap-0.5 mt-0.5">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: getConstellationMaxStars(champ) }).map((_, i) => {
                              const activeColor = "#e5c17d";
                              return (
                                <svg
                                  key={i}
                                  className="w-2.5 h-2.5 transition-all duration-300"
                                  style={{
                                    color: i < champ.stars ? activeColor : 'rgb(30, 41, 59)',
                                    filter: i < champ.stars ? `drop-shadow(0 0 1.5px ${activeColor})` : undefined
                                  }}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              );
                            })}
                          </div>
                          {/* Bonus Stats Dots */}
                          {(() => {
                            const bonusNodes = champ.constellation?.nodes?.filter(n => n.upgradeType === "Bonus Stat") || [];
                            if (bonusNodes.length === 0) return null;
                            return (
                              <div className="flex items-center gap-1 mt-0.5">
                                {bonusNodes.map((node) => {
                                  const isUnlocked = champ.unlockedNodes?.includes(node.id);
                                  const dotColor = node.color === "blue" ? "#38bdf8" : node.color === "purple" ? "#b79ced" : "#e5c17d";
                                  return (
                                    <svg
                                      key={node.id}
                                      className="w-2 h-2 transition-all duration-300"
                                      style={{
                                        color: isUnlocked ? dotColor : '#1e293b',
                                        filter: isUnlocked ? `drop-shadow(0 0 1px ${dotColor})` : undefined
                                      }}
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <title>{node.title}</title>
                                      <path d="M12 2c0 5.523 4.477 10 10 10-5.523 0-10 4.477-10 10 0-5.523-4.477-10-10-10 5.523 0 10-4.477 10-10z" />
                                    </svg>
                                  );
                                })}
                              </div>
                            );
                          })()}
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
        {/* Top Fade Overlay */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black to-transparent pointer-events-none z-20" />
        {/* Bottom Fade Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
      </div>
    </div>
  );
}
