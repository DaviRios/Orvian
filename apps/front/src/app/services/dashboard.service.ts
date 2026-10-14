import type { DashboardSummaryDto } from '@orvian/contracts';
import { httpClient } from '../factories/http-client.factory';

export async function getDashboardSummary(
  signal?: AbortSignal,
): Promise<DashboardSummaryDto> {
  return await httpClient.get<DashboardSummaryDto>('dashboard', signal);
}
