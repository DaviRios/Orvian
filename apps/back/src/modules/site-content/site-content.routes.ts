import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from '@fastify/type-provider-zod';
import { z } from 'zod';
import {
  createPartnerBannerSchema,
  createContentLinkSchema,
  createInformationSchema,
  createProductSchema,
  partnerBannerSchema,
  contentLinkSchema,
  idParamsSchema,
  languageQuerySchema,
  informationSchema,
  productSchema,
  updatePartnerBannerSchema,
  updateContentLinkSchema,
  updateInformationSchema,
  updateProductSchema,
} from '@orvian/contracts';
import type { AuthService } from '../auth/auth.service';
import { requireAuth } from '../auth/auth.routes';
import type { SiteContentService } from './site-content.service';

interface SiteContentRoutesOptions {
  service: SiteContentService;
  auth: AuthService;
}

export const siteContentRoutes: FastifyPluginAsync<
  SiteContentRoutesOptions
> = async (app, { service, auth }) => {
  const server = app.withTypeProvider<ZodTypeProvider>();
  const authenticated = requireAuth(auth);

  server.post(
    '/products',
    { preHandler: authenticated, schema: { body: createProductSchema } },
    async (request, reply) => {
      const item = await service.createProduct(request.body);
      return reply
        .header('Location', `/v1/products/${item.id}`)
        .code(201)
        .send();
    },
  );
  server.get(
    '/products',
    {
      preHandler: authenticated,
      schema: {
        querystring: languageQuerySchema,
        response: { 200: z.array(productSchema) },
      },
    },
    (request) => service.listProducts(request.query.language),
  );
  server.get(
    '/products/:id',
    {
      preHandler: authenticated,
      schema: { params: idParamsSchema, response: { 200: productSchema } },
    },
    (request) => service.getProduct(request.params.id),
  );
  server.patch(
    '/products/:id',
    {
      preHandler: authenticated,
      schema: { params: idParamsSchema, body: updateProductSchema },
    },
    async (request, reply) => {
      await service.updateProduct(request.params.id, request.body);
      return reply.code(204).send();
    },
  );
  server.delete(
    '/products/:id',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.deleteProduct(request.params.id);
      return reply.code(204).send();
    },
  );
  server.patch(
    '/products/:id/toggle',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.toggleProduct(request.params.id);
      return reply.code(204).send();
    },
  );
  server.patch(
    '/products/:id/publish',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.publishProduct(request.params.id);
      return reply.code(204).send();
    },
  );
  server.patch(
    '/products/:id/unpublish',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.unpublishProduct(request.params.id);
      return reply.code(204).send();
    },
  );

  server.post(
    '/information',
    { preHandler: authenticated, schema: { body: createInformationSchema } },
    async (request, reply) => {
      const item = await service.createInformation(request.body);
      return reply
        .header('Location', `/v1/information/${item.id}`)
        .code(201)
        .send();
    },
  );
  server.get(
    '/information',
    {
      preHandler: authenticated,
      schema: {
        querystring: languageQuerySchema,
        response: { 200: z.array(informationSchema) },
      },
    },
    (request) => service.listInformation(request.query.language),
  );
  server.get(
    '/information/:id',
    {
      preHandler: authenticated,
      schema: { params: idParamsSchema, response: { 200: informationSchema } },
    },
    (request) => service.getInformation(request.params.id),
  );
  server.patch(
    '/information/:id',
    {
      preHandler: authenticated,
      schema: { params: idParamsSchema, body: updateInformationSchema },
    },
    async (request, reply) => {
      await service.updateInformation(request.params.id, request.body);
      return reply.code(204).send();
    },
  );
  server.delete(
    '/information/:id',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.deleteInformation(request.params.id);
      return reply.code(204).send();
    },
  );
  server.patch(
    '/information/:id/publish',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.publishInformation(request.params.id);
      return reply.code(204).send();
    },
  );
  server.patch(
    '/information/:id/unpublish',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.unpublishInformation(request.params.id);
      return reply.code(204).send();
    },
  );

  server.post(
    '/partner-banners',
    { preHandler: authenticated, schema: { body: createPartnerBannerSchema } },
    async (request, reply) => {
      const item = await service.createPartnerBanner(request.body);
      return reply
        .header('Location', `/v1/partner-banners/${item.id}`)
        .code(201)
        .send();
    },
  );
  server.get(
    '/partner-banners',
    {
      preHandler: authenticated,
      schema: { response: { 200: z.array(partnerBannerSchema) } },
    },
    () => service.listPartnerBanners(),
  );
  server.get(
    '/partner-banners/:id',
    {
      preHandler: authenticated,
      schema: {
        params: idParamsSchema,
        response: { 200: partnerBannerSchema },
      },
    },
    (request) => service.getPartnerBanner(request.params.id),
  );
  server.patch(
    '/partner-banners/:id',
    {
      preHandler: authenticated,
      schema: { params: idParamsSchema, body: updatePartnerBannerSchema },
    },
    async (request, reply) => {
      await service.updatePartnerBanner(request.params.id, request.body);
      return reply.code(204).send();
    },
  );
  server.delete(
    '/partner-banners/:id',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.deletePartnerBanner(request.params.id);
      return reply.code(204).send();
    },
  );
  server.patch(
    '/partner-banners/:id/toggle',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.togglePartnerBanner(request.params.id);
      return reply.code(204).send();
    },
  );
  server.patch(
    '/partner-banners/:id/publish',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.publishPartnerBanner(request.params.id);
      return reply.code(204).send();
    },
  );
  server.patch(
    '/partner-banners/:id/unpublish',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.unpublishPartnerBanner(request.params.id);
      return reply.code(204).send();
    },
  );

  server.post(
    '/links',
    { preHandler: authenticated, schema: { body: createContentLinkSchema } },
    async (request, reply) => {
      const item = await service.createContentLink(request.body);
      return reply.header('Location', `/v1/links/${item.id}`).code(201).send();
    },
  );
  server.get(
    '/links',
    {
      preHandler: authenticated,
      schema: { response: { 200: z.array(contentLinkSchema) } },
    },
    () => service.listContentLinks(),
  );
  server.get(
    '/links/:id',
    {
      preHandler: authenticated,
      schema: { params: idParamsSchema, response: { 200: contentLinkSchema } },
    },
    (request) => service.getContentLink(request.params.id),
  );
  server.patch(
    '/links/:id',
    {
      preHandler: authenticated,
      schema: { params: idParamsSchema, body: updateContentLinkSchema },
    },
    async (request, reply) => {
      await service.updateContentLink(request.params.id, request.body);
      return reply.code(204).send();
    },
  );
  server.patch(
    '/links/:id/toggle',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.toggleContentLink(request.params.id);
      return reply.code(204).send();
    },
  );
  server.delete(
    '/links/:id',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.deleteContentLink(request.params.id);
      return reply.code(204).send();
    },
  );
};
