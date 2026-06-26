import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE } from "./lib/auth-config"
import { verifySessionToken } from "./lib/session"

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  const session = await verifySessionToken(token)
  const { pathname } = req.nextUrl

  // Protect everything under /dashboard.
  if (pathname.startsWith("/dashboard") && !session) {
    const url = new URL("/login", req.url)
    return NextResponse.redirect(url)
  }

  // Keep authenticated admins out of the login page.
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
