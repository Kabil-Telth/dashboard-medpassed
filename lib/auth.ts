import { cookies } from "next/headers"
import { SESSION_COOKIE } from "./auth-config"
import { verifySessionToken, type SessionPayload } from "./session"

// Reads and verifies the current admin session from the cookie store.
// Returns null when there is no valid, unexpired session.
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return verifySessionToken(token)
}
