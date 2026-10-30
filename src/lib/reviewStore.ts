export interface StoredReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  createdAt: string;
}

const memoryReviews: StoredReview[] = [];

export function addInMemoryReview(review: StoredReview): void {
  memoryReviews.unshift(review);
}

export function getInMemoryReviews(productId?: string | null): StoredReview[] {
  if (!productId) return memoryReviews;
  return memoryReviews.filter((r) => r.productId === productId);
}
