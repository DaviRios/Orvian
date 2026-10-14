import { useState } from 'react';
import type { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModulePageHero } from '../../components/ui/ModulePageHero';
import {
  BriefcaseIcon,
  ImageIcon,
  SettingsIcon,
  UsersIcon,
  type IconProps,
} from '../../components/icons/OrvianIcons';

type Tab = 'services' | 'partners' | 'careers' | 'media';

interface TabDetails {
  label: string;
  description: string;
  icon: ComponentType<IconProps>;
  iconClass: string;
}

const TAB_DETAILS: Record<Tab, TabDetails> = {
  services: {
    label: 'Serviços',
    description: 'Soluções oferecidas',
    icon: SettingsIcon,
    iconClass: 'bg-orvian-primary/15 text-orvian-primary',
  },
  partners: {
    label: 'Parceiros',
    description: 'Empresas parceiras',
    icon: UsersIcon,
    iconClass: 'bg-orvian-secondary/30 text-orvian-lavender',
  },
  careers: {
    label: 'Carreiras',
    description: 'Vagas e oportunidades',
    icon: BriefcaseIcon,
    iconClass: 'bg-orvian-gold/15 text-orvian-gold',
  },
  media: {
    label: 'Mídia',
    description: 'Materiais institucionais',
    icon: ImageIcon,
    iconClass: 'bg-orvian-blue/15 text-orvian-blue',
  },
};

export function About() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('services');
  const activeTabDetails = TAB_DETAILS[activeTab];

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1800px] flex-col gap-[clamp(0.875rem,1.4vh,2rem)]">
      <ModulePageHero
        eyebrow="Conteúdo institucional"
        title="Página Sobre"
        description="Gerencie serviços, parceiros, carreiras e materiais institucionais exibidos no site."
        icon={UsersIcon}
        onBack={() => navigate('/')}
      />

      <section aria-labelledby="about-sections-title">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h2
              id="about-sections-title"
              className="m-0 text-[clamp(0.8rem,0.78vw,1.3rem)] font-bold text-white"
            >
              Seções institucionais
            </h2>
            <p className="mb-0 mt-0.5 text-[clamp(0.62rem,0.56vw,0.95rem)] font-normal text-orvian-lavender">
              Selecione uma área para visualizar e editar seu conteúdo
            </p>
          </div>
          <span className="hidden text-xs font-semibold text-orvian-lavender sm:block">
            Editando: {activeTabDetails.label}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-[clamp(0.625rem,0.75vw,1.25rem)] min-[430px]:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(TAB_DETAILS) as Tab[]).map((tab) => {
            const details = TAB_DETAILS[tab];
            const TabIcon = details.icon;
            const active = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                aria-pressed={active}
                className={`group flex min-h-[88px] min-w-0 items-center gap-3 rounded-[clamp(0.75rem,0.8vw,1.25rem)] border p-[clamp(0.75rem,0.85vw,1.25rem)] text-left shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:border-orvian-primary/70 ${
                  active
                    ? 'border-orvian-primary bg-orvian-primary/10 shadow-[0_10px_24px_rgba(239,89,40,0.12)]'
                    : 'border-orvian-secondary/35 bg-orvian-shadow'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-xl transition ${
                    active
                      ? 'bg-orvian-primary text-white shadow-[0_5px_12px_rgba(239,89,40,0.24)]'
                      : details.iconClass
                  }`}
                >
                  <TabIcon className="size-5" />
                </span>
                <span className="min-w-0">
                  <strong
                    className={`block text-xs font-bold ${
                      active ? 'text-orvian-primary' : 'text-white'
                    }`}
                  >
                    {details.label}
                  </strong>
                  <span className="mt-1 block text-[11px] font-normal text-orvian-lavender">
                    {details.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <ComingSoon sectionName={activeTabDetails.label} />
    </div>
  );
}

function ComingSoon({ sectionName }: { sectionName: string }) {
  return (
    <section
      aria-label={`Conteúdo de ${sectionName}`}
      className="grid min-h-[280px] place-items-center rounded-[clamp(0.875rem,1vw,1.5rem)] border border-orvian-secondary/35 bg-orvian-shadow p-8 text-center shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
    >
      <div className="flex max-w-sm flex-col items-center gap-3">
        <div className="mb-2 grid size-16 place-items-center rounded-2xl bg-orvian-secondary/25 text-orvian-blue">
          <SettingsIcon className="size-8" />
        </div>
        <p className="m-0 text-base font-bold text-white">
          {sectionName} em breve
        </p>
        <p className="m-0 text-sm leading-relaxed text-orvian-lavender">
          Esta seção está em desenvolvimento e estará disponível em breve.
        </p>
      </div>
    </section>
  );
}

export default About;
