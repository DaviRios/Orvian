import { httpClient } from '../factories/http-client.factory';

export interface PartnerBannerDTO {
  id: string;
  name: string;
  imageId: string;
  imageUrl: string;
  isActive: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartnerBannerDTO {
  name: string;
  imageId?: string;
}

export async function listPartnerBanners(
  signal?: AbortSignal,
): Promise<PartnerBannerDTO[]> {
  return await httpClient.get<PartnerBannerDTO[]>('partner-banners', signal);
}

export async function createPartnerBanner(
  data: CreatePartnerBannerDTO,
): Promise<void> {
  return await httpClient.post('partner-banners', JSON.stringify(data));
}

export interface UpdatePartnerBannerDTO {
  name?: string;
  imageId?: string;
}

export async function updatePartnerBanner(
  id: string,
  data: UpdatePartnerBannerDTO,
): Promise<void> {
  return await httpClient.patch(`partner-banners/${id}`, JSON.stringify(data));
}

export async function deletePartnerBanner(id: string): Promise<void> {
  return await httpClient.delete(`partner-banners/${id}`);
}

export async function togglePartnerBanner(id: string): Promise<void> {
  return await httpClient.patch(`partner-banners/${id}/toggle`);
}

export async function publishPartnerBanner(id: string): Promise<void> {
  return await httpClient.patch(`partner-banners/${id}/publish`);
}

export async function unpublishPartnerBanner(id: string): Promise<void> {
  return await httpClient.patch(`partner-banners/${id}/unpublish`);
}
