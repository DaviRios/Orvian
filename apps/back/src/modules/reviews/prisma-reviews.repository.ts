import type { DatabaseClient } from '../../infrastructure/database/prisma';
import {
  publishData,
  softDeleteData,
  unpublishData,
} from '../../core/lifecycle';
import type {
  ReviewsRepository,
  CreateReviewInput,
  CreateReviewTestimonialInput,
  UpdateReviewInput,
} from './reviews.repository';

const publicationData = (published: boolean) =>
  published ? publishData() : unpublishData();

export class PrismaReviewsRepository implements ReviewsRepository {
  constructor(private readonly database: DatabaseClient) {}

  async imageExists(id: string): Promise<boolean> {
    return (
      (await this.database.mediaAsset.count({
        where: { id, kind: 'IMAGE', isActive: true },
      })) > 0
    );
  }
  createReview(input: CreateReviewInput) {
    return this.database.review.create({
      data: {
        title: input.title,
        shortTitle: input.shortTitle ?? '',
        subtitle: input.subtitle ?? '',
        content: input.content ?? '',
        industry: input.industry ?? '',
        country: input.country ?? '',
        tag: input.tag ?? '',
        logoId: input.logoId,
        language: input.language,
      },
      include: {
        images: { where: { isActive: true }, orderBy: { position: 'asc' } },
      },
    });
  }
  listReviews(title?: string) {
    return this.database.review.findMany({
      where: {
        isActive: true,
        ...(title
          ? { title: { contains: title, mode: 'insensitive' as const } }
          : {}),
      },
      include: {
        images: { where: { isActive: true }, orderBy: { position: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  findReview(id: string) {
    return this.database.review.findFirst({
      where: { id, isActive: true },
      include: {
        images: { where: { isActive: true }, orderBy: { position: 'asc' } },
      },
    });
  }
  async updateReview(id: string, input: UpdateReviewInput) {
    await this.database.review.update({ where: { id }, data: input });
  }
  async setReviewPublished(id: string, published: boolean) {
    await this.database.review.update({
      where: { id },
      data: publicationData(published),
    });
  }
  async deleteReview(id: string) {
    await this.database.review.update({
      where: { id },
      data: softDeleteData(),
    });
  }
  async addImages(reviewId: string, imageIds: string[]) {
    const current = await this.database.reviewImage.count({
      where: { reviewId, isActive: true },
    });
    await this.database.reviewImage.createMany({
      data: imageIds.map((imageId, index) => ({
        reviewId,
        imageId,
        position: current + index,
      })),
      skipDuplicates: true,
    });
  }
  createTestimonial(reviewId: string, input: CreateReviewTestimonialInput) {
    return this.database.reviewTestimonial.create({
      data: {
        reviewId,
        authorName: input.authorName,
        role: input.role ?? '',
        company: input.company ?? '',
        content: input.content,
        language: input.language,
      },
    });
  }
  listTestimonials(reviewId: string, language?: 'ENGLISH' | 'PORTUGUESE') {
    return this.database.reviewTestimonial.findMany({
      where: { reviewId, isActive: true, ...(language ? { language } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }
  findTestimonial(reviewId: string, id: string) {
    return this.database.reviewTestimonial.findFirst({
      where: { reviewId, id, isActive: true },
    });
  }
  async setTestimonialPublished(id: string, published: boolean) {
    await this.database.reviewTestimonial.update({
      where: { id },
      data: publicationData(published),
    });
  }
}
