import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";

export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET || "entropy_2k26_amazon_replica_super_secret_jwt_key_2026";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    // MED_16: Registration Password Confirmation Match
    // Account creation submits and provisions an account even when "Password" and "Confirm Password" values do not match
    if (!isDefectActive("MED_16_REGISTRATION_PASSWORD_MATCH_BYPASS")) {
      if (password !== confirmPassword) {
        return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser = null;

    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
      }

      newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "customer",
        },
      });
    } catch {
      // In-memory fallback
      newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: "customer",
        avatarUrl: null,
      };
    }

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatarUrl: newUser.avatarUrl,
      },
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
