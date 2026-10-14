import { httpClient } from '../factories/http-client.factory';

export interface FeedbackDTO {
  id: string;
  imageId: string;
  imageUrl: string;
  shortTitle: string;
  longTitle: string;
  description: string;
  language: 'PORTUGUESE' | 'ENGLISH';
  isActive: boolean;
  isDraft: boolean;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackDTO {
  imageId: string;
  shortTitle: string;
  longTitle: string;
  description: string;
  language: 'PORTUGUESE' | 'ENGLISH';
}

export async function listFeedbacks(
  signal?: AbortSignal,
): Promise<FeedbackDTO[]> {
  return await httpClient.get<FeedbackDTO[]>('feedbacks', signal);
}

export async function createFeedback(data: CreateFeedbackDTO): Promise<void> {
  return await httpClient.post('feedbacks', JSON.stringify(data));
}

export interface UpdateFeedbackDTO {
  imageId?: string;
  shortTitle?: string;
  longTitle?: string;
  description?: string;
}

export async function updateFeedback(
  id: string,
  data: UpdateFeedbackDTO,
): Promise<void> {
  return await httpClient.patch(`feedbacks/${id}`, JSON.stringify(data));
}

export async function deleteFeedback(id: string): Promise<void> {
  return await httpClient.delete(`feedbacks/${id}`);
}

export async function toggleFeedback(id: string): Promise<void> {
  return await httpClient.patch(`feedbacks/${id}/toggle`);
}

export async function publishFeedback(id: string): Promise<void> {
  return await httpClient.patch(`feedbacks/${id}/publish`);
}

export async function unpublishFeedback(id: string): Promise<void> {
  return await httpClient.patch(`feedbacks/${id}/unpublish`);
}
