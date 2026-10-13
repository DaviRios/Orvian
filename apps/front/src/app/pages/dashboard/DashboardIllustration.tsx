export function DashboardIllustration() {
  return (
    <svg
      viewBox="0 0 360 170"
      role="img"
      aria-label="Painel de conteúdo flutuante"
      className="h-[clamp(150px,12vw,280px)] w-[clamp(318px,25.4vw,593px)]"
    >
      <defs>
        <linearGradient id="windowTop" x1="0" x2="1">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#60A5FA" />
        </linearGradient>
        <linearGradient id="windowBody" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EFF6FF" />
        </linearGradient>
        <filter id="panelShadow" x="-30%" y="-30%" width="170%" height="190%">
          <feDropShadow
            dx="0"
            dy="12"
            stdDeviation="10"
            floodColor="#1D4ED8"
            floodOpacity="0.2"
          />
        </filter>
      </defs>

      <ellipse
        cx="189"
        cy="147"
        rx="124"
        ry="15"
        fill="#60A5FA"
        opacity="0.18"
      />
      <g
        transform="translate(48 14) rotate(-3 132 65) skewX(-5)"
        filter="url(#panelShadow)"
      >
        <rect width="264" height="126" rx="12" fill="url(#windowBody)" />
        <path
          d="M0 12A12 12 0 0 1 12 0h240a12 12 0 0 1 12 12v18H0Z"
          fill="url(#windowTop)"
        />
        <circle cx="16" cy="15" r="3.5" fill="white" opacity="0.95" />
        <circle cx="28" cy="15" r="3.5" fill="white" opacity="0.75" />
        <circle cx="40" cy="15" r="3.5" fill="white" opacity="0.55" />

        <path
          d="M0 30h67v84a12 12 0 0 0 12 12H12a12 12 0 0 1-12-12Z"
          fill="#DBEAFE"
        />
        <g fill="#3B82F6">
          <circle cx="17" cy="47" r="7" />
          <circle cx="17" cy="70" r="7" opacity="0.72" />
          <circle cx="17" cy="93" r="7" opacity="0.5" />
        </g>
        <g fill="#93C5FD">
          <rect x="29" y="43" width="28" height="5" rx="2.5" />
          <rect x="29" y="51" width="19" height="3" rx="1.5" opacity="0.7" />
          <rect x="29" y="66" width="25" height="5" rx="2.5" />
          <rect x="29" y="74" width="17" height="3" rx="1.5" opacity="0.7" />
          <rect x="29" y="89" width="27" height="5" rx="2.5" />
          <rect x="29" y="97" width="20" height="3" rx="1.5" opacity="0.7" />
        </g>

        <rect x="84" y="44" width="91" height="8" rx="4" fill="#60A5FA" />
        <rect x="84" y="59" width="151" height="5" rx="2.5" fill="#BFDBFE" />
        <rect x="84" y="69" width="131" height="5" rx="2.5" fill="#DBEAFE" />
        <rect x="84" y="79" width="143" height="5" rx="2.5" fill="#DBEAFE" />
        <rect x="84" y="94" width="66" height="23" rx="5" fill="#DBEAFE" />
        <circle cx="137" cy="101" r="3" fill="#60A5FA" />
        <path d="m91 113 12-11 8 7 8-7 19 15H91Z" fill="#93C5FD" />
        <rect x="161" y="94" width="74" height="6" rx="3" fill="#BFDBFE" />
        <rect x="161" y="106" width="58" height="5" rx="2.5" fill="#DBEAFE" />
      </g>

      <circle cx="325" cy="46" r="7" fill="#3B82F6" opacity="0.18" />
      <path d="m27 35 11-11 11 11-11 11Z" fill="#60A5FA" opacity="0.2" />
    </svg>
  );
}
