import { Adventure } from "@/types";

const ADVENTURES: Adventure[] = [
  {
    id: "a1",
    name: "Aurelion Sol's Cosmic Descent",
    stars: 4.0,
    region: "Targon",
    completed: true,
    completedWith: ["Jinx", "Yasuo", "Aurelion Sol"],
    rewards: ["Golden Reliquary", "5000 XP"],
    status: "Completed",
  },
  {
    id: "a2",
    name: "Galio's Colossus Stand",
    stars: 3.5,
    region: "Demacia",
    completed: true,
    completedWith: ["Yasuo", "Aurelion Sol"],
    rewards: ["Platinum Vault", "3000 XP"],
    status: "Completed",
  },
  {
    id: "a3",
    name: "Kai'Sa's Void Breach",
    stars: 3.0,
    region: "Shurima",
    completed: true,
    completedWith: ["Jinx"],
    rewards: ["Gold Vault", "2500 XP"],
    status: "Completed",
  },
  {
    id: "a4",
    name: "Thresh's Shadow Isles",
    stars: 2.0,
    region: "Shadow Isles",
    completed: true,
    completedWith: ["Lux: Illuminated", "Miss Fortune"],
    rewards: ["Silver Vault", "1500 XP"],
    status: "Completed",
  },
  {
    id: "a5",
    name: "Lulu's Magical Meadow",
    stars: 1.0,
    region: "Ionia",
    completed: false,
    completedWith: [],
    rewards: ["Bronze Vault", "500 XP"],
    status: "In Progress",
  },
  {
    id: "a6",
    name: "Weekly Nightmare Portal",
    stars: 5.5,
    region: "Runeterra",
    completed: false,
    completedWith: [],
    rewards: ["Epic Relic Fragment", "8000 XP"],
    status: "Locked",
  },
];

export default function AdventuresTab() {
  const completedCount = ADVENTURES.filter(a => a.status === "Completed").length;
  const inProgressCount = ADVENTURES.filter(a => a.status === "In Progress").length;
  const lockedCount = ADVENTURES.filter(a => a.status === "Locked").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary details */}
      <div className="bg-[#0a0f1d] border border-slate-800/80 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-[#c29d53]/30 flex items-center justify-center text-[#e5c17d]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-100">Path Campaign Progress</h3>
            <p className="text-xs text-slate-400 mt-0.5">Explore adventure nodes and unlock champion rewards.</p>
          </div>
        </div>
        <div className="flex items-center gap-8 text-center">
          <div className="flex flex-col">
            <span className="text-2xl font-black font-mono text-[#e5c17d]">{completedCount} / {ADVENTURES.length}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Completed</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="flex flex-col">
            <span className="text-2xl font-black font-mono text-emerald-400">{inProgressCount}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">In Progress</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="flex flex-col">
            <span className="text-2xl font-black font-mono text-rose-500">{lockedCount}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Locked</span>
          </div>
        </div>
      </div>

      {/* Adventures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ADVENTURES.map((adv) => (
          <div
            key={adv.id}
            className={`relative rounded-2xl bg-[#0b0f1a] border ${
              adv.status === "Completed"
                ? "border-slate-800/80 hover:border-[#c29d53]/40"
                : adv.status === "In Progress"
                ? "border-amber-600/50 hover:border-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.05)]"
                : "border-slate-900 opacity-60 hover:opacity-75"
            }`}
          >
            {/* Status Indicator Bar */}
            <div className={`h-1 w-full rounded-t-2xl ${
              adv.status === "Completed"
                ? "bg-emerald-500"
                : adv.status === "In Progress"
                ? "bg-amber-500"
                : "bg-slate-700"
            }`} />

            {/* Card Content */}
            <div className="p-5 flex flex-col justify-between h-full gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-mono bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                    {adv.region}
                  </span>
                  
                  {/* Status badge */}
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    adv.status === "Completed"
                      ? "text-emerald-400"
                      : adv.status === "In Progress"
                      ? "text-amber-400"
                      : "text-slate-500"
                  }`}>
                    {adv.status}
                  </span>
                </div>

                <h4 className="font-bold text-slate-100 text-lg mt-1">{adv.name}</h4>
                
                {/* Star Rating Display */}
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs text-slate-400 mr-1">Difficulty:</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(adv.stars)
                            ? "text-amber-500"
                            : i === Math.floor(adv.stars) && adv.stars % 1 !== 0
                            ? "text-amber-500/60"
                            : "text-slate-700"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-[#e5c17d] font-bold font-mono ml-1">{adv.stars}★</span>
                </div>
              </div>

              {/* Completion History & Rewards */}
              <div className="flex flex-col gap-3.5 border-t border-slate-900 pt-4 mt-1">
                {adv.completedWith.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cleared With</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {adv.completedWith.map((champ, index) => (
                        <span key={index} className="text-xs bg-[#c29d53]/10 border border-[#c29d53]/25 text-[#e5c17d] px-2.5 py-0.5 rounded-full font-medium">
                          {champ}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rewards</span>
                  <div className="flex flex-wrap gap-1.5">
                    {adv.rewards.map((reward, index) => (
                      <span key={index} className="text-xs bg-slate-950 border border-slate-900 text-slate-300 px-2 py-0.5 rounded font-mono">
                        {reward}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
