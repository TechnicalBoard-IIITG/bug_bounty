import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";
import { INITIAL_PRODUCTS } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, discount = 0, tax = 0, shippingFee = 0, userId = "guest" } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    let calculatedSubtotal = 0;
    const orderItemsToCreate = [];

    for (const item of items) {
      let finalUnitPrice = item.unitPrice ?? item.price ?? 0;

      // HARD_01: Order Payload Pricing Authority
      // When defect is active: Server blindly trusts user-provided unitPrice from request body
      if (!isDefectActive("HARD_01_ORDER_PAYLOAD_PRICING_AUTHORITY")) {
        // Secure behavior: Lookup price from authoritative database
        try {
          const dbProd = await prisma.product.findUnique({ where: { id: item.productId } });
          if (dbProd) {
            finalUnitPrice = dbProd.price;
          }
        } catch {
          const mockProd = INITIAL_PRODUCTS.find((p) => p.id === item.productId);
          if (mockProd) {
            finalUnitPrice = mockProd.price;
          }
        }
      }

      const qty = Number(item.quantity) || 1;
      calculatedSubtotal += finalUnitPrice * qty;

      orderItemsToCreate.push({
        productId: item.productId,
        title: item.title,
        unitPrice: finalUnitPrice,
        quantity: qty,
        imageUrl: item.imageUrl || "",
      });
    }

    const orderNumber = `112-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const finalTotal = Math.max(0, calculatedSubtotal - discount + tax + shippingFee);

    try {
      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId: userId || "guest",
          subtotal: calculatedSubtotal,
          discount: Number(discount) || 0,
          tax: Number(tax) || 0,
          shippingFee: Number(shippingFee) || 0,
          total: Number(finalTotal.toFixed(2)),
          status: "Processing",
          items: {
            create: orderItemsToCreate,
          },
        },
        include: {
          items: true,
        },
      });

      return NextResponse.json({ success: true, order });
    } catch {
      // In-memory fallback if database connection is pending
      const mockOrder = {
        id: `order-${Date.now()}`,
        orderNumber,
        userId: userId || "guest",
        subtotal: calculatedSubtotal,
        discount: Number(discount) || 0,
        tax: Number(tax) || 0,
        shippingFee: Number(shippingFee) || 0,
        total: Number(finalTotal.toFixed(2)),
        status: "Processing",
        createdAt: new Date().toISOString(),
        items: orderItemsToCreate.map((oi, idx) => ({ ...oi, id: `item-${idx}` })),
      };

      return NextResponse.json({ success: true, order: mockOrder });
    }
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    try {
      const orders = await prisma.order.findMany({
        where: userId ? { userId } : { orderNumber: "112-8492041-5928310" },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ orders });
    } catch {
      return NextResponse.json({ orders: [] });
    }
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
