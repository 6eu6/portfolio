import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side admin authentication for mutating / sensitive API routes.
 *
 * The admin secret lives ONLY in the ADMIN_TOKEN environment variable
 * (set in Vercel project settings), never in client code. The admin
 * dashboard sends it in the `x-admin-token` header.
 *
 * Fails closed: if ADMIN_TOKEN is unset, every protected route is denied.
 */
export function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;

  const header = request.headers.get("x-admin-token");
  if (!header) return false;

  // Length-aware constant-time-ish comparison
  if (header.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= header.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Returns a 401 response when the request is not authorized, else null. */
export function requireAdmin(request: NextRequest): NextResponse | null {
  if (isAuthorized(request)) return null;
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 },
  );
}
