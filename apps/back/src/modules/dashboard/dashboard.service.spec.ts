import type { DashboardRepository } from './dashboard.repository';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  it('builds metrics and sorts the three most recent real activities', async () => {
    const repository: DashboardRepository = {
      getSnapshot: jest.fn().mockResolvedValue({
        publishedPages: 3,
        reviews: 7,
        blogPosts: 12,
        mediaAssets: 31,
        activity: [
          {
            id: 'review-1',
            resource: 'REVIEW',
            title: 'Avaliação antiga',
            isActive: true,
            publishedAt: null,
            createdAt: new Date('2026-09-01T10:00:00.000Z'),
            updatedAt: new Date('2026-09-02T10:00:00.000Z'),
          },
          {
            id: 'post-1',
            resource: 'BLOG',
            title: 'Post publicado',
            isActive: true,
            publishedAt: new Date('2026-10-13T12:00:00.000Z'),
            createdAt: new Date('2026-10-01T10:00:00.000Z'),
            updatedAt: new Date('2026-10-13T12:00:00.000Z'),
          },
          {
            id: 'media-1',
            resource: 'MEDIA',
            title: 'Imagem nova',
            isActive: true,
            publishedAt: null,
            createdAt: new Date('2026-10-13T13:00:00.000Z'),
            updatedAt: new Date('2026-10-13T13:00:00.000Z'),
          },
          {
            id: 'home-1',
            resource: 'HOME',
            title: 'Produto removido',
            isActive: false,
            publishedAt: null,
            createdAt: new Date('2026-10-01T10:00:00.000Z'),
            updatedAt: new Date('2026-10-13T14:00:00.000Z'),
          },
        ],
      }),
    };

    const result = await new DashboardService(repository).summary();

    expect(result.metrics).toEqual({
      publishedPages: 3,
      reviews: 7,
      blogPosts: 12,
      mediaAssets: 31,
    });
    expect(result.recentActivity).toEqual([
      expect.objectContaining({ id: 'HOME:home-1', action: 'DELETED' }),
      expect.objectContaining({ id: 'MEDIA:media-1', action: 'CREATED' }),
      expect.objectContaining({ id: 'BLOG:post-1', action: 'PUBLISHED' }),
    ]);
  });
});
