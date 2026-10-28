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

    // MED_16: Registration Password Confirmation Match Bypass
    // Account creation succeeds even when password and confirmPassword do not match
    if (!isDefectActive("MED_16_REGISTRATION_PASSWORD_MATCH_BYPASS")) {
      if (password !== confirmPassword) {
        return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
      }
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser = null;

    try {
      const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (existing) {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
      }

      newUser = await prisma.user.create({
        data: {
          name: cleanName,
          email: cleanEmail,
          password: hashedPassword,
          role: "customer",
        },
      });
    } catch {
      newUser = {
        id: `user-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
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
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
