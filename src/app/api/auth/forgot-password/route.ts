import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { isDbActiveSync, safeDbQuery } from "@/lib/dbCircuitBreaker";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const token = crypto.randomBytes(24).toString("hex");

    if (isDbActiveSync()) {
      await safeDbQuery(
        () =>
          prisma.passwordResetToken.create({
            data: {
              email: email.trim().toLowerCase(),
              token,
              used: false,
            },
          }),
        null
      );
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a reset link has been dispatched.",
      resetUrl: `/reset-password?token=${token}`,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
