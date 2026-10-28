import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";

export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET || "entropy_2k26_amazon_replica_super_secret_jwt_key_2026";

export async function POST(req: NextRequest) {
  try {
    const { email, password, redirect } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = null;

    try {
      user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    } catch {
      // Fallback
    }

    if (!user) {
      // In-memory support if database is offline locally
      user = {
        id: `user-${cleanEmail.replace(/[^a-z0-9]/g, "-")}`,
        name: cleanEmail.split("@")[0],
        email: cleanEmail,
        password: await bcrypt.hash(password, 10),
        role: "customer",
        avatarUrl: null,
      };
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Compute redirect URL
    let targetRedirect = redirect || "/";

    // MED_17: Checkout Login Redirect Home
    // When returning from login during checkout, redirects to home page instead of checkout
    if (isDefectActive("MED_17_CHECKOUT_LOGIN_REDIRECT_HOME") && redirect && redirect.includes("/checkout")) {
      targetRedirect = "/";
    }

    // HARD_06: Open Redirect Parameter Handling
    // When defect is active: Server allows arbitrary external URLs in redirect without origin validation
    if (!isDefectActive("HARD_06_OPEN_REDIRECT_LOGIN_PARAMETER")) {
      if (targetRedirect.startsWith("http://") || targetRedirect.startsWith("https://") || targetRedirect.startsWith("//")) {
        targetRedirect = "/";
      }
    }

    return NextResponse.json({
      success: true,
      token,
      redirectUrl: targetRedirect,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
