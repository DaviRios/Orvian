import {
  publishData,
  softDeleteData,
  unpublishData,
} from '../../core/lifecycle';
import type { LegalDocumentType } from '../../generated/prisma/client';
import type { DatabaseClient } from '../../infrastructure/database/prisma';
import type {
  LegalContentRepository,
  SaveLegalDocumentInput,
} from './legal-content.repository';

export class PrismaLegalContentRepository implements LegalContentRepository {
  constructor(private readonly database: DatabaseClient) {}

  list(language?: 'ENGLISH' | 'PORTUGUESE') {
    return this.database.legalDocument.findMany({
      where: { isActive: true, ...(language ? { language } : {}) },
      orderBy: [{ type: 'asc' }, { language: 'asc' }],
    });
  }

  save(type: LegalDocumentType, input: SaveLegalDocumentInput) {
    return this.database.legalDocument.upsert({
      where: { type_language: { type, language: input.language } },
      create: { type, ...input },
      update: {
        title: input.title,
        content: input.content,
        isActive: true,
        deletedAt: null,
      },
    });
  }

  find(id: string) {
    return this.database.legalDocument.findFirst({
      where: { id, isActive: true },
    });
  }

  async publish(id: string) {
    await this.database.legalDocument.update({
      where: { id },
      data: publishData(),
    });
  }

  async unpublish(id: string) {
    await this.database.legalDocument.update({
      where: { id },
      data: unpublishData(),
    });
  }

  async delete(id: string) {
    await this.database.legalDocument.update({
      where: { id },
      data: { ...softDeleteData(), ...unpublishData() },
    });
  }
}
