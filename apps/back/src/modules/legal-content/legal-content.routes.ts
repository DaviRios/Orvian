import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from '@fastify/type-provider-zod';
import { z } from 'zod';
import {
  idParamsSchema,
  languageQuerySchema,
  legalDocumentSchema,
  legalDocumentTypeParamsSchema,
  saveLegalDocumentSchema,
} from '@orvian/contracts';
import type { AuthService } from '../auth/auth.service';
import { requireAuth } from '../auth/auth.routes';
import type { LegalContentService } from './legal-content.service';

interface LegalContentRoutesOptions {
  service: LegalContentService;
  auth: AuthService;
}

export const legalContentRoutes: FastifyPluginAsync<
  LegalContentRoutesOptions
> = async (app, { service, auth }) => {
  const server = app.withTypeProvider<ZodTypeProvider>();
  const authenticated = requireAuth(auth);

  server.get(
    '/legal-documents',
    {
      preHandler: authenticated,
      schema: {
        querystring: languageQuerySchema,
        response: { 200: z.array(legalDocumentSchema) },
      },
    },
    (request) => service.list(request.query.language),
  );

  server.put(
    '/legal-documents/:type',
    {
      preHandler: authenticated,
      schema: {
        params: legalDocumentTypeParamsSchema,
        body: saveLegalDocumentSchema,
        response: { 200: legalDocumentSchema },
      },
    },
    (request) => service.save(request.params.type, request.body),
  );

  server.patch(
    '/legal-documents/:id/publish',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.publish(request.params.id);
      return reply.code(204).send();
    },
  );

  server.patch(
    '/legal-documents/:id/unpublish',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.unpublish(request.params.id);
      return reply.code(204).send();
    },
  );

  server.delete(
    '/legal-documents/:id',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.delete(request.params.id);
      return reply.code(204).send();
    },
  );
};
