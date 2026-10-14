import type { DatabaseClient } from '../../infrastructure/database/prisma';
import {
  publishData,
  softDeleteData,
  unpublishData,
} from '../../core/lifecycle';
import type {
  CreatePartnerBannerInput,
  CreateContentLinkInput,
  CreateInformationInput,
  CreateProductInput,
  SiteContentRepository,
  UpdatePartnerBannerInput,
  UpdateContentLinkInput,
  UpdateInformationInput,
  UpdateProductInput,
} from './site-content.repository';

export class PrismaSiteContentRepository implements SiteContentRepository {
  constructor(private readonly database: DatabaseClient) {}

  async imageExists(id: string): Promise<boolean> {
    return (
      (await this.database.mediaAsset.count({
        where: { id, kind: 'IMAGE', isActive: true },
      })) > 0
    );
  }

  createProduct(input: CreateProductInput) {
    return this.database.product.create({
      data: {
        logoId: input.logoId,
        text: input.text,
        buttonText: input.buttonText ?? '',
        buttonUrl: input.buttonUrl ?? '',
        language: input.language,
      },
    });
  }
  listProducts(language?: 'ENGLISH' | 'PORTUGUESE') {
    return this.database.product.findMany({
      where: { isActive: true, ...(language ? { language } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }
  findProduct(id: string) {
    return this.database.product.findFirst({ where: { id, isActive: true } });
  }
  async updateProduct(id: string, input: UpdateProductInput) {
    await this.database.product.update({ where: { id }, data: input });
  }
  async publishProduct(id: string) {
    await this.database.product.update({ where: { id }, data: publishData() });
  }
  async unpublishProduct(id: string) {
    await this.database.product.update({
      where: { id },
      data: unpublishData(),
    });
  }
  async deleteProduct(id: string) {
    await this.database.product.update({
      where: { id },
      data: softDeleteData(),
    });
  }

  createInformation(input: CreateInformationInput) {
    return this.database.information.create({
      data: {
        title: input.title,
        description: input.description ?? '',
        buttonText: input.buttonText ?? '',
        redirectUrl: input.redirectUrl ?? '',
        buttonText2: input.buttonText2 ?? '',
        redirectUrl2: input.redirectUrl2 ?? '',
        style: input.style,
        language: input.language,
      },
    });
  }
  listInformation(language?: 'ENGLISH' | 'PORTUGUESE') {
    return this.database.information.findMany({
      where: { isActive: true, ...(language ? { language } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }
  findInformation(id: string) {
    return this.database.information.findFirst({
      where: { id, isActive: true },
    });
  }
  async updateInformation(id: string, input: UpdateInformationInput) {
    await this.database.information.update({ where: { id }, data: input });
  }
  async publishInformation(id: string) {
    await this.database.information.update({
      where: { id },
      data: publishData(),
    });
  }
  async unpublishInformation(id: string) {
    await this.database.information.update({
      where: { id },
      data: unpublishData(),
    });
  }
  async deleteInformation(id: string) {
    await this.database.information.update({
      where: { id },
      data: softDeleteData(),
    });
  }

  createPartnerBanner(input: CreatePartnerBannerInput) {
    return this.database.partnerBanner.create({ data: input });
  }
  listPartnerBanners() {
    return this.database.partnerBanner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  findPartnerBanner(id: string) {
    return this.database.partnerBanner.findFirst({
      where: { id, isActive: true },
    });
  }
  async updatePartnerBanner(id: string, input: UpdatePartnerBannerInput) {
    await this.database.partnerBanner.update({ where: { id }, data: input });
  }
  async publishPartnerBanner(id: string) {
    await this.database.partnerBanner.update({
      where: { id },
      data: publishData(),
    });
  }
  async unpublishPartnerBanner(id: string) {
    await this.database.partnerBanner.update({
      where: { id },
      data: unpublishData(),
    });
  }
  async deletePartnerBanner(id: string) {
    await this.database.partnerBanner.update({
      where: { id },
      data: softDeleteData(),
    });
  }

  createContentLink(input: CreateContentLinkInput) {
    return this.database.contentLink.create({
      data: { url: input.url, label: input.label ?? '' },
    });
  }
  listContentLinks() {
    return this.database.contentLink.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  findContentLink(id: string) {
    return this.database.contentLink.findFirst({
      where: { id, isActive: true },
    });
  }
  async updateContentLink(id: string, input: UpdateContentLinkInput) {
    await this.database.contentLink.update({ where: { id }, data: input });
  }
  async publishContentLink(id: string) {
    await this.database.contentLink.update({
      where: { id },
      data: publishData(),
    });
  }
  async unpublishContentLink(id: string) {
    await this.database.contentLink.update({
      where: { id },
      data: unpublishData(),
    });
  }
  async deleteContentLink(id: string) {
    await this.database.contentLink.update({
      where: { id },
      data: softDeleteData(),
    });
  }
}
