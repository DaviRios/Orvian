import type { DatabaseClient } from '../../infrastructure/database/prisma';
import type { PublicPagesRepository } from './public-pages.repository';

const published = { isActive: true, publicationStatus: 'PUBLISHED' as const };

export class PrismaPublicPagesRepository implements PublicPagesRepository {
  constructor(private readonly database: DatabaseClient) {}

  listProducts(language?: 'ENGLISH' | 'PORTUGUESE') {
    return this.database.product.findMany({
      where: { ...published, ...(language ? { language } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }
  listFeedbacks(language?: 'ENGLISH' | 'PORTUGUESE') {
    return this.database.feedback.findMany({
      where: { ...published, ...(language ? { language } : {}) },
      include: { image: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  listPartnerBanners() {
    return this.database.partnerBanner.findMany({
      where: published,
      include: { image: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  findInformation(language?: 'ENGLISH' | 'PORTUGUESE') {
    return this.database.information.findFirst({
      where: { ...published, ...(language ? { language } : {}) },
      orderBy: { publishedAt: 'desc' },
    });
  }
  listLinks() {
    return this.database.contentLink.findMany({
      where: published,
      orderBy: { createdAt: 'desc' },
    });
  }
  listReviews(language?: 'ENGLISH' | 'PORTUGUESE') {
    return this.database.review.findMany({
      where: { ...published, ...(language ? { language } : {}) },
      include: {
        images: { where: { isActive: true }, orderBy: { position: 'asc' } },
      },
      orderBy: { publishedAt: 'desc' },
    });
  }
  listAboutMedia() {
    return this.database.aboutMedia.findMany({
      where: published,
      include: { media: true },
      orderBy: { sortOrder: 'asc' },
    });
  }
  listPosts(language?: 'ENGLISH' | 'PORTUGUESE') {
    return this.database.blogPost.findMany({
      where: { ...published, ...(language ? { language } : {}) },
      include: { author: true },
      orderBy: { publishedAt: 'desc' },
    });
  }
  listAuthors() {
    return this.database.author.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }
}
