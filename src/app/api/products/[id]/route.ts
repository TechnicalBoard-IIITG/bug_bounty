import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { INITIAL_PRODUCTS } from "@/lib/mockData";
import { getEffectiveStock } from "@/lib/inventoryManager";
import { isDbActiveSync, markDbOffline } from "@/lib/dbCircuitBreaker";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || null;

    let product = null;

    if (isDbActiveSync()) {
      try {
        const dbProd = await prisma.product.findFirst({
          where: {
            OR: [{ id }, { slug: id }],
          },
          include: {
            reviews: {
              orderBy: { createdAt: "desc" },
            },
          },
        });

        if (dbProd) {
          product = {
            ...dbProd,
            images: typeof dbProd.images === "string" ? JSON.parse(dbProd.images) : dbProd.images,
            specs: typeof dbProd.specs === "string" ? JSON.parse(dbProd.specs) : dbProd.specs,
          };
        }
      } catch {
        markDbOffline();
      }
    }

    if (!product) {
      const mockProd = INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id);
      if (mockProd) {
        product = {
          ...mockProd,
          reviews: [
            {
              id: "rev-m1",
              productId: mockProd.id,
              userId: "u-comm-1",
              userName: "Verified Buyer",
              rating: 5,
              title: "Exceptional quality and fast shipping",
              comment: "Arrived the next day in perfect condition. Exceeded my expectations.",
              isVerifiedPurchase: true,
              helpfulVotes: 14,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Apply effective team stock
    const effectiveStock = await getEffectiveStock(product.id, userId);
    product.stock = effectiveStock;

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
