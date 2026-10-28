import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { resetMemoryStock } from "@/lib/inventoryManager";
import { resetInMemoryOrders } from "@/lib/orderStore";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    console.log("[Storefront Reset] Initializing full store database reset...");

    // Clear in-memory fallbacks
    resetMemoryStock();
    resetInMemoryOrders();

    try {
      // Clear transactional tables
      await prisma.userStockDecrement.deleteMany();
      await prisma.orderItem.deleteMany();
      await prisma.order.deleteMany();
      await prisma.address.deleteMany();
      await prisma.passwordResetToken.deleteMany();
      await prisma.user.deleteMany();

      console.log("[Storefront Reset] Store database purged and reset successfully.");
    } catch (e: any) {
      console.warn("[Storefront Reset Warning]:", e.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Amazon Storefront reset successfully. All orders, test accounts, and stock decrements cleared.",
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Storefront reset error:", error);
    return NextResponse.json({ error: "Failed to reset storefront" }, { status: 500 });
  }
}
