import { NextRequest, NextResponse } from "next/server";
import { isDefectActive } from "@/config/defects.config";
import { revokeToken } from "@/lib/tokenRevocation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (token) {
      // HARD_04: Post-Logout Session Validity
      // When defect is active: Server fails to invalidate JWT token on logout,
      // allowing the Authorization header to remain reusable.
      if (!isDefectActive("HARD_04_POST_LOGOUT_SESSION_VALIDITY")) {
        revokeToken(token);
      }
    }

    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
