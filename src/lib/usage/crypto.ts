/**
 * Web Crypto utilities used by the freemium usage system.
 *
 * All HMACs use SHA-256. We share one server secret (`USAGE_SECRET`, with
 * fallback to NEXTAUTH_SECRET so deployment is never broken by a missing env)
 * across:
 *   • signed guest_id cookies — proves the cookie was minted by this server
 *   • single-use export tokens — bound to actor + kind + nonce + exp
 *   • ipHash / uaHash — non-reversible identity signals stored in DB
 *
 * Edge-runtime compatible (uses globalThis.crypto.subtle, no Node `crypto`).
 */

const enc = new TextEncoder();
const dec = new TextDecoder();

function getSecret(): string {
  const secret = process.env.USAGE_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    // We must never silently fall back to an empty key — that would forge cookies.
    throw new Error("USAGE_SECRET (or NEXTAUTH_SECRET) must be set.");
  }
  return secret;
}

function b64urlEncode(bytes: Uint8Array): string {
  // btoa wants a binary string.
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return globalThis.crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function hmac(payload: string, secret = getSecret()): Promise<string> {
  const key = await importKey(secret);
  const sig = await globalThis.crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return b64urlEncode(new Uint8Array(sig));
}

export async function hmacVerify(
  payload: string,
  signature: string,
  secret = getSecret()
): Promise<boolean> {
  // Constant-time compare via Subtle.verify.
  try {
    const key = await importKey(secret);
    const sigBytes = b64urlDecode(signature);
    return await globalThis.crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as ArrayBuffer,
      enc.encode(payload)
    );
  } catch {
    return false;
  }
}

/**
 * Stable hash for non-PII identity signals (IP, UA). Same secret salts every
 * record so two visitors with the same IP collide deterministically. We use
 * SHA-256 (not HMAC) here because nothing depends on key secrecy — just on
 * the salt making rainbow-table lookups infeasible.
 */
export async function shortHash(value: string): Promise<string> {
  const salted = `${getSecret()}|${value || ""}`;
  const digest = await globalThis.crypto.subtle.digest("SHA-256", enc.encode(salted));
  return b64urlEncode(new Uint8Array(digest)).slice(0, 24);
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Signed guest cookie                                                     */
/* ─────────────────────────────────────────────────────────────────────── */

/** Mint a new signed guest-id payload: `<uuid>.<sig>` */
export async function mintGuestCookie(uuid: string): Promise<string> {
  const sig = await hmac(uuid);
  return `${uuid}.${sig}`;
}

/** Verify a guest-id cookie. Returns the uuid on success, null otherwise. */
export async function readGuestCookie(value: string | undefined): Promise<string | null> {
  if (!value) return null;
  const dot = value.lastIndexOf(".");
  if (dot < 1) return null;
  const uuid = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (!uuid || !sig) return null;
  return (await hmacVerify(uuid, sig)) ? uuid : null;
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Single-use export token                                                 */
/* ─────────────────────────────────────────────────────────────────────── */

export type ExportTokenPayload = {
  /** "user" or "guest" */
  a: "user" | "guest";
  /** actor id — User.id or GuestSession.cookieId */
  i: string;
  /** kind: "resume" | "cover_letter" */
  k: "resume" | "cover_letter";
  /** nonce — random per token */
  n: string;
  /** issued at, seconds */
  iat: number;
  /** expiry, seconds — usually iat + 90 */
  exp: number;
};

export async function mintExportToken(payload: Omit<ExportTokenPayload, "n" | "iat" | "exp">, ttlSeconds = 90): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const nonce = b64urlEncode(globalThis.crypto.getRandomValues(new Uint8Array(12)));
  const full: ExportTokenPayload = { ...payload, n: nonce, iat: now, exp: now + ttlSeconds };
  const body = b64urlEncode(enc.encode(JSON.stringify(full)));
  const sig = await hmac(body);
  return `${body}.${sig}`;
}

export async function readExportToken(token: string | undefined | null): Promise<ExportTokenPayload | null> {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!(await hmacVerify(body, sig))) return null;
  try {
    const json = dec.decode(b64urlDecode(body));
    const payload = JSON.parse(json) as ExportTokenPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}
