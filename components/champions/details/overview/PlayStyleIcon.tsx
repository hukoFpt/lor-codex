interface PlayStyleIconProps {
  playStyle: string;
  className?: string;
}

export default function PlayStyleIcon({ playStyle, className = "w-6 h-6" }: PlayStyleIconProps) {
  if (playStyle === "Combo") {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="comboOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffb03a" />
            <stop offset="100%" stopColor="#e67e22" />
          </linearGradient>
        </defs>
        {/* Card 1 (Back) - Bottom Left Outline */}
        <path d="M5 13 V26 A2 2 0 0 0 7 28 H17" stroke="#e67e22" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
        {/* Card 2 (Middle) - Bottom Left Outline */}
        <path d="M10 8 V21 A2 2 0 0 0 12 23 H22" stroke="#e67e22" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
        {/* Card 3 (Front) - Full Filled Rect */}
        <rect x="15" y="3" width="12" height="17" rx="2" fill="url(#comboOrange)" stroke="#d35400" strokeWidth="1" />
      </svg>
    );
  }

  if (playStyle === "Aggressive") {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="aggressiveRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff5c33" />
            <stop offset="100%" stopColor="#d62211" />
          </linearGradient>
        </defs>
        {/* Left Eye */}
        <path d="M4 6 C5.5 14 11 27 18 24 C14.5 20.5 13 16.5 13 13 C11.5 9.5 9 9 4 6 Z" fill="url(#aggressiveRed)" stroke="#7a0e05" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Right Eye */}
        <path d="M28 6 C26.5 14 21 27 14 24 C17.5 20.5 19 16.5 19 13 C20.5 9.5 23 9 28 6 Z" fill="url(#aggressiveRed)" stroke="#7a0e05" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    );
  }

  if (playStyle === "Defensive") {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="defensiveBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7ee8fa" />
            <stop offset="100%" stopColor="#00bfff" />
          </linearGradient>
        </defs>
        {/* Base of the Rook */}
        <path d="M5 29 L27 29 L25 25 L7 25 Z" fill="url(#defensiveBlue)" stroke="#0080a8" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Body/Neck */}
        <path d="M8 25 L24 25 L21 13 L11 13 Z" fill="url(#defensiveBlue)" stroke="#0080a8" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Top crenellation (battlement) */}
        <path d="M7 13 L25 13 L25 3 L21 3 L21 6.5 L18 6.5 L18 3 L14 3 L14 6.5 L11 6.5 L11 3 L7 3 Z" fill="url(#defensiveBlue)" stroke="#0080a8" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    );
  }

  if (playStyle === "Balanced") {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="balancedPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d8b4fe" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        {/* Top Right Swirl */}
        <path d="M16 4 C22 4 27 9 27 15 C27 20 23 23 20 23 C18.5 23 18.5 21 20.5 19 C22.5 17 22.5 13.5 19.5 12 C16.5 10.5 13 13.5 13 16.5 C13 13.5 14.5 9 16 4 Z" fill="url(#balancedPurple)" stroke="#7e22ce" strokeWidth="1" />
        {/* Bottom Left Swirl */}
        <path d="M16 28 C10 28 5 23 5 17 C5 12 9 9 12 9 C13.5 9 13.5 11 11.5 13 C9.5 15 9.5 18.5 12.5 20 C15.5 21.5 19 18.5 19 15.5 C19 18.5 17.5 23 16 28 Z" fill="url(#balancedPurple)" stroke="#7e22ce" strokeWidth="1" />
      </svg>
    );
  }

  return null;
}
