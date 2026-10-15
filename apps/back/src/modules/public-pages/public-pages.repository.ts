import type {
  AboutMedia,
  Author,
  BlogPost,
  Review,
  ReviewImage,
  Feedback,
  PartnerBanner,
  ContentLink,
  MediaAsset,
  Information,
  LegalDocument,
  LegalDocumentType,
  Product,
} from '../../generated/prisma/client';

export type FeedbackWithImage = Feedback & { image: MediaAsset };
export type PartnerBannerWithImage = PartnerBanner & { image: MediaAsset };
export type AboutMediaWithAsset = AboutMedia & { media: MediaAsset };
export type BlogPostWithAuthor = BlogPost & { author: Author };
export type PublicReview = Review & { images: ReviewImage[] };

export interface PublicPagesRepository {
  listProducts(language?: 'ENGLISH' | 'PORTUGUESE'): Promise<Product[]>;
  listFeedbacks(
    language?: 'ENGLISH' | 'PORTUGUESE',
  ): Promise<FeedbackWithImage[]>;
  listPartnerBanners(): Promise<PartnerBannerWithImage[]>;
  findInformation(
    language?: 'ENGLISH' | 'PORTUGUESE',
  ): Promise<Information | null>;
  listLinks(): Promise<ContentLink[]>;
  listReviews(language?: 'ENGLISH' | 'PORTUGUESE'): Promise<PublicReview[]>;
  listAboutMedia(): Promise<AboutMediaWithAsset[]>;
  listPosts(language?: 'ENGLISH' | 'PORTUGUESE'): Promise<BlogPostWithAuthor[]>;
  listAuthors(): Promise<Author[]>;
  findLegalDocument(
    type: LegalDocumentType,
    language: 'ENGLISH' | 'PORTUGUESE',
  ): Promise<LegalDocument | null>;
}
