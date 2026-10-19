import type { SVGProps } from 'react';

type LogoVariant = 'mark' | 'wordmark' | 'full';

interface OrvianLogoProps extends SVGProps<SVGSVGElement> {
  variant?: LogoVariant;
  decorative?: boolean;
}

const viewBoxes: Record<LogoVariant, string> = {
  mark: '330 170 594 594',
  wordmark: '180 740 900 310',
  full: '180 170 900 900',
};

export function OrvianLogo({
  variant = 'full',
  decorative = false,
  ...props
}: OrvianLogoProps) {
  return (
    <svg
      viewBox={viewBoxes[variant]}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : 'Orvian — Gestão de conteúdo'}
      {...props}
    >
      <image
        href="/orvian-logo.png"
        width="1254"
        height="1254"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}
