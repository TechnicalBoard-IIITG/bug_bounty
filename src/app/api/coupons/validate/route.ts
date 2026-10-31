import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";
import { isDbActiveSync, safeDbQuery } from "@/lib/dbCircuitBreaker";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { code, currentApplied = [] } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const trimmedCode = code.trim();

    // The 12 active promotional coupons across the platform
    const validCoupons: Record<
      string,
      { discountPercent: number; flatDiscount: number; isTreasure?: boolean; treasureCode?: string }
    > = {
      // 4 Deals Page Festive Offers
      DIWALI50: { discountPercent: 50, flatDiscount: 0 },
      FESTIVE20: { discountPercent: 20, flatDiscount: 0 },
      MEGA25: { discountPercent: 25, flatDiscount: 0 },
      SUPERDEAL: { discountPercent: 35, flatDiscount: 0 },

      // 3 Product Page Bank & Payment Offers
      SAVE10: { discountPercent: 10, flatDiscount: 0 },
      CASHBACK15: { discountPercent: 15, flatDiscount: 0 },
      PRIME100: { discountPercent: 40, flatDiscount: 0 },

      // 5 Homepage Category Promos
      WELCOME10: { discountPercent: 10, flatDiscount: 0 },
      welcome10: { discountPercent: 10, flatDiscount: 0 }, // For HARD_14 defect testing
      HOLIDAY30: { discountPercent: 30, flatDiscount: 0 },
      APPEXCLUSIVE: { discountPercent: 15, flatDiscount: 0 },
      FLAT50: { discountPercent: 50, flatDiscount: 0 },

      // 12th Secret Sponsor Promo
      ENTROPY2K26: {
        discountPercent: 20,
        flatDiscount: 0,
        isTreasure: true,
        treasureCode: "TREASURE-ENTROPY-2026",
      },
    };

    // HARD_14: Case-Sensitive Promo Stacking
    let coupon: any = null;

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

    if (!coupon && isDbActiveSync()) {
      const dbCoupon = await safeDbQuery(
        () =>
          prisma.coupon.findFirst({
            where: { code: { equals: trimmedCode, mode: "insensitive" } },
          }),
        null
      );
      if (dbCoupon) {
        coupon = dbCoupon;
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
      isTreasure: Boolean(coupon.isTreasure),
      treasureCode: coupon.treasureCode || null,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
