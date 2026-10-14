import { auditDto, lifecycleDto } from '../../core/lifecycle';
import type { PublicPagesRepository } from './public-pages.repository';

export class PublicPagesService {
  constructor(private readonly repository: PublicPagesRepository) {}

  async home(language?: 'ENGLISH' | 'PORTUGUESE') {
    const [products, feedbacks, partnerBanners, activeInformation, links] =
      await Promise.all([
        this.repository.listProducts(language),
        this.repository.listFeedbacks(language),
        this.repository.listPartnerBanners(),
        this.repository.findInformation(language),
        this.repository.listLinks(),
      ]);
    return {
      products: products.map(lifecycleDto),
      feedbacks: feedbacks.map(({ image, ...feedback }) => ({
        ...lifecycleDto(feedback),
        imageUrl: `/v1/images/${image.id}`,
      })),
      partnerBanners: partnerBanners.map(({ image, ...item }) => ({
        ...lifecycleDto(item),
        imageUrl: `/v1/images/${image.id}`,
      })),
      activeInformation: activeInformation
        ? lifecycleDto(activeInformation)
        : null,
      links: links.map(lifecycleDto),
    };
  }

  async feedbacks(language?: 'ENGLISH' | 'PORTUGUESE') {
    const items = await this.repository.listReviews(language);
    return {
      reviews: items.map(({ images, ...item }) => ({
        ...lifecycleDto(item),
        imageIds: images.map((image) => image.imageId),
      })),
    };
  }

  async about() {
    const media = await this.repository.listAboutMedia();
    return {
      media: media.map(({ media: asset, ...item }) => ({
        ...lifecycleDto(item),
        imageId: asset.id,
        imageUrl: `/v1/${asset.kind === 'VIDEO' ? 'videos' : 'images'}/${asset.id}`,
      })),
    };
  }

  async blog(language?: 'ENGLISH' | 'PORTUGUESE') {
    const [posts, authors] = await Promise.all([
      this.repository.listPosts(language),
      this.repository.listAuthors(),
    ]);
    return {
      posts: posts.map(({ author, ...post }) => ({
        ...lifecycleDto(post),
        authorName: author.name,
      })),
      authors: authors.map(auditDto),
    };
  }
}
