import { z } from 'zod';

export const dashboardActivitySchema = z.object({
  id: z.string(),
  resource: z.enum(['HOME', 'REVIEW', 'BLOG', 'MEDIA', 'ABOUT']),
  action: z.enum(['CREATED', 'UPDATED', 'PUBLISHED', 'DELETED']),
  title: z.string(),
  occurredAt: z.string(),
});

export const dashboardSummarySchema = z.object({
  metrics: z.object({
    publishedPages: z.number().int().nonnegative(),
    reviews: z.number().int().nonnegative(),
    blogPosts: z.number().int().nonnegative(),
    mediaAssets: z.number().int().nonnegative(),
  }),
  recentActivity: z.array(dashboardActivitySchema).max(3),
});

export type DashboardActivityDto = z.infer<typeof dashboardActivitySchema>;
export type DashboardSummaryDto = z.infer<typeof dashboardSummarySchema>;
