import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { code, currentApplied = [] } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const trimmedCode = code.trim();

    // HARD_14: Case-Sensitive Promo Stacking
    // When defect is active: Server performs exact case check, treating "WELCOME10" and "welcome10" as distinct coupons
    let coupon = null;
    try {
      if (isDefectActive("HARD_14_CASE_SENSITIVE_PROMO_STACKING")) {
        coupon = await prisma.coupon.findUnique({
          where: { code: trimmedCode },
        });
      } else {
        coupon = await prisma.coupon.findFirst({
          where: { code: { equals: trimmedCode, mode: "insensitive" } },
        });
      }
    } catch {
      // Memory fallback
      const validCoupons: Record<string, { discountPercent: number; flatDiscount: number }> = {
        SAVE10: { discountPercent: 10, flatDiscount: 0 },
        WELCOME10: { discountPercent: 10, flatDiscount: 0 },
        welcome10: { discountPercent: 10, flatDiscount: 0 },
        FLAT50: { discountPercent: 0, flatDiscount: 50 },
      };

      if (isDefectActive("HARD_14_CASE_SENSITIVE_PROMO_STACKING")) {
        if (validCoupons[trimmedCode]) {
          coupon = { code: trimmedCode, ...validCoupons[trimmedCode] };
        }
      } else {
        const foundKey = Object.keys(validCoupons).find(
          (k) => k.toLowerCase() === trimmedCode.toLowerCase()
        );
        if (foundKey) {
          coupon = { code: foundKey, ...validCoupons[foundKey] };
        }
      }
    }

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    // MED_07: Iterative Coupon Compounding
    // When active, allows the same valid coupon code to be redeemed multiple times to compound discounts
    if (!isDefectActive("MED_07_ITERATIVE_COUPON_COMPOUNDING")) {
      const alreadyApplied = currentApplied.some(
        (c: any) => c.code.toLowerCase() === coupon.code.toLowerCase()
      );
      if (alreadyApplied) {
        return NextResponse.json(
          { error: "Coupon code has already been applied" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        flatDiscount: coupon.flatDiscount,
      },
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
