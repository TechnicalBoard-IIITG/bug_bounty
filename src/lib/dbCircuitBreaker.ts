import prisma from "./prisma";

// Circuit breaker state
let isDbOnline = false;
let lastCheckTime = 0;
const CHECK_COOLDOWN_MS = 60000; // Only retry remote DB once per minute if failing
let hasCheckedInitial = false;
let isProbing = false;

/**
 * Checks whether the PostgreSQL database is reachable.
 * Protects against TCP connection hangs when the database is offline, blocked, or in standby.
 */
export async function isDbReachable(): Promise<boolean> {
  const now = Date.now();

  // If currently offline and cooldown hasn't expired, return false immediately (0ms)
  if (hasCheckedInitial && !isDbOnline && now - lastCheckTime < CHECK_COOLDOWN_MS) {
    return false;
  }

  // Attempt lightweight query with a strict 400ms timeout race
  try {
    const probePromise = prisma.$queryRaw`SELECT 1`;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("DB probe timeout")), 400)
    );

    await Promise.race([probePromise, timeoutPromise]);
    isDbOnline = true;
    lastCheckTime = now;
    hasCheckedInitial = true;
    return true;
  } catch {
    isDbOnline = false;
    lastCheckTime = now;
    hasCheckedInitial = true;
    return false;
  }
}

/**
 * Synchronous check of the current circuit-breaker state without blocking.
 * If initial check has not completed, triggers a non-blocking background probe
 * and returns false immediately (0ms) so user requests are NEVER delayed.
 */
export function isDbActiveSync(): boolean {
  if (!hasCheckedInitial) {
    if (!isProbing) {
      isProbing = true;
      isDbReachable().finally(() => {
        isProbing = false;
      });
    }
    return false;
  }
  if (!isDbOnline && Date.now() - lastCheckTime < CHECK_COOLDOWN_MS) {
    return false;
  }
  return isDbOnline;
}

/**
 * Manually trips the circuit breaker to offline mode when a query catches an error.
 */
export function markDbOffline(): void {
  isDbOnline = false;
  lastCheckTime = Date.now();
  hasCheckedInitial = true;
}

/**
 * Executes a database query safely with 0ms fast-path when offline
 * and an 800ms race timeout when online, ensuring no page or API
 * ever hangs for more than sub-second latency.
 */
export async function safeDbQuery<T>(queryFn: () => Promise<T>, fallback: T): Promise<T> {
  if (!isDbActiveSync()) {
    return fallback;
  }

  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DB query timeout")), 800)
    );
    return await Promise.race([queryFn(), timeoutPromise]);
  } catch {
    markDbOffline();
    return fallback;
  }
}
