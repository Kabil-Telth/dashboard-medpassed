// Edge + Node compatible signed session tokens using the Web Crypto API.
// Token format: base64url(payload).base64url(HMAC-SHA256(payload))

import { SESSION_SECRET } from "./auth-config"

export type SessionPayload = {
  sub: string
  exp: number
}

const encoder = new TextEncoder()

function bytesToB64url(bytes: Uint8Array): string {
  let bin = ""
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function b64urlToString(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/")
  return atob(b64)
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const data = bytesToB64url(encoder.encode(JSON.stringify(payload)))
  const key = await getKey()
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data))
  return `${data}.${bytesToB64url(new Uint8Array(sig))}`
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token) return null
  const [data, sig] = token.split(".")
  if (!data || !sig) return null

  try {
    const key = await getKey()
    const expected = await crypto.subtle.sign("HMAC", key, encoder.encode(data))
    if (bytesToB64url(new Uint8Array(expected)) !== sig) return null

    const payload = JSON.parse(b64urlToString(data)) as SessionPayload
    if (!payload?.exp || Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}
