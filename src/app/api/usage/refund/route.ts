import { NextRequest, NextResponse } from "next/server";
import { resolveActor } from "@/lib/usage/actor";
import { refund } from "@/lib/usage/service";

/**
 * Reverse a recent consume. The caller passes the token they got from
 * /api/usage/consume; the server validates that the token belongs to the
 * resolved actor, that the usage event exists, isn't already refunded, and
 * still falls inside the refund window.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const token = (body as { token?: unknown })?.token;
  if (typeof token !== "string" || token.length < 10) {
    return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 });
  }

  const actor = await resolveActor();
  const result = await refund(actor, token);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
