import type { z } from 'zod';
import type { saveLegalDocumentSchema } from '@orvian/contracts';
import type {
  LegalDocument,
  LegalDocumentType,
} from '../../generated/prisma/client';

export type SaveLegalDocumentInput = z.infer<typeof saveLegalDocumentSchema>;

export interface LegalContentRepository {
  list(language?: 'ENGLISH' | 'PORTUGUESE'): Promise<LegalDocument[]>;
  save(
    type: LegalDocumentType,
    input: SaveLegalDocumentInput,
  ): Promise<LegalDocument>;
  find(id: string): Promise<LegalDocument | null>;
  publish(id: string): Promise<void>;
  unpublish(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
