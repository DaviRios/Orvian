import {
  type ComponentType,
  type FormEvent,
  type ReactNode,
  useMemo,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/auth';
import {
  BellIcon,
  BriefcaseIcon,
  CalendarIcon,
  FolderIcon,
  HomeIcon,
  ImageIcon,
  LogOutIcon,
  MenuIcon,
  NewspaperIcon,
  SearchIcon,
  SettingsIcon,
  XIcon,
  type IconProps,
} from '../icons/CmsIcons';

interface AdminLayoutProps {
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

interface NavigationItem {
  path?: string;
  label: string;
  description?: string;
  icon: ComponentType<IconProps>;
}

const navigationItems: NavigationItem[] = [
  { path: '/', label: 'Início', icon: HomeIcon },
  { path: '/home-content', label: 'Conteúdo', icon: FolderIcon },
  { path: '/cases', label: 'Cases', icon: BriefcaseIcon },
  { path: '/blog-posts', label: 'Blog', icon: NewspaperIcon },
  { path: '/media', label: 'Mídias', icon: ImageIcon },
  { label: 'Configurações', description: 'Em breve', icon: SettingsIcon },
];

const searchableModules = [
  { path: '/', label: 'Início', keywords: 'dashboard painel' },
  {
    path: '/home-content',
    label: 'Conteúdo da Home',
    keywords: 'slides logos ecossistema popups links',
  },
  {
    path: '/cases',
    label: 'Cases',
    keywords: 'histórias clientes portfólio',
  },
  {
    path: '/blog-posts',
    label: 'Blog e Notícias',
    keywords: 'posts autores editorial',
  },
  {
    path: '/media',
    label: 'Repositório de Mídias',
    keywords: 'imagens vídeos arquivos upload',
  },
  {
    path: '/about',
    label: 'Página Sobre',
    keywords: 'serviços parceiros vagas institucional',
  },
];

function formattedDate() {
  const value = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date());
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const initials = (user?.name ?? user?.username ?? 'Administrador')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  function goTo(path?: string) {
    if (!path) return;
    navigate(path);
    onNavigate?.();
  }

  return (
    <div className="flex h-full flex-col">
      <button
        className="flex h-20 items-center gap-3 border-0 bg-transparent px-6 text-left"
        onClick={() => goTo('/')}
        aria-label="Ir para o início"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-500 text-lg font-bold text-white shadow-[0_8px_20px_rgba(59,130,246,0.25)]">
          S
        </span>
        <span>
          <strong className="block text-lg font-bold tracking-[0.08em] text-slate-900">
            Soir
          </strong>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
            Gestão de conteúdo
          </span>
        </span>
      </button>

      <nav className="flex-1 px-3 py-3" aria-label="Navegação principal">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Menu principal
        </p>
        <div className="flex flex-col gap-1">
          {navigationItems.map((item) => {
            const active = item.path
              ? item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)
              : false;
            const NavigationIcon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                aria-current={active ? 'page' : undefined}
                disabled={!item.path}
                title={item.description}
                onClick={() => goTo(item.path)}
                className={`group flex h-11 w-full items-center gap-3 rounded-xl border-0 px-3 text-left text-sm font-semibold transition ${
                  active
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                } disabled:cursor-not-allowed disabled:opacity-55`}
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-lg transition ${
                    active
                      ? 'bg-blue-500 text-white shadow-[0_5px_12px_rgba(59,130,246,0.24)]'
                      : 'text-slate-400 group-hover:text-blue-500'
                  }`}
                >
                  <NavigationIcon className="size-[18px]" />
                </span>
                <span className="flex-1">{item.label}</span>
                {!item.path && (
                  <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    Em breve
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-sky-400 text-xs font-bold text-white">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block truncate text-xs font-semibold text-slate-800">
              {user?.name ?? 'Administrador'}
            </strong>
            <span className="block truncate text-[10px] text-slate-400">
              {user?.email ?? user?.username}
            </span>
          </span>
          <button
            type="button"
            onClick={() => void signOut()}
            className="grid size-8 shrink-0 place-items-center rounded-lg border-0 bg-transparent text-slate-400 transition hover:bg-red-50 hover:text-red-500"
            aria-label="Sair"
            title="Sair"
          >
            <LogOutIcon className="size-[17px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminLayout({
  children,
  actionLabel,
  onAction,
}: AdminLayoutProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    if (!normalized) return [];
    return searchableModules.filter(({ label, keywords }) =>
      `${label} ${keywords}`.toLocaleLowerCase('pt-BR').includes(normalized),
    );
  }, [query]);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    if (!results[0]) return;
    navigate(results[0].path);
    setQuery('');
  }

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-[#F8FAFD] text-slate-900">
      <aside className="hidden h-dvh w-[220px] shrink-0 border-r border-slate-200 bg-white lg:block">
        <SidebarContent />
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 border-0 bg-slate-950/30 backdrop-blur-[2px]"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Fechar menu"
          />
          <aside className="relative h-dvh w-[280px] border-r border-slate-200 bg-white shadow-2xl">
            <button
              type="button"
              className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-lg border-0 bg-slate-50 text-slate-500"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fechar menu"
            >
              <XIcon className="size-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileMenuOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative z-50 flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:px-6">
          <button
            type="button"
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <MenuIcon className="size-5" />
          </button>

          <form
            className="relative w-full max-w-[430px]"
            onSubmit={submitSearch}
          >
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-[17px] -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar no CMS..."
              aria-label="Buscar no CMS"
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
            {query && (
              <div className="absolute left-0 right-0 top-11 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                {results.length > 0 ? (
                  results.map((result) => (
                    <button
                      key={result.path}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg border-0 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => {
                        navigate(result.path);
                        setQuery('');
                      }}
                    >
                      <SearchIcon className="size-4 text-slate-400" />
                      {result.label}
                    </button>
                  ))
                ) : (
                  <p className="m-0 px-3 py-2 text-xs text-slate-400">
                    Nenhum módulo encontrado.
                  </p>
                )}
              </div>
            )}
          </form>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
              <CalendarIcon className="size-4 text-blue-500" />
              <span>{formattedDate()}</span>
            </div>
            <span className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />
            <div className="relative">
              <button
                type="button"
                className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setNotificationsOpen((open) => !open)}
                aria-label="Notificações"
                aria-expanded={notificationsOpen}
              >
                <BellIcon className="size-[18px]" />
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-11 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
                  <strong className="text-xs font-semibold text-slate-800">
                    Notificações
                  </strong>
                  <p className="mb-0 mt-2 text-xs leading-5 text-slate-400">
                    Nenhuma nova notificação.
                  </p>
                </div>
              )}
            </div>
            {actionLabel && onAction && (
              <button
                type="button"
                onClick={onAction}
                className="h-9 rounded-xl border-0 bg-blue-500 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-600"
              >
                {actionLabel}
              </button>
            )}
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 lg:p-5 xl:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
