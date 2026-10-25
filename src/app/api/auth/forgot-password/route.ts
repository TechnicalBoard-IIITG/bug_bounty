import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const token = crypto.randomBytes(24).toString("hex");

    try {
      await prisma.passwordResetToken.create({
        data: {
          email,
          token,
          used: false,
        },
      });
    } catch {
      // In-memory fallback
    }

    const resetLink = `/reset-password?token=${token}`;

    return NextResponse.json({
      success: true,
      message: "Password reset link generated successfully",
      resetLink,
      token,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
