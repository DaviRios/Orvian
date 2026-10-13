import { useQuery } from '@tanstack/react-query';
import type { DashboardActivityDto } from '@soir/contracts';
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
} from '../../components/icons/CmsIcons';
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
    path: '/home-content',
    title: 'Conteúdo da Home',
    description: 'Slides, ecossistema, logos e popups da página inicial.',
    label: 'Home',
    icon: HomeIcon,
    iconClass: 'bg-blue-50 text-blue-600',
    labelClass: 'border-blue-100 bg-blue-50 text-blue-600',
  },
  {
    path: '/cases',
    title: 'Cases',
    description: 'Cases e histórias que mostram resultados dos clientes.',
    label: 'Cases',
    icon: BriefcaseIcon,
    iconClass: 'bg-violet-50 text-violet-600',
    labelClass: 'border-violet-100 bg-violet-50 text-violet-600',
  },
  {
    path: '/blog-posts',
    title: 'Blog e Notícias',
    description: 'Conteúdo editorial, publicações e seus autores.',
    label: 'Blog',
    icon: NewspaperIcon,
    iconClass: 'bg-amber-50 text-amber-600',
    labelClass: 'border-amber-100 bg-amber-50 text-amber-600',
  },
  {
    path: '/media',
    title: 'Repositório de Mídias',
    description: 'Imagens, vídeos e arquivos utilizados pelo CMS.',
    label: 'Mídias',
    icon: ImageIcon,
    iconClass: 'bg-emerald-50 text-emerald-600',
    labelClass: 'border-emerald-100 bg-emerald-50 text-emerald-600',
  },
  {
    path: '/about',
    title: 'Página Sobre',
    description: 'Serviços, parceiros e oportunidades da empresa.',
    label: 'Institucional',
    icon: UsersIcon,
    iconClass: 'bg-rose-50 text-rose-600',
    labelClass: 'border-rose-100 bg-rose-50 text-rose-600',
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
  HOME: { label: 'Home', className: 'bg-blue-50 text-blue-600' },
  CASE: { label: 'Case', className: 'bg-violet-50 text-violet-600' },
  BLOG: { label: 'Blog', className: 'bg-amber-50 text-amber-600' },
  MEDIA: { label: 'Mídia', className: 'bg-emerald-50 text-emerald-600' },
  ABOUT: { label: 'Sobre', className: 'bg-rose-50 text-rose-600' },
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
      <span className="block h-[clamp(1.5rem,1.7vw,2.75rem)] w-[clamp(2.5rem,3vw,5rem)] animate-pulse rounded bg-slate-100" />
    );
  }
  return (
    <strong className="text-[clamp(1.25rem,1.45vw,2.5rem)] leading-none text-slate-900">
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
      style: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Cases cadastrados',
      description: 'Cases ativos no CMS',
      value: metrics?.cases,
      icon: BriefcaseIcon,
      style: 'bg-violet-50 text-violet-600',
    },
    {
      title: 'Posts do blog',
      description: 'Publicações ativas',
      value: metrics?.blogPosts,
      icon: FileTextIcon,
      style: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Arquivos de mídia',
      description: 'Arquivos disponíveis',
      value: metrics?.mediaAssets,
      icon: ImageIcon,
      style: 'bg-emerald-50 text-emerald-600',
    },
  ];

  const quickActions = [
    {
      label: 'Novo post no blog',
      path: '/blog-posts',
      state: { create: true },
      icon: PlusIcon,
      style: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Novo case',
      path: '/cases',
      state: { create: true },
      icon: BriefcaseIcon,
      style: 'bg-violet-50 text-violet-600',
    },
    {
      label: 'Upload de mídia',
      path: '/media',
      state: undefined,
      icon: UploadIcon,
      style: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Editar conteúdo da Home',
      path: '/home-content',
      state: undefined,
      icon: HomeIcon,
      style: 'bg-blue-50 text-blue-600',
    },
  ];

  return (
    <div className="mx-auto flex min-h-full w-full flex-col gap-[clamp(0.75rem,1.4vh,2rem)]">
      <section className="relative flex min-h-[150px] shrink-0 items-center overflow-hidden rounded-[clamp(0.875rem,1vw,1.5rem)] border border-blue-100 bg-gradient-to-r from-blue-50 via-[#EEF6FF] to-[#E4F1FF] px-[clamp(1.25rem,2vw,3.5rem)] py-5 shadow-[0_8px_24px_rgba(37,99,235,0.06)] min-[1200px]:h-[clamp(150px,18vh,360px)] min-[1200px]:py-0">
        <div className="pointer-events-none absolute -right-12 -top-24 size-64 rotate-12 rounded-[56px] bg-blue-300/20" />
        <div className="pointer-events-none absolute right-48 top-16 h-28 w-60 -rotate-12 rounded-[44px] bg-white/35" />
        <div className="relative z-10 max-w-[clamp(34rem,48vw,68rem)]">
          <p className="mb-[clamp(0.25rem,0.5vh,0.75rem)] text-[clamp(0.6rem,0.55vw,1rem)] font-bold uppercase tracking-[0.18em] text-blue-500">
            Painel de controle
          </p>
          <h1 className="m-0 text-[clamp(1.35rem,1.45vw,2.75rem)] font-bold tracking-[-0.025em] text-slate-900">
            Bem-vindo de volta! <span aria-hidden="true">👋</span>
          </h1>
          <p className="mb-[clamp(0.5rem,1vh,1rem)] mt-1 text-[clamp(0.7rem,0.7vw,1.2rem)] font-normal text-slate-500">
            Gerencie todo o conteúdo do seu site de forma simples e rápida.
          </p>
          <button
            type="button"
            onClick={() => navigate('/home-content')}
            className="inline-flex h-[clamp(2rem,2.3vw,3.25rem)] items-center gap-2 rounded-[clamp(0.5rem,0.55vw,0.875rem)] border-0 bg-blue-500 px-[clamp(0.875rem,1vw,1.75rem)] text-[clamp(0.68rem,0.65vw,1.05rem)] font-semibold text-white shadow-[0_5px_12px_rgba(59,130,246,0.22)] transition hover:bg-blue-600"
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
            className="m-0 text-[clamp(0.75rem,0.72vw,1.25rem)] font-bold text-slate-800"
          >
            Visão geral
          </h2>
          {summary.isError && (
            <button
              type="button"
              onClick={() => void summary.refetch()}
              className="border-0 bg-transparent text-[10px] font-semibold text-red-500 hover:text-red-600"
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
                className="flex min-h-[88px] items-center gap-[clamp(0.75rem,0.8vw,1.5rem)] rounded-[clamp(0.75rem,0.8vw,1.25rem)] border border-slate-200 bg-white px-[clamp(1rem,1.15vw,2rem)] py-3 shadow-[0_3px_12px_rgba(15,23,42,0.025)] min-[1200px]:h-full min-[1200px]:min-h-0"
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
                  <h3 className="mb-0 mt-1 truncate text-[clamp(0.68rem,0.62vw,1.05rem)] font-semibold text-slate-700">
                    {metric.title}
                  </h3>
                  <p className="m-0 truncate text-[clamp(0.58rem,0.52vw,0.9rem)] font-normal text-slate-400">
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
            className="m-0 text-[clamp(0.75rem,0.72vw,1.25rem)] font-bold text-slate-800"
          >
            Módulos do sistema
          </h2>
          <p className="mb-0 mt-0.5 text-[clamp(0.58rem,0.52vw,0.9rem)] font-normal text-slate-400">
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
                className="group flex min-h-[220px] min-w-0 flex-col rounded-[clamp(0.75rem,0.8vw,1.25rem)] border border-slate-200 bg-white p-[clamp(0.875rem,1vw,1.75rem)] text-left shadow-[0_3px_12px_rgba(15,23,42,0.025)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_10px_25px_rgba(37,99,235,0.08)] min-[1200px]:h-full min-[1200px]:min-h-0"
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
                <h3 className="mb-0 mt-[clamp(0.75rem,1vh,1.25rem)] break-words text-[clamp(0.75rem,0.72vw,1.25rem)] font-bold leading-[1.35] text-slate-800 [overflow-wrap:anywhere]">
                  {module.title}
                </h3>
                <p className="mb-0 mt-1 break-words text-[clamp(0.62rem,0.58vw,1rem)] font-normal leading-[1.55] text-slate-400 [overflow-wrap:anywhere]">
                  {module.description}
                </p>
                <span className="mt-[clamp(0.75rem,1.2vh,1.5rem)] flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50/70 px-2 py-2 text-center text-[clamp(0.62rem,0.58vw,1rem)] font-semibold text-blue-600 transition group-hover:border-blue-200 group-hover:bg-blue-100/70 min-[1200px]:mt-auto">
                  Acessar módulo
                  <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-[clamp(0.625rem,0.75vw,1.25rem)] min-[1200px]:min-h-[clamp(190px,30vh,620px)] min-[1200px]:grid-cols-[1.2fr_1fr]">
        <article className="flex min-h-[166px] flex-col rounded-[clamp(0.75rem,0.8vw,1.25rem)] border border-slate-200 bg-white p-[clamp(1rem,1.15vw,2rem)] shadow-[0_3px_12px_rgba(15,23,42,0.025)] min-[1200px]:h-full min-[1200px]:min-h-0">
          <div className="mb-[clamp(0.625rem,0.8vh,1.25rem)] flex items-center justify-between">
            <div>
              <h2 className="m-0 text-[clamp(0.75rem,0.72vw,1.25rem)] font-bold text-slate-800">
                Atividade recente
              </h2>
              <p className="mb-0 mt-0.5 text-[clamp(0.58rem,0.52vw,0.9rem)] font-normal text-slate-400">
                Últimas alterações realizadas no CMS
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
                  className="min-h-7 flex-1 animate-pulse rounded-lg bg-slate-50"
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
                    <span className="min-w-0 flex-1 truncate text-[clamp(0.62rem,0.58vw,1rem)] text-slate-500">
                      <strong className="font-semibold text-slate-700">
                        {actionLabels[item.action]}:
                      </strong>{' '}
                      {item.title}
                    </span>
                    <time
                      className="shrink-0 text-[clamp(0.58rem,0.52vw,0.9rem)] text-slate-400"
                      dateTime={item.occurredAt}
                    >
                      {formatActivityDate(item.occurredAt)}
                    </time>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="grid min-h-[82px] flex-1 place-items-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60 text-center">
              <div>
                <FileTextIcon className="mx-auto size-[clamp(1.25rem,1.3vw,2.25rem)] text-slate-300" />
                <p className="mb-0 mt-1 text-[clamp(0.62rem,0.58vw,1rem)] font-normal text-slate-400">
                  Nenhuma atividade registrada ainda.
                </p>
              </div>
            </div>
          )}
        </article>

        <article className="flex min-h-[166px] flex-col rounded-[clamp(0.75rem,0.8vw,1.25rem)] border border-slate-200 bg-white p-[clamp(1rem,1.15vw,2rem)] shadow-[0_3px_12px_rgba(15,23,42,0.025)] min-[1200px]:h-full min-[1200px]:min-h-0">
          <div className="mb-[clamp(0.625rem,0.8vh,1.25rem)]">
            <h2 className="m-0 text-[clamp(0.75rem,0.72vw,1.25rem)] font-bold text-slate-800">
              Acesso rápido
            </h2>
            <p className="mb-0 mt-0.5 text-[clamp(0.58rem,0.52vw,0.9rem)] font-normal text-slate-400">
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
                  className="group flex min-h-10 min-w-0 items-center gap-[clamp(0.5rem,0.65vw,1rem)] rounded-[clamp(0.5rem,0.55vw,0.875rem)] border border-slate-100 bg-slate-50/70 px-[clamp(0.625rem,0.75vw,1.25rem)] py-2 text-left transition hover:border-blue-100 hover:bg-blue-50/60"
                >
                  <span
                    className={`grid size-[clamp(1.75rem,2vw,3.5rem)] shrink-0 place-items-center rounded-lg ${action.style}`}
                  >
                    <ActionIcon className="size-[clamp(0.875rem,1vw,1.75rem)]" />
                  </span>
                  <span className="min-w-0 truncate text-[clamp(0.58rem,0.55vw,0.95rem)] font-semibold text-slate-600 group-hover:text-slate-900">
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
