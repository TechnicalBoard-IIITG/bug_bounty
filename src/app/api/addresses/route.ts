import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  getAccountId,
  getAccountAddresses,
  addAccountAddress,
} from "@/lib/accountIsolation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const accountId = getAccountId(req);
    const addresses = await getAccountAddresses(accountId);
    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Addresses GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, street, city, state, pincode, country = "United States", isDefault = false, userId } = body;

    if (!fullName || !street || !city || !state || !pincode) {
      return NextResponse.json({ error: "All address fields are required" }, { status: 400 });
    }

    const accountId = getAccountId(req, userId);

    try {
      const address = await prisma.address.create({
        data: {
          userId: accountId,
          fullName,
          street,
          city,
          state,
          pincode,
          country,
          isDefault,
        },
      });
      addAccountAddress(accountId, address);
      return NextResponse.json({ success: true, address });
    } catch {
      const mockAddr = {
        id: `addr-${Date.now()}`,
        userId: accountId,
        fullName,
        street,
        city,
        state,
        pincode,
        country,
        isDefault,
      };
      addAccountAddress(accountId, mockAddr);
      return NextResponse.json({ success: true, address: mockAddr });
    }
  } catch (error) {
    console.error("Address POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
