import type { AuthenticatedUser } from '@orvian/contracts';

declare module 'fastify' {
  interface FastifyRequest {
    authUser: AuthenticatedUser | null;
  }
}
