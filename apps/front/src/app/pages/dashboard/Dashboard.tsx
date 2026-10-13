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
  icon: ComponentType<IconProps>;
  iconClass: string;
}

const modules: DashboardModule[] = [
  {
    path: '/home-content',
    title: 'Conteúdo da Home',
    description: 'Slides, ecossistema, logos e popups da página inicial.',
    icon: HomeIcon,
    iconClass: 'bg-blue-50 text-blue-600',
  },
  {
    path: '/cases',
    title: 'Cases',
    description: 'Cases e histórias que mostram resultados dos clientes.',
    icon: BriefcaseIcon,
    iconClass: 'bg-violet-50 text-violet-600',
  },
  {
    path: '/blog-posts',
    title: 'Blog e Notícias',
    description: 'Conteúdo editorial, publicações e seus autores.',
    icon: NewspaperIcon,
    iconClass: 'bg-amber-50 text-amber-600',
  },
  {
    path: '/media',
    title: 'Repositório de Mídias',
    description: 'Imagens, vídeos e arquivos utilizados pelo CMS.',
    icon: ImageIcon,
    iconClass: 'bg-emerald-50 text-emerald-600',
  },
  {
    path: '/about',
    title: 'Página Sobre',
    description: 'Serviços, parceiros e oportunidades da empresa.',
    icon: UsersIcon,
    iconClass: 'bg-rose-50 text-rose-600',
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
      <span className="block h-6 w-10 animate-pulse rounded bg-slate-100" />
    );
  }
  return (
    <strong className="text-xl leading-none text-slate-900">
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
    <div className="mx-auto flex min-h-full w-full max-w-[1680px] flex-col gap-3.5">
      <section className="relative flex h-[126px] shrink-0 items-center overflow-hidden rounded-[14px] border border-blue-100 bg-gradient-to-r from-blue-50 via-[#EEF6FF] to-[#E4F1FF] px-7 shadow-[0_8px_24px_rgba(37,99,235,0.06)] sm:px-8">
        <div className="pointer-events-none absolute -right-12 -top-24 size-64 rotate-12 rounded-[56px] bg-blue-300/20" />
        <div className="pointer-events-none absolute right-48 top-16 h-28 w-60 -rotate-12 rounded-[44px] bg-white/35" />
        <div className="relative z-10 max-w-[680px]">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-blue-500">
            Painel de controle
          </p>
          <h1 className="m-0 text-[22px] font-bold tracking-[-0.025em] text-slate-900 sm:text-2xl">
            Bem-vindo de volta! <span aria-hidden="true">👋</span>
          </h1>
          <p className="mb-2 mt-1 text-xs font-normal text-slate-500">
            Gerencie todo o conteúdo do seu site de forma simples e rápida.
          </p>
          <button
            type="button"
            onClick={() => navigate('/home-content')}
            className="inline-flex h-8 items-center gap-2 rounded-lg border-0 bg-blue-500 px-3.5 text-[11px] font-semibold text-white shadow-[0_5px_12px_rgba(59,130,246,0.22)] transition hover:bg-blue-600"
          >
            Começar agora
            <ArrowRightIcon className="size-3.5" />
          </button>
        </div>
        <div className="absolute bottom-[-14px] right-7 hidden lg:block xl:right-16">
          <DashboardIllustration />
        </div>
      </section>

      <section aria-labelledby="metrics-title">
        <div className="mb-2 flex items-center justify-between">
          <h2
            id="metrics-title"
            className="m-0 text-xs font-bold text-slate-800"
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
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {metricCards.map((metric) => {
            const MetricIcon = metric.icon;
            return (
              <article
                key={metric.title}
                className="flex h-[88px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 shadow-[0_3px_12px_rgba(15,23,42,0.025)]"
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-xl ${metric.style}`}
                >
                  <MetricIcon className="size-5" />
                </span>
                <div className="min-w-0">
                  <MetricValue
                    loading={summary.isPending}
                    value={metric.value}
                  />
                  <h3 className="mb-0 mt-1 truncate text-[11px] font-semibold text-slate-700">
                    {metric.title}
                  </h3>
                  <p className="m-0 truncate text-[9px] font-normal text-slate-400">
                    {metric.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="modules-title">
        <h2
          id="modules-title"
          className="mb-2 text-xs font-bold text-slate-800"
        >
          Módulos do sistema
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {modules.map((module) => {
            const ModuleIcon = module.icon;
            return (
              <button
                key={module.path}
                type="button"
                onClick={() => navigate(module.path)}
                className="group flex h-[164px] min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-4 text-left shadow-[0_3px_12px_rgba(15,23,42,0.025)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_10px_25px_rgba(37,99,235,0.08)]"
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-xl ${module.iconClass}`}
                >
                  <ModuleIcon className="size-5" />
                </span>
                <h3 className="mb-0 mt-3 truncate text-xs font-bold text-slate-800">
                  {module.title}
                </h3>
                <p className="mb-0 mt-1 line-clamp-2 min-h-8 text-[10px] font-normal leading-4 text-slate-400">
                  {module.description}
                </p>
                <span className="mt-auto flex items-center gap-1.5 text-[10px] font-semibold text-blue-500">
                  Acessar módulo
                  <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[1.2fr_1fr]">
        <article className="h-[166px] rounded-xl border border-slate-200 bg-white p-4 shadow-[0_3px_12px_rgba(15,23,42,0.025)]">
          <div className="mb-2.5 flex items-center justify-between">
            <div>
              <h2 className="m-0 text-xs font-bold text-slate-800">
                Atividade recente
              </h2>
              <p className="mb-0 mt-0.5 text-[9px] font-normal text-slate-400">
                Últimas alterações realizadas no CMS
              </p>
            </div>
          </div>

          {summary.isPending ? (
            <div className="space-y-2" aria-label="Carregando atividades">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-7 animate-pulse rounded-lg bg-slate-50"
                />
              ))}
            </div>
          ) : summary.data?.recentActivity.length ? (
            <ul className="m-0 space-y-1.5 p-0">
              {summary.data.recentActivity.map((item) => {
                const resource = resourceStyles[item.resource];
                return (
                  <li key={item.id} className="flex h-7 items-center gap-2.5">
                    <span
                      className={`rounded-md px-2 py-1 text-[8px] font-bold uppercase tracking-wide ${resource.className}`}
                    >
                      {resource.label}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[10px] text-slate-500">
                      <strong className="font-semibold text-slate-700">
                        {actionLabels[item.action]}:
                      </strong>{' '}
                      {item.title}
                    </span>
                    <time
                      className="shrink-0 text-[9px] text-slate-400"
                      dateTime={item.occurredAt}
                    >
                      {formatActivityDate(item.occurredAt)}
                    </time>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="grid h-[82px] place-items-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60 text-center">
              <div>
                <FileTextIcon className="mx-auto size-5 text-slate-300" />
                <p className="mb-0 mt-1 text-[10px] font-normal text-slate-400">
                  Nenhuma atividade registrada ainda.
                </p>
              </div>
            </div>
          )}
        </article>

        <article className="h-[166px] rounded-xl border border-slate-200 bg-white p-4 shadow-[0_3px_12px_rgba(15,23,42,0.025)]">
          <div className="mb-2.5">
            <h2 className="m-0 text-xs font-bold text-slate-800">
              Acesso rápido
            </h2>
            <p className="mb-0 mt-0.5 text-[9px] font-normal text-slate-400">
              Atalhos para as tarefas mais frequentes
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => navigate(action.path, { state: action.state })}
                  className="group flex h-10 min-w-0 items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-2.5 text-left transition hover:border-blue-100 hover:bg-blue-50/60"
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-lg ${action.style}`}
                  >
                    <ActionIcon className="size-3.5" />
                  </span>
                  <span className="min-w-0 truncate text-[9px] font-semibold text-slate-600 group-hover:text-slate-900">
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
