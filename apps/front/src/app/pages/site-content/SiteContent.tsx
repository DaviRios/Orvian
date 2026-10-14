import { lazy, Suspense, useState, useEffect, useCallback } from 'react';
import type { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRightIcon,
  FileTextIcon,
  HomeIcon,
  ImageIcon,
  LayoutDashboardIcon,
  NewspaperIcon,
  UsersIcon,
  type IconProps,
} from '../../components/icons/OrvianIcons';

const ProductsTab = lazy(() =>
  import('./products/ProductsTab').then((module) => ({
    default: module.ProductsTab,
  })),
);
const PartnerBannersTab = lazy(() =>
  import('./partner-banners/PartnerBannersTab').then((module) => ({
    default: module.PartnerBannersTab,
  })),
);
const LogosTab = lazy(() =>
  import('./logos/LogosTab').then((module) => ({ default: module.LogosTab })),
);
const InformationTab = lazy(() =>
  import('./information/InformationTab').then((module) => ({
    default: module.InformationTab,
  })),
);
const LinksTab = lazy(() =>
  import('./links/LinksTab').then((module) => ({
    default: module.LinksTab,
  })),
);

type Tab = 'products' | 'partner-banners' | 'logos' | 'information' | 'links';

interface TabDetails {
  label: string;
  description: string;
  icon: ComponentType<IconProps>;
  iconClass: string;
}

const TAB_DETAILS: Record<Tab, TabDetails> = {
  products: {
    label: 'Produto',
    description: 'Hero principal',
    icon: ImageIcon,
    iconClass: 'bg-orvian-primary/15 text-orvian-primary',
  },
  'partner-banners': {
    label: 'Parceiros/Banner',
    description: 'Itens e soluções',
    icon: UsersIcon,
    iconClass: 'bg-orvian-secondary/30 text-orvian-lavender',
  },
  logos: {
    label: 'Logos',
    description: 'Marcas em destaque',
    icon: LayoutDashboardIcon,
    iconClass: 'bg-orvian-gold/15 text-orvian-gold',
  },
  information: {
    label: 'Saiba mais/informações',
    description: 'Informações complementares',
    icon: NewspaperIcon,
    iconClass: 'bg-orvian-red/20 text-orvian-red',
  },
  links: {
    label: 'Links',
    description: 'Conteúdo relacionado',
    icon: FileTextIcon,
    iconClass: 'bg-orvian-blue/15 text-orvian-blue',
  },
};

const TAB_ADD_LABELS: Record<Tab, string> = {
  products: '+ Novo Produto',
  'partner-banners': '+ Novo Parceiro/Banner',
  logos: '+ Adicionar Logo',
  information: '+ Nova Informação',
  links: '+ Novo Link',
};

export function SiteContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [success, setSuccess] = useState('');
  const [currentCount, setCurrentCount] = useState(0);
  const [openFormTrigger, setOpenFormTrigger] = useState(0);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(''), 3500);
    return () => clearTimeout(t);
  }, [success]);

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    setOpenFormTrigger(0);
    setCurrentCount(0);
  }

  const handleSuccess = useCallback((msg: string) => setSuccess(msg), []);
  const handleCountChange = useCallback(
    (count: number) => setCurrentCount(count),
    [],
  );

  const tabProps = {
    openFormTrigger,
    onSuccess: handleSuccess,
    onCountChange: handleCountChange,
  };
  const activeTabDetails = TAB_DETAILS[activeTab];

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1800px] flex-col gap-[clamp(0.875rem,1.4vh,2rem)]">
      <section className="relative min-h-[190px] overflow-hidden rounded-[clamp(0.875rem,1vw,1.5rem)] border border-orvian-secondary/45 bg-gradient-to-r from-orvian-shadow via-[#3B3047] to-orvian-secondary px-[clamp(1.25rem,2vw,3.5rem)] py-[clamp(1.25rem,2vw,2.5rem)] shadow-[0_10px_30px_rgba(0,0,0,0.16)]">
        <div className="pointer-events-none absolute -right-12 -top-24 size-64 rotate-12 rounded-[56px] bg-orvian-lavender/15" />
        <div className="pointer-events-none absolute right-36 top-20 h-28 w-60 -rotate-12 rounded-[44px] bg-orvian-gold/10" />
        <HomeIcon className="pointer-events-none absolute bottom-[-2rem] right-[clamp(1.5rem,5vw,7rem)] hidden size-[clamp(10rem,13vw,16rem)] text-orvian-lavender/10 md:block" />

        <div className="relative z-10 flex h-full flex-col justify-between gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-orvian-secondary/60 bg-orvian-charcoal/55 px-3 text-xs font-semibold text-orvian-lavender transition hover:border-orvian-primary/60 hover:bg-orvian-primary/10 hover:text-white"
              onClick={() => navigate('/')}
            >
              <ArrowRightIcon className="size-4 rotate-180" />
              Voltar para o início
            </button>
            {currentCount > 0 && (
              <span className="rounded-full border border-orvian-gold/35 bg-orvian-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orvian-gold">
                {currentCount} item{currentCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-3xl">
              <p className="mb-1 text-[clamp(0.6rem,0.55vw,1rem)] font-bold uppercase tracking-[0.18em] text-orvian-primary">
                Gestão do conteúdo do site
              </p>
              <h1 className="m-0 text-[clamp(1.45rem,1.7vw,3rem)] font-bold tracking-[-0.025em] text-white">
                Conteúdo Site
              </h1>
              <p className="mb-0 mt-1 max-w-2xl text-[clamp(0.72rem,0.72vw,1.2rem)] font-normal leading-relaxed text-orvian-muted">
                Gerencie produtos, parceiros/banners, logos, informações e links
                do site.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border-0 bg-orvian-primary px-5 text-xs font-semibold text-white shadow-[0_5px_14px_rgba(239,89,40,0.26)] transition hover:-translate-y-0.5 hover:bg-orvian-orange"
              onClick={() => setOpenFormTrigger((trigger) => trigger + 1)}
            >
              {TAB_ADD_LABELS[activeTab]}
              <ArrowRightIcon className="size-4" />
            </button>
          </div>
        </div>
      </section>

      <section aria-labelledby="site-sections-title">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h2
              id="site-sections-title"
              className="m-0 text-[clamp(0.8rem,0.78vw,1.3rem)] font-bold text-white"
            >
              Seções do Site
            </h2>
            <p className="mb-0 mt-0.5 text-[clamp(0.62rem,0.56vw,0.95rem)] font-normal text-orvian-lavender">
              Selecione uma área para visualizar e editar seu conteúdo
            </p>
          </div>
          <span className="hidden text-xs font-semibold text-orvian-lavender sm:block">
            Editando: {activeTabDetails.label}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-[clamp(0.625rem,0.75vw,1.25rem)] min-[430px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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
                onClick={() => switchTab(tab)}
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
                    className={`block truncate text-xs font-bold ${
                      active ? 'text-orvian-primary' : 'text-white'
                    }`}
                  >
                    {details.label}
                  </strong>
                  <span className="mt-1 block truncate text-[11px] font-normal text-orvian-lavender">
                    {details.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {success && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-green-400/35 bg-green-400/10 px-4 py-3 text-xs font-medium text-green-300"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {success}
        </div>
      )}

      <section
        aria-label={`Conteúdo de ${activeTabDetails.label}`}
        className="min-w-0"
      >
        <Suspense
          fallback={
            <div className="grid min-h-40 place-items-center rounded-2xl border border-orvian-secondary/35 bg-orvian-shadow text-sm text-orvian-lavender">
              Carregando seção…
            </div>
          }
        >
          {activeTab === 'products' && <ProductsTab {...tabProps} />}
          {activeTab === 'partner-banners' && (
            <PartnerBannersTab {...tabProps} />
          )}
          {activeTab === 'logos' && <LogosTab {...tabProps} />}
          {activeTab === 'information' && <InformationTab {...tabProps} />}
          {activeTab === 'links' && <LinksTab {...tabProps} />}
        </Suspense>
      </section>
    </div>
  );
}

export default SiteContent;
