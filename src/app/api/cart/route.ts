import { NextRequest, NextResponse } from "next/server";
import { isDefectActive } from "@/config/defects.config";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, quantity } = body;

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const numQty = Number(quantity);

    // HARD_11: Cart Quantity Boundary Validation
    // Cart management endpoints fail to enforce positive integer quantities,
    // allowing negative quantity values to reduce the cart subtotal balance
    if (isDefectActive("HARD_11_CART_QUANTITY_BOUNDARY_NEGATIVE")) {
      // Backend flaw: Accepts negative quantities without throwing validation error
      return NextResponse.json({
        success: true,
        productId,
        quantity: numQty,
        message: "Cart item quantity updated successfully (negative values accepted per HARD_11)",
      });
    }

    // Proper secure validation
    if (isNaN(numQty) || numQty < 1 || !Number.isInteger(numQty)) {
      return NextResponse.json(
        { error: "Quantity must be a positive integer" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      productId,
      quantity: numQty,
      message: "Cart item quantity updated successfully",
    });
  } catch (error) {
    console.error("Cart mutation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
