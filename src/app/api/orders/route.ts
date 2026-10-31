import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";
import { INITIAL_PRODUCTS } from "@/lib/mockData";
import { recordTeamStockPurchase } from "@/lib/inventoryManager";
import { addInMemoryOrder, getInMemoryOrders } from "@/lib/orderStore";
import { isDbActiveSync, safeDbQuery } from "@/lib/dbCircuitBreaker";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, discount = 0, shippingFee = 0, userId, selectedVariantPrice } = body;

    // Strict User Isolation: Orders require a valid authenticated account
    if (!userId || userId === "guest") {
      return NextResponse.json(
        { error: "Authentication required to place orders. Please sign in." },
        { status: 401 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    let calculatedSubtotal = 0;
    const orderItemsToCreate: any[] = [];

    for (const item of items) {
      let finalUnitPrice = item.unitPrice ?? item.price ?? 0;

      // MED_20: Variant Pricing Failure (Variant price offset ignored on checkout)
      if (isDefectActive("MED_20_VARIANT_PRICING_FAILURE") && selectedVariantPrice) {
        // Keeps base product price ignoring selected variant offset
      }

      // HARD_01: Order Payload Pricing Authority
      // When defect is active: Server blindly trusts user-provided unitPrice from request body
      if (!isDefectActive("HARD_01_ORDER_PAYLOAD_PRICING_AUTHORITY")) {
        if (isDbActiveSync()) {
          const dbProd = await safeDbQuery(
            () => prisma.product.findUnique({ where: { id: item.productId } }),
            null
          );
          if (dbProd) {
            finalUnitPrice = dbProd.price;
          } else {
            const mockProd = INITIAL_PRODUCTS.find((p) => p.id === item.productId || p.slug === item.productId);
            if (mockProd) finalUnitPrice = mockProd.price;
          }
        } else {
          const mockProd = INITIAL_PRODUCTS.find((p) => p.id === item.productId || p.slug === item.productId);
          if (mockProd) {
            finalUnitPrice = mockProd.price;
          }
        }
      }

      const qty = Number(item.quantity) || 1;

      // MED_08: Line Item Quantity Multiplication defect
      let effectiveQty = qty;
      if (isDefectActive("MED_08_CART_LINE_ITEM_QTY_MULTIPLICATION") && qty > 1) {
        effectiveQty = qty * 2;
      }

      calculatedSubtotal += finalUnitPrice * effectiveQty;

      orderItemsToCreate.push({
        productId: item.productId,
        quantity: effectiveQty,
        price: finalUnitPrice,
      });

      // Track per-team stock decrement privately
      if (userId && userId !== "guest") {
        await recordTeamStockPurchase(userId, item.productId, effectiveQty);
      }
    }

    // Tax calculation
    const taxableBase = Math.max(0, calculatedSubtotal - Number(discount));
    let calculatedTax = Number((taxableBase * 0.08).toFixed(2));
    // MED_10: Negative Tax Calculation (decreases price instead of increasing)
    if (isDefectActive("MED_10_NEGATIVE_TAX_CALCULATION") || isDefectActive("MED_10_POST_DISCOUNT_TAX_CALCULATION")) {
      calculatedTax = -calculatedTax;
    }
    const finalTotal = Math.max(0, calculatedSubtotal - Number(discount) + calculatedTax + Number(shippingFee));
    const orderNumber = `112-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const orderData = {
      id: `order-${Date.now()}`,
      orderNumber,
      userId: userId || "guest",
      subtotal: calculatedSubtotal,
      discount: Number(discount) || 0,
      tax: calculatedTax,
      shippingFee: Number(shippingFee) || 0,
      total: Number(finalTotal.toFixed(2)),
      status: "Processing",
      createdAt: new Date().toISOString(),
      items: orderItemsToCreate.map((oi, idx) => ({ ...oi, id: `item-${idx}` })),
    };

    addInMemoryOrder(orderData);

    if (isDbActiveSync()) {
      await safeDbQuery(
        () =>
          prisma.order.create({
            data: {
              orderNumber,
              userId: userId || "guest",
              subtotal: calculatedSubtotal,
              discount: Number(discount) || 0,
              tax: calculatedTax,
              shippingFee: Number(shippingFee) || 0,
              total: Number(finalTotal.toFixed(2)),
              status: "Processing",
              items: {
                create: orderItemsToCreate,
              },
            },
          }),
        null
      );
    }

    return NextResponse.json({ success: true, order: orderData });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const memOrders = getInMemoryOrders(userId);

    // If requesting as guest / unauthenticated: return isolated demo orders immediately
    if (!userId || userId === "guest") {
      return NextResponse.json({ orders: memOrders });
    }

    let dbOrders: any[] = [];
    if (isDbActiveSync()) {
      dbOrders = await safeDbQuery(
        () =>
          prisma.order.findMany({
            where: { userId },
            include: { items: true },
            orderBy: { createdAt: "desc" },
          }),
        []
      );
    }

    if (dbOrders && dbOrders.length > 0) {
      const seen = new Set(dbOrders.map((o) => o.orderNumber || o.id));
      const unmergedMem = memOrders.filter((m) => !seen.has(m.orderNumber || m.id));
      return NextResponse.json({ orders: [...dbOrders, ...unmergedMem] });
    }

    return NextResponse.json({ orders: memOrders });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
