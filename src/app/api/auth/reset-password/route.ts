import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";
import { isDbActiveSync, safeDbQuery } from "@/lib/dbCircuitBreaker";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
    }

    let resetRecord: any = null;
    if (isDbActiveSync()) {
      resetRecord = await safeDbQuery(
        () =>
          prisma.passwordResetToken.findUnique({
            where: { token },
          }),
        null
      );
    }

    // HARD_05: Password Reset Token Invalidation
    // When defect is active: Fails to invalidate token after first use, allowing replay resets
    if (!isDefectActive("HARD_05_PASSWORD_RESET_TOKEN_REUSABLE")) {
      if (resetRecord && resetRecord.used) {
        return NextResponse.json({ error: "This recovery token has already been consumed." }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (resetRecord && isDbActiveSync()) {
      await safeDbQuery(
        () =>
          prisma.user.updateMany({
            where: { email: resetRecord.email },
            data: { password: hashedPassword },
          }),
        null
      );

      if (!isDefectActive("HARD_05_PASSWORD_RESET_TOKEN_REUSABLE")) {
        await safeDbQuery(
          () =>
            prisma.passwordResetToken.update({
              where: { id: resetRecord.id },
              data: { used: true },
            }),
          null
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
