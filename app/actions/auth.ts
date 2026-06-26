"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  SESSION_COOKIE,
  SESSION_MAX_AGE_MS,
} from "@/lib/auth-config"
import { createSessionToken } from "@/lib/session"

export type LoginState = { error?: string }

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return { error: "Invalid username or password." }
  }

  const exp = Date.now() + SESSION_MAX_AGE_MS
  const token = await createSessionToken({ sub: username, exp })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_MAX_AGE_MS / 1000),
  })

  redirect("/dashboard")
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect("/login")
}
