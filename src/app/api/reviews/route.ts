import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";
import { addInMemoryReview, getInMemoryReviews } from "@/lib/reviewStore";
import { isDbActiveSync, safeDbQuery } from "@/lib/dbCircuitBreaker";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    let dbReviews: any[] = [];
    if (productId && isDbActiveSync()) {
      dbReviews = await safeDbQuery(
        () =>
          prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: "desc" },
          }),
        []
      );
    }

    const memReviews = getInMemoryReviews(productId);
    const combined = [...memReviews, ...dbReviews];

    return NextResponse.json({ reviews: combined });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, rating, title, comment, userName, userId } = body;

    // Strict User Isolation & Auth Gate: Reviews require authenticated user account
    if (!userId || userId === "guest" || userId === "guest-user") {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to submit a review." },
        { status: 401 }
      );
    }

    if (!productId || !rating || !title || !comment) {
      return NextResponse.json(
        { error: "productId, rating, title, and comment are required" },
        { status: 400 }
      );
    }

    // HARD_07: Stored XSS in Product Reviews
    // When defect is active: Server saves submitted review text without HTML entity sanitization
    let finalComment = comment;
    if (!isDefectActive("HARD_07_REVIEW_XSS_UNSANITIZED_HTML")) {
      finalComment = comment.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    const reviewId = `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const reviewData = {
      id: reviewId,
      productId,
      userId: userId || "guest-user",
      userName: userName || "Verified Amazon Customer",
      rating: Number(rating),
      title,
      comment: finalComment,
      isVerifiedPurchase: true,
      helpfulVotes: 0,
      createdAt: new Date().toISOString(),
    };

    // Save to memory immediately so submission is instant and always available
    addInMemoryReview(reviewData);

    // Also persist to DB safely in background if active
    if (isDbActiveSync()) {
      await safeDbQuery(
        () =>
          prisma.review.create({
            data: {
              productId,
              userId: userId && userId !== "guest" ? userId : null,
              userName: reviewData.userName,
              rating: reviewData.rating,
              title: reviewData.title,
              comment: reviewData.comment,
              isVerifiedPurchase: true,
              helpfulVotes: 0,
            },
          }),
        null
      );
    }

    return NextResponse.json({ success: true, review: reviewData });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
