import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const roleHeader = req.headers.get("x-user-role") || "customer";

    // HARD_03: Administrative Route Access Control
    // Direct navigation to /admin/users while authenticated as a standard customer renders
    // the back-office user management console without authorization checks.
    if (!isDefectActive("HARD_03_ADMIN_ROUTE_UNRESTRICTED_ACCESS")) {
      if (roleHeader !== "admin") {
        return NextResponse.json(
          { error: "Forbidden: Admin privileges required." },
          { status: 403 }
        );
      }
    }

    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
          _count: {
            select: { orders: true, reviews: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        users: users.map((u) => ({
          ...u,
          ordersCount: u._count?.orders ?? 0,
          reviewsCount: u._count?.reviews ?? 0,
        })),
      });
    } catch {
      // Mock data fallback
      return NextResponse.json({
        users: [
          {
            id: "user-cust-1",
            name: "John Customer",
            email: "customer@amazon.local",
            role: "customer",
            avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
            createdAt: new Date().toISOString(),
            ordersCount: 2,
            reviewsCount: 3,
          },
          {
            id: "user-admin-1",
            name: "Admin User",
            email: "admin@amazon.local",
            role: "admin",
            avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80",
            createdAt: new Date().toISOString(),
            ordersCount: 1,
            reviewsCount: 1,
          },
        ],
      });
    }
  } catch (error) {
    console.error("Admin users GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
