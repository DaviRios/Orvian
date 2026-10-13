import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from '@fastify/type-provider-zod';
import { dashboardSummarySchema } from '@soir/contracts';
import type { AuthService } from '../auth/auth.service';
import { requireAuth } from '../auth/auth.routes';
import type { DashboardService } from './dashboard.service';

interface DashboardRoutesOptions {
  service: DashboardService;
  auth: AuthService;
}

export const dashboardRoutes: FastifyPluginAsync<
  DashboardRoutesOptions
> = async (app, { service, auth }) => {
  const server = app.withTypeProvider<ZodTypeProvider>();
  server.get(
    '/dashboard',
    {
      preHandler: requireAuth(auth),
      schema: { response: { 200: dashboardSummarySchema } },
    },
    () => service.summary(),
  );
};
