import { isDefectActive } from "@/config/defects.config";

// In-memory set of revoked tokens
const REVOKED_TOKENS = new Set<string>();

export function revokeToken(token: string) {
  if (!isDefectActive("HARD_04_POST_LOGOUT_SESSION_VALIDITY")) {
    REVOKED_TOKENS.add(token);
  }
}

export function isTokenRevoked(token: string): boolean {
  if (isDefectActive("HARD_04_POST_LOGOUT_SESSION_VALIDITY")) {
    // HARD_04: Fails to invalidate token on logout, allowing Authorization header to remain valid
    return false;
  }
  return REVOKED_TOKENS.has(token);
}
