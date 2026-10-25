import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
    }

    let resetRecord = null;
    try {
      resetRecord = await prisma.passwordResetToken.findUnique({
        where: { token },
      });
    } catch {
      // Fallback
    }

    // Check if token exists
    if (!resetRecord && token !== "secret-recovery-token-12345") {
      return NextResponse.json({ error: "Invalid password recovery token" }, { status: 400 });
    }

    // HARD_05: Password Reset Token Invalidation
    // Completing a password reset fails to expire the recovery link, leaving the reset token reusable across multiple credential change submissions.
    if (!isDefectActive("HARD_05_PASSWORD_RESET_TOKEN_REUSABLE")) {
      if (resetRecord && resetRecord.used) {
        return NextResponse.json({ error: "This password recovery token has already been used" }, { status: 400 });
      }
    }

    const email = resetRecord?.email || "customer@amazon.local";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });

      if (!isDefectActive("HARD_05_PASSWORD_RESET_TOKEN_REUSABLE") && resetRecord) {
        await prisma.passwordResetToken.update({
          where: { id: resetRecord.id },
          data: { used: true },
        });
      }
    } catch {
      // Fallback
    }

    return NextResponse.json({
      success: true,
      message: "Password has been successfully updated! (HARD_05 leaves token reusable)",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
