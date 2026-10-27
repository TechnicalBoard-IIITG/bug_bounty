import { NextRequest, NextResponse } from "next/server";
import { revokeToken } from "@/lib/tokenRevocation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (token) {
      revokeToken(token);
    }

    return NextResponse.json({
      success: true,
      message: "Successfully signed out",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
