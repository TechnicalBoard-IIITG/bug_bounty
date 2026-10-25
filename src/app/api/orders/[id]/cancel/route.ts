import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    let order = null;
    try {
      order = await prisma.order.findFirst({
        where: {
          OR: [{ id }, { orderNumber: id }],
        },
      });
    } catch {
      // Fallback
    }

    const currentStatus = order?.status || "Delivered";

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

    try {
      if (order) {
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
      // Fallback
    }

    return NextResponse.json({
      success: true,
      message: `Order #${id} status changed from "${currentStatus}" to "Cancelled" (HARD_10 defect active).`,
      order: {
        id,
        orderNumber: id,
        status: "Cancelled",
        previousStatus: currentStatus,
      },
    });
  } catch (error) {
    console.error("Order cancel error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
