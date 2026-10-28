import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let targetIdToDelete = id;

    // MED_14: Address Management List Indexing
    // Fails to map the targeted address ID correctly, deleting the first address record instead
    if (isDefectActive("MED_14_ADDRESS_DELETE_INDEXING_OFFSET") && userId) {
      try {
        const userAddresses = await prisma.address.findMany({
          where: { userId },
          orderBy: { createdAt: "asc" },
        });
        if (userAddresses.length > 0) {
          targetIdToDelete = userAddresses[0].id;
        }
      } catch {
        // Fallback
      }
    }

    try {
      await prisma.address.delete({
        where: { id: targetIdToDelete },
      });
      return NextResponse.json({ success: true, deletedId: targetIdToDelete });
    } catch {
      return NextResponse.json({ success: true, deletedId: targetIdToDelete });
    }
  } catch (error) {
    console.error("Address DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
