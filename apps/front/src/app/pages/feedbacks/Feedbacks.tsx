import { lazy, Suspense, useState } from 'react';
import type { ComponentType } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ModulePageHero } from '../../components/ui/ModulePageHero';
import {
  BriefcaseIcon,
  UsersIcon,
  type IconProps,
} from '../../components/icons/OrvianIcons';

const ReviewsTab = lazy(() =>
  import('./reviews/ReviewsTab').then((module) => ({
    default: module.ReviewsTab,
  })),
);
const CustomerFeedbacksTab = lazy(() =>
  import('./customer-feedbacks/CustomerFeedbacksTab').then((module) => ({
    default: module.CustomerFeedbacksTab,
  })),
);

type Tab = 'reviews' | 'feedbacks';

interface TabDetails {
  label: string;
  description: string;
  icon: ComponentType<IconProps>;
  iconClass: string;
}

const TAB_DETAILS: Record<Tab, TabDetails> = {
  reviews: {
    label: 'Avaliações',
    description: 'Avaliações e resultados',
    icon: BriefcaseIcon,
    iconClass: 'bg-orvian-primary/15 text-orvian-primary',
  },
  feedbacks: {
    label: 'Feedbacks',
    description: 'Experiências e depoimentos',
    icon: UsersIcon,
    iconClass: 'bg-orvian-gold/15 text-orvian-gold',
  },
};

export function Feedbacks() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>('reviews');
  const [openFormTrigger, setOpenFormTrigger] = useState(() =>
    (location.state as { create?: boolean } | null)?.create ? 1 : 0,
  );
  const [reviewsCount, setReviewsCount] = useState(0);
  const [feedbacksCount, setFeedbacksCount] = useState(0);
  const [success, setSuccess] = useState('');

  function handleSuccess(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3500);
  }

  const currentCount = activeTab === 'reviews' ? reviewsCount : feedbacksCount;
  const addLabel =
    activeTab === 'reviews' ? '+ Nova Avaliação' : '+ Novo Feedback';
  const activeTabDetails = TAB_DETAILS[activeTab];

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1800px] flex-col gap-[clamp(0.875rem,1.4vh,2rem)]">
      <ModulePageHero
        eyebrow="Portfólio e resultados"
        title="Feedbacks"
        description="Gerencie as avaliações e os feedbacks exibidos no site."
        icon={BriefcaseIcon}
        countLabel={
          currentCount > 0
            ? `${currentCount} item${currentCount > 1 ? 's' : ''}`
            : undefined
        }
        actionLabel={addLabel}
        onBack={() => navigate('/')}
        onAction={() => setOpenFormTrigger((trigger) => trigger + 1)}
      />

      <section aria-labelledby="feedback-sections-title">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h2
              id="feedback-sections-title"
              className="m-0 text-[clamp(0.8rem,0.78vw,1.3rem)] font-bold text-white"
            >
              Tipos de conteúdo
            </h2>
            <p className="mb-0 mt-0.5 text-[clamp(0.62rem,0.56vw,0.95rem)] font-normal text-orvian-lavender">
              Selecione uma área para visualizar e editar seus conteúdos
            </p>
          </div>
          <span className="hidden text-xs font-semibold text-orvian-lavender sm:block">
            Editando: {activeTabDetails.label}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-[clamp(0.625rem,0.75vw,1.25rem)] sm:grid-cols-2">
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
          {activeTab === 'reviews' && (
            <ReviewsTab
              openFormTrigger={openFormTrigger}
              onSuccess={handleSuccess}
              onCountChange={setReviewsCount}
            />
          )}
          {activeTab === 'feedbacks' && (
            <CustomerFeedbacksTab
              openFormTrigger={openFormTrigger}
              onSuccess={handleSuccess}
              onCountChange={setFeedbacksCount}
            />
          )}
        </Suspense>
      </section>
    </div>
  );
}

export default Feedbacks;
