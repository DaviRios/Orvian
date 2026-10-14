import { lazy, Suspense, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { createReviewSchema } from '@orvian/contracts';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import {
  addReviewImages,
  createReview,
  type ReviewContentDTO,
  updateReview,
} from '../../../services/reviews.service';
import { uploadImage } from '../../../services/images.service';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { zodResolver } from '../../../lib/zod-resolver';

const RichTextEditor = lazy(() =>
  import('../../../components/RichTextEditor/RichTextEditor').then(
    (module) => ({ default: module.RichTextEditor }),
  ),
);

type ReviewFormValues = z.infer<typeof createReviewSchema>;

interface ReviewFormProps {
  item: ReviewContentDTO | null;
  onClose: () => void;
  onSaved: (message: string) => Promise<void>;
}

const inputClass =
  'w-full rounded-xl border border-orvian-secondary/70 bg-orvian-charcoal/70 px-3.5 py-2.5 text-sm text-orvian-ink outline-none transition placeholder:text-orvian-lavender focus:border-orvian-primary focus:bg-orvian-charcoal focus:ring-2 focus:ring-orvian-primary/20';
const labelClass =
  'flex flex-col gap-1.5 text-sm font-semibold text-orvian-ink';

export function ReviewForm({ item, onClose, onSaved }: ReviewFormProps) {
  const [error, setError] = useState('');
  const [images, setImages] = useState<(File | null)[]>([null, null, null]);
  const [previews, setPreviews] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const imageRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      title: item?.title ?? '',
      subtitle: item?.subtitle ?? '',
      shortTitle: item?.shortTitle ?? '',
      content: item?.content ?? '',
      industry: item?.industry ?? '',
      country: item?.country ?? '',
      tag: item?.tag ?? '',
      language: item?.language ?? 'PORTUGUESE',
    },
  });

  function changeImage(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const previous = previews[index];
    if (previous) URL.revokeObjectURL(previous);
    const preview = URL.createObjectURL(file);
    setImages((current) =>
      current.map((value, currentIndex) =>
        currentIndex === index ? file : value,
      ),
    );
    setPreviews((current) =>
      current.map((value, currentIndex) =>
        currentIndex === index ? preview : value,
      ),
    );
  }

  function removeImage(index: number) {
    const previous = previews[index];
    if (previous) URL.revokeObjectURL(previous);
    setImages((current) =>
      current.map((value, currentIndex) =>
        currentIndex === index ? null : value,
      ),
    );
    setPreviews((current) =>
      current.map((value, currentIndex) =>
        currentIndex === index ? null : value,
      ),
    );
  }

  async function submit(values: ReviewFormValues) {
    setError('');
    try {
      if (item) {
        await updateReview(item.id, values);
        await onSaved('Avaliação atualizada com sucesso!');
        return;
      }

      const reviewId = await createReview(values);
      const files = images.filter((file): file is File => file !== null);
      if (reviewId && files.length > 0) {
        const uploaded = await Promise.all(
          files.map((file) =>
            uploadImage(file, file.name.replace(/\.[^.]+$/, ''), ['review']),
          ),
        );
        await addReviewImages(
          reviewId,
          uploaded.map((asset) => asset.id),
        );
      }
      await onSaved('Avaliação criada com sucesso!');
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Erro ao salvar avaliação.',
      );
    }
  }

  return (
    <section className="mb-8 rounded-2xl border border-orvian-secondary/60 bg-orvian-shadow p-7 text-orvian-ink shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="m-0 text-lg font-bold text-orvian-ink">
            {item ? 'Editar avaliação' : 'Nova avaliação'}
          </h2>
          <p className="m-0 mt-1 text-sm text-orvian-muted">
            {item
              ? 'Atualize os campos da avaliação'
              : 'Preencha os campos para criar uma nova avaliação de sucesso'}
          </p>
        </div>
        <Button variant="secondary" className="px-3" onClick={onClose}>
          Fechar
        </Button>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(submit)}>
        {error && <Alert>{error}</Alert>}
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            Título *
            <input
              className={inputClass}
              placeholder="Título principal da avaliação"
              {...register('title')}
            />
            {errors.title?.message && (
              <span className="text-xs font-normal text-red-600">
                {errors.title.message}
              </span>
            )}
          </label>
          <label className={labelClass}>
            Título curto
            <input
              className={inputClass}
              placeholder="Versão resumida"
              {...register('shortTitle')}
            />
          </label>
        </div>
        <label className={labelClass}>
          Subtítulo
          <input
            className={inputClass}
            placeholder="Subtítulo descritivo"
            {...register('subtitle')}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <label className={labelClass}>
            Setor / Indústria
            <input
              className={inputClass}
              placeholder="Ex: Fintech, Saúde, Varejo"
              {...register('industry')}
            />
          </label>
          <label className={labelClass}>
            País
            <input
              className={inputClass}
              placeholder="Ex: Brasil"
              {...register('country')}
            />
          </label>
          <label className={labelClass}>
            Tag
            <input
              className={inputClass}
              placeholder="Ex: Transformação Digital"
              {...register('tag')}
            />
          </label>
          <label className={labelClass}>
            Idioma
            <select className={inputClass} {...register('language')}>
              <option value="PORTUGUESE">Português</option>
              <option value="ENGLISH">English</option>
            </select>
          </label>
        </div>
        <label className={labelClass}>
          Conteúdo
          <Suspense
            fallback={
              <div className="min-h-48 rounded-xl bg-orvian-charcoal" />
            }
          >
            <RichTextEditor
              value={watch('content') ?? ''}
              onChange={(value) => setValue('content', value)}
              placeholder="Descreva a avaliação de sucesso em detalhes..."
              minHeight={200}
            />
          </Suspense>
        </label>

        {!item && (
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-semibold text-orvian-ink">
              Imagens da avaliação{' '}
              <span className="font-normal text-orvian-muted">(até 3)</span>
            </legend>
            <div className="flex flex-wrap gap-3">
              {([0, 1, 2] as const).map((index) => (
                <div key={index} className="h-28 w-28 shrink-0">
                  <input
                    ref={imageRefs[index]}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => changeImage(index, event)}
                  />
                  {previews[index] ? (
                    <div className="relative h-full w-full overflow-hidden rounded-xl border border-orvian-secondary/60">
                      <img
                        src={previews[index] ?? ''}
                        alt={`Imagem ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute right-1.5 top-1.5 rounded-md bg-slate-900/70 px-2 py-1 text-xs text-white hover:bg-red-600"
                        onClick={() => removeImage(index)}
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-orvian-secondary bg-orvian-charcoal/70 text-sm font-semibold text-orvian-orange hover:border-orvian-primary"
                      onClick={() => imageRefs[index].current?.click()}
                    >
                      Imagem {index + 1}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </fieldset>
        )}

        <div className="flex justify-end gap-3 border-t border-orvian-secondary/50 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Salvando...'
              : item
                ? 'Atualizar avaliação'
                : 'Salvar avaliação'}
          </Button>
        </div>
      </form>
    </section>
  );
}
