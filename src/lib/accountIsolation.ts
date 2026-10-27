import { NextRequest } from "next/server";
import prisma from "./prisma";

// Global in-memory cache for per-account state and shared reviews
declare global {
  // eslint-disable-next-line no-var
  var accountStockDeltasGlobal: Map<string, Map<string, number>> | undefined;
  // eslint-disable-next-line no-var
  var accountMockOrdersGlobal: Map<string, any[]> | undefined;
  // eslint-disable-next-line no-var
  var accountMockAddressesGlobal: Map<string, any[]> | undefined;
  // eslint-disable-next-line no-var
  var globalSharedReviewsList: any[] | undefined;
}

const accountStockDeltas: Map<string, Map<string, number>> =
  globalThis.accountStockDeltasGlobal ?? new Map();
globalThis.accountStockDeltasGlobal = accountStockDeltas;

const accountMockOrders: Map<string, any[]> =
  globalThis.accountMockOrdersGlobal ?? new Map();
globalThis.accountMockOrdersGlobal = accountMockOrders;

const accountMockAddresses: Map<string, any[]> =
  globalThis.accountMockAddressesGlobal ?? new Map();
globalThis.accountMockAddressesGlobal = accountMockAddresses;

const globalSharedReviews: any[] =
  globalThis.globalSharedReviewsList ?? [];
globalThis.globalSharedReviewsList = globalSharedReviews;

/**
 * Extract or generate isolated Account ID from request headers, cookies, query, or body.
 */
export function getAccountId(req?: NextRequest, fallbackUserId?: string): string {
  if (req) {
    // 1. Check custom x-account-id header
    const headerId = req.headers.get("x-account-id");
    if (headerId && headerId !== "guest" && headerId.trim()) return headerId.trim();

    // 2. Check cookie amazon_account_id
    const cookieId = req.cookies.get("amazon_account_id")?.value;
    if (cookieId && cookieId !== "guest" && cookieId.trim()) return cookieId.trim();

    // 3. Check query param ?accountId=... or ?userId=...
    const queryId =
      req.nextUrl.searchParams.get("accountId") || req.nextUrl.searchParams.get("userId");
    if (queryId && queryId !== "guest" && queryId.trim()) return queryId.trim();
  }

  // 4. Fallback from body or caller
  if (fallbackUserId && fallbackUserId !== "guest" && fallbackUserId.trim()) {
    return fallbackUserId.trim();
  }

  return "default_account";
}

/**
 * Get account-isolated available stock for a product.
 * Initialized to the exact same initial baseStock for every team/account,
 * and decreases/increases based on that account's purchases/cancellations only.
 */
export async function getAccountProductStock(
  accountId: string,
  productId: string,
  baseStock: number
): Promise<number> {
  let purchasedDeduction = 0;

  // 1. Calculate units purchased in database by this account that are not cancelled
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: accountId,
        status: { not: "Cancelled" },
      },
      include: { items: true },
    });

    for (const ord of orders) {
      if (ord.id?.startsWith("ord-deliv-") || ord.id?.startsWith("ord-proc-")) continue;
      for (const it of ord.items) {
        if (it.productId === productId) {
          purchasedDeduction += it.quantity;
        }
      }
    }
  } catch {
    // If DB is offline, check in-memory orders for this account
    const orders = accountMockOrders.get(accountId) || [];
    for (const ord of orders) {
      if (ord.id?.startsWith("ord-deliv-") || ord.id?.startsWith("ord-proc-")) continue;
      if (ord.status !== "Cancelled" && Array.isArray(ord.items)) {
        for (const it of ord.items) {
          if (it.productId === productId) {
            purchasedDeduction += it.quantity;
          }
        }
      }
    }
  }

  // 2. Add any active manual stock delta for this account
  const accountDeltas = accountStockDeltas.get(accountId);
  const manualDelta = accountDeltas?.get(productId) || 0;

  return Math.max(0, baseStock - purchasedDeduction - manualDelta);
}

/**
 * Deduct stock for an account when placing an order manually (if not in orders)
 */
export function deductAccountStock(accountId: string, productId: string, qty: number) {
  if (!accountStockDeltas.has(accountId)) {
    accountStockDeltas.set(accountId, new Map());
  }
  const deltas = accountStockDeltas.get(accountId)!;
  deltas.set(productId, (deltas.get(productId) || 0) + qty);
}

/**
 * Restore stock for an account when cancelling an order manually (if not in orders)
 */
export function restoreAccountStock(accountId: string, productId: string, qty: number) {
  if (accountStockDeltas.has(accountId)) {
    const deltas = accountStockDeltas.get(accountId)!;
    const current = deltas.get(productId) || 0;
    deltas.set(productId, Math.max(0, current - qty));
  }
}

/**
 * Generate initial pre-seeded demo orders isolated for a specific account.
 * Gives each account their own Delivered order (for HARD_10 testing) and Processing order.
 */
export function getInitialAccountDemoOrders(accountId: string) {
  const accountSuffix = accountId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6) || "999";
  return [
    {
      id: `ord-deliv-${accountSuffix}`,
      orderNumber: `112-8492041-${accountSuffix}`,
      userId: accountId,
      status: "Delivered", // Target for HARD_10 order cancellation
      total: 375.84,
      subtotal: 348.0,
      discount: 0,
      tax: 27.84,
      shippingFee: 0,
      createdAt: "2026-10-14T10:30:00.000Z",
      items: [
        {
          id: `it-deliv-${accountSuffix}`,
          productId: "prod-e1",
          title: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
          unitPrice: 348.0,
          quantity: 1,
          imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        },
      ],
    },
    {
      id: `ord-proc-${accountSuffix}`,
      orderNumber: `112-1049281-${accountSuffix}`,
      userId: accountId,
      status: "Processing",
      total: 89.99,
      subtotal: 89.99,
      discount: 0,
      tax: 0,
      shippingFee: 0,
      createdAt: "2026-10-16T08:15:00.000Z",
      items: [
        {
          id: `it-proc-${accountSuffix}`,
          productId: "prod-h1",
          title: "Ninja AF101 4-Quart Digital Air Fryer",
          unitPrice: 89.99,
          quantity: 1,
          imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
        },
      ],
    },
  ];
}

/**
 * Get orders isolated to a specific account
 */
export async function getAccountOrders(accountId: string) {
  try {
    const dbOrders = await prisma.order.findMany({
      where: { userId: accountId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    if (dbOrders && dbOrders.length > 0) {
      return dbOrders;
    }
  } catch {
    // DB offline, fall through to in-memory
  }

  // If no DB orders yet, check accountMockOrders
  if (!accountMockOrders.has(accountId)) {
    accountMockOrders.set(accountId, getInitialAccountDemoOrders(accountId));
  }
  return accountMockOrders.get(accountId) || [];
}

/**
 * Add order to account-isolated orders
 */
export function addAccountOrder(accountId: string, order: any) {
  if (!accountMockOrders.has(accountId)) {
    accountMockOrders.set(accountId, getInitialAccountDemoOrders(accountId));
  }
  const orders = accountMockOrders.get(accountId)!;
  orders.unshift(order);
}

/**
 * Cancel an account order in DB and/or in-memory mock store
 */
export async function cancelAccountOrder(accountId: string, orderId: string) {
  try {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: "Cancelled" },
      include: { items: true },
    });
    return updated;
  } catch {
    // Check mock orders
  }

  const mockOrders = await getAccountOrders(accountId);
  const found = mockOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (found) {
    found.status = "Cancelled";
    return found;
  }
  return null;
}

/**
 * Generate initial pre-seeded demo addresses isolated for a specific account.
 * Gives each account their own 2 addresses so they can test MED_14 deletion independently.
 */
export function getInitialAccountDemoAddresses(accountId: string) {
  const accountSuffix = accountId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6) || "999";
  return [
    {
      id: `addr-1-${accountSuffix}`,
      userId: accountId,
      fullName: "Team Participant Primary",
      street: "123 Bounty Way, Suite 400",
      city: "Seattle",
      state: "WA",
      pincode: "98109",
      country: "United States",
      isDefault: true,
    },
    {
      id: `addr-2-${accountSuffix}`,
      userId: accountId,
      fullName: "Team Participant (Secondary Lab)",
      street: "456 Tech Park Boulevard",
      city: "Bellevue",
      state: "WA",
      pincode: "98004",
      country: "United States",
      isDefault: false,
    },
  ];
}

/**
 * Get addresses isolated to a specific account
 */
export async function getAccountAddresses(accountId: string) {
  try {
    const dbAddresses = await prisma.address.findMany({
      where: { userId: accountId },
      orderBy: { isDefault: "desc" },
    });

    if (dbAddresses && dbAddresses.length > 0) {
      return dbAddresses;
    }
  } catch {
    // DB offline, fall through
  }

  if (!accountMockAddresses.has(accountId)) {
    accountMockAddresses.set(accountId, getInitialAccountDemoAddresses(accountId));
  }
  return accountMockAddresses.get(accountId) || [];
}

/**
 * Add an address to account-isolated addresses
 */
export function addAccountAddress(accountId: string, address: any) {
  if (!accountMockAddresses.has(accountId)) {
    accountMockAddresses.set(accountId, getInitialAccountDemoAddresses(accountId));
  }
  const addrs = accountMockAddresses.get(accountId)!;
  addrs.unshift(address);
}

/**
 * Delete an address from account-isolated addresses
 */
export function deleteAccountAddress(accountId: string, addressId: string) {
  if (accountMockAddresses.has(accountId)) {
    const addrs = accountMockAddresses.get(accountId)!;
    const filtered = addrs.filter((a) => a.id !== addressId);
    accountMockAddresses.set(accountId, filtered);
  }
}

/**
 * Shared Comments / Reviews functionality:
 * Comments are shared across all participants/teams globally!
 */
export function addSharedReview(review: any) {
  globalSharedReviews.unshift(review);
}

export function getSharedReviews(productId: string) {
  return globalSharedReviews.filter((r) => r.productId === productId);
}
