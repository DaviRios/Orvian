import { useQuery } from '@tanstack/react-query';
import type { DashboardActivityDto } from '@orvian/contracts';
import type { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRightIcon,
  BriefcaseIcon,
  FileTextIcon,
  HomeIcon,
  ImageIcon,
  LayoutDashboardIcon,
  NewspaperIcon,
  PlusIcon,
  UploadIcon,
  UsersIcon,
  type IconProps,
} from '../../components/icons/OrvianIcons';
import { getDashboardSummary } from '../../services/dashboard.service';
import { DashboardIllustration } from './DashboardIllustration';

interface DashboardModule {
  path: string;
  title: string;
  description: string;
  label: string;
  icon: ComponentType<IconProps>;
  iconClass: string;
  labelClass: string;
}

const modules: DashboardModule[] = [
  {
    path: '/site-content',
    title: 'Conteúdo Site',
    description: 'Produtos, parceiros/banners, logos, informações e links.',
    label: 'Site',
    icon: HomeIcon,
    iconClass: 'bg-orvian-primary/15 text-orvian-primary',
    labelClass:
      'border-orvian-primary/30 bg-orvian-primary/10 text-orvian-primary',
  },
  {
    path: '/feedbacks',
    title: 'Feedbacks',
    description: 'Avaliações e feedbacks que mostram resultados dos clientes.',
    label: 'Feedbacks',
    icon: BriefcaseIcon,
    iconClass: 'bg-orvian-secondary/25 text-orvian-lavender',
    labelClass:
      'border-orvian-secondary/50 bg-orvian-secondary/20 text-orvian-lavender',
  },
  {
    path: '/blog-posts',
    title: 'Blog e Notícias',
    description: 'Conteúdo editorial, publicações e seus autores.',
    label: 'Blog',
    icon: NewspaperIcon,
    iconClass: 'bg-orvian-gold/15 text-orvian-gold',
    labelClass: 'border-orvian-gold/35 bg-orvian-gold/10 text-orvian-gold',
  },
  {
    path: '/media',
    title: 'Repositório de Mídias',
    description: 'Imagens, vídeos e arquivos utilizados pelo Orvian.',
    label: 'Mídias',
    icon: ImageIcon,
    iconClass: 'bg-orvian-blue/15 text-orvian-blue',
    labelClass: 'border-orvian-blue/35 bg-orvian-blue/10 text-orvian-blue',
  },
  {
    path: '/about',
    title: 'Página Sobre',
    description: 'Serviços, parceiros e oportunidades da empresa.',
    label: 'Institucional',
    icon: UsersIcon,
    iconClass: 'bg-orvian-red/20 text-orvian-red',
    labelClass: 'border-orvian-red/40 bg-orvian-red/15 text-orvian-red',
  },
];

const actionLabels: Record<DashboardActivityDto['action'], string> = {
  CREATED: 'Criado',
  UPDATED: 'Atualizado',
  PUBLISHED: 'Publicado',
  DELETED: 'Removido',
};

const resourceStyles: Record<
  DashboardActivityDto['resource'],
  { label: string; className: string }
> = {
  HOME: {
    label: 'Home',
    className: 'bg-orvian-primary/15 text-orvian-primary',
  },
  REVIEW: {
    label: 'Avaliação',
    className: 'bg-orvian-secondary/25 text-orvian-lavender',
  },
  BLOG: { label: 'Blog', className: 'bg-orvian-gold/15 text-orvian-gold' },
  MEDIA: { label: 'Mídia', className: 'bg-orvian-blue/15 text-orvian-blue' },
  ABOUT: { label: 'Sobre', className: 'bg-orvian-red/20 text-orvian-red' },
  LEGAL: {
    label: 'Legal',
    className: 'bg-orvian-primary/15 text-orvian-primary',
  },
};

function formatActivityDate(value: string) {
  const date = new Date(value);
  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  return sameDay
    ? date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      });
}

function MetricValue({ loading, value }: { loading: boolean; value?: number }) {
  if (loading) {
    return (
      <span className="block h-[clamp(1.5rem,1.7vw,2.75rem)] w-[clamp(2.5rem,3vw,5rem)] animate-pulse rounded bg-orvian-secondary/25" />
    );
  }
  return (
    <strong className="text-[clamp(1.25rem,1.45vw,2.5rem)] leading-none text-white">
      {value ?? '—'}
    </strong>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const summary = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: ({ signal }) => getDashboardSummary(signal),
  });
  const metrics = summary.data?.metrics;

  const metricCards = [
    {
      title: 'Páginas publicadas',
      description: 'Áreas com conteúdo ativo',
      value: metrics?.publishedPages,
      icon: LayoutDashboardIcon,
      style: 'bg-orvian-primary/15 text-orvian-primary',
    },
    {
      title: 'Avaliações cadastradas',
      description: 'Avaliações ativas no Orvian',
      value: metrics?.reviews,
      icon: BriefcaseIcon,
      style: 'bg-orvian-secondary/25 text-orvian-lavender',
    },
    {
      title: 'Posts do blog',
      description: 'Publicações ativas',
      value: metrics?.blogPosts,
      icon: FileTextIcon,
      style: 'bg-orvian-gold/15 text-orvian-gold',
    },
    {
      title: 'Arquivos de mídia',
      description: 'Arquivos disponíveis',
      value: metrics?.mediaAssets,
      icon: ImageIcon,
      style: 'bg-orvian-blue/15 text-orvian-blue',
    },
  ];

  const quickActions = [
    {
      label: 'Novo post no blog',
      path: '/blog-posts',
      state: { create: true },
      icon: PlusIcon,
      style: 'bg-orvian-gold/15 text-orvian-gold',
    },
    {
      label: 'Nova avaliação',
      path: '/feedbacks',
      state: { create: true },
      icon: BriefcaseIcon,
      style: 'bg-orvian-secondary/25 text-orvian-lavender',
    },
    {
      label: 'Upload de mídia',
      path: '/media',
      state: undefined,
      icon: UploadIcon,
      style: 'bg-orvian-blue/15 text-orvian-blue',
    },
    {
      label: 'Editar Conteúdo Site',
      path: '/site-content',
      state: undefined,
      icon: HomeIcon,
      style: 'bg-orvian-primary/15 text-orvian-primary',
    },
  ];

  return (
    <div className="mx-auto flex min-h-full w-full flex-col gap-[clamp(0.75rem,1.4vh,2rem)]">
      <section className="relative flex min-h-[150px] shrink-0 items-center overflow-hidden rounded-[clamp(0.875rem,1vw,1.5rem)] border border-orvian-secondary/45 bg-gradient-to-r from-orvian-shadow via-[#3B3047] to-orvian-secondary px-[clamp(1.25rem,2vw,3.5rem)] py-5 shadow-[0_10px_30px_rgba(0,0,0,0.16)] min-[1200px]:h-[clamp(150px,18vh,360px)] min-[1200px]:py-0">
        <div className="pointer-events-none absolute -right-12 -top-24 size-64 rotate-12 rounded-[56px] bg-orvian-lavender/15" />
        <div className="pointer-events-none absolute right-48 top-16 h-28 w-60 -rotate-12 rounded-[44px] bg-orvian-gold/10" />
        <div className="relative z-10 max-w-[clamp(34rem,48vw,68rem)]">
          <p className="mb-[clamp(0.25rem,0.5vh,0.75rem)] text-[clamp(0.6rem,0.55vw,1rem)] font-bold uppercase tracking-[0.18em] text-orvian-primary">
            Painel de controle
          </p>
          <h1 className="m-0 text-[clamp(1.35rem,1.45vw,2.75rem)] font-bold tracking-[-0.025em] text-white">
            Bem-vindo de volta!
          </h1>
          <p className="mb-[clamp(0.5rem,1vh,1rem)] mt-1 text-[clamp(0.7rem,0.7vw,1.2rem)] font-normal text-orvian-lavender">
            Gerencie todo o conteúdo do seu site de forma simples e rápida.
          </p>
          <button
            type="button"
            onClick={() => navigate('/site-content')}
            className="inline-flex h-[clamp(2rem,2.3vw,3.25rem)] items-center gap-2 rounded-[clamp(0.5rem,0.55vw,0.875rem)] border-0 bg-orvian-primary px-[clamp(0.875rem,1vw,1.75rem)] text-[clamp(0.68rem,0.65vw,1.05rem)] font-semibold text-white shadow-[0_5px_14px_rgba(239,89,40,0.26)] transition hover:bg-orvian-orange"
          >
            Começar agora
            <ArrowRightIcon className="size-3.5" />
          </button>
        </div>
        <div className="absolute bottom-[-8%] right-[clamp(1.75rem,4vw,7rem)] hidden lg:block">
          <DashboardIllustration />
        </div>
      </section>

      <section
        aria-labelledby="metrics-title"
        className="flex flex-col min-[1200px]:min-h-[clamp(112px,14vh,360px)]"
      >
        <div className="mb-[clamp(0.5rem,0.7vh,0.875rem)] flex items-center justify-between">
          <h2
            id="metrics-title"
            className="m-0 text-[clamp(0.75rem,0.72vw,1.25rem)] font-bold text-white"
          >
            Visão geral
          </h2>
          {summary.isError && (
            <button
              type="button"
              onClick={() => void summary.refetch()}
              className="border-0 bg-transparent text-[10px] font-semibold text-orvian-red hover:text-orvian-primary"
            >
              Não foi possível atualizar · tentar novamente
            </button>
          )}
        </div>
        <div className="grid flex-1 grid-cols-1 gap-[clamp(0.625rem,0.75vw,1.25rem)] min-[480px]:grid-cols-2 min-[1200px]:grid-cols-4">
          {metricCards.map((metric) => {
            const MetricIcon = metric.icon;
            return (
              <article
                key={metric.title}
                className="flex min-h-[88px] items-center gap-[clamp(0.75rem,0.8vw,1.5rem)] rounded-[clamp(0.75rem,0.8vw,1.25rem)] border border-orvian-secondary/35 bg-orvian-shadow px-[clamp(1rem,1.15vw,2rem)] py-3 shadow-[0_6px_18px_rgba(0,0,0,0.12)] min-[1200px]:h-full min-[1200px]:min-h-0"
              >
                <span
                  className={`grid size-[clamp(2.5rem,2.6vw,4.5rem)] shrink-0 place-items-center rounded-[clamp(0.75rem,0.8vw,1.25rem)] ${metric.style}`}
                >
                  <MetricIcon className="size-[clamp(1.25rem,1.3vw,2.25rem)]" />
                </span>
                <div className="min-w-0">
                  <MetricValue
                    loading={summary.isPending}
                    value={metric.value}
                  />
                  <h3 className="mb-0 mt-1 truncate text-[clamp(0.68rem,0.62vw,1.05rem)] font-semibold text-white">
                    {metric.title}
                  </h3>
                  <p className="m-0 truncate text-[clamp(0.58rem,0.52vw,0.9rem)] font-normal text-orvian-lavender">
                    {metric.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section
        aria-labelledby="modules-title"
        className="flex flex-col min-[1200px]:min-h-[clamp(190px,30vh,620px)]"
      >
        <div className="mb-[clamp(0.625rem,0.8vh,1rem)]">
          <h2
            id="modules-title"
            className="m-0 text-[clamp(0.75rem,0.72vw,1.25rem)] font-bold text-white"
          >
            Módulos do sistema
          </h2>
          <p className="mb-0 mt-0.5 text-[clamp(0.58rem,0.52vw,0.9rem)] font-normal text-orvian-lavender">
            Acesse e gerencie cada parte do seu site
          </p>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-[clamp(0.625rem,0.75vw,1.25rem)] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {modules.map((module) => {
            const ModuleIcon = module.icon;
            return (
              <button
                key={module.path}
                type="button"
                onClick={() => navigate(module.path)}
                className="group flex min-h-[220px] min-w-0 flex-col rounded-[clamp(0.75rem,0.8vw,1.25rem)] border border-orvian-secondary/35 bg-orvian-shadow p-[clamp(0.875rem,1vw,1.75rem)] text-left shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:border-orvian-primary/70 hover:shadow-[0_12px_28px_rgba(239,89,40,0.12)] min-[1200px]:h-full min-[1200px]:min-h-0"
              >
                <span className="flex w-full items-start justify-between gap-2">
                  <span
                    className={`grid size-[clamp(2.5rem,2.55vw,4.5rem)] shrink-0 place-items-center rounded-[clamp(0.75rem,0.8vw,1.25rem)] ${module.iconClass}`}
                  >
                    <ModuleIcon className="size-[clamp(1.25rem,1.25vw,2.2rem)]" />
                  </span>
                  <span
                    className={`max-w-full rounded-full border px-2 py-1 text-[clamp(0.5rem,0.45vw,0.75rem)] font-bold uppercase leading-none tracking-wide ${module.labelClass}`}
                  >
                    {module.label}
                  </span>
                </span>
                <h3 className="mb-0 mt-[clamp(0.75rem,1vh,1.25rem)] break-words text-[clamp(0.75rem,0.72vw,1.25rem)] font-bold leading-[1.35] text-white [overflow-wrap:anywhere]">
                  {module.title}
                </h3>
                <p className="mb-0 mt-1 break-words text-[clamp(0.62rem,0.58vw,1rem)] font-normal leading-[1.55] text-orvian-lavender [overflow-wrap:anywhere]">
                  {module.description}
                </p>
                <span className="mt-[clamp(0.75rem,1.2vh,1.5rem)] flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-orvian-primary/35 bg-orvian-primary/10 px-2 py-2 text-center text-[clamp(0.62rem,0.58vw,1rem)] font-semibold text-orvian-primary transition group-hover:border-orvian-primary group-hover:bg-orvian-primary group-hover:text-white min-[1200px]:mt-auto">
                  Acessar módulo
                  <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-[clamp(0.625rem,0.75vw,1.25rem)] min-[1200px]:min-h-[clamp(190px,30vh,620px)] min-[1200px]:grid-cols-[1.2fr_1fr]">
        <article className="flex min-h-[166px] flex-col rounded-[clamp(0.75rem,0.8vw,1.25rem)] border border-orvian-secondary/35 bg-orvian-shadow p-[clamp(1rem,1.15vw,2rem)] shadow-[0_6px_18px_rgba(0,0,0,0.12)] min-[1200px]:h-full min-[1200px]:min-h-0">
          <div className="mb-[clamp(0.625rem,0.8vh,1.25rem)] flex items-center justify-between">
            <div>
              <h2 className="m-0 text-[clamp(0.75rem,0.72vw,1.25rem)] font-bold text-white">
                Atividade recente
              </h2>
              <p className="mb-0 mt-0.5 text-[clamp(0.58rem,0.52vw,0.9rem)] font-normal text-orvian-lavender">
                Últimas alterações realizadas no Orvian
              </p>
            </div>
          </div>

          {summary.isPending ? (
            <div
              className="flex flex-1 flex-col justify-around gap-2"
              aria-label="Carregando atividades"
            >
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="min-h-7 flex-1 animate-pulse rounded-lg bg-orvian-secondary/20"
                />
              ))}
            </div>
          ) : summary.data?.recentActivity.length ? (
            <ul className="m-0 flex flex-1 flex-col justify-around gap-1.5 p-0">
              {summary.data.recentActivity.map((item) => {
                const resource = resourceStyles[item.resource];
                return (
                  <li
                    key={item.id}
                    className="flex min-h-7 items-center gap-2.5"
                  >
                    <span
                      className={`rounded-md px-2 py-1 text-[clamp(0.5rem,0.45vw,0.78rem)] font-bold uppercase tracking-wide ${resource.className}`}
                    >
                      {resource.label}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[clamp(0.62rem,0.58vw,1rem)] text-orvian-lavender">
                      <strong className="font-semibold text-white">
                        {actionLabels[item.action]}:
                      </strong>{' '}
                      {item.title}
                    </span>
                    <time
                      className="shrink-0 text-[clamp(0.58rem,0.52vw,0.9rem)] text-orvian-gray"
                      dateTime={item.occurredAt}
                    >
                      {formatActivityDate(item.occurredAt)}
                    </time>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="grid min-h-[82px] flex-1 place-items-center rounded-lg border border-dashed border-orvian-secondary/45 bg-orvian-charcoal/45 text-center">
              <div>
                <FileTextIcon className="mx-auto size-[clamp(1.25rem,1.3vw,2.25rem)] text-orvian-secondary" />
                <p className="mb-0 mt-1 text-[clamp(0.62rem,0.58vw,1rem)] font-normal text-orvian-lavender">
                  Nenhuma atividade registrada ainda.
                </p>
              </div>
            </div>
          )}
        </article>

        <article className="flex min-h-[166px] flex-col rounded-[clamp(0.75rem,0.8vw,1.25rem)] border border-orvian-secondary/35 bg-orvian-shadow p-[clamp(1rem,1.15vw,2rem)] shadow-[0_6px_18px_rgba(0,0,0,0.12)] min-[1200px]:h-full min-[1200px]:min-h-0">
          <div className="mb-[clamp(0.625rem,0.8vh,1.25rem)]">
            <h2 className="m-0 text-[clamp(0.75rem,0.72vw,1.25rem)] font-bold text-white">
              Acesso rápido
            </h2>
            <p className="mb-0 mt-0.5 text-[clamp(0.58rem,0.52vw,0.9rem)] font-normal text-orvian-lavender">
              Atalhos para as tarefas mais frequentes
            </p>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-[clamp(0.5rem,0.6vw,1rem)] min-[420px]:grid-cols-2">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => navigate(action.path, { state: action.state })}
                  className="group flex min-h-10 min-w-0 items-center gap-[clamp(0.5rem,0.65vw,1rem)] rounded-[clamp(0.5rem,0.55vw,0.875rem)] border border-orvian-secondary/30 bg-orvian-charcoal/60 px-[clamp(0.625rem,0.75vw,1.25rem)] py-2 text-left transition hover:border-orvian-primary/50 hover:bg-orvian-primary/10"
                >
                  <span
                    className={`grid size-[clamp(1.75rem,2vw,3.5rem)] shrink-0 place-items-center rounded-lg ${action.style}`}
                  >
                    <ActionIcon className="size-[clamp(0.875rem,1vw,1.75rem)]" />
                  </span>
                  <span className="min-w-0 truncate text-[clamp(0.58rem,0.55vw,0.95rem)] font-semibold text-orvian-lavender group-hover:text-white">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </article>
      </section>
    </div>
  );
}

export default Dashboard;
