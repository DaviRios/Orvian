import type { LegalDocumentType } from '../../generated/prisma/client';
import { NotFoundError } from '../../core/errors';
import { lifecycleDto } from '../../core/lifecycle';
import type {
  LegalContentRepository,
  SaveLegalDocumentInput,
} from './legal-content.repository';

export class LegalContentService {
  constructor(private readonly repository: LegalContentRepository) {}

  async list(language?: 'ENGLISH' | 'PORTUGUESE') {
    return (await this.repository.list(language)).map(lifecycleDto);
  }

  async save(type: LegalDocumentType, input: SaveLegalDocumentInput) {
    return lifecycleDto(await this.repository.save(type, input));
  }

  async publish(id: string) {
    await this.get(id);
    await this.repository.publish(id);
  }

  async unpublish(id: string) {
    await this.get(id);
    await this.repository.unpublish(id);
  }

  async delete(id: string) {
    await this.get(id);
    await this.repository.delete(id);
  }

  private async get(id: string) {
    const document = await this.repository.find(id);
    if (!document) throw new NotFoundError('Documento legal');
    return document;
  }
}
