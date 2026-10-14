import { NotFoundError } from '../../core/errors';
import { lifecycleDto } from '../../core/lifecycle';
import type {
  ReviewsRepository,
  ReviewWithImages,
  CreateReviewInput,
  CreateReviewTestimonialInput,
  UpdateReviewInput,
} from './reviews.repository';

export class ReviewsService {
  constructor(private readonly repository: ReviewsRepository) {}

  async create(input: CreateReviewInput) {
    if (input.logoId) await this.requireImage(input.logoId);
    return this.toDto(await this.repository.createReview(input));
  }
  async list(title?: string) {
    return (await this.repository.listReviews(title)).map((item) =>
      this.toDto(item),
    );
  }
  async get(id: string) {
    const item = await this.repository.findReview(id);
    if (!item) throw new NotFoundError('Avaliação');
    return this.toDto(item);
  }
  async update(id: string, input: UpdateReviewInput) {
    await this.get(id);
    if (input.logoId) await this.requireImage(input.logoId);
    await this.repository.updateReview(id, input);
  }
  async publish(id: string) {
    await this.get(id);
    await this.repository.setReviewPublished(id, true);
  }
  async unpublish(id: string) {
    await this.get(id);
    await this.repository.setReviewPublished(id, false);
  }
  async toggle(id: string) {
    const item = await this.get(id);
    await this.repository.setReviewPublished(id, !item.isPublished);
  }
  async delete(id: string) {
    await this.get(id);
    await this.repository.deleteReview(id);
  }
  async addImages(id: string, imageIds: string[]) {
    await this.get(id);
    for (const imageId of imageIds) await this.requireImage(imageId);
    await this.repository.addImages(id, imageIds);
  }
  async addTestimonial(id: string, input: CreateReviewTestimonialInput) {
    await this.get(id);
    return lifecycleDto(await this.repository.createTestimonial(id, input));
  }
  async listTestimonials(id: string, language?: 'ENGLISH' | 'PORTUGUESE') {
    await this.get(id);
    return (await this.repository.listTestimonials(id, language)).map(
      lifecycleDto,
    );
  }
  async setTestimonialPublished(
    reviewId: string,
    id: string,
    published: boolean,
  ) {
    const item = await this.repository.findTestimonial(reviewId, id);
    if (!item) throw new NotFoundError('Depoimento');
    await this.repository.setTestimonialPublished(id, published);
  }

  private async requireImage(id: string) {
    if (!(await this.repository.imageExists(id)))
      throw new NotFoundError('Imagem');
  }
  private toDto(item: ReviewWithImages) {
    const { images, ...record } = item;
    return {
      ...lifecycleDto(record),
      imageIds: images.map((image) => image.imageId),
    };
  }
}
