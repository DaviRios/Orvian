import type {
  Language,
  LegalDocumentDto,
  LegalDocumentType,
} from '@orvian/contracts';
import { httpClient } from '../factories/http-client.factory';

export interface SaveLegalDocumentDto {
  title: string;
  content: string;
  language: Language;
}

export function listLegalDocuments(language?: Language, signal?: AbortSignal) {
  const query = language ? `?language=${language}` : '';
  return httpClient.get<LegalDocumentDto[]>(`legal-documents${query}`, signal);
}

export function saveLegalDocument(
  type: LegalDocumentType,
  input: SaveLegalDocumentDto,
) {
  return httpClient.put<LegalDocumentDto>(
    `legal-documents/${type}`,
    JSON.stringify(input),
  );
}

export function publishLegalDocument(id: string) {
  return httpClient.patch(`legal-documents/${id}/publish`);
}

export function unpublishLegalDocument(id: string) {
  return httpClient.patch(`legal-documents/${id}/unpublish`);
}

export function deleteLegalDocument(id: string) {
  return httpClient.delete(`legal-documents/${id}`);
}
