import { NextRequest, NextResponse } from "next/server";
import { isDefectActive } from "@/config/defects.config";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // EASY_11: Contact Form Email Validation Bypass
    // When defect is active: Server accepts contact message even if email is completely empty or invalid
    if (!isDefectActive("EASY_11_CONTACT_EMAIL_VALIDATION_BYPASS")) {
      if (!email || !email.includes("@")) {
        return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      ticketId: `CASE-${Math.floor(100000 + Math.random() * 900000)}`,
      message: "Customer inquiry received. A customer service associate will respond within 24 hours.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
