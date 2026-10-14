import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listBlogPosts,
  publishBlogPost,
  unpublishBlogPost,
  deleteBlogPost,
  BlogPostDTO,
} from '../../services/blog-posts.service';
import { AuthorsPanel } from './components/AuthorsPanel';
import { BlogPostForm } from './components/BlogPostForm';
import { Alert } from '../../components/ui/Alert';
import { ModulePageHero } from '../../components/ui/ModulePageHero';
import { NewspaperIcon } from '../../components/icons/OrvianIcons';

const LANG_LABEL: Record<string, string> = { PORTUGUESE: 'PT', ENGLISH: 'EN' };

export function BlogPosts() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showForm, setShowForm] = useState(() =>
    Boolean((location.state as { create?: boolean } | null)?.create),
  );
  const [editingPost, setEditingPost] = useState<BlogPostDTO | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const postsQuery = useQuery({
    queryKey: ['blog-posts'],
    queryFn: ({ signal }) => listBlogPosts(undefined, signal),
  });
  const posts = postsQuery.data ?? [];
  const loading = postsQuery.isPending;

  async function refreshEditorial() {
    await queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
  }

  function openForm(post?: BlogPostDTO) {
    setEditingPost(post ?? null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeForm() {
    setShowForm(false);
    setError('');
    setEditingPost(null);
  }

  async function handlePublishToggle(post: BlogPostDTO) {
    try {
      if (post.isPublished) {
        await unpublishBlogPost(post.id);
      } else {
        await publishBlogPost(post.id);
      }
      await queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Erro ao alterar publicação.',
      );
    }
  }

  async function handleDelete(post: BlogPostDTO) {
    if (confirmingId !== post.id) {
      setConfirmingId(post.id);
      return;
    }
    setConfirmingId(null);
    try {
      await deleteBlogPost(post.id);
      await queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Erro ao remover post.',
      );
    }
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1800px] flex-col gap-[clamp(0.875rem,1.4vh,2rem)]">
      <ModulePageHero
        eyebrow="Conteúdo editorial"
        title="Blog e Notícias"
        description="Crie, edite e gerencie os posts publicados no blog do site."
        icon={NewspaperIcon}
        countLabel={
          posts.length > 0
            ? `${posts.length} post${posts.length > 1 ? 's' : ''}`
            : undefined
        }
        actionLabel="+ Novo Post"
        onBack={() => navigate('/')}
        onAction={() => openForm()}
      />

      {error && (
        <div className="mb-5">
          <Alert>{error}</Alert>
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

      {showForm && (
        <BlogPostForm
          key={editingPost?.id ?? 'new-post'}
          item={editingPost}
          onClose={closeForm}
          onSaved={async (message) => {
            setSuccess(message);
            setTimeout(() => setSuccess(''), 3500);
            closeForm();
            await refreshEditorial();
          }}
        />
      )}
      <section aria-labelledby="blog-content-title">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h2
              id="blog-content-title"
              className="m-0 text-[clamp(0.8rem,0.78vw,1.3rem)] font-bold text-white"
            >
              Conteúdo editorial
            </h2>
            <p className="mb-0 mt-0.5 text-[clamp(0.62rem,0.56vw,0.95rem)] font-normal text-orvian-lavender">
              Visualize, publique e organize os posts do Orvian
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-2xl border border-orvian-secondary/35 bg-orvian-shadow">
            <div className="size-9 animate-spin rounded-full border-[3px] border-orvian-secondary border-t-orvian-primary" />
            <p className="m-0 text-sm text-orvian-lavender">
              Carregando posts...
            </p>
          </div>
        ) : posts.length > 0 ? (
          <div className="mb-12 grid grid-cols-1 gap-[clamp(0.875rem,1vw,1.5rem)] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className={
                  '[background:#302638] [border-radius:18px] [border:1px_solid_#68577E] overflow-hidden [box-shadow:0_2px_8px_rgba(84,_200,_232,_0.05)] [transition:box-shadow_0.2s,_transform_0.15s] hover:[box-shadow:0_8px_28px_rgba(84,_200,_232,_0.12)] hover:[transform:translateY(-2px)]'
                }
              >
                <div
                  className={
                    '[height:160px] overflow-hidden [background:#302638] relative'
                  }
                >
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className={'w-full h-full object-cover'}
                      onError={(e) => undefined}
                    />
                  ) : (
                    <div
                      className={
                        'w-full h-full flex items-center justify-center [color:#A1C8FA]'
                      }
                    >
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                  <span
                    className={
                      'absolute [top:10px] [right:10px] [background:rgba(84,_200,_232,_0.85)] [color:#ffffff] [font-size:14px] font-bold [padding:3px_8px] [border-radius:6px] [letter-spacing:0.05em]'
                    }
                  >
                    {LANG_LABEL[post.language] ?? post.language}
                  </span>
                </div>
                <div className={'[padding:16px_18px] flex flex-col [gap:6px]'}>
                  <h3
                    className={
                      '[font-size:15px] font-bold [color:#F7F2FA] [margin:0] [line-height:1.35]'
                    }
                  >
                    {post.title}
                  </h3>
                  {post.description && (
                    <p
                      className={
                        '[font-size:14px] [color:#AFA5B6] [margin:0] [line-height:1.6] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden'
                      }
                    >
                      {post.description.replace(/<[^>]*>/g, '')}
                    </p>
                  )}
                  {post.authorName && (
                    <p
                      className={
                        'flex items-center [gap:5px] [font-size:14px] [color:#9981AE] [margin:0]'
                      }
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      {post.authorName}
                    </p>
                  )}
                  <div
                    className={
                      'flex items-center justify-between [margin-top:8px] [padding-top:12px] [border-top:1px_solid_#302638]'
                    }
                  >
                    <span
                      className={`${'[font-size:14px] font-semibold [padding:3px_10px] [border-radius:999px]'} ${post.isPublished ? '[background:#f0fdf4] [color:#16a34a] [border:1px_solid_#bbf7d0]' : '[background:#25232C] [color:#9981AE] [border:1px_solid_#68577E]'}`}
                    >
                      {post.isPublished ? 'Publicado' : 'Rascunho'}
                    </span>
                    <div className={'flex items-center [gap:6px]'}>
                      {!post.isPublished && (
                        <button
                          className={
                            '[width:28px] [height:28px] [border-radius:8px] [border:1px_solid_#68577E] [background:#25232C] [color:#9981AE] flex items-center justify-center cursor-pointer [transition:background_0.15s,_color_0.15s] [padding:0] hover:[background:#302638] hover:[color:#EF5928] hover:[border-color:#68577E]'
                          }
                          onClick={() => openForm(post)}
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
                        className={`${'border-0 [background:none] [font-size:14px] font-semibold cursor-pointer [font-family:inherit] [padding:5px_12px] [border-radius:8px] [transition:background_0.15s]'} ${post.isPublished ? '[color:#dc2626] [background:#fef2f2] hover:[background:#fee2e2]' : '[color:#EF5928] [background:#302638] hover:[background:#68577E]'}`}
                        onClick={() => handlePublishToggle(post)}
                      >
                        {post.isPublished ? 'Despublicar' : 'Publicar'}
                      </button>
                      <button
                        className={`${'[width:28px] [height:28px] [border-radius:8px] [border:1px_solid_#68577E] [background:#25232C] [color:#9981AE] flex items-center justify-center cursor-pointer [transition:background_0.15s,_color_0.15s] [padding:0] hover:[background:#fef2f2] hover:[color:#dc2626] hover:[border-color:#fecaca]'} ${confirmingId === post.id ? '[width:auto] [padding:0_10px] [font-size:14px] font-semibold [background:#fef2f2] [color:#dc2626] [border-color:#fecaca] hover:[background:#fee2e2]' : ''}`}
                        onClick={() => handleDelete(post)}
                        title={
                          confirmingId === post.id
                            ? 'Clique para confirmar'
                            : 'Remover'
                        }
                      >
                        {confirmingId === post.id ? (
                          'Confirmar?'
                        ) : (
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
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !showForm && (
            <div
              className={
                'flex flex-col items-center [gap:10px] [padding:72px_40px] text-center'
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
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <p
                className={
                  '[font-size:15.5px] font-semibold [color:#F7F2FA] [margin:0]'
                }
              >
                Nenhum post cadastrado
              </p>
              <p
                className={
                  '[font-size:14px] [color:#9981AE] [margin:0] [max-width:300px] [line-height:1.6]'
                }
              >
                Crie o primeiro post para publicar no blog
              </p>
              <button
                className={
                  '[margin-top:8px] [background:#EF5928] [color:#ffffff] border-0 [border-radius:10px] [padding:10px_24px] [font-size:14px] font-semibold cursor-pointer [font-family:inherit] [transition:background_0.15s,_transform_0.1s] [box-shadow:0_2px_10px_rgba(84,_200,_232,_0.3)] hover:[background:#FF892B] hover:[transform:translateY(-1px)]'
                }
                onClick={() => openForm()}
              >
                + Novo Post
              </button>
            </div>
          )
        )}
      </section>

      <AuthorsPanel />
    </div>
  );
}

export default BlogPosts;
