import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getDashboardSummary } from '../../services/dashboard.service';
import { Dashboard } from './Dashboard';

jest.mock('../../services/dashboard.service', () => ({
  getDashboardSummary: jest.fn(),
}));

describe('Dashboard', () => {
  it('shows backend metrics and recent activity', async () => {
    jest.mocked(getDashboardSummary).mockResolvedValue({
      metrics: {
        publishedPages: 3,
        cases: 8,
        blogPosts: 13,
        mediaAssets: 21,
      },
      recentActivity: [
        {
          id: 'BLOG:1',
          resource: 'BLOG',
          action: 'PUBLISHED',
          title: 'Como organizar conteúdo',
          occurredAt: '2026-10-13T12:00:00.000Z',
        },
      ],
    });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Dashboard />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Como organizar conteúdo')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('8')).toBeTruthy();
    expect(screen.getByText('13')).toBeTruthy();
    expect(screen.getByText('21')).toBeTruthy();
    expect(screen.getByText('Publicado:')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /Novo post no blog/ }),
    ).toBeTruthy();
  });
});
