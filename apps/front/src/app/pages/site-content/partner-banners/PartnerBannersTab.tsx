import { useState, useEffect, FormEvent, ChangeEvent, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listPartnerBanners,
  createPartnerBanner,
  updatePartnerBanner,
  deletePartnerBanner,
  publishPartnerBanner,
  unpublishPartnerBanner,
  PartnerBannerDTO,
} from '../../../services/partner-banners.service';
import { uploadImage } from '../../../services/images.service';
import { ConfirmDialog } from '../ConfirmDialog';
import { EmptyTabState } from '../EmptyTabState';

interface Props {
  openFormTrigger: number;
  onSuccess: (msg: string) => void;
  onCountChange: (count: number) => void;
}

export function PartnerBannersTab({
  openFormTrigger,
  onSuccess,
  onCountChange,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState<PartnerBannerDTO | null>(null);
  const [ecoName, setEcoName] = useState('');
  const [ecoImageFile, setEcoImageFile] = useState<File | null>(null);
  const [ecoImagePreview, setEcoImagePreview] = useState('');
  const [pendingDelete, setPendingDelete] = useState<{
    label: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const ecoImageRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const partnerBannerQuery = useQuery({
    queryKey: ['partnerBanners'],
    queryFn: ({ signal }) => listPartnerBanners(signal),
  });
  const ecoItems = partnerBannerQuery.data ?? [];
  const loading = partnerBannerQuery.isPending;
  useEffect(
    () => onCountChange(ecoItems.length),
    [ecoItems.length, onCountChange],
  );

  useEffect(() => {
    if (openFormTrigger > 0) openItemForm();
  }, [openFormTrigger]);

  function openItemForm(item?: PartnerBannerDTO) {
    if (item) {
      setEditingItem(item);
      setEcoName(item.name ?? '');
    }
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEcoName('');
    if (ecoImagePreview && ecoImageFile) URL.revokeObjectURL(ecoImagePreview);
    setEcoImageFile(null);
    setEcoImagePreview('');
    setEditingItem(null);
    setError('');
  }

  function onEcoImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEcoImageFile(file);
    if (ecoImagePreview) URL.revokeObjectURL(ecoImagePreview);
    setEcoImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingItem) {
        let imageId: string | undefined;
        if (ecoImageFile) {
          const name = ecoImageFile.name.replace(/\.[^.]+$/, '');
          const uploaded = await uploadImage(ecoImageFile, name, [
            'partner-banner',
          ]);
          imageId = uploaded.id;
        }
        await updatePartnerBanner(editingItem.id, {
          name: ecoName || undefined,
          imageId,
        });
        onSuccess('Item atualizado com sucesso!');
      } else {
        let imageId: string | undefined;
        if (ecoImageFile) {
          const name = ecoImageFile.name.replace(/\.[^.]+$/, '');
          const uploaded = await uploadImage(ecoImageFile, name, [
            'partner-banner',
          ]);
          imageId = uploaded.id;
        }
        await createPartnerBanner({ name: ecoName, imageId });
        onSuccess('Item criado com sucesso!');
      }
      setShowForm(false);
      resetForm();
      const data = await listPartnerBanners();
      queryClient.setQueryData(['partnerBanners'], data);
      onCountChange(data.length);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : editingItem
            ? 'Erro ao atualizar item.'
            : 'Erro ao criar item.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(item: PartnerBannerDTO) {
    try {
      if (item.isPublished) await unpublishPartnerBanner(item.id);
      else await publishPartnerBanner(item.id);
      const data = await listPartnerBanners();
      queryClient.setQueryData(['partnerBanners'], data);
      onCountChange(data.length);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Erro ao alterar a publicação do item.',
      );
    }
  }

  function handleDelete(item: PartnerBannerDTO) {
    setPendingDelete({
      label: item.name,
      onConfirm: async () => {
        await deletePartnerBanner(item.id);
        const data = await listPartnerBanners();
        queryClient.setQueryData(['partnerBanners'], data);
        onCountChange(data.length);
      },
    });
  }

  if (loading) {
    return (
      <div
        className={'flex flex-col items-center [gap:14px] [padding:80px_40px]'}
      >
        <div
          className={
            '[width:38px] [height:38px] [border:3px_solid_#68577E] [border-top-color:#EF5928] [border-radius:50%] animate-spin'
          }
        />
        <p className={'[font-size:14px] [color:#9981AE] [margin:0]'}>
          Carregando...
        </p>
      </div>
    );
  }

  return (
    <>
      {showForm && (
        <div
          className={
            '[background:#302638] [border-radius:20px] [border:1px_solid_#68577E] [box-shadow:0_4px_24px_rgba(84,_200,_232,_0.08)] [padding:28px_32px] [margin-bottom:32px]'
          }
        >
          <div
            className={'flex items-start justify-between [margin-bottom:22px]'}
          >
            <div>
              <h2
                className={
                  '[font-size:17px] font-bold [color:#F7F2FA] [margin:0_0_4px]'
                }
              >
                {editingItem
                  ? 'Editar parceiro/banner'
                  : 'Novo parceiro/banner'}
              </h2>
              <p className={'[font-size:14px] [color:#9981AE] [margin:0]'}>
                {editingItem
                  ? 'Atualize os campos do parceiro/banner'
                  : 'Adicione uma empresa à área de parceiros/banners do site'}
              </p>
            </div>
            <button
              className={
                '[width:32px] [height:32px] [border-radius:9px] [border:1px_solid_#68577E] [background:#25232C] [color:#9981AE] flex items-center justify-center cursor-pointer shrink-0 [transition:background_0.15s,_color_0.15s] hover:[background:#fef2f2] hover:[color:#dc2626] hover:[border-color:#fecaca]'
              }
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              title="Fechar"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <form className={'flex flex-col [gap:16px]'} onSubmit={handleSubmit}>
            {error && (
              <div
                className={`${'flex items-center [gap:8px] [border-radius:10px] [padding:12px_16px] [font-size:14px] font-medium [margin-bottom:20px]'} ${'[background:#fef2f2] [border:1px_solid_#fecaca] [color:#dc2626]'}`}
              >
                {error}
              </div>
            )}
            <div
              className={
                'grid [grid-template-columns:180px_1fr] [gap:24px] max-[640px]:[grid-template-columns:1fr]'
              }
            >
              <div className={'flex flex-col [gap:8px]'}>
                <label
                  className={
                    '[font-size:14px] font-semibold [color:#E7E1EA] [letter-spacing:0.01em]'
                  }
                >
                  Imagem
                </label>
                <div
                  className={`${'[aspect-ratio:1] [border:2px_dashed_#A1C8FA] [border-radius:14px] [background:#25232C] flex items-center justify-center cursor-pointer overflow-hidden [transition:border-color_0.2s,_background_0.2s] hover:[border-color:#EF5928] hover:[background:#302638]'} ${ecoImagePreview ? '[border-style:solid] [border-color:#A1C8FA]' : ''}`}
                  onClick={() => ecoImageRef.current?.click()}
                >
                  <input
                    ref={ecoImageRef}
                    type="file"
                    accept="image/*"
                    className={'hidden'}
                    onChange={onEcoImageChange}
                  />
                  {ecoImagePreview ? (
                    <img
                      src={ecoImagePreview}
                      alt="Preview"
                      className={
                        'w-full h-full object-contain [padding:10px] [box-sizing:border-box]'
                      }
                    />
                  ) : (
                    <div
                      className={
                        'flex flex-col items-center [gap:6px] [padding:14px] text-center'
                      }
                    >
                      <div
                        className={
                          '[width:40px] [height:40px] [border-radius:11px] [background:#68577E] flex items-center justify-center [color:#EF5928]'
                        }
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                      <span
                        className={
                          '[font-size:14px] font-medium [color:#D2C9D7]'
                        }
                      >
                        Clique para adicionar
                      </span>
                      <span className={'[font-size:14px] [color:#A1C8FA]'}>
                        PNG, SVG, WebP
                      </span>
                    </div>
                  )}
                </div>
                {ecoImagePreview && (
                  <button
                    type="button"
                    className={
                      'border-0 [background:none] [font-size:14px] font-semibold [color:#EF5928] cursor-pointer [padding:0] [font-family:inherit]'
                    }
                    onClick={() => ecoImageRef.current?.click()}
                  >
                    Trocar imagem
                  </button>
                )}
              </div>
              <div className={'flex flex-col [gap:14px]'}>
                <div className={'flex flex-col [gap:6px]'}>
                  <label
                    className={
                      '[font-size:14px] font-semibold [color:#E7E1EA] [letter-spacing:0.01em]'
                    }
                    htmlFor="ecoName"
                  >
                    Nome *
                  </label>
                  <input
                    id="ecoName"
                    type="text"
                    className={
                      'w-full [background:#25232C] [border:1px_solid_#68577E] [border-radius:10px] [padding:11px_14px] [font-size:14px] [color:#F7F2FA] outline-none [transition:border-color_0.2s,_box-shadow_0.2s] [box-sizing:border-box] [font-family:inherit] [appearance:none] placeholder:[color:#A1C8FA] placeholder:font-normal focus:[border-color:#EF5928] focus:[box-shadow:0_0_0_3px_rgba(84,_200,_232,_0.12)] focus:[background:#302638]'
                    }
                    placeholder="Nome da empresa ou tecnologia"
                    value={ecoName}
                    onChange={(e) => setEcoName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div
              className={
                'flex justify-end [gap:12px] [padding-top:14px] [border-top:1px_solid_#302638]'
              }
            >
              <button
                type="button"
                className={
                  '[border:1px_solid_#68577E] [background:#25232C] [color:#9981AE] [border-radius:10px] [padding:10px_22px] [font-size:14px] font-semibold cursor-pointer [font-family:inherit] [transition:background_0.15s] hover:[background:#302638] hover:[border-color:#A1C8FA] hover:[color:#EF5928]'
                }
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={
                  '[background:#EF5928] [color:#ffffff] border-0 [border-radius:10px] [padding:10px_24px] [font-size:14px] font-semibold cursor-pointer [font-family:inherit] flex items-center [gap:8px] [transition:background_0.15s,_transform_0.1s] [box-shadow:0_2px_10px_rgba(84,_200,_232,_0.3)] hover:[background:#FF892B] hover:[transform:translateY(-1px)] disabled:[opacity:0.7] disabled:cursor-not-allowed'
                }
                disabled={saving}
              >
                {saving && (
                  <span
                    className={
                      '[width:14px] [height:14px] [border:2px_solid_rgba(255,_255,_255,_0.3)] [border-top-color:#fff] [border-radius:50%] animate-spin shrink-0'
                    }
                  />
                )}
                {saving
                  ? 'Salvando...'
                  : editingItem
                    ? 'Atualizar item'
                    : 'Salvar item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {ecoItems.length > 0 ? (
        <div
          className={
            'grid [grid-template-columns:repeat(auto-fill,_minmax(250px,_1fr))] [gap:14px]'
          }
        >
          {ecoItems.map((item) => (
            <div
              key={item.id}
              className={
                '[background:#302638] [border-radius:18px] [border:1px_solid_#68577E] [padding:22px] flex flex-col [gap:12px] [box-shadow:0_2px_8px_rgba(84,_200,_232,_0.05)] [transition:box-shadow_0.2s,_transform_0.15s] hover:[box-shadow:0_6px_20px_rgba(84,_200,_232,_0.12)] hover:[transform:translateY(-2px)]'
              }
            >
              <div
                className={
                  '[height:88px] flex items-center justify-center [background:#25232C] [padding:12px]'
                }
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className={
                      '[max-width:100%] [max-height:60px] object-contain'
                    }
                  />
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    style={{ color: '#A1C8FA' }}
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                )}
              </div>
              <div
                className={
                  '[padding:8px_12px] flex items-center justify-between [border-top:1px_solid_#302638]'
                }
              >
                <p
                  className={
                    '[font-size:14px] font-medium [color:#D2C9D7] [margin:0] whitespace-nowrap overflow-hidden [text-overflow:ellipsis] flex-1'
                  }
                >
                  {item.name}
                </p>
                <span
                  className={`${'[font-size:14px] font-semibold [padding:3px_10px] [border-radius:999px]'} ${item.isPublished ? '[background:#f0fdf4] [color:#16a34a] [border:1px_solid_#bbf7d0]' : '[background:#25232C] [color:#9981AE] [border:1px_solid_#68577E]'}`}
                >
                  {item.isPublished ? 'Publicado' : 'Rascunho'}
                </span>
              </div>
              <div
                className={
                  'flex justify-end [padding-top:10px] [border-top:1px_solid_#302638]'
                }
              >
                <div className={'flex items-center [gap:6px]'}>
                  {!item.isPublished && (
                    <button
                      className={
                        '[width:28px] [height:28px] [border-radius:8px] [border:1px_solid_#68577E] [background:#25232C] [color:#BBAFC3] cursor-pointer flex items-center justify-center [font-family:inherit] [padding:0] hover:[background:#302638] hover:[color:#EF5928] hover:[border-color:#68577E]'
                      }
                      onClick={() => openItemForm(item)}
                      title="Editar rascunho"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  )}

                  <button
                    className={`${'border-0 [background:none] [font-size:14px] font-semibold cursor-pointer [font-family:inherit] [padding:5px_12px] [border-radius:8px] [transition:background_0.15s]'} ${item.isPublished ? '[color:#dc2626] [background:#fef2f2] hover:[background:#fee2e2]' : '[color:#EF5928] [background:#302638] hover:[background:#68577E]'}`}
                    onClick={() => handleTogglePublish(item)}
                  >
                    {item.isPublished ? 'Despublicar' : 'Publicar'}
                  </button>
                  <button
                    className={
                      '[width:28px] [height:28px] [border-radius:8px] [border:1px_solid_#68577E] [background:#25232C] [color:#BBAFC3] cursor-pointer flex items-center justify-center [font-family:inherit] [padding:0] hover:[background:#fef2f2] hover:[color:#dc2626] hover:[border-color:#fecaca]'
                    }
                    onClick={() => handleDelete(item)}
                    title="Remover"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <EmptyTabState
            label="Nenhum item cadastrado"
            sub="Adicione empresas e tecnologias ao parceiros/banner"
            onAdd={() => setShowForm(true)}
            btnLabel="+ Novo Item"
          />
        )
      )}

      {pendingDelete && (
        <ConfirmDialog
          label={pendingDelete.label}
          onConfirm={pendingDelete.onConfirm}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </>
  );
}
