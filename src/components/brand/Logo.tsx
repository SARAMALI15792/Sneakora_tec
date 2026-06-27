interface LogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 24, text: "text-sm", gap: 1.5 },
  md: { icon: 32, text: "text-base", gap: 2 },
  lg: { icon: 44, text: "text-xl", gap: 2.5 },
};

export function Logo({ size = "md", showWordmark = true, className = "" }: LogoProps) {
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-${s.gap} ${className}`}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Sneakora logo"
        role="img"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7c3aed" />
            <stop offset="0.5" stopColor="#6366f1" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>

        {/* Base S shape */}
        <path
          d="M24 4H10C8.89543 4 8 4.89543 8 6V10C8 11.1046 8.89543 12 10 12H22C23.1046 12 24 12.8954 24 14V18C24 19.1046 23.1046 20 22 20H10C8.89543 20 8 20.8954 8 22V26C8 27.1046 8.89543 28 10 28H24"
          stroke="url(#logo-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Speed line — forward motion */}
        <path
          d="M18 8L26 16L18 24"
          stroke="url(#logo-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Small diamond accent */}
        <path
          d="M26 14L28 16L26 18L24 16L26 14Z"
          fill="url(#logo-gradient)"
        />
      </svg>

      {showWordmark && (
        <span
          className={`font-heading font-bold tracking-wide ${s.text}`}
          style={{ color: "inherit" }}
        >
          Sneakora
        </span>
      )}
    </div>
  );
}
