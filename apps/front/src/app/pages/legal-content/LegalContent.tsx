import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { z } from 'zod';
import {
  saveLegalDocumentSchema,
  type Language,
  type LegalDocumentDto,
  type LegalDocumentType,
} from '@orvian/contracts';
import { useNavigate } from 'react-router-dom';
import {
  FileTextIcon,
  type IconProps,
} from '../../components/icons/OrvianIcons';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { ModulePageHero } from '../../components/ui/ModulePageHero';
import { zodResolver } from '../../lib/zod-resolver';
import {
  deleteLegalDocument,
  listLegalDocuments,
  publishLegalDocument,
  saveLegalDocument,
  unpublishLegalDocument,
} from '../../services/legal-documents.service';

const RichTextEditor = lazy(() =>
  import('../../components/RichTextEditor/RichTextEditor').then((module) => ({
    default: module.RichTextEditor,
  })),
);

type FormValues = z.infer<typeof saveLegalDocumentSchema>;

interface DocumentDetails {
  label: string;
  description: string;
  defaultTitle: Record<Language, string>;
  icon: ComponentType<IconProps>;
}

const DOCUMENTS: Record<LegalDocumentType, DocumentDetails> = {
  PRIVACY_POLICY: {
    label: 'Política de Privacidade',
    description: 'Explique como os dados pessoais são coletados e utilizados.',
    defaultTitle: {
      PORTUGUESE: 'Política de Privacidade',
      ENGLISH: 'Privacy Policy',
    },
    icon: FileTextIcon,
  },
  TERMS_OF_SERVICE: {
    label: 'Termos de Serviço',
    description: 'Defina as regras e condições de uso dos serviços.',
    defaultTitle: {
      PORTUGUESE: 'Termos de Serviço',
      ENGLISH: 'Terms of Service',
    },
    icon: FileTextIcon,
  },
};

const inputClass =
  'w-full rounded-xl border border-orvian-secondary/70 bg-orvian-charcoal/70 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-orvian-gray focus:border-orvian-primary focus:ring-2 focus:ring-orvian-primary/20';
const labelClass = 'flex flex-col gap-1.5 text-sm font-semibold text-white';

function replaceDocument(
  items: LegalDocumentDto[] | undefined,
  document: LegalDocumentDto,
) {
  const current = items ?? [];
  const index = current.findIndex((item) => item.id === document.id);
  if (index < 0) return [...current, document];
  return current.map((item) => (item.id === document.id ? document : item));
}

export function LegalContent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeType, setActiveType] =
    useState<LegalDocumentType>('PRIVACY_POLICY');
  const [language, setLanguage] = useState<Language>('PORTUGUESE');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [working, setWorking] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const queryKey = useMemo(
    () => ['legal-documents', language] as const,
    [language],
  );
  const documentsQuery = useQuery({
    queryKey,
    queryFn: ({ signal }) => listLegalDocuments(language, signal),
  });
  const document = (documentsQuery.data ?? []).find(
    (item) => item.type === activeType,
  );
  const details = DOCUMENTS[activeType];
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(saveLegalDocumentSchema),
    defaultValues: {
      title: details.defaultTitle[language],
      content: '',
      language,
    },
  });

  useEffect(() => {
    reset({
      title: document?.title ?? details.defaultTitle[language],
      content: document?.content ?? '',
      language,
    });
  }, [details, document, language, reset]);

  useEffect(() => {
    setError('');
    setSuccess('');
  }, [activeType, language]);

  function updateCache(nextDocument: LegalDocumentDto) {
    queryClient.setQueryData<LegalDocumentDto[]>(queryKey, (items) =>
      replaceDocument(items, nextDocument),
    );
    void queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
  }

  async function persist(values: FormValues, publish: boolean) {
    setWorking(true);
    setError('');
    setSuccess('');
    try {
      let saved = await saveLegalDocument(activeType, values);
      if (publish && !saved.isPublished) {
        await publishLegalDocument(saved.id);
        const now = new Date().toISOString();
        saved = {
          ...saved,
          isDraft: false,
          isPublished: true,
          publishedAt: now,
          updatedAt: now,
        };
      }
      updateCache(saved);
      setSuccess(
        publish
          ? `${details.label} publicada com sucesso.`
          : `${details.label} salva com sucesso.`,
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : `Não foi possível salvar ${details.label.toLocaleLowerCase('pt-BR')}.`,
      );
    } finally {
      setWorking(false);
    }
  }

  async function unpublish() {
    if (!document) return;
    setWorking(true);
    setError('');
    setSuccess('');
    try {
      await unpublishLegalDocument(document.id);
      updateCache({
        ...document,
        isDraft: true,
        isPublished: false,
        publishedAt: null,
        updatedAt: new Date().toISOString(),
      });
      setSuccess(`${details.label} voltou para rascunho.`);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Não foi possível despublicar o documento.',
      );
    } finally {
      setWorking(false);
    }
  }

  async function remove() {
    if (!document) return;
    setWorking(true);
    setError('');
    setSuccess('');
    try {
      await deleteLegalDocument(document.id);
      queryClient.setQueryData<LegalDocumentDto[]>(queryKey, (items) =>
        (items ?? []).filter((item) => item.id !== document.id),
      );
      void queryClient.invalidateQueries({
        queryKey: ['dashboard', 'summary'],
      });
      setConfirmDelete(false);
      setSuccess('Conteúdo removido com sucesso.');
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Não foi possível remover o documento.',
      );
    } finally {
      setWorking(false);
    }
  }

  const status = document?.isPublished
    ? 'Publicado'
    : document
      ? 'Rascunho'
      : 'Não criado';

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1800px] flex-col gap-[clamp(0.875rem,1.4vh,2rem)]">
      <ModulePageHero
        eyebrow="Conteúdo institucional"
        title="Documentos legais"
        description="Crie e publique a Política de Privacidade e os Termos de Serviço do site."
        icon={FileTextIcon}
        countLabel={`${documentsQuery.data?.length ?? 0} ${
          documentsQuery.data?.length === 1 ? 'documento' : 'documentos'
        }`}
        onBack={() => navigate('/')}
      />

      <section aria-labelledby="legal-documents-title">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="legal-documents-title"
              className="m-0 text-[clamp(0.8rem,0.78vw,1.3rem)] font-bold text-white"
            >
              Documentos disponíveis
            </h2>
            <p className="mb-0 mt-0.5 text-[clamp(0.62rem,0.56vw,0.95rem)] text-orvian-lavender">
              Selecione o documento e o idioma que deseja editar
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-orvian-lavender">
            Idioma
            <select
              className="h-9 rounded-xl border border-orvian-secondary bg-orvian-shadow px-3 text-xs text-white outline-none focus:border-orvian-primary"
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
            >
              <option value="PORTUGUESE">Português</option>
              <option value="ENGLISH">English</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(Object.keys(DOCUMENTS) as LegalDocumentType[]).map((type) => {
            const item = DOCUMENTS[type];
            const ItemIcon = item.icon;
            const active = type === activeType;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveType(type)}
                className={`flex min-h-[96px] items-center gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-orvian-primary/70 ${
                  active
                    ? 'border-orvian-primary bg-orvian-primary/10'
                    : 'border-orvian-secondary/35 bg-orvian-shadow'
                }`}
              >
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-xl ${
                    active
                      ? 'bg-orvian-primary text-white'
                      : 'bg-orvian-secondary/25 text-orvian-lavender'
                  }`}
                >
                  <ItemIcon className="size-6" />
                </span>
                <span>
                  <strong
                    className={`block text-sm ${active ? 'text-orvian-primary' : 'text-white'}`}
                  >
                    {item.label}
                  </strong>
                  <span className="mt-1 block text-xs leading-relaxed text-orvian-lavender">
                    {item.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-orvian-secondary/35 bg-orvian-shadow p-[clamp(1rem,1.3vw,2rem)] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-orvian-secondary/35 pb-4">
          <div>
            <h2 className="m-0 text-lg font-bold text-white">
              {details.label}
            </h2>
            <p className="mb-0 mt-1 text-xs text-orvian-lavender">
              {language === 'PORTUGUESE'
                ? 'Versão em português'
                : 'English version'}
            </p>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
              document?.isPublished
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-orvian-gold/35 bg-orvian-gold/10 text-orvian-gold'
            }`}
          >
            {status}
          </span>
        </div>

        {documentsQuery.isPending ? (
          <div className="grid min-h-72 place-items-center text-sm text-orvian-lavender">
            Carregando documento…
          </div>
        ) : documentsQuery.isError ? (
          <Alert>
            Não foi possível carregar os documentos.{' '}
            <button
              type="button"
              className="border-0 bg-transparent font-bold text-white underline"
              onClick={() => void documentsQuery.refetch()}
            >
              Tentar novamente
            </button>
          </Alert>
        ) : (
          <form className="flex flex-col gap-5">
            {error && <Alert>{error}</Alert>}
            {success && <Alert tone="success">{success}</Alert>}

            <input type="hidden" {...register('language')} />
            <label className={labelClass}>
              Título *
              <input
                className={inputClass}
                placeholder={details.defaultTitle[language]}
                {...register('title')}
              />
              {errors.title?.message && (
                <span className="text-xs font-normal text-red-300">
                  {errors.title.message}
                </span>
              )}
            </label>

            <label className={labelClass}>
              Conteúdo *
              <Suspense
                fallback={
                  <div className="min-h-80 animate-pulse rounded-xl bg-orvian-charcoal" />
                }
              >
                <RichTextEditor
                  key={`${activeType}-${language}-${document?.id ?? 'new'}`}
                  value={watch('content')}
                  onChange={(value) =>
                    setValue('content', value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  placeholder="Escreva o conteúdo completo do documento..."
                  minHeight={360}
                />
              </Suspense>
              {errors.content?.message && (
                <span className="text-xs font-normal text-red-300">
                  {errors.content.message}
                </span>
              )}
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-orvian-secondary/35 pt-4">
              <div>
                {document && (
                  <Button
                    variant="danger"
                    onClick={() => setConfirmDelete(true)}
                    disabled={working}
                  >
                    Excluir
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap justify-end gap-3">
                {document?.isPublished && (
                  <Button
                    variant="secondary"
                    onClick={() => void unpublish()}
                    disabled={working}
                  >
                    Voltar para rascunho
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() =>
                    void handleSubmit((values) => persist(values, false))()
                  }
                  disabled={working}
                >
                  {working ? 'Salvando…' : 'Salvar'}
                </Button>
                <Button
                  onClick={() =>
                    void handleSubmit((values) => persist(values, true))()
                  }
                  disabled={working}
                >
                  {working ? 'Publicando…' : 'Salvar e publicar'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </section>

      {confirmDelete && document && (
        <div className="fixed inset-0 z-[200] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-legal-title"
            className="w-full max-w-md rounded-2xl border border-orvian-secondary bg-orvian-shadow p-6 shadow-2xl"
          >
            <h2
              id="delete-legal-title"
              className="m-0 text-lg font-bold text-white"
            >
              Excluir {details.label}?
            </h2>
            <p className="mb-6 mt-2 text-sm leading-relaxed text-orvian-lavender">
              O conteúdo será removido do painel e deixará de ser publicado. O
              registro permanecerá no banco como inativo.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setConfirmDelete(false)}
                disabled={working}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => void remove()}
                disabled={working}
              >
                {working ? 'Excluindo…' : 'Excluir conteúdo'}
              </Button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default LegalContent;
