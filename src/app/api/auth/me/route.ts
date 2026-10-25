import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { isTokenRevoked } from "@/lib/tokenRevocation";

export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET || "entropy_2k26_amazon_replica_super_secret_jwt_key_2026";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // Check if token was revoked (HARD_04: If active, tokens are never considered revoked)
    if (isTokenRevoked(token)) {
      return NextResponse.json({ error: "Session expired or logged out" }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string; name: string };

      let user = null;
      try {
        user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, name: true, email: true, role: true, avatarUrl: true, createdAt: true },
        });
      } catch {
        // Fallback
      }

      if (!user) {
        user = {
          id: decoded.id,
          name: decoded.name || "Customer",
          email: decoded.email,
          role: decoded.role || "customer",
          avatarUrl: null,
          createdAt: new Date(),
        };
      }

      return NextResponse.json({ user });
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
