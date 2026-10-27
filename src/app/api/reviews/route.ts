import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addSharedReview } from "@/lib/accountIsolation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, rating, title, comment, userName, userId } = body;

    if (!productId || !rating || !title || !comment) {
      return NextResponse.json(
        { error: "productId, rating, title, and comment are required" },
        { status: 400 }
      );
    }

    // HARD_07: Product review text is stored without sanitization
    // Allowing submitted HTML (e.g. <img src=x onerror=...>)
    const newReview = {
      id: `rev-${Date.now()}`,
      productId,
      userId: userId || "guest-user",
      userName: userName || "Verified Amazon Customer",
      rating: Number(rating),
      title,
      comment, // Unsanitized HTML stored per HARD_07
      isVerifiedPurchase: true,
      helpfulVotes: 0,
      createdAt: new Date().toISOString(),
    };

    // Shared globally for all teams/accounts
    addSharedReview(newReview);

    try {
      const created = await prisma.review.create({
        data: {
          productId,
          userId: userId || "guest-user",
          userName: newReview.userName,
          rating: Number(rating),
          title,
          comment,
          isVerifiedPurchase: true,
          helpfulVotes: 0,
        },
      });
      return NextResponse.json({ success: true, review: created });
    } catch {
      // If DB error, return memory review
      return NextResponse.json({ success: true, review: newReview });
    }
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
