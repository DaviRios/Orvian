export type DashboardResource = 'HOME' | 'CASE' | 'BLOG' | 'MEDIA' | 'ABOUT';

export interface DashboardActivityCandidate {
  id: string;
  resource: DashboardResource;
  title: string;
  isActive: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardSnapshot {
  publishedPages: number;
  cases: number;
  blogPosts: number;
  mediaAssets: number;
  activity: DashboardActivityCandidate[];
}

export interface DashboardRepository {
  getSnapshot(): Promise<DashboardSnapshot>;
}
