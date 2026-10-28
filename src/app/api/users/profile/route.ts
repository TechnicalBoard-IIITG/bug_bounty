import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, avatarUrl, mimeType } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // MED_15: User Profile File Upload MIME Validation
    // Profile avatar file selector fails to restrict uploads to supported image formats (.png, .jpg, .webp)
    // and accepts .txt or .pdf files.
    if (!isDefectActive("MED_15_AVATAR_UPLOAD_MIME_UNRESTRICTED") && mimeType) {
      const allowed = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
      if (!allowed.includes(mimeType)) {
        return NextResponse.json(
          { error: "Invalid file type. Only PNG, JPEG, and WEBP images are supported." },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;

    // HARD_13: Profile Update Parameter Filtering
    // The profile modification endpoint fails to filter restricted attributes,
    // allowing users to pass elevated keys (e.g., role: "admin") to escalate privileges.
    if (isDefectActive("HARD_13_PROFILE_UPDATE_PRIVILEGE_ESCALATION")) {
      if (body.role) {
        updateData.role = body.role; // Privilege escalation flaw!
      }
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
        },
      });

      return NextResponse.json({
        success: true,
        user: updatedUser,
        message: updateData.role
          ? `Profile updated. Role updated to "${updateData.role}".`
          : "Profile updated successfully",
      });
    } catch {
      // Fallback
      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          name: name || "Customer",
          email: "customer@amazon.local",
          role: (updateData.role as string) || "customer",
          avatarUrl: avatarUrl || null,
        },
        message: updateData.role
          ? `Profile updated. Role updated to "${updateData.role}".`
          : "Profile updated successfully",
      });
    }
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
