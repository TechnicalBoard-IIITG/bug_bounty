import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";

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

    // HARD_07: Stored XSS in Product Reviews
    // When defect is active: Server saves submitted review text without HTML entity sanitization
    let finalComment = comment;
    if (!isDefectActive("HARD_07_REVIEW_XSS_UNSANITIZED_HTML")) {
      finalComment = comment.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    const reviewData = {
      productId,
      userId: userId || "guest-user",
      userName: userName || "Verified Amazon Customer",
      rating: Number(rating),
      title,
      comment: finalComment,
      isVerifiedPurchase: true,
      helpfulVotes: 0,
    };

    try {
      const created = await prisma.review.create({
        data: reviewData,
      });
      return NextResponse.json({ success: true, review: created });
    } catch {
      // Memory fallback
      return NextResponse.json({
        success: true,
        review: {
          id: `rev-${Date.now()}`,
          ...reviewData,
          createdAt: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
