import type { z } from 'zod';
import type {
  createPartnerBannerSchema,
  createContentLinkSchema,
  createInformationSchema,
  createProductSchema,
  updatePartnerBannerSchema,
  updateContentLinkSchema,
  updateInformationSchema,
  updateProductSchema,
} from '@orvian/contracts';
import type {
  PartnerBanner,
  ContentLink,
  Information,
  Product,
} from '../../generated/prisma/client';

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateInformationInput = z.infer<typeof createInformationSchema>;
export type UpdateInformationInput = z.infer<typeof updateInformationSchema>;
export type CreatePartnerBannerInput = z.infer<
  typeof createPartnerBannerSchema
>;
export type UpdatePartnerBannerInput = z.infer<
  typeof updatePartnerBannerSchema
>;
export type CreateContentLinkInput = z.infer<typeof createContentLinkSchema>;
export type UpdateContentLinkInput = z.infer<typeof updateContentLinkSchema>;

export interface SiteContentRepository {
  imageExists(id: string): Promise<boolean>;
  createProduct(input: CreateProductInput): Promise<Product>;
  listProducts(language?: 'ENGLISH' | 'PORTUGUESE'): Promise<Product[]>;
  findProduct(id: string): Promise<Product | null>;
  updateProduct(id: string, input: UpdateProductInput): Promise<void>;
  publishProduct(id: string): Promise<void>;
  unpublishProduct(id: string): Promise<void>;
  deleteProduct(id: string): Promise<void>;
  createInformation(input: CreateInformationInput): Promise<Information>;
  listInformation(language?: 'ENGLISH' | 'PORTUGUESE'): Promise<Information[]>;
  findInformation(id: string): Promise<Information | null>;
  updateInformation(id: string, input: UpdateInformationInput): Promise<void>;
  publishInformation(id: string): Promise<void>;
  unpublishInformation(id: string): Promise<void>;
  deleteInformation(id: string): Promise<void>;
  createPartnerBanner(input: CreatePartnerBannerInput): Promise<PartnerBanner>;
  listPartnerBanners(): Promise<PartnerBanner[]>;
  findPartnerBanner(id: string): Promise<PartnerBanner | null>;
  updatePartnerBanner(
    id: string,
    input: UpdatePartnerBannerInput,
  ): Promise<void>;
  publishPartnerBanner(id: string): Promise<void>;
  unpublishPartnerBanner(id: string): Promise<void>;
  deletePartnerBanner(id: string): Promise<void>;
  createContentLink(input: CreateContentLinkInput): Promise<ContentLink>;
  listContentLinks(): Promise<ContentLink[]>;
  findContentLink(id: string): Promise<ContentLink | null>;
  updateContentLink(id: string, input: UpdateContentLinkInput): Promise<void>;
  publishContentLink(id: string): Promise<void>;
  unpublishContentLink(id: string): Promise<void>;
  deleteContentLink(id: string): Promise<void>;
}
