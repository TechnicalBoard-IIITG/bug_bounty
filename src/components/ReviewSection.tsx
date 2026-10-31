"use client";

import React, { useState } from "react";
import { Star, ThumbsUp, CheckCircle, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UI_CONFIG } from "@/lib/uiDefects";
import { getMockReviewsForProduct } from "@/lib/mockReviews";

export interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  createdAt?: string;
}

interface ReviewSectionProps {
  productId: string;
  productTitle: string;
  initialRating: number;
  initialReviewCount: number;
  initialReviews: ReviewItem[];
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  productTitle,
  initialRating,
  initialReviewCount,
  initialReviews,
}) => {
  const { user } = useAuth();
  const defaultMock = getMockReviewsForProduct(productId, productTitle);
  const effectiveInitial = initialReviews && initialReviews.length >= 12 
    ? initialReviews 
    : [...(initialReviews || []), ...defaultMock.slice((initialReviews || []).length)];

  const [reviews, setReviews] = useState<ReviewItem[]>(effectiveInitial);
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);

  // Fetch reviews on mount so newly added reviews persist across page refreshes
  React.useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews && data.reviews.length > 0) {
          const existingIds = new Set(data.reviews.map((r: any) => r.id));
          const unmergedInitial = effectiveInitial.filter((ir) => !existingIds.has(ir.id));
          setReviews([...data.reviews, ...unmergedInitial]);
        }
      })
      .catch(() => {});
  }, [productId]);

  // Write Review Modal Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState("");
  const [formComment, setFormComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredReviews = reviews.filter((r) => {
    if (selectedStarFilter === null) return true;
    if (selectedStarFilter === 1 && UI_CONFIG.reviewStarFilterInverted) {
      return r.rating > 1;
    }
    return r.rating === selectedStarFilter;
  });

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating: formRating,
          title: formTitle,
          comment: formComment,
          userName: user?.name || "Verified Amazon Customer",
          userId: user?.id || "guest",
        }),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews([data.review, ...reviews]);
        setIsFormOpen(false);
        setFormTitle("");
        setFormComment("");
      }
    } catch (e) {
      console.error("Submit review error:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-300 pt-8 mt-12 text-amazon-text">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Rating Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(initialRating)
                      ? "fill-current"
                      : "text-gray-300 fill-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-bold">{initialRating} out of 5</span>
          </div>
          <p className="text-xs text-gray-500">{initialReviewCount} global ratings</p>

          {/* Star breakdown bars */}
          <div className="space-y-2 pt-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const percentages: Record<number, number> = {
                5: 72,
                4: 18,
                3: 5,
                2: 3,
                1: 2,
              };
              const pct = percentages[stars] || 0;
              const isSelected = selectedStarFilter === stars;

              return (
                <div
                  key={stars}
                  onClick={() =>
                    setSelectedStarFilter(isSelected ? null : stars)
                  }
                  className={`flex items-center gap-3 text-xs cursor-pointer group p-1 rounded ${
                    isSelected ? "bg-amber-100 font-bold" : "hover:bg-gray-100"
                  }`}
                  title={`Filter by ${stars} star`}
                >
                  <span className="w-12 text-amazon-link group-hover:underline">
                    {stars} star
                  </span>
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                    <div
                      className="h-full bg-amazon-orange rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-gray-600">{pct}%</span>
                </div>
              );
            })}
          </div>

          {selectedStarFilter !== null && (
            <button
              onClick={() => setSelectedStarFilter(null)}
              className="text-xs text-amazon-link hover:underline font-semibold block pt-1"
            >
              Clear filter ({selectedStarFilter} star)
            </button>
          )}

          <div className="border-t pt-4">
            <h4 className="font-bold text-sm mb-1">Review this product</h4>
            <p className="text-xs text-gray-600 mb-3">
              Share your thoughts with other customers
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="w-full rounded border border-gray-300 py-1.5 text-xs font-semibold hover:bg-gray-50 shadow-sm"
            >
              Write a customer review
            </button>
          </div>
        </div>

        {/* Right Column: Review Cards */}
        <div className="md:col-span-2 space-y-6">
          {filteredReviews.length === 0 ? (
            <p className="text-xs text-gray-500 py-4">No reviews match the selected filter.</p>
          ) : (
            filteredReviews.map((rev) => (
              <div key={rev.id} className="border-b border-gray-200 pb-5 space-y-2">
                {/* User avatar & name */}
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-700">
                    {rev.userName.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-gray-800">
                    {rev.userName}
                  </span>
                </div>

                {/* Rating & Title */}
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < rev.rating
                            ? "fill-current"
                            : "text-gray-300 fill-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <h5 className="text-xs font-bold text-gray-900">{rev.title}</h5>
                </div>

                {/* Verified Purchase badge */}
                {rev.isVerifiedPurchase && (
                  <div className="flex items-center gap-1 text-[11px] text-amber-800 font-semibold">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Verified Purchase</span>
                  </div>
                )}

                {/* Review Text */}
                <div
                  className="text-xs text-gray-700 leading-relaxed break-words"
                  dangerouslySetInnerHTML={{ __html: rev.comment }}
                />

                {/* Helpful Button */}
                <div className="flex items-center gap-4 pt-1 text-xs text-gray-500">
                  <button className="flex items-center gap-1 rounded border border-gray-300 px-3 py-1 text-[11px] hover:bg-gray-50">
                    <ThumbsUp className="h-3 w-3" />
                    Helpful ({rev.helpfulVotes})
                  </button>
                  <span className="hover:underline cursor-pointer">Report</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Submission Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl p-6 text-amazon-text space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amazon-orange" />
              Write a Review for {productTitle}
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Overall Rating
                </label>
                <div className="flex gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormRating(s)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          s <= formRating
                            ? "fill-current"
                            : "text-gray-300 fill-gray-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="What's most important to know?"
                  required
                  className="w-full rounded border border-gray-400 px-3 py-2 text-xs focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Written Review
                </label>
                <textarea
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="What did you like or dislike? What did you use this product for?"
                  rows={4}
                  required
                  className="w-full rounded border border-gray-400 px-3 py-2 text-xs focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded border border-gray-300 px-4 py-1.5 text-xs font-semibold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded bg-amazon-yellow hover:bg-amazon-yellowHover px-6 py-1.5 text-xs font-bold text-amazon-text shadow-sm"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
