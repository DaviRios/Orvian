import { useState, useEffect, useRef, ChangeEvent, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  listImages,
  uploadImage,
  deleteImage,
  ImageSearchResult,
} from '../../services/images.service';
import { ModulePageHero } from '../../components/ui/ModulePageHero';
import { ImageIcon } from '../../components/icons/OrvianIcons';

const EXTENSIONS = ['PNG', 'JPEG', 'GIF', 'MP4'];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function MediaGallery() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ImageSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [extFilter, setExtFilter] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<ImageSearchResult | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load(q?: string, ext?: string) {
    setLoading(true);
    setError('');
    try {
      const data = await listImages(q, ext);
      setImages(data);
    } catch {
      setError('Erro ao carregar imagens.');
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load(query || undefined, extFilter || undefined);
  }

  function handleExtChange(ext: string) {
    setExtFilter(ext);
    load(query || undefined, ext || undefined);
  }

  async function handleFiles(files: File[]) {
    const imageFiles = files.filter(
      (f) => f.type.startsWith('image/') || f.type.startsWith('video/'),
    );
    if (!imageFiles.length) {
      setError('Selecione arquivos de imagem ou vídeo.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      for (const file of imageFiles) {
        const name = file.name.replace(/\.[^.]+$/, '');
        await uploadImage(file, name, ['media']);
      }
      setSuccess(
        `${imageFiles.length} arquivo${imageFiles.length > 1 ? 's' : ''} enviado${imageFiles.length > 1 ? 's' : ''}!`,
      );
      setTimeout(() => setSuccess(''), 3500);
      load(query || undefined, extFilter || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar arquivo.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) handleFiles(Array.from(e.target.files));
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(Array.from(e.dataTransfer.files));
  }

  async function handleConfirmDelete() {
    if (!selected) return;
    try {
      await deleteImage(selected.id);
      setSelected(null);
      setConfirmingDelete(false);
      load(query || undefined, extFilter || undefined);
    } catch {
      setError('Erro ao excluir arquivo.');
      setConfirmingDelete(false);
    }
  }

  const isVideo = (ext: string) => ext?.toUpperCase() === 'MP4';

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1800px] flex-col gap-[clamp(0.875rem,1.4vh,2rem)]">
      <ModulePageHero
        eyebrow="Biblioteca de arquivos"
        title="Repositório de Mídias"
        description="Organize, busque e envie todas as imagens e vídeos utilizados pelo sistema."
        icon={ImageIcon}
        countLabel={
          !loading && images.length > 0
            ? `${images.length} arquivo${images.length > 1 ? 's' : ''}`
            : undefined
        }
        actionLabel={uploading ? 'Enviando...' : '+ Upload'}
        onBack={() => navigate('/')}
        onAction={() => fileRef.current?.click()}
        actionDisabled={uploading}
      />

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-400/35 bg-red-400/10 px-4 py-3 text-xs font-medium text-red-300"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}
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
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {success}
        </div>
      )}

      <section
        aria-labelledby="media-tools-title"
        className="rounded-[clamp(0.875rem,1vw,1.5rem)] border border-orvian-secondary/35 bg-orvian-shadow p-[clamp(1rem,1.2vw,1.75rem)] shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
      >
        <div className="mb-4">
          <h2
            id="media-tools-title"
            className="m-0 text-[clamp(0.8rem,0.78vw,1.3rem)] font-bold text-white"
          >
            Buscar e adicionar arquivos
          </h2>
          <p className="mb-0 mt-0.5 text-[clamp(0.62rem,0.56vw,0.95rem)] font-normal text-orvian-lavender">
            Filtre a biblioteca ou envie novas imagens e vídeos
          </p>
        </div>

        <form
          className="mb-5 flex flex-wrap items-center gap-2.5"
          onSubmit={handleSearch}
        >
          <div className={'relative flex-1 [min-width:200px]'}>
            <svg
              className={
                'absolute [left:12px] [top:50%] [transform:translateY(-50%)] [color:#A1C8FA] pointer-events-none'
              }
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={
                'w-full [background:#302638] [border:1px_solid_#68577E] [border-radius:10px] [padding:10px_14px_10px_36px] [font-size:14px] [color:#F7F2FA] outline-none [transition:border-color_0.2s,_box-shadow_0.2s] [box-sizing:border-box] [font-family:inherit] placeholder:[color:#A1C8FA] focus:[border-color:#EF5928] focus:[box-shadow:0_0_0_3px_rgba(84,_200,_232,_0.12)]'
              }
              placeholder="Buscar por nome..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className={
              '[background:#EF5928] [color:#ffffff] border-0 [border-radius:10px] [padding:10px_20px] [font-size:14px] font-semibold cursor-pointer [font-family:inherit] [transition:background_0.15s] [box-shadow:0_2px_8px_rgba(84,_200,_232,_0.25)] hover:[background:#FF892B]'
            }
          >
            Buscar
          </button>
          <div className={'flex [gap:6px] [flex-wrap:wrap]'}>
            <button
              type="button"
              className={`${'[border:1px_solid_#68577E] [background:#25232C] [color:#9981AE] [border-radius:8px] [padding:8px_14px] [font-size:14px] font-semibold cursor-pointer [font-family:inherit] [transition:background_0.15s,_color_0.15s,_border-color_0.15s] hover:[background:#302638] hover:[border-color:#A1C8FA] hover:[color:#EF5928]'} ${extFilter === '' ? '[background:#EF5928] [border-color:#EF5928] [color:#ffffff] hover:[background:#FF892B] hover:[color:#ffffff]' : ''}`}
              onClick={() => handleExtChange('')}
            >
              Todos
            </button>
            {EXTENSIONS.map((ext) => (
              <button
                key={ext}
                type="button"
                className={`${'[border:1px_solid_#68577E] [background:#25232C] [color:#9981AE] [border-radius:8px] [padding:8px_14px] [font-size:14px] font-semibold cursor-pointer [font-family:inherit] [transition:background_0.15s,_color_0.15s,_border-color_0.15s] hover:[background:#302638] hover:[border-color:#A1C8FA] hover:[color:#EF5928]'} ${extFilter === ext ? '[background:#EF5928] [border-color:#EF5928] [color:#ffffff] hover:[background:#FF892B] hover:[color:#ffffff]' : ''}`}
                onClick={() => handleExtChange(ext)}
              >
                {ext}
              </button>
            ))}
          </div>
        </form>

        <div
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-orvian-blue/55 bg-orvian-charcoal/45 px-5 py-6 transition hover:border-orvian-primary hover:bg-orvian-primary/5 ${isDragging ? 'border-orvian-primary bg-orvian-primary/5' : ''} ${uploading ? 'pointer-events-none cursor-default opacity-80' : ''}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !uploading && fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/mp4"
            multiple
            className={'hidden'}
            onChange={onFileChange}
          />
          {uploading ? (
            <>
              <div
                className={
                  '[width:28px] [height:28px] [border:3px_solid_#68577E] [border-top-color:#EF5928] [border-radius:50%] animate-spin'
                }
              />
              <p
                className={
                  '[font-size:14px] [color:#9981AE] [margin:0] font-medium'
                }
              >
                Enviando arquivos...
              </p>
            </>
          ) : (
            <>
              <div
                className={
                  '[width:46px] [height:46px] [border-radius:14px] [background:#68577E] flex items-center justify-center [color:#EF5928]'
                }
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p
                className={
                  '[font-size:14px] [color:#9981AE] [margin:0] font-medium'
                }
              >
                {isDragging ? 'Solte aqui' : 'Arraste arquivos ou '}
                {!isDragging && (
                  <span
                    className={
                      '[color:#EF5928] font-semibold [text-decoration:underline] cursor-pointer'
                    }
                  >
                    clique para selecionar
                  </span>
                )}
              </p>
              <p className={'[font-size:14px] [color:#A1C8FA] [margin:0]'}>
                PNG, JPEG, GIF, MP4
              </p>
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="media-gallery-title">
        <div className="mb-3">
          <h2
            id="media-gallery-title"
            className="m-0 text-[clamp(0.8rem,0.78vw,1.3rem)] font-bold text-white"
          >
            Arquivos do repositório
          </h2>
          <p className="mb-0 mt-0.5 text-[clamp(0.62rem,0.56vw,0.95rem)] font-normal text-orvian-lavender">
            Selecione um item para visualizar seus detalhes
          </p>
        </div>

        {loading ? (
          <div
            className={
              'flex flex-col items-center [gap:14px] [padding:60px_40px]'
            }
          >
            <div
              className={
                '[width:38px] [height:38px] [border:3px_solid_#68577E] [border-top-color:#EF5928] [border-radius:50%] animate-spin'
              }
            />
            <p className={'[font-size:14px] [color:#9981AE] [margin:0]'}>
              Carregando mídias...
            </p>
          </div>
        ) : images.length > 0 ? (
          <div
            className={
              'grid [grid-template-columns:repeat(auto-fill,_minmax(160px,_1fr))] [gap:14px] [margin-bottom:24px]'
            }
          >
            {images.map((img, idx) => (
              <button
                key={img.url + idx}
                className={`${'[background:#302638] [border:2px_solid_#68577E] [border-radius:14px] [padding:0] cursor-pointer [text-align:left] [transition:border-color_0.15s,_box-shadow_0.15s,_transform_0.12s] overflow-hidden [font-family:inherit] hover:[border-color:#A1C8FA] hover:[box-shadow:0_6px_20px_rgba(84,_200,_232,_0.12)] hover:[transform:translateY(-2px)] group'} ${selected?.url === img.url ? '[border-color:#EF5928] [box-shadow:0_0_0_3px_rgba(84,_200,_232,_0.18)]' : ''}`}
                onClick={() =>
                  setSelected(selected?.url === img.url ? null : img)
                }
                title={img.name}
              >
                <div
                  className={
                    'relative w-full [aspect-ratio:4_/_3] [background:#302638] overflow-hidden'
                  }
                >
                  {isVideo(img.extension) ? (
                    <div
                      className={
                        'w-full h-full flex items-center justify-center [background:#F7F2FA] [color:#A1C8FA]'
                      }
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon
                          points="5 3 19 12 5 21 5 3"
                          fill="currentColor"
                          stroke="none"
                        />
                      </svg>
                    </div>
                  ) : (
                    <img
                      src={img.url}
                      alt={img.name}
                      className={
                        'w-full h-full object-cover block [transition:transform_0.2s] group-hover:[transform:scale(1.04)]'
                      }
                      loading="lazy"
                    />
                  )}
                  <span
                    className={
                      'absolute [bottom:6px] [right:6px] [background:rgba(30,_27,_46,_0.72)] [color:#ffffff] [font-size:14px] font-bold [padding:2px_6px] [border-radius:5px] [letter-spacing:0.05em]'
                    }
                  >
                    {img.extension}
                  </span>
                </div>
                <div
                  className={
                    '[padding:10px_12px] [border-top:1px_solid_#302638]'
                  }
                >
                  <p
                    className={
                      '[font-size:14px] font-semibold [color:#F7F2FA] [margin:0_0_3px] whitespace-nowrap overflow-hidden [text-overflow:ellipsis]'
                    }
                    title={img.name}
                  >
                    {img.name}
                  </p>
                  <p className={'[font-size:14px] [color:#9981AE] [margin:0]'}>
                    {formatBytes(img.size)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div
            className={
              'flex flex-col items-center [gap:10px] [padding:60px_40px] text-center'
            }
          >
            <div
              className={
                '[width:68px] [height:68px] [border-radius:20px] [background:#302638] flex items-center justify-center [color:#A1C8FA] [margin-bottom:8px]'
              }
            >
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p
              className={
                '[font-size:15.5px] font-semibold [color:#F7F2FA] [margin:0]'
              }
            >
              Nenhuma mídia encontrada
            </p>
            <p
              className={
                '[font-size:14px] [color:#9981AE] [margin:0] [max-width:300px] [line-height:1.6]'
              }
            >
              Faça upload de imagens ou vídeos para o repositório
            </p>
          </div>
        )}
      </section>

      {/* Detail panel */}
      {selected && (
        <div
          className={
            'fixed [right:24px] [bottom:24px] [width:280px] [background:#302638] [border:1px_solid_#68577E] [border-radius:18px] [box-shadow:0_12px_40px_rgba(84,_200,_232,_0.16)] overflow-hidden [z-index:100] animate-[slide-up_.22s_ease]'
          }
        >
          <div
            className={
              'flex items-center justify-between [padding:14px_16px_12px] [border-bottom:1px_solid_#302638]'
            }
          >
            <span className={'[font-size:14px] font-bold [color:#F7F2FA]'}>
              Detalhes
            </span>
            <button
              className={
                '[width:28px] [height:28px] [border-radius:8px] [border:1px_solid_#68577E] [background:#25232C] [color:#9981AE] flex items-center justify-center cursor-pointer [transition:background_0.15s] hover:[background:#fef2f2] hover:[color:#dc2626]'
              }
              onClick={() => setSelected(null)}
            >
              <svg
                width="15"
                height="15"
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
          <div
            className={
              '[background:#302638] flex items-center justify-center [min-height:160px]'
            }
          >
            {isVideo(selected.extension) ? (
              <video
                src={selected.url}
                controls
                className={'w-full [max-height:200px] block'}
              />
            ) : (
              <img
                src={selected.url}
                alt={selected.name}
                className={'w-full [max-height:200px] object-contain block'}
              />
            )}
          </div>
          <dl
            className={
              'grid [grid-template-columns:auto_1fr] [gap:6px_12px] [padding:14px_16px] [margin:0] [font-size:14px] [&_dt]:[color:#9981AE] [&_dt]:font-semibold [&_dt]:whitespace-nowrap [&_dd]:[margin:0] [&_dd]:[color:#F7F2FA] [&_dd]:font-medium [&_dd]:whitespace-nowrap [&_dd]:overflow-hidden [&_dd]:[text-overflow:ellipsis]'
            }
          >
            <dt>Nome</dt>
            <dd title={selected.name}>{selected.name}</dd>
            <dt>Tipo</dt>
            <dd>{selected.extension}</dd>
            <dt>Tamanho</dt>
            <dd>{formatBytes(selected.size)}</dd>
            {selected.uploadDate && (
              <>
                <dt>Data</dt>
                <dd>{formatDate(selected.uploadDate)}</dd>
              </>
            )}
            <dt>URL</dt>
            <dd>
              <button
                className={
                  'inline-flex items-center [gap:5px] [background:#302638] [border:1px_solid_#68577E] [color:#EF5928] [border-radius:7px] [padding:4px_10px] [font-size:14px] font-semibold cursor-pointer [font-family:inherit] [transition:background_0.15s] hover:[background:#68577E]'
                }
                onClick={() => navigator.clipboard.writeText(selected.url)}
                title="Copiar URL"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copiar URL
              </button>
            </dd>
          </dl>
          <button
            className={
              'flex items-center [gap:6px] w-full [padding:8px_14px] [border-radius:8px] [border:1px_solid_#fecaca] [background:#fef2f2] [color:#dc2626] [font-size:1rem] font-medium cursor-pointer [transition:background_0.15s] justify-center hover:[background:#fee2e2]'
            }
            onClick={() => setConfirmingDelete(true)}
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
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            Excluir
          </button>
        </div>
      )}

      {confirmingDelete && selected && (
        <div
          className={
            'fixed [inset:0] [background:rgba(0,_0,_0,_0.45)] flex items-center justify-center [z-index:1000]'
          }
        >
          <div
            className={
              '[background:#302638] [border-radius:12px] [padding:28px_32px] [max-width:360px] [width:90%] [box-shadow:0_8px_32px_rgba(0,0,0,0.18)] flex flex-col [gap:20px]'
            }
          >
            <p
              className={
                '[font-size:1rem] [color:#F7F2FA] text-center [margin:0]'
              }
            >
              Excluir <strong>{selected.name}</strong> permanentemente?
            </p>
            <div className={'flex [gap:10px] justify-center'}>
              <button
                className={
                  '[padding:8px_20px] [border-radius:8px] [border:1px_solid_#68577E] [background:#25232C] [color:#C6B5D2] [font-size:1rem] cursor-pointer [transition:background_0.15s] hover:[background:#302638]'
                }
                onClick={() => setConfirmingDelete(false)}
              >
                Cancelar
              </button>
              <button
                className={
                  '[padding:8px_20px] [border-radius:8px] border-0 [background:#dc2626] [color:#fff] [font-size:1rem] font-semibold cursor-pointer [transition:background_0.15s] hover:[background:#b91c1c]'
                }
                onClick={handleConfirmDelete}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaGallery;
