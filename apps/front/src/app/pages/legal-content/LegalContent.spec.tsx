import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  listLegalDocuments,
  saveLegalDocument,
} from '../../services/legal-documents.service';
import { LegalContent } from './LegalContent';

jest.mock('../../services/legal-documents.service', () => ({
  listLegalDocuments: jest.fn(),
  saveLegalDocument: jest.fn(),
  publishLegalDocument: jest.fn(),
  unpublishLegalDocument: jest.fn(),
  deleteLegalDocument: jest.fn(),
}));

jest.mock('../../components/RichTextEditor/RichTextEditor', () => ({
  RichTextEditor: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <textarea
      aria-label="Conteúdo do documento"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}));

describe('LegalContent', () => {
  it('shows both legal documents and saves the privacy policy', async () => {
    jest.mocked(listLegalDocuments).mockResolvedValue([]);
    jest.mocked(saveLegalDocument).mockResolvedValue({
      id: '0e0df94b-05e5-4db9-83ee-86f977ef6fa0',
      type: 'PRIVACY_POLICY',
      title: 'Política de Privacidade',
      content: '<p>Uso dos dados</p>',
      language: 'PORTUGUESE',
      isActive: true,
      isDraft: true,
      isPublished: false,
      publishedAt: null,
      createdAt: '2026-10-15T12:00:00.000Z',
      updatedAt: '2026-10-15T12:00:00.000Z',
    });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <LegalContent />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByRole('button', { name: /Política de Privacidade/ }),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /Termos de Serviço/ }),
    ).toBeTruthy();

    fireEvent.change(await screen.findByLabelText('Conteúdo do documento'), {
      target: { value: '<p>Uso dos dados</p>' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() =>
      expect(saveLegalDocument).toHaveBeenCalledWith('PRIVACY_POLICY', {
        title: 'Política de Privacidade',
        content: '<p>Uso dos dados</p>',
        language: 'PORTUGUESE',
      }),
    );
  });
});
