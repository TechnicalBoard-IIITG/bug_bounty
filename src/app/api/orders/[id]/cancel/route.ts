import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";
import { findInMemoryOrder, updateInMemoryOrderStatus } from "@/lib/orderStore";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    let order: any = findInMemoryOrder(id);

    if (!order) {
      try {
        order = await prisma.order.findFirst({
          where: {
            OR: [{ id }, { orderNumber: id }],
          },
        });
      } catch {
        // Fallback
      }
    }

    const currentStatus = order?.status || "Processing";

    // HARD_10: Order State Transition Validation
    // When defect is active: Fails to block invalid state transitions,
    // allowing a cancellation request on a "Delivered" order to mark it "Cancelled".
    if (!isDefectActive("HARD_10_DELIVERED_ORDER_CANCELLATION")) {
      if (currentStatus === "Delivered") {
        return NextResponse.json(
          { error: "Invalid state transition: Delivered orders cannot be cancelled." },
          { status: 400 }
        );
      }
    }

    const updatedMem = updateInMemoryOrderStatus(id, "Cancelled");
    if (updatedMem) {
      return NextResponse.json({
        success: true,
        message: `Order #${updatedMem.orderNumber} status changed from "${currentStatus}" to "Cancelled".`,
        order: updatedMem,
      });
    }

    try {
      if (order?.id) {
        const updated = await prisma.order.update({
          where: { id: order.id },
          data: { status: "Cancelled" },
        });
        return NextResponse.json({
          success: true,
          message: `Order #${updated.orderNumber} status changed from "${currentStatus}" to "Cancelled".`,
          order: updated,
        });
      }
    } catch {
      // In-memory fallback
    }

    return NextResponse.json({
      success: true,
      message: `Order #${id} status changed from "${currentStatus}" to "Cancelled".`,
      order: {
        id,
        orderNumber: id,
        status: "Cancelled",
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Order cancellation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
