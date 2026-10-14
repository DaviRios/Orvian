import { httpClient } from '../factories/http-client.factory';

export interface ContentLinkDTO {
  id: string;
  url: string;
  label?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function listContentLinks(
  signal?: AbortSignal,
): Promise<ContentLinkDTO[]> {
  return await httpClient.get<ContentLinkDTO[]>('links', signal);
}

export async function createContentLink(data: {
  url: string;
  label?: string;
}): Promise<void> {
  return await httpClient.post('links', JSON.stringify(data));
}

export async function toggleContentLink(id: string): Promise<void> {
  return await httpClient.patch(`links/${id}/toggle`);
}

export async function deleteContentLink(id: string): Promise<void> {
  return await httpClient.delete(`links/${id}`);
}
