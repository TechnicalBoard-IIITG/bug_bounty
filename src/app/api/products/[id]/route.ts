import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { INITIAL_PRODUCTS } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Try finding by ID or slug in DB
    try {
      const product = await prisma.product.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
        include: {
          reviews: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (product) {
        return NextResponse.json({
          ...product,
          images: typeof product.images === "string" ? JSON.parse(product.images) : product.images,
          specs: typeof product.specs === "string" ? JSON.parse(product.specs) : product.specs,
        });
      }
    } catch {
      // Fallback
    }

    // Fallback to mock product
    const mock = INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id);
    if (mock) {
      return NextResponse.json({
        ...mock,
        reviews: [
          {
            id: "rev-1",
            userName: "Alex R. (Verified Buyer)",
            rating: 5,
            title: "Exceptional quality and fast delivery!",
            comment: "Arrived in perfect condition. Exactly as described, would highly recommend to anyone looking for premium quality.",
            isVerifiedPurchase: true,
            helpfulVotes: 14,
            createdAt: new Date().toISOString(),
          },
          {
            id: "rev-2",
            userName: "Sarah M.",
            rating: 4,
            title: "Solid build, great value for money",
            comment: "Performs very well day to day. A minor detail could be improved in the documentation, but overall 4/5.",
            isVerifiedPurchase: true,
            helpfulVotes: 6,
            createdAt: new Date().toISOString(),
          },
          {
            id: "rev-3",
            userName: "Disappointed Shopper",
            rating: 1,
            title: "Not what I expected",
            comment: "Found a few issues right out of the box. Customer support was okay, but I expected more.",
            isVerifiedPurchase: true,
            helpfulVotes: 2,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }

    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  } catch (error) {
    console.error("Single product GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
