import { NextResponse, type NextRequest } from "next/server"
import { getSession } from "@/lib/auth"
import { backendFetch, RESOURCE_PATHS } from "@/lib/backend"

// GET /api/<resource> -> proxies a list request to the backend.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ resource: string }> },
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { resource } = await params
  const base = RESOURCE_PATHS[resource]
  if (!base) {
    return NextResponse.json({ error: "Unknown resource" }, { status: 404 })
  }

  try {
    const res = await backendFetch(base)
    const body = await res.text()
    return new NextResponse(body, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to reach backend" },
      { status: 502 },
    )
  }
}
