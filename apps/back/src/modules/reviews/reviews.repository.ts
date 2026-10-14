import type { z } from 'zod';
import type {
  createReviewSchema,
  createReviewTestimonialSchema,
  updateReviewSchema,
} from '@orvian/contracts';
import type {
  Review,
  ReviewImage,
  ReviewTestimonial,
} from '../../generated/prisma/client';

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type CreateReviewTestimonialInput = z.infer<
  typeof createReviewTestimonialSchema
>;
export type ReviewWithImages = Review & { images: ReviewImage[] };

export interface ReviewsRepository {
  imageExists(id: string): Promise<boolean>;
  createReview(input: CreateReviewInput): Promise<ReviewWithImages>;
  listReviews(title?: string): Promise<ReviewWithImages[]>;
  findReview(id: string): Promise<ReviewWithImages | null>;
  updateReview(id: string, input: UpdateReviewInput): Promise<void>;
  setReviewPublished(id: string, published: boolean): Promise<void>;
  deleteReview(id: string): Promise<void>;
  addImages(reviewId: string, imageIds: string[]): Promise<void>;
  createTestimonial(
    reviewId: string,
    input: CreateReviewTestimonialInput,
  ): Promise<ReviewTestimonial>;
  listTestimonials(
    reviewId: string,
    language?: 'ENGLISH' | 'PORTUGUESE',
  ): Promise<ReviewTestimonial[]>;
  findTestimonial(
    reviewId: string,
    id: string,
  ): Promise<ReviewTestimonial | null>;
  setTestimonialPublished(id: string, published: boolean): Promise<void>;
}
