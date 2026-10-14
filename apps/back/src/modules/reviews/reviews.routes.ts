import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from '@fastify/type-provider-zod';
import { z } from 'zod';
import {
  reviewImageBatchSchema,
  reviewImageSchema,
  reviewQuerySchema,
  reviewSchema,
  reviewTestimonialParamsSchema,
  reviewTestimonialSchema,
  createReviewSchema,
  createReviewTestimonialSchema,
  idParamsSchema,
  languageQuerySchema,
  updateReviewSchema,
} from '@orvian/contracts';
import { requireAuth } from '../auth/auth.routes';
import type { AuthService } from '../auth/auth.service';
import type { ReviewsService } from './reviews.service';

interface ReviewsRoutesOptions {
  service: ReviewsService;
  auth: AuthService;
}

export const reviewsRoutes: FastifyPluginAsync<ReviewsRoutesOptions> = async (
  app,
  { service, auth },
) => {
  const server = app.withTypeProvider<ZodTypeProvider>();
  const authenticated = requireAuth(auth);
  server.post(
    '/reviews',
    { preHandler: authenticated, schema: { body: createReviewSchema } },
    async (request, reply) => {
      const item = await service.create(request.body);
      return reply
        .header('Location', `/v1/reviews/${item.id}`)
        .code(201)
        .send();
    },
  );
  server.get(
    '/reviews',
    {
      preHandler: authenticated,
      schema: {
        querystring: reviewQuerySchema,
        response: { 200: z.array(reviewSchema) },
      },
    },
    (request) => service.list(request.query.title),
  );
  server.get(
    '/reviews/:id',
    {
      preHandler: authenticated,
      schema: { params: idParamsSchema, response: { 200: reviewSchema } },
    },
    (request) => service.get(request.params.id),
  );
  server.patch(
    '/reviews/:id',
    {
      preHandler: authenticated,
      schema: { params: idParamsSchema, body: updateReviewSchema },
    },
    async (request, reply) => {
      await service.update(request.params.id, request.body);
      return reply.code(204).send();
    },
  );
  server.delete(
    '/reviews/:id',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.delete(request.params.id);
      return reply.code(204).send();
    },
  );
  server.patch(
    '/reviews/:id/toggle',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.toggle(request.params.id);
      return reply.code(204).send();
    },
  );
  server.patch(
    '/reviews/:id/publish',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.publish(request.params.id);
      return reply.code(204).send();
    },
  );
  server.patch(
    '/reviews/:id/unpublish',
    { preHandler: authenticated, schema: { params: idParamsSchema } },
    async (request, reply) => {
      await service.unpublish(request.params.id);
      return reply.code(204).send();
    },
  );
  server.post(
    '/reviews/:id/images',
    {
      preHandler: authenticated,
      schema: { params: idParamsSchema, body: reviewImageSchema },
    },
    async (request, reply) => {
      await service.addImages(request.params.id, [request.body.imageId]);
      return reply.code(204).send();
    },
  );
  server.post(
    '/reviews/:id/images/batch',
    {
      preHandler: authenticated,
      schema: { params: idParamsSchema, body: reviewImageBatchSchema },
    },
    async (request, reply) => {
      await service.addImages(
        request.params.id,
        request.body.map((item) => item.imageId),
      );
      return reply.code(204).send();
    },
  );
  server.post(
    '/reviews/:id/testimonials',
    {
      preHandler: authenticated,
      schema: { params: idParamsSchema, body: createReviewTestimonialSchema },
    },
    async (request, reply) => {
      const item = await service.addTestimonial(
        request.params.id,
        request.body,
      );
      return reply
        .header(
          'Location',
          `/v1/reviews/${request.params.id}/testimonials/${item.id}`,
        )
        .code(201)
        .send();
    },
  );
  server.get(
    '/reviews/:id/testimonials',
    {
      preHandler: authenticated,
      schema: {
        params: idParamsSchema,
        querystring: languageQuerySchema,
        response: { 200: z.array(reviewTestimonialSchema) },
      },
    },
    (request) =>
      service.listTestimonials(request.params.id, request.query.language),
  );
  server.patch(
    '/reviews/:id/testimonials/:testimonialId/publish',
    {
      preHandler: authenticated,
      schema: { params: reviewTestimonialParamsSchema },
    },
    async (request, reply) => {
      await service.setTestimonialPublished(
        request.params.id,
        request.params.testimonialId,
        true,
      );
      return reply.code(204).send();
    },
  );
  server.patch(
    '/reviews/:id/testimonials/:testimonialId/unpublish',
    {
      preHandler: authenticated,
      schema: { params: reviewTestimonialParamsSchema },
    },
    async (request, reply) => {
      await service.setTestimonialPublished(
        request.params.id,
        request.params.testimonialId,
        false,
      );
      return reply.code(204).send();
    },
  );
};
