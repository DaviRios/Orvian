import { NotFoundError } from '../../core/errors';
import { lifecycleDto } from '../../core/lifecycle';
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

export class SiteContentService {
  constructor(private readonly repository: SiteContentRepository) {}

  async ensureImage(id: string) {
    if (!(await this.repository.imageExists(id)))
      throw new NotFoundError('Imagem');
  }

  async createProduct(input: CreateProductInput) {
    await this.ensureImage(input.logoId);
    return lifecycleDto(await this.repository.createProduct(input));
  }
  async listProducts(language?: 'ENGLISH' | 'PORTUGUESE') {
    return (await this.repository.listProducts(language)).map(lifecycleDto);
  }
  async getProduct(id: string) {
    const item = await this.repository.findProduct(id);
    if (!item) throw new NotFoundError('Produto');
    return lifecycleDto(item);
  }
  async updateProduct(id: string, input: UpdateProductInput) {
    await this.getProduct(id);
    if (input.logoId) await this.ensureImage(input.logoId);
    await this.repository.updateProduct(id, input);
  }
  async publishProduct(id: string) {
    await this.getProduct(id);
    await this.repository.publishProduct(id);
  }
  async unpublishProduct(id: string) {
    await this.getProduct(id);
    await this.repository.unpublishProduct(id);
  }
  async toggleProduct(id: string) {
    const item = await this.getProduct(id);
    return item.isPublished
      ? this.unpublishProduct(id)
      : this.publishProduct(id);
  }
  async deleteProduct(id: string) {
    await this.getProduct(id);
    await this.repository.deleteProduct(id);
  }

  async createInformation(input: CreateInformationInput) {
    return lifecycleDto(await this.repository.createInformation(input));
  }
  async listInformation(language?: 'ENGLISH' | 'PORTUGUESE') {
    return (await this.repository.listInformation(language)).map(lifecycleDto);
  }
  async getInformation(id: string) {
    const item = await this.repository.findInformation(id);
    if (!item) throw new NotFoundError('Informação');
    return lifecycleDto(item);
  }
  async updateInformation(id: string, input: UpdateInformationInput) {
    await this.getInformation(id);
    await this.repository.updateInformation(id, input);
  }
  async publishInformation(id: string) {
    await this.getInformation(id);
    await this.repository.publishInformation(id);
  }
  async unpublishInformation(id: string) {
    await this.getInformation(id);
    await this.repository.unpublishInformation(id);
  }
  async deleteInformation(id: string) {
    await this.getInformation(id);
    await this.repository.deleteInformation(id);
  }

  async createPartnerBanner(input: CreatePartnerBannerInput) {
    await this.ensureImage(input.imageId);
    return this.partnerBannerDto(
      await this.repository.createPartnerBanner(input),
    );
  }
  async listPartnerBanners() {
    return (await this.repository.listPartnerBanners()).map((item) =>
      this.partnerBannerDto(item),
    );
  }
  async getPartnerBanner(id: string) {
    const item = await this.repository.findPartnerBanner(id);
    if (!item) throw new NotFoundError('Item de parceiros/banner');
    return this.partnerBannerDto(item);
  }
  async updatePartnerBanner(id: string, input: UpdatePartnerBannerInput) {
    await this.getPartnerBanner(id);
    if (input.imageId) await this.ensureImage(input.imageId);
    await this.repository.updatePartnerBanner(id, input);
  }
  async publishPartnerBanner(id: string) {
    await this.getPartnerBanner(id);
    await this.repository.publishPartnerBanner(id);
  }
  async unpublishPartnerBanner(id: string) {
    await this.getPartnerBanner(id);
    await this.repository.unpublishPartnerBanner(id);
  }
  async togglePartnerBanner(id: string) {
    const item = await this.getPartnerBanner(id);
    return item.isPublished
      ? this.unpublishPartnerBanner(id)
      : this.publishPartnerBanner(id);
  }
  async deletePartnerBanner(id: string) {
    await this.getPartnerBanner(id);
    await this.repository.deletePartnerBanner(id);
  }

  async createContentLink(input: CreateContentLinkInput) {
    return lifecycleDto(await this.repository.createContentLink(input));
  }
  async listContentLinks() {
    return (await this.repository.listContentLinks()).map(lifecycleDto);
  }
  async getContentLink(id: string) {
    const item = await this.repository.findContentLink(id);
    if (!item) throw new NotFoundError('Link');
    return lifecycleDto(item);
  }
  async updateContentLink(id: string, input: UpdateContentLinkInput) {
    await this.getContentLink(id);
    await this.repository.updateContentLink(id, input);
  }
  async toggleContentLink(id: string) {
    const item = await this.getContentLink(id);
    return item.isPublished
      ? this.repository.unpublishContentLink(id)
      : this.repository.publishContentLink(id);
  }
  async deleteContentLink(id: string) {
    await this.getContentLink(id);
    await this.repository.deleteContentLink(id);
  }

  private partnerBannerDto<
    T extends Parameters<typeof lifecycleDto>[0] & { imageId: string },
  >(item: T) {
    return { ...lifecycleDto(item), imageUrl: `/v1/images/${item.imageId}` };
  }
}
