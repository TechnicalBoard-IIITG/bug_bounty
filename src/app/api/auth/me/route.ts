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
      return NextResponse.json({ error: "Missing authorization token" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    if (isTokenRevoked(token)) {
      return NextResponse.json({ error: "Session token has been revoked" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid or expired session token" }, { status: 401 });
    }

    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
        },
      });
    } catch {
      // Memory fallback
      user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role || "customer",
        avatarUrl: null,
        createdAt: new Date().toISOString(),
      };
    }

    if (!user) {
      user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role || "customer",
        avatarUrl: null,
      };
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
