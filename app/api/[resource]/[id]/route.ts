// app/api/[resource]/[id]/route.ts
import { NextResponse, type NextRequest } from "next/server"
import { getSession } from "@/lib/auth"
import { backendFetch, RESOURCE_PATHS } from "@/lib/backend"

type Ctx = { params: Promise<{ resource: string; id: string }> }

async function resolve(params: Ctx["params"]) {
  const session = await getSession()
  if (!session) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }
  const { resource, id } = await params
  const base = RESOURCE_PATHS[resource]
  if (!base) {
    return { error: NextResponse.json({ error: "Unknown resource" }, { status: 404 }) }
  }
  return { path: `${base}/${encodeURIComponent(id)}` }
}

// DELETE /api/<resource>/<id>
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { error, path } = await resolve(params)
  if (error) return error

  try {
    const res = await backendFetch(path!, { method: "DELETE" })
    const body = await res.text()
    return new NextResponse(body || JSON.stringify({ ok: true }), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 })
  }
}

// PATCH /api/<resource>/<id>
// Next.js row-actions sends PATCH → we forward as PUT to Node.js
// because Node.js routes only define: router.put("/:id", ...)
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { error, path } = await resolve(params)
  if (error) return error

  const body = await req.text()

  try {
    const res = await backendFetch(path!, { method: "PUT", body }) // PATCH → PUT
    const text = await res.text()
    return new NextResponse(text || JSON.stringify({ ok: true }), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 })
  }
}