import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";

// POST /api/admin/verify — validate the admin token from the login screen.
// The token is checked server-side against ADMIN_TOKEN; never exposed to clients.
export async function POST(request: NextRequest) {
  if (isAuthorized(request)) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
