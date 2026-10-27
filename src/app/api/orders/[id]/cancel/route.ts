import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";
import { getAccountId, getAccountOrders, cancelAccountOrder } from "@/lib/accountIsolation";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const accountId = getAccountId(req);

    let order = null;
    try {
      order = await prisma.order.findFirst({
        where: {
          OR: [{ id }, { orderNumber: id }],
        },
        include: { items: true },
      });
    } catch {
      // In-memory fallback
    }

    if (!order) {
      const mockOrders = await getAccountOrders(accountId);
      order = mockOrders.find((o) => o.id === id || o.orderNumber === id);
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

    // Cancel order in DB or in-memory mock store
    const cancelledOrder = await cancelAccountOrder(accountId, order?.id || id);

    return NextResponse.json({
      success: true,
      message: `Order #${order?.orderNumber || id} status changed from "${currentStatus}" to "Cancelled".`,
      order: cancelledOrder || {
        id,
        orderNumber: order?.orderNumber || id,
        status: "Cancelled",
        previousStatus: currentStatus,
      },
    });
  } catch (error) {
    console.error("Order cancel error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
