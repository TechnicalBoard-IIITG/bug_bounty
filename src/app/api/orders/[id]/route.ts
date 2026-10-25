import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const authHeader = req.headers.get("authorization");
    // Suppose requesting user id is passed or inferred
    const requestingUserId = req.nextUrl.searchParams.get("userId") || "guest";

    try {
      const order = await prisma.order.findFirst({
        where: {
          OR: [{ id }, { orderNumber: id }],
        },
        include: {
          items: true,
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // HARD_02: Order History Parameter Enumeration
      // When defect is active: Endpoint lacks session ownership validation,
      // allowing any user to view other customers' orders by incrementing the URL ID parameter.
      if (!isDefectActive("HARD_02_ORDER_HISTORY_PARAMETER_ENUMERATION")) {
        // Secure validation:
        if (order.userId !== requestingUserId && requestingUserId !== "admin") {
          return NextResponse.json(
            { error: "Unauthorized: You do not own this order." },
            { status: 403 }
          );
        }
      }

      return NextResponse.json({ order });
    } catch {
      // In-memory mock response for Hard 2 testing if DB is offline
      const mockOrder = {
        id,
        orderNumber: id.startsWith("112-") ? id : `112-${id}-9999999`,
        userId: "customer-999-other-victim",
        subtotal: 348.0,
        discount: 0,
        tax: 27.84,
        shippingFee: 0,
        total: 375.84,
        status: "Delivered",
        createdAt: "2026-10-15T12:00:00.000Z",
        items: [
          {
            id: "item-enum-1",
            productId: "prod-e1",
            title: "Sony WH-1000XM5 Wireless Headphones (Other Customer Order)",
            unitPrice: 348.0,
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
          },
        ],
      };
      return NextResponse.json({ order: mockOrder });
    }
  } catch (error) {
    console.error("Single order GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
