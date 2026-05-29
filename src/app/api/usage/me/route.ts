import { NextResponse } from "next/server";
import { GUEST_COOKIE } from "@/middleware";
import { resolveActor, quotaSnapshot } from "@/lib/usage/actor";

/**
 * Return the current actor's usage quota.
 * Works for both authenticated users and anonymous visitors.
 */
export async function GET() {
  // Read-only: this runs on every page load, so don't write a GuestSession row
  // here. A brand-new visitor simply reads as 0 used; the row is created lazily
  // on their first actual export (consume), not on a quota check.
  const actor = await resolveActor({ persist: false });
  const res = NextResponse.json({
    ok: true,
    ...quotaSnapshot(actor)
  });

  // If middleware never ran for whatever reason (e.g. dev refresh edge case),
  // ensure the guest cookie is set so the next call shares the same identity.
  if (actor.type === "guest" && actor.newCookieValue) {
    res.cookies.set(GUEST_COOKIE, actor.newCookieValue, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 90,
      path: "/"
    });
  }

  return res;
}
