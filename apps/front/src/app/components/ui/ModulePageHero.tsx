import type { ComponentType } from 'react';
import { ArrowRightIcon, type IconProps } from '../icons/OrvianIcons';

interface ModulePageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: ComponentType<IconProps>;
  countLabel?: string;
  actionLabel?: string;
  onBack: () => void;
  onAction?: () => void;
  actionDisabled?: boolean;
}

export function ModulePageHero({
  eyebrow,
  title,
  description,
  icon: ModuleIcon,
  countLabel,
  actionLabel,
  onBack,
  onAction,
  actionDisabled = false,
}: ModulePageHeroProps) {
  return (
    <section className="relative min-h-[190px] overflow-hidden rounded-[clamp(0.875rem,1vw,1.5rem)] border border-orvian-secondary/45 bg-gradient-to-r from-orvian-shadow via-[#3B3047] to-orvian-secondary px-[clamp(1.25rem,2vw,3.5rem)] py-[clamp(1.25rem,2vw,2.5rem)] shadow-[0_10px_30px_rgba(0,0,0,0.16)]">
      <div className="pointer-events-none absolute -right-12 -top-24 size-64 rotate-12 rounded-[56px] bg-orvian-lavender/15" />
      <div className="pointer-events-none absolute right-36 top-20 h-28 w-60 -rotate-12 rounded-[44px] bg-orvian-gold/10" />
      <ModuleIcon className="pointer-events-none absolute bottom-[-2rem] right-[clamp(1.5rem,5vw,7rem)] hidden size-[clamp(10rem,13vw,16rem)] text-orvian-lavender/10 md:block" />

      <div className="relative z-10 flex h-full flex-col justify-between gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-orvian-secondary/60 bg-orvian-charcoal/55 px-3 text-xs font-semibold text-orvian-lavender transition hover:border-orvian-primary/60 hover:bg-orvian-primary/10 hover:text-white"
            onClick={onBack}
          >
            <ArrowRightIcon className="size-4 rotate-180" />
            Voltar para o início
          </button>
          {countLabel && (
            <span className="rounded-full border border-orvian-gold/35 bg-orvian-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orvian-gold">
              {countLabel}
            </span>
          )}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-3xl">
            <p className="mb-1 text-[clamp(0.6rem,0.55vw,1rem)] font-bold uppercase tracking-[0.18em] text-orvian-primary">
              {eyebrow}
            </p>
            <h1 className="m-0 text-[clamp(1.45rem,1.7vw,3rem)] font-bold tracking-[-0.025em] text-white">
              {title}
            </h1>
            <p className="mb-0 mt-1 max-w-2xl text-[clamp(0.72rem,0.72vw,1.2rem)] font-normal leading-relaxed text-orvian-muted">
              {description}
            </p>
          </div>

          {actionLabel && onAction && (
            <button
              type="button"
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border-0 bg-orvian-primary px-5 text-xs font-semibold text-white shadow-[0_5px_14px_rgba(239,89,40,0.26)] transition hover:-translate-y-0.5 hover:bg-orvian-orange disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              onClick={onAction}
              disabled={actionDisabled}
            >
              {actionLabel}
              <ArrowRightIcon className="size-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
