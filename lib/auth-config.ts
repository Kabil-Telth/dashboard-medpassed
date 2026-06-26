// Central config for the single-admin auth system and backend connection.
// These can be overridden with environment variables in production.

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME 
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD 

// Secret used to sign the session cookie. Override in production via env.
export const SESSION_SECRET =
  process.env.SESSION_SECRET ?? "medpass-admin-dev-secret-change-me"

// Base URL of the Node.js backend.
export const API_BASE_URL =
  process.env.MEDPASS_API_BASE_URL ?? "http://192.168.1.238:5000"

export const SESSION_COOKIE = "medpass_admin_session"

// Session lifetime: 12 hours.
export const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 12
