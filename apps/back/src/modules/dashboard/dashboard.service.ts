import type {
  DashboardActivityCandidate,
  DashboardRepository,
} from './dashboard.repository';

const SAME_EVENT_WINDOW_MS = 1_000;

function happenedTogether(left: Date | null, right: Date): boolean {
  return Boolean(
    left && Math.abs(left.getTime() - right.getTime()) <= SAME_EVENT_WINDOW_MS,
  );
}

function actionFor(item: DashboardActivityCandidate) {
  if (!item.isActive) return 'DELETED' as const;
  if (happenedTogether(item.publishedAt, item.updatedAt)) {
    return 'PUBLISHED' as const;
  }
  if (happenedTogether(item.createdAt, item.updatedAt)) {
    return 'CREATED' as const;
  }
  return 'UPDATED' as const;
}

export class DashboardService {
  constructor(private readonly repository: DashboardRepository) {}

  async summary() {
    const snapshot = await this.repository.getSnapshot();
    return {
      metrics: {
        publishedPages: snapshot.publishedPages,
        cases: snapshot.cases,
        blogPosts: snapshot.blogPosts,
        mediaAssets: snapshot.mediaAssets,
      },
      recentActivity: snapshot.activity
        .sort(
          (left, right) => right.updatedAt.getTime() - left.updatedAt.getTime(),
        )
        .slice(0, 3)
        .map((item) => ({
          id: `${item.resource}:${item.id}`,
          resource: item.resource,
          action: actionFor(item),
          title: item.title,
          occurredAt: item.updatedAt.toISOString(),
        })),
    };
  }
}
