import { useState, useEffect, FormEvent, ChangeEvent, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  publishProduct,
  unpublishProduct,
  ProductDTO,
} from '../../../services/products.service';
import { uploadImage } from '../../../services/images.service';
import { ConfirmDialog } from '../ConfirmDialog';
import { EmptyTabState } from '../EmptyTabState';

const LANG_LABEL: Record<string, string> = { PORTUGUESE: 'PT', ENGLISH: 'EN' };

interface Props {
  openFormTrigger: number;
  onSuccess: (msg: string) => void;
  onCountChange: (count: number) => void;
}

export function ProductsTab({
  openFormTrigger,
  onSuccess,
  onCountChange,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);
  const [slText, setSlText] = useState('');
  const [slBtnText, setSlBtnText] = useState('');
  const [slBtnUrl, setSlBtnUrl] = useState('');
  const [slLang, setSlLang] = useState<'PORTUGUESE' | 'ENGLISH'>('PORTUGUESE');
  const [slLogoFile, setSlLogoFile] = useState<File | null>(null);
  const [slLogoPreview, setSlLogoPreview] = useState('');
  const [pendingDelete, setPendingDelete] = useState<{
    label: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const slLogoRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: ({ signal }) => listProducts(undefined, signal),
  });
  const products = productsQuery.data ?? [];
  const loading = productsQuery.isPending;
  useEffect(
    () => onCountChange(products.length),
    [onCountChange, products.length],
  );

  useEffect(() => {
    if (openFormTrigger > 0) openProductForm();
  }, [openFormTrigger]);

  function openProductForm(product?: ProductDTO) {
    if (product) {
      setEditingProduct(product);
      setSlText(product.text ?? '');
      setSlBtnText(product.buttonText ?? '');
      setSlBtnUrl(product.buttonUrl ?? '');
      setSlLang(product.language ?? 'PORTUGUESE');
    }
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setSlText('');
    setSlBtnText('');
    setSlBtnUrl('');
    setSlLang('PORTUGUESE');
    if (slLogoPreview && slLogoFile) URL.revokeObjectURL(slLogoPreview);
    setSlLogoFile(null);
    setSlLogoPreview('');
    setEditingProduct(null);
    setError('');
  }

  function onSlLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSlLogoFile(file);
    if (slLogoPreview) URL.revokeObjectURL(slLogoPreview);
    setSlLogoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          text: slText || undefined,
          buttonText: slBtnText || undefined,
          buttonUrl: slBtnUrl || undefined,
          language: slLang,
        });
        onSuccess('Produto atualizado com sucesso!');
      } else {
        let logoId: string | undefined;
        if (slLogoFile) {
          const name = slLogoFile.name.replace(/\.[^.]+$/, '');
          const uploaded = await uploadImage(slLogoFile, name, [
            'product',
            'logo',
          ]);
          logoId = uploaded.id;
        }
        await createProduct({
          text: slText,
          buttonText: slBtnText || undefined,
          buttonUrl: slBtnUrl || undefined,
          logoId,
          language: slLang,
        });
        onSuccess('Produto criado com sucesso!');
      }
      setShowForm(false);
      resetForm();
      const data = await listProducts();
      queryClient.setQueryData(['products'], data);
      onCountChange(data.length);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : editingProduct
            ? 'Erro ao atualizar produto.'
            : 'Erro ao criar produto.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(product: ProductDTO) {
    try {
      if (product.isPublished) await unpublishProduct(product.id);
      else await publishProduct(product.id);
      const data = await listProducts();
      queryClient.setQueryData(['products'], data);
      onCountChange(data.length);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Erro ao alterar a publicação do produto.',
      );
    }
  }

  function handleDelete(product: ProductDTO) {
    setPendingDelete({
      label: product.text,
      onConfirm: async () => {
        await deleteProduct(product.id);
        const data = await listProducts();
        queryClient.setQueryData(['products'], data);
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
                {editingProduct ? 'Editar produto' : 'Novo produto'}
              </h2>
              <p className={'[font-size:14px] [color:#9981AE] [margin:0]'}>
                {editingProduct
                  ? 'Atualize os campos do produto'
                  : 'Configure o produto do destaque da página inicial'}
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
                  Logo do produto (opcional)
                </label>
                <div
                  className={`${'[aspect-ratio:1] [border:2px_dashed_#A1C8FA] [border-radius:14px] [background:#25232C] flex items-center justify-center cursor-pointer overflow-hidden [transition:border-color_0.2s,_background_0.2s] hover:[border-color:#EF5928] hover:[background:#302638]'} ${slLogoPreview ? '[border-style:solid] [border-color:#A1C8FA]' : ''}`}
                  onClick={() => slLogoRef.current?.click()}
                >
                  <input
                    ref={slLogoRef}
                    type="file"
                    accept="image/*"
                    className={'hidden'}
                    onChange={onSlLogoChange}
                  />
                  {slLogoPreview ? (
                    <img
                      src={slLogoPreview}
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
                    </div>
                  )}
                </div>
                {slLogoPreview && (
                  <button
                    type="button"
                    className={
                      'border-0 [background:none] [font-size:14px] font-semibold [color:#EF5928] cursor-pointer [padding:0] [font-family:inherit]'
                    }
                    onClick={() => slLogoRef.current?.click()}
                  >
                    Trocar logo
                  </button>
                )}
              </div>
              <div className={'flex flex-col [gap:14px]'}>
                <div className={'flex flex-col [gap:6px]'}>
                  <label
                    className={
                      '[font-size:14px] font-semibold [color:#E7E1EA] [letter-spacing:0.01em]'
                    }
                    htmlFor="slText"
                  >
                    Texto do produto *
                  </label>
                  <textarea
                    id="slText"
                    className={`${'w-full [background:#25232C] [border:1px_solid_#68577E] [border-radius:10px] [padding:11px_14px] [font-size:14px] [color:#F7F2FA] outline-none [transition:border-color_0.2s,_box-shadow_0.2s] [box-sizing:border-box] [font-family:inherit] [appearance:none] placeholder:[color:#A1C8FA] placeholder:font-normal focus:[border-color:#EF5928] focus:[box-shadow:0_0_0_3px_rgba(84,_200,_232,_0.12)] focus:[background:#302638]'} ${'[resize:vertical] [min-height:88px] [line-height:1.6]'}`}
                    placeholder="Texto principal exibido no produto..."
                    value={slText}
                    onChange={(e) => setSlText(e.target.value)}
                    rows={3}
                    required
                  />
                </div>
                <div
                  className={'grid [grid-template-columns:1fr_1fr] [gap:14px]'}
                >
                  <div className={'flex flex-col [gap:6px]'}>
                    <label
                      className={
                        '[font-size:14px] font-semibold [color:#E7E1EA] [letter-spacing:0.01em]'
                      }
                      htmlFor="slBtnText"
                    >
                      Texto do botão
                    </label>
                    <input
                      id="slBtnText"
                      type="text"
                      className={
                        'w-full [background:#25232C] [border:1px_solid_#68577E] [border-radius:10px] [padding:11px_14px] [font-size:14px] [color:#F7F2FA] outline-none [transition:border-color_0.2s,_box-shadow_0.2s] [box-sizing:border-box] [font-family:inherit] [appearance:none] placeholder:[color:#A1C8FA] placeholder:font-normal focus:[border-color:#EF5928] focus:[box-shadow:0_0_0_3px_rgba(84,_200,_232,_0.12)] focus:[background:#302638]'
                      }
                      placeholder="Ex: Saiba mais"
                      value={slBtnText}
                      onChange={(e) => setSlBtnText(e.target.value)}
                    />
                  </div>
                  <div className={'flex flex-col [gap:6px]'}>
                    <label
                      className={
                        '[font-size:14px] font-semibold [color:#E7E1EA] [letter-spacing:0.01em]'
                      }
                      htmlFor="slLang"
                    >
                      Idioma
                    </label>
                    <select
                      id="slLang"
                      className={
                        'w-full [background:#25232C] [border:1px_solid_#68577E] [border-radius:10px] [padding:11px_14px] [font-size:14px] [color:#F7F2FA] outline-none [transition:border-color_0.2s,_box-shadow_0.2s] [box-sizing:border-box] [font-family:inherit] [appearance:none] placeholder:[color:#A1C8FA] placeholder:font-normal focus:[border-color:#EF5928] focus:[box-shadow:0_0_0_3px_rgba(84,_200,_232,_0.12)] focus:[background:#302638]'
                      }
                      value={slLang}
                      onChange={(e) =>
                        setSlLang(e.target.value as 'PORTUGUESE' | 'ENGLISH')
                      }
                    >
                      <option value="PORTUGUESE">Português</option>
                      <option value="ENGLISH">English</option>
                    </select>
                  </div>
                </div>
                <div className={'flex flex-col [gap:6px]'}>
                  <label
                    className={
                      '[font-size:14px] font-semibold [color:#E7E1EA] [letter-spacing:0.01em]'
                    }
                    htmlFor="slBtnUrl"
                  >
                    URL do botão
                  </label>
                  <input
                    id="slBtnUrl"
                    type="text"
                    className={
                      'w-full [background:#25232C] [border:1px_solid_#68577E] [border-radius:10px] [padding:11px_14px] [font-size:14px] [color:#F7F2FA] outline-none [transition:border-color_0.2s,_box-shadow_0.2s] [box-sizing:border-box] [font-family:inherit] [appearance:none] placeholder:[color:#A1C8FA] placeholder:font-normal focus:[border-color:#EF5928] focus:[box-shadow:0_0_0_3px_rgba(84,_200,_232,_0.12)] focus:[background:#302638]'
                    }
                    placeholder="https://..."
                    value={slBtnUrl}
                    onChange={(e) => setSlBtnUrl(e.target.value)}
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
                  : editingProduct
                    ? 'Atualizar produto'
                    : 'Salvar produto'}
              </button>
            </div>
          </form>
        </div>
      )}

      {products.length > 0 ? (
        <div
          className={
            'grid [grid-template-columns:repeat(auto-fill,_minmax(300px,_1fr))] [gap:18px]'
          }
        >
          {products.map((product) => (
            <div
              key={product.id}
              className={
                '[background:#302638] [border-radius:18px] [border:1px_solid_#68577E] [padding:22px] flex flex-col [gap:12px] [box-shadow:0_2px_8px_rgba(84,_200,_232,_0.05)] [transition:box-shadow_0.2s,_transform_0.15s] hover:[box-shadow:0_8px_24px_rgba(84,_200,_232,_0.1)] hover:[transform:translateY(-2px)]'
              }
            >
              <div className={'flex items-center justify-between'}>
                <span
                  className={
                    '[font-size:14px] font-bold [color:#EF5928] [background:#302638] [border:1px_solid_#68577E] [padding:3px_9px] [border-radius:6px] [letter-spacing:0.05em]'
                  }
                >
                  {LANG_LABEL[product.language] ?? product.language}
                </span>
                <span
                  className={`${'[font-size:14px] font-semibold [padding:3px_10px] [border-radius:999px]'} ${product.isPublished ? '[background:#f0fdf4] [color:#16a34a] [border:1px_solid_#bbf7d0]' : '[background:#25232C] [color:#9981AE] [border:1px_solid_#68577E]'}`}
                >
                  {product.isPublished ? 'Publicado' : 'Rascunho'}
                </span>
              </div>
              <p
                className={
                  '[font-size:14px] [color:#F7F2FA] [margin:0] [line-height:1.6] flex-1'
                }
              >
                {product.text}
              </p>
              {(product.buttonText || product.buttonUrl) && (
                <div
                  className={
                    'flex flex-col [gap:2px] [background:#25232C] [border:1px_solid_#68577E] [border-radius:10px] [padding:10px_12px]'
                  }
                >
                  {product.buttonText && (
                    <span
                      className={
                        '[font-size:14px] font-semibold [color:#EF5928]'
                      }
                    >
                      {product.buttonText}
                    </span>
                  )}
                  {product.buttonUrl && (
                    <span
                      className={
                        '[font-size:14px] [color:#9981AE] whitespace-nowrap overflow-hidden [text-overflow:ellipsis]'
                      }
                    >
                      {product.buttonUrl}
                    </span>
                  )}
                </div>
              )}
              <div
                className={
                  'flex justify-end [padding-top:10px] [border-top:1px_solid_#302638]'
                }
              >
                <div className={'flex items-center [gap:6px]'}>
                  {!product.isPublished && (
                    <button
                      className={
                        '[width:28px] [height:28px] [border-radius:8px] [border:1px_solid_#68577E] [background:#25232C] [color:#BBAFC3] cursor-pointer flex items-center justify-center [font-family:inherit] [padding:0] hover:[background:#302638] hover:[color:#EF5928] hover:[border-color:#68577E]'
                      }
                      onClick={() => openProductForm(product)}
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
                    className={`${'border-0 [background:none] [font-size:14px] font-semibold cursor-pointer [font-family:inherit] [padding:5px_12px] [border-radius:8px] [transition:background_0.15s]'} ${product.isPublished ? '[color:#dc2626] [background:#fef2f2] hover:[background:#fee2e2]' : '[color:#EF5928] [background:#302638] hover:[background:#68577E]'}`}
                    onClick={() => handleTogglePublish(product)}
                  >
                    {product.isPublished ? 'Despublicar' : 'Publicar'}
                  </button>
                  <button
                    className={
                      '[width:28px] [height:28px] [border-radius:8px] [border:1px_solid_#68577E] [background:#25232C] [color:#BBAFC3] cursor-pointer flex items-center justify-center [font-family:inherit] [padding:0] hover:[background:#fef2f2] hover:[color:#dc2626] hover:[border-color:#fecaca]'
                    }
                    onClick={() => handleDelete(product)}
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
            label="Nenhum produto cadastrado"
            sub="Adicione produtos ao destaque da página inicial"
            onAdd={() => setShowForm(true)}
            btnLabel="+ Novo produto"
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
