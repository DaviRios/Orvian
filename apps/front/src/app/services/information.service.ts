import { httpClient } from '../factories/http-client.factory';

export type InformationStyle =
  | 'ORANGE_WHITE'
  | 'WHITE_ORANGE'
  | 'PURPLE_WHITE'
  | 'WHITE_PURPLE';

export const INFORMATION_STYLE_LABELS: Record<InformationStyle, string> = {
  ORANGE_WHITE: 'Laranja e branco',
  WHITE_ORANGE: 'Branco e laranja',
  PURPLE_WHITE: 'Roxo e branco',
  WHITE_PURPLE: 'Branco e roxo',
};

export const INFORMATION_STYLE_COLORS: Record<
  InformationStyle,
  [string, string]
> = {
  ORANGE_WHITE: ['#F97316', '#FFFFFF'],
  WHITE_ORANGE: ['#FFFFFF', '#F97316'],
  PURPLE_WHITE: ['#7C3AED', '#FFFFFF'],
  WHITE_PURPLE: ['#FFFFFF', '#7C3AED'],
};

export interface InformationDTO {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  redirectUrl: string;
  buttonText2: string | null;
  redirectUrl2: string | null;
  isActive: boolean;
  style: InformationStyle;
  language: 'ENGLISH' | 'PORTUGUESE';
  isDraft: boolean;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInformationDTO {
  title: string;
  description?: string;
  buttonText?: string;
  redirectUrl?: string;
  buttonText2?: string;
  redirectUrl2?: string;
  style: InformationStyle;
  language: 'ENGLISH' | 'PORTUGUESE';
}

export async function listInformation(
  language?: string,
  signal?: AbortSignal,
): Promise<InformationDTO[]> {
  const qs = language ? `?language=${language}` : '';
  return await httpClient.get<InformationDTO[]>(`information${qs}`, signal);
}

export async function createInformation(
  data: CreateInformationDTO,
): Promise<void> {
  return await httpClient.post('information', JSON.stringify(data));
}

export interface UpdateInformationDTO {
  title?: string;
  description?: string;
  buttonText?: string;
  redirectUrl?: string;
  buttonText2?: string;
  redirectUrl2?: string;
  style?: InformationStyle;
  language?: 'ENGLISH' | 'PORTUGUESE';
}

export async function updateInformation(
  id: string,
  data: UpdateInformationDTO,
): Promise<void> {
  return await httpClient.patch(`information/${id}`, JSON.stringify(data));
}

export async function deleteInformation(id: string): Promise<void> {
  return await httpClient.delete(`information/${id}`);
}

export async function publishInformation(id: string): Promise<void> {
  return await httpClient.patch(`information/${id}/publish`);
}

export async function unpublishInformation(id: string): Promise<void> {
  return await httpClient.patch(`information/${id}/unpublish`);
}
