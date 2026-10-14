interface DashboardIllustrationProps {
  className?: string;
}

export function DashboardIllustration({
  className = 'h-[clamp(150px,12vw,280px)] w-[clamp(318px,25.4vw,593px)]',
}: DashboardIllustrationProps) {
  return (
    <svg
      viewBox="0 0 360 170"
      role="img"
      aria-label="Painel de conteúdo flutuante"
      className={className}
    >
      <defs>
        <linearGradient id="windowTop" x1="0" x2="1">
          <stop stopColor="#EF5928" />
          <stop offset="1" stopColor="#FF892B" />
        </linearGradient>
        <linearGradient id="windowBody" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#F7F2F8" />
          <stop offset="1" stopColor="#D9CCE2" />
        </linearGradient>
        <filter id="panelShadow" x="-30%" y="-30%" width="170%" height="190%">
          <feDropShadow
            dx="0"
            dy="12"
            stdDeviation="10"
            floodColor="#25232C"
            floodOpacity="0.2"
          />
        </filter>
      </defs>

      <ellipse
        cx="189"
        cy="147"
        rx="124"
        ry="15"
        fill="#F9B82D"
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
          fill="#68577E"
        />
        <g fill="#EF5928">
          <circle cx="17" cy="47" r="7" />
          <circle cx="17" cy="70" r="7" opacity="0.72" />
          <circle cx="17" cy="93" r="7" opacity="0.5" />
        </g>
        <g fill="#9981AE">
          <rect x="29" y="43" width="28" height="5" rx="2.5" />
          <rect x="29" y="51" width="19" height="3" rx="1.5" opacity="0.7" />
          <rect x="29" y="66" width="25" height="5" rx="2.5" />
          <rect x="29" y="74" width="17" height="3" rx="1.5" opacity="0.7" />
          <rect x="29" y="89" width="27" height="5" rx="2.5" />
          <rect x="29" y="97" width="20" height="3" rx="1.5" opacity="0.7" />
        </g>

        <rect x="84" y="44" width="91" height="8" rx="4" fill="#EF5928" />
        <rect x="84" y="59" width="151" height="5" rx="2.5" fill="#9981AE" />
        <rect x="84" y="69" width="131" height="5" rx="2.5" fill="#C6B5D2" />
        <rect x="84" y="79" width="143" height="5" rx="2.5" fill="#C6B5D2" />
        <rect x="84" y="94" width="66" height="23" rx="5" fill="#E2D8E8" />
        <circle cx="137" cy="101" r="3" fill="#F9B82D" />
        <path d="m91 113 12-11 8 7 8-7 19 15H91Z" fill="#B84B55" />
        <rect x="161" y="94" width="74" height="6" rx="3" fill="#9981AE" />
        <rect x="161" y="106" width="58" height="5" rx="2.5" fill="#C6B5D2" />
      </g>

      <circle cx="325" cy="46" r="7" fill="#F9B82D" opacity="0.55" />
      <path d="m27 35 11-11 11 11-11 11Z" fill="#EF5928" opacity="0.45" />
    </svg>
  );
}
