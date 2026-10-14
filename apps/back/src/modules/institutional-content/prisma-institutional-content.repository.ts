import type { DatabaseClient } from '../../infrastructure/database/prisma';
import {
  publishData,
  softDeleteData,
  unpublishData,
} from '../../core/lifecycle';
import type {
  CreateAboutMediaInput,
  CreateCareerInput,
  CreateFeedbackInput,
  CreatePartnerInput,
  CreateServiceItemInput,
  InstitutionalContentRepository,
  UpdateAboutMediaInput,
  UpdateCareerInput,
  UpdateFeedbackInput,
  UpdatePartnerInput,
  UpdateServiceItemInput,
} from './institutional-content.repository';

const publicationData = (published: boolean) =>
  published ? publishData() : unpublishData();

export class PrismaInstitutionalContentRepository
  implements InstitutionalContentRepository
{
  constructor(private readonly database: DatabaseClient) {}

  findMedia(id: string) {
    return this.database.mediaAsset.findFirst({
      where: { id, isActive: true },
    });
  }

  createFeedback(input: CreateFeedbackInput) {
    return this.database.feedback.create({ data: input });
  }
  listFeedbacks() {
    return this.database.feedback.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  findFeedback(id: string) {
    return this.database.feedback.findFirst({
      where: { id, isActive: true },
    });
  }
  async updateFeedback(id: string, input: UpdateFeedbackInput) {
    await this.database.feedback.update({ where: { id }, data: input });
  }
  async setFeedbackPublished(id: string, published: boolean) {
    await this.database.feedback.update({
      where: { id },
      data: publicationData(published),
    });
  }
  async deleteFeedback(id: string) {
    await this.database.feedback.update({
      where: { id },
      data: softDeleteData(),
    });
  }

  createAboutMedia(input: CreateAboutMediaInput) {
    return this.database.aboutMedia.create({
      data: {
        mediaId: input.imageId,
        mediaType: input.mediaType,
        caption: input.caption ?? '',
        sortOrder: input.sortOrder,
      },
      include: { media: true },
    });
  }
  listAboutMedia() {
    return this.database.aboutMedia.findMany({
      where: { isActive: true },
      include: { media: true },
      orderBy: { sortOrder: 'asc' },
    });
  }
  findAboutMedia(id: string) {
    return this.database.aboutMedia.findFirst({
      where: { id, isActive: true },
      include: { media: true },
    });
  }
  async updateAboutMedia(id: string, input: UpdateAboutMediaInput) {
    const { imageId, ...data } = input;
    await this.database.aboutMedia.update({
      where: { id },
      data: { ...data, ...(imageId ? { mediaId: imageId } : {}) },
    });
  }
  async setAboutMediaPublished(id: string, published: boolean) {
    await this.database.aboutMedia.update({
      where: { id },
      data: publicationData(published),
    });
  }
  async deleteAboutMedia(id: string) {
    await this.database.aboutMedia.update({
      where: { id },
      data: softDeleteData(),
    });
  }

  createPartner(input: CreatePartnerInput) {
    return this.database.partner.create({
      data: {
        name: input.name,
        logoId: input.logoId,
        website: input.website ?? '',
      },
    });
  }
  listPartners() {
    return this.database.partner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  findPartner(id: string) {
    return this.database.partner.findFirst({ where: { id, isActive: true } });
  }
  async updatePartner(id: string, input: UpdatePartnerInput) {
    await this.database.partner.update({ where: { id }, data: input });
  }
  async setPartnerPublished(id: string, published: boolean) {
    await this.database.partner.update({
      where: { id },
      data: publicationData(published),
    });
  }
  async deletePartner(id: string) {
    await this.database.partner.update({
      where: { id },
      data: softDeleteData(),
    });
  }

  createCareer(input: CreateCareerInput) {
    return this.database.career.create({
      data: {
        title: input.title,
        description: input.description ?? '',
        location: input.location ?? '',
        language: input.language,
      },
    });
  }
  listCareers(language?: 'ENGLISH' | 'PORTUGUESE') {
    return this.database.career.findMany({
      where: { isActive: true, ...(language ? { language } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }
  findCareer(id: string) {
    return this.database.career.findFirst({ where: { id, isActive: true } });
  }
  async updateCareer(id: string, input: UpdateCareerInput) {
    await this.database.career.update({ where: { id }, data: input });
  }
  async setCareerPublished(id: string, published: boolean) {
    await this.database.career.update({
      where: { id },
      data: publicationData(published),
    });
  }
  async deleteCareer(id: string) {
    await this.database.career.update({
      where: { id },
      data: softDeleteData(),
    });
  }

  createServiceItem(input: CreateServiceItemInput) {
    return this.database.serviceItem.create({
      data: {
        name: input.name,
        description: input.description ?? '',
        language: input.language,
      },
    });
  }
  listServiceItems(language?: 'ENGLISH' | 'PORTUGUESE') {
    return this.database.serviceItem.findMany({
      where: { isActive: true, ...(language ? { language } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }
  findServiceItem(id: string) {
    return this.database.serviceItem.findFirst({
      where: { id, isActive: true },
    });
  }
  async updateServiceItem(id: string, input: UpdateServiceItemInput) {
    await this.database.serviceItem.update({ where: { id }, data: input });
  }
  async setServiceItemPublished(id: string, published: boolean) {
    await this.database.serviceItem.update({
      where: { id },
      data: publicationData(published),
    });
  }
  async deleteServiceItem(id: string) {
    await this.database.serviceItem.update({
      where: { id },
      data: softDeleteData(),
    });
  }
}
