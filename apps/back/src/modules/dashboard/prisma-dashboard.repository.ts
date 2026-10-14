import type { DatabaseClient } from '../../infrastructure/database/prisma';
import type {
  DashboardActivityCandidate,
  DashboardRepository,
} from './dashboard.repository';

interface MetricsRow {
  publishedPages: number;
  reviews: number;
  blogPosts: number;
  mediaAssets: number;
}

export class PrismaDashboardRepository implements DashboardRepository {
  constructor(private readonly database: DatabaseClient) {}

  async getSnapshot() {
    const [metricsRows, activity] = await Promise.all([
      this.database.$queryRaw<MetricsRow[]>`
        SELECT
          (
            CASE WHEN
              EXISTS (SELECT 1 FROM products WHERE is_active AND publication_status = 'PUBLISHED') OR
              EXISTS (SELECT 1 FROM information WHERE is_active AND publication_status = 'PUBLISHED') OR
              EXISTS (SELECT 1 FROM partner_banners WHERE is_active AND publication_status = 'PUBLISHED') OR
              EXISTS (SELECT 1 FROM links WHERE is_active AND publication_status = 'PUBLISHED') OR
              EXISTS (SELECT 1 FROM feedbacks WHERE is_active AND publication_status = 'PUBLISHED')
            THEN 1 ELSE 0 END +
            CASE WHEN EXISTS (
              SELECT 1 FROM reviews WHERE is_active AND publication_status = 'PUBLISHED'
            ) THEN 1 ELSE 0 END +
            CASE WHEN EXISTS (
              SELECT 1 FROM blog_posts WHERE is_active AND publication_status = 'PUBLISHED'
            ) THEN 1 ELSE 0 END +
            CASE WHEN
              EXISTS (SELECT 1 FROM about_media WHERE is_active AND publication_status = 'PUBLISHED') OR
              EXISTS (SELECT 1 FROM partners WHERE is_active AND publication_status = 'PUBLISHED') OR
              EXISTS (SELECT 1 FROM careers WHERE is_active AND publication_status = 'PUBLISHED') OR
              EXISTS (SELECT 1 FROM service_items WHERE is_active AND publication_status = 'PUBLISHED')
            THEN 1 ELSE 0 END
          )::int AS "publishedPages",
          (SELECT COUNT(*)::int FROM reviews WHERE is_active) AS reviews,
          (SELECT COUNT(*)::int FROM blog_posts WHERE is_active) AS "blogPosts",
          (SELECT COUNT(*)::int FROM media_assets WHERE is_active) AS "mediaAssets"
      `,
      this.database.$queryRaw<DashboardActivityCandidate[]>`
        SELECT *
        FROM (
          SELECT id::text, 'HOME' AS resource, text AS title, is_active AS "isActive",
            published_at AS "publishedAt", created_at AS "createdAt", updated_at AS "updatedAt"
          FROM products
          UNION ALL
          SELECT id::text, 'HOME', title, is_active, published_at, created_at, updated_at FROM information
          UNION ALL
          SELECT id::text, 'HOME', name, is_active, published_at, created_at, updated_at FROM partner_banners
          UNION ALL
          SELECT id::text, 'HOME', COALESCE(NULLIF(label, ''), url), is_active, published_at, created_at, updated_at FROM links
          UNION ALL
          SELECT id::text, 'HOME', short_title, is_active, published_at, created_at, updated_at FROM feedbacks
          UNION ALL
          SELECT id::text, 'REVIEW', title, is_active, published_at, created_at, updated_at FROM reviews
          UNION ALL
          SELECT id::text, 'BLOG', title, is_active, published_at, created_at, updated_at FROM blog_posts
          UNION ALL
          SELECT id::text, 'MEDIA', name, is_active, NULL::timestamp, created_at, updated_at FROM media_assets
          UNION ALL
          SELECT id::text, 'ABOUT', COALESCE(NULLIF(caption, ''), 'Mídia da página Sobre'), is_active, published_at, created_at, updated_at FROM about_media
          UNION ALL
          SELECT id::text, 'ABOUT', name, is_active, published_at, created_at, updated_at FROM partners
          UNION ALL
          SELECT id::text, 'ABOUT', title, is_active, published_at, created_at, updated_at FROM careers
          UNION ALL
          SELECT id::text, 'ABOUT', name, is_active, published_at, created_at, updated_at FROM service_items
        ) AS recent_activity
        ORDER BY "updatedAt" DESC
        LIMIT 3
      `,
    ]);
    const metrics = metricsRows[0] ?? {
      publishedPages: 0,
      reviews: 0,
      blogPosts: 0,
      mediaAssets: 0,
    };

    return {
      publishedPages: metrics.publishedPages,
      reviews: metrics.reviews,
      blogPosts: metrics.blogPosts,
      mediaAssets: metrics.mediaAssets,
      activity,
    };
  }
}
