import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";
import { isDbActiveSync, safeDbQuery } from "@/lib/dbCircuitBreaker";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, avatarUrl, mimeType } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // MED_15: User Profile File Upload MIME Validation
    // When defect is active: Server fails to restrict avatar upload types, allowing non-image files
    if (!isDefectActive("MED_15_AVATAR_UPLOAD_MIME_UNRESTRICTED") && mimeType) {
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowed.includes(mimeType.toLowerCase())) {
        return NextResponse.json(
          { error: "Invalid file type. Only JPEG, PNG, WEBP, and GIF images are permitted." },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;

    // HARD_13: Profile Update Parameter Filtering
    // When defect is active: Endpoint blindly accepts and applies 'role' parameter from payload
    if (isDefectActive("HARD_13_PROFILE_UPDATE_PRIVILEGE_ESCALATION") && body.role) {
      updateData.role = body.role;
    }

    if (isDbActiveSync()) {
      const updated = await safeDbQuery(
        () =>
          prisma.user.update({
            where: { id },
            data: updateData,
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              avatarUrl: true,
            },
          }),
        null
      );
      if (updated) {
        return NextResponse.json({ success: true, user: updated });
      }
    }
      // Memory fallback
      return NextResponse.json({
        success: true,
        user: {
          id,
          name: name || "Customer",
          email: "customer@team.local",
          role: updateData.role || "customer",
          avatarUrl: avatarUrl || null,
        },
      });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
