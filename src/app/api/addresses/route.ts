import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";
import { isDbActiveSync, safeDbQuery } from "@/lib/dbCircuitBreaker";

export const dynamic = "force-dynamic";

const FALLBACK_ADDRESSES = [
  {
    id: "addr-1",
    fullName: "Team Primary Address",
    street: "123 Amazon Way, Suite 400",
    city: "Seattle",
    state: "WA",
    pincode: "98109",
    country: "United States",
    isDefault: true,
  },
];

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    let addresses: any[] = FALLBACK_ADDRESSES;
    if (isDbActiveSync()) {
      addresses = await safeDbQuery(
        () =>
          prisma.address.findMany({
            where: userId ? { userId } : { fullName: "Default Seed Address" },
            orderBy: { isDefault: "desc" },
          }),
        FALLBACK_ADDRESSES
      );
    }

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Addresses GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, fullName, street, city, state, pincode, country, isDefault } = body;

    if (!fullName || !street || !city || !state || !pincode) {
      return NextResponse.json({ error: "All address fields are required" }, { status: 400 });
    }

    // MED_19: Whitespace Validation Bypass
    // ZIP code required-field validation can be bypassed by entering a single whitespace character
    if (!isDefectActive("MED_19_ZIP_WHITESPACE_VALIDATION_BYPASS")) {
      if (pincode.trim().length === 0) {
        return NextResponse.json({ error: "Postal code is invalid" }, { status: 400 });
      }
    }

    const newAddr = {
      id: `addr-${Date.now()}`,
      userId: userId || null,
      fullName,
      street,
      city,
      state,
      pincode,
      country: country || "United States",
      isDefault: Boolean(isDefault),
    };

    if (isDbActiveSync()) {
      await safeDbQuery(
        () =>
          prisma.address.create({
            data: {
              userId: userId || null,
              fullName,
              street,
              city,
              state,
              pincode,
              country: country || "United States",
              isDefault: Boolean(isDefault),
            },
          }),
        null
      );
    }

    return NextResponse.json({ address: newAddr });
  } catch (error) {
    console.error("Address creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
