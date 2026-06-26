// lib/backend.ts
import "server-only"
import { API_BASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD } from "./auth-config"

// JWT token cached in module memory — shared across all requests in one process.
// Avoids logging in on every single API call.
let cachedToken: string | null = null
let tokenExpiry = 0 // ms timestamp

async function refreshBackendToken(): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_USERNAME, password: ADMIN_PASSWORD }),
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Backend login failed (${res.status}): ${text}`)
  }

  const json = await res.json()
  if (!json.token) throw new Error("Backend login returned no token")

  cachedToken = json.token
  tokenExpiry = Date.now() + 7.5 * 60 * 60 * 1000 // refresh at 7.5h, token lives 8h
  return cachedToken
}

async function getBackendToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken // still valid
  return refreshBackendToken()                                     // expired or first call
}

export async function backendFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const token = await getBackendToken()

  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // JWT — matches Node.js protect middleware
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  })
}

// Must match exactly: app.use("/api/institutions" ...) in Node.js index.js
export const RESOURCE_PATHS: Record<string, string> = {
  institutions:  "/api/institutions",
  applications:  "/api/applications",
  organisations: "/api/organisations",
}