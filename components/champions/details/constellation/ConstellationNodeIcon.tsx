interface ConstellationNodeIconProps {
  nodeId: string;
  type: string;
  isUnlocked: boolean;
  color?: "blue" | "purple";
  isStarPower?: boolean;
}

export default function ConstellationNodeIcon({
  nodeId,
  type,
  isUnlocked,
  color,
  isStarPower
}: ConstellationNodeIconProps) {
  const isPurpleStar = type === "purple-star";
  const gradId = `star-glow-${nodeId}`;

  if (!isStarPower) {
    return (
      <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <defs>
          <radialGradient id={gradId} gradientUnits="userSpaceOnUse" cx="12" cy="12" r="10">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M12 5v14M5 12h14" stroke={`url(#${gradId})`} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (isPurpleStar) {
    return (
      <svg className="w-[30px] h-[30px] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <defs>
          <radialGradient id={gradId} gradientUnits="userSpaceOnUse" cx="12" cy="12" r="10">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M12 12L12 4.5M12 12L19.1 9.7M12 12L16.4 18.1M12 12L7.6 18.1M12 12L4.9 9.7" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className="w-[26px] h-[26px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <defs>
        <radialGradient id={gradId} gradientUnits="userSpaceOnUse" cx="12" cy="12" r="10">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M12 12L12 4.5M12 12L19.1 9.7M12 12L16.4 18.1M12 12L7.6 18.1M12 12L4.9 9.7" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
