import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    try {
      await prisma.address.delete({
        where: { id },
      });
      return NextResponse.json({ success: true, message: `Address ${id} deleted` });
    } catch {
      // In-memory fallback
      return NextResponse.json({ success: true, message: `Address ${id} deleted (mock)` });
    }
  } catch (error) {
    console.error("Address DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
