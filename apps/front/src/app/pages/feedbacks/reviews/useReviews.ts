import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { ReviewContentDTO } from '../../../services/reviews.service';
import {
  deleteReview,
  listReviews,
  publishReview,
  toggleReview,
  unpublishReview,
} from '../../../services/reviews.service';

export function useReviews() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['reviews'],
    queryFn: ({ signal }) => listReviews(undefined, signal),
  });

  async function invalidate() {
    await queryClient.invalidateQueries({ queryKey: ['reviews'] });
  }

  async function toggleActive(item: ReviewContentDTO) {
    await toggleReview(item.id);
    await invalidate();
  }

  async function togglePublication(item: ReviewContentDTO) {
    if (item.isPublished) await unpublishReview(item.id);
    else await publishReview(item.id);
    await invalidate();
  }

  async function remove(item: ReviewContentDTO) {
    await deleteReview(item.id);
    await invalidate();
  }

  return {
    reviews: query.data ?? [],
    isPending: query.isPending,
    invalidate,
    remove,
    toggleActive,
    togglePublication,
  };
}
