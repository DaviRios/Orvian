import { httpClient } from '../factories/http-client.factory';

const BASE_URL =
  (import.meta.env.VITE_API_ORVIAN_URL ?? '/v1').replace(/\/$/, '') + '/';

export interface ReviewContentDTO {
  id: string;
  title: string;
  subtitle: string;
  shortTitle: string;
  content: string;
  industry: string;
  country: string;
  tag: string;
  language: 'PORTUGUESE' | 'ENGLISH';
  logoId: string;
  imageIds: string[];
  isActive: boolean;
  isDraft: boolean;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewDTO {
  title: string;
  subtitle?: string;
  shortTitle?: string;
  content?: string;
  industry?: string;
  country?: string;
  tag?: string;
  language: 'PORTUGUESE' | 'ENGLISH';
}

export function reviewImageUrl(imageId: string): string {
  return `${BASE_URL}images/${imageId}`;
}

export async function listReviews(
  title?: string,
  signal?: AbortSignal,
): Promise<ReviewContentDTO[]> {
  const qs = title ? `?title=${encodeURIComponent(title)}` : '';
  return await httpClient.get<ReviewContentDTO[]>(`reviews${qs}`, signal);
}

export async function createReview(data: CreateReviewDTO): Promise<string> {
  const response = await httpClient.raw(
    'POST',
    'reviews',
    JSON.stringify(data),
  );
  const location = response.headers.get('Location') ?? '';
  return location.split('/').pop() ?? '';
}

export async function addReviewImages(
  reviewId: string,
  imageIds: string[],
): Promise<void> {
  return await httpClient.post(
    `reviews/${reviewId}/images/batch`,
    JSON.stringify(imageIds.map((imageId) => ({ imageId }))),
  );
}

export interface UpdateReviewDTO {
  title?: string;
  subtitle?: string;
  shortTitle?: string;
  content?: string;
  industry?: string;
  country?: string;
  tag?: string;
}

export async function updateReview(
  id: string,
  data: UpdateReviewDTO,
): Promise<void> {
  return await httpClient.patch(`reviews/${id}`, JSON.stringify(data));
}

export async function deleteReview(id: string): Promise<void> {
  return await httpClient.delete(`reviews/${id}`);
}

export async function toggleReview(id: string): Promise<void> {
  return await httpClient.patch(`reviews/${id}/toggle`);
}

export async function publishReview(id: string): Promise<void> {
  return await httpClient.patch(`reviews/${id}/publish`);
}

export async function unpublishReview(id: string): Promise<void> {
  return await httpClient.patch(`reviews/${id}/unpublish`);
}
