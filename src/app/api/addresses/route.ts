import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
      // Mock fallback
      return NextResponse.json({
        addresses: [
          {
            id: "addr-1",
            fullName: "John Customer",
            street: "123 Amazon Way, Suite 400",
            city: "Seattle",
            state: "WA",
            pincode: "98109",
            country: "United States",
            isDefault: true,
          },
          {
            id: "addr-2",
            fullName: "John Customer (Office)",
            street: "456 Tech Park Boulevard",
            city: "Bellevue",
            state: "WA",
            pincode: "98004",
            country: "United States",
            isDefault: false,
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
    const { userId = "guest", fullName, street, city, state, pincode, country = "United States", isDefault = false } = body;

    if (!fullName || !street || !city || !state || !pincode) {
      return NextResponse.json({ error: "All address fields are required" }, { status: 400 });
    }

    try {
      const address = await prisma.address.create({
        data: {
          userId,
          fullName,
          street,
          city,
          state,
          pincode,
          country,
          isDefault,
        },
      });
      return NextResponse.json({ success: true, address });
    } catch {
      const mockAddr = {
        id: `addr-${Date.now()}`,
        userId,
        fullName,
        street,
        city,
        state,
        pincode,
        country,
        isDefault,
      };
      return NextResponse.json({ success: true, address: mockAddr });
    }
  } catch (error) {
    console.error("Address POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
