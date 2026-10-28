import prisma from "@/lib/prisma";
import { INITIAL_PRODUCTS } from "./mockData";
import { isDbActiveSync, markDbOffline } from "./dbCircuitBreaker";

// In-memory fallback tracking if database is operating offline locally
const memoryStockDecrements: Map<string, number> = new Map();

/**
 * Returns effective stock for a user by subtracting their team's private purchases.
 * Guarantees every team starts with identical initial inventory.
 */
export async function getEffectiveStock(productId: string, userId?: string | null): Promise<number> {
  const baseProduct = INITIAL_PRODUCTS.find((p) => p.id === productId || p.slug === productId);
  const baseStock = baseProduct?.stock ?? 50;

  if (!userId || userId === "guest") {
    return baseStock;
  }

  // Fast path: if DB is offline or circuit breaker tripped, serve from memory in 0ms
  if (!isDbActiveSync()) {
    const key = `${userId}:${productId}`;
    const decremented = memoryStockDecrements.get(key) || 0;
    return Math.max(0, baseStock - decremented);
  }

  try {
    const record = await prisma.userStockDecrement.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (record) {
      return Math.max(0, baseStock - record.quantity);
    }
  } catch {
    markDbOffline();
    const key = `${userId}:${productId}`;
    const decremented = memoryStockDecrements.get(key) || 0;
    return Math.max(0, baseStock - decremented);
  }

  return baseStock;
}

/**
 * Records purchase against a team's account to decrement their private stock view.
 */
export async function recordTeamStockPurchase(userId: string, productId: string, qty: number): Promise<void> {
  if (!userId || userId === "guest") return;

  const key = `${userId}:${productId}`;
  const current = memoryStockDecrements.get(key) || 0;
  memoryStockDecrements.set(key, current + qty);

  if (!isDbActiveSync()) {
    return;
  }

  try {
    await prisma.userStockDecrement.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {
        quantity: { increment: qty },
      },
      create: {
        userId,
        productId,
        quantity: qty,
      },
    });
  } catch {
    markDbOffline();
  }
}

export function resetMemoryStock(): void {
  memoryStockDecrements.clear();
}
