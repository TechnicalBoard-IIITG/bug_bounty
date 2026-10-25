import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";

export const dynamic = "force-dynamic";

const MOCK_COUPONS = [
  { code: "SAVE10", discountPercent: 10, flatDiscount: 0 },
  { code: "WELCOME10", discountPercent: 10, flatDiscount: 0 },
  { code: "welcome10", discountPercent: 10, flatDiscount: 0 }, // For HARD_14 defect
  { code: "FLAT50", discountPercent: 0, flatDiscount: 50 },
];

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    let coupon = null;

    // HARD_14: Case-Sensitive Promo Stacking
    // Promo codes lack case normalization on backend
    if (isDefectActive("HARD_14_CASE_SENSITIVE_PROMO_STACKING")) {
      try {
        coupon = await prisma.coupon.findUnique({
          where: { code }, // Exact case query
        });
      } catch {
        coupon = MOCK_COUPONS.find((c) => c.code === code);
      }
    } else {
      try {
        coupon = await prisma.coupon.findFirst({
          where: {
            code: {
              equals: code,
              mode: "insensitive",
            },
          },
        });
      } catch {
        coupon = MOCK_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
      }
    }

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { error: `The promotional code you entered is not valid: "${code}"` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      flatDiscount: coupon.flatDiscount,
      message: `Coupon "${coupon.code}" applied successfully!`,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
