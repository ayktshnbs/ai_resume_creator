import { NextRequest, NextResponse } from "next/server";
import { mintGuestCookie, readGuestCookie } from "@/lib/usage/crypto";

export const GUEST_COOKIE = "guest_id";
const GUEST_COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

/**
 * Edge middleware that ensures every visitor has a signed guest_id cookie.
 *
 * The cookie is the foundation of the freemium quota for anonymous users.
 * We mint it lazily so SSR-rendered pages and API routes can rely on it being
 * present even on the very first request — if it isn't, we issue it on the
 * response and the next request will carry it.
 */
export async function middleware(req: NextRequest) {
  const existing = req.cookies.get(GUEST_COOKIE)?.value;
  const valid = await readGuestCookie(existing);

  const res = NextResponse.next();

  if (!valid) {
    const uuid = globalThis.crypto.randomUUID();
    const signed = await mintGuestCookie(uuid);
    res.cookies.set(GUEST_COOKIE, signed, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: GUEST_COOKIE_MAX_AGE,
      path: "/"
    });
  }

  return res;
}

/**
 * Limit middleware scope to the pages and APIs that read the cookie.
 * Skip _next/* assets, fonts, images, and unrelated public routes for perf.
 */
export const config = {
  matcher: [
    "/resume",
    "/cover-letter",
    "/templates",
    "/dashboard",
    "/api/usage/:path*",
    "/api/user/:path*"
  ]
};
