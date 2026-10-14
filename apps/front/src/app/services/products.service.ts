import { httpClient } from '../factories/http-client.factory';

export interface ProductDTO {
  id: string;
  logoId: string;
  text: string;
  buttonText: string;
  buttonUrl: string;
  isActive: boolean;
  language: 'ENGLISH' | 'PORTUGUESE';
  isDraft: boolean;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  text: string;
  buttonText?: string;
  buttonUrl?: string;
  logoId?: string;
  language: 'ENGLISH' | 'PORTUGUESE';
}

export async function listProducts(
  language?: string,
  signal?: AbortSignal,
): Promise<ProductDTO[]> {
  const qs = language ? `?language=${language}` : '';
  return await httpClient.get<ProductDTO[]>(`products${qs}`, signal);
}

export async function createProduct(data: CreateProductDTO): Promise<void> {
  return await httpClient.post('products', JSON.stringify(data));
}

export interface UpdateProductDTO {
  text?: string;
  buttonText?: string;
  buttonUrl?: string;
  language?: 'ENGLISH' | 'PORTUGUESE';
}

export async function updateProduct(
  id: string,
  data: UpdateProductDTO,
): Promise<void> {
  return await httpClient.patch(`products/${id}`, JSON.stringify(data));
}

export async function deleteProduct(id: string): Promise<void> {
  return await httpClient.delete(`products/${id}`);
}

export async function toggleProduct(id: string): Promise<void> {
  return await httpClient.patch(`products/${id}/toggle`);
}

export async function publishProduct(id: string): Promise<void> {
  return await httpClient.patch(`products/${id}/publish`);
}

export async function unpublishProduct(id: string): Promise<void> {
  return await httpClient.patch(`products/${id}/unpublish`);
}
