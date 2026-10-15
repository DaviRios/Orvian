import type { LegalDocument } from '../../generated/prisma/client';
import type { LegalContentRepository } from './legal-content.repository';
import { LegalContentService } from './legal-content.service';

const now = new Date('2026-10-15T12:00:00.000Z');
const privacyPolicy: LegalDocument = {
  id: '0e0df94b-05e5-4db9-83ee-86f977ef6fa0',
  type: 'PRIVACY_POLICY',
  title: 'Política de Privacidade',
  content: '<p>Conteúdo</p>',
  language: 'PORTUGUESE',
  publicationStatus: 'DRAFT',
  isActive: true,
  publishedAt: null,
  deletedAt: null,
  createdAt: now,
  updatedAt: now,
};

function repositoryMock(): jest.Mocked<LegalContentRepository> {
  return {
    list: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    publish: jest.fn(),
    unpublish: jest.fn(),
    delete: jest.fn(),
  };
}

describe('LegalContentService', () => {
  it('saves a new document as a draft', async () => {
    const repository = repositoryMock();
    repository.save.mockResolvedValue(privacyPolicy);
    const service = new LegalContentService(repository);

    const result = await service.save('PRIVACY_POLICY', {
      title: privacyPolicy.title,
      content: privacyPolicy.content,
      language: 'PORTUGUESE',
    });

    expect(result).toEqual(
      expect.objectContaining({
        type: 'PRIVACY_POLICY',
        isDraft: true,
        isPublished: false,
      }),
    );
  });

  it('publishes an existing active document', async () => {
    const repository = repositoryMock();
    repository.find.mockResolvedValue(privacyPolicy);
    const service = new LegalContentService(repository);

    await service.publish(privacyPolicy.id);

    expect(repository.publish).toHaveBeenCalledWith(privacyPolicy.id);
  });
});
