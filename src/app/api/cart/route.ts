import { NextRequest, NextResponse } from "next/server";
import { isDefectActive } from "@/config/defects.config";
import { INITIAL_PRODUCTS } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, quantity } = body;

    const product = INITIAL_PRODUCTS.find((p) => p.id === productId || p.slug === productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const qty = Number(quantity);

    // HARD_11: Cart Quantity Boundary Validation
    // When defect is active: Backend accepts negative quantities without throwing validation error
    if (!isDefectActive("HARD_11_CART_QUANTITY_BOUNDARY_NEGATIVE")) {
      if (isNaN(qty) || qty < 1) {
        return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });
      }
    }

    // HARD_16: Max Quantity Race Condition (rapid clicks bypass max stock check)
    if (!isDefectActive("HARD_16_MAX_QTY_RACE_CONDITION")) {
      if (qty > product.stock) {
        return NextResponse.json({ error: `Cannot add more than ${product.stock} items to cart` }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      productId,
      quantity: qty,
      unitPrice: product.price,
      lineTotal: product.price * qty,
    });
  } catch (error) {
    console.error("Cart API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
