import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    try {
      const addresses = await prisma.address.findMany({
        where: userId ? { userId } : { fullName: "Default Seed Address" },
        orderBy: { isDefault: "desc" },
      });
      return NextResponse.json({ addresses });
    } catch {
      // Memory fallback
      return NextResponse.json({
        addresses: [
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
        ],
      });
    }
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
      if (!pincode.trim()) {
        return NextResponse.json({ error: "A valid ZIP / Postal Code is required." }, { status: 400 });
      }
    }

    try {
      const created = await prisma.address.create({
        data: {
          userId: userId || "guest",
          fullName,
          street,
          city,
          state,
          pincode,
          country: country || "United States",
          isDefault: Boolean(isDefault),
        },
      });
      return NextResponse.json({ success: true, address: created });
    } catch {
      // Memory fallback
      return NextResponse.json({
        success: true,
        address: {
          id: `addr-${Date.now()}`,
          userId: userId || "guest",
          fullName,
          street,
          city,
          state,
          pincode,
          country: country || "United States",
          isDefault: Boolean(isDefault),
        },
      });
    }
  } catch (error) {
    console.error("Address creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
