// Client-side fetcher for SWR. Throws on non-2xx responses.
export async function fetcher<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const message = await res.text().catch(() => "")
    throw new Error(message || `Request failed with ${res.status}`)
  }
  return res.json() as Promise<T>
}

// Normalizes various backend list shapes into a plain array.
export function toArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>
    for (const key of ["data", "items", "results", "docs"]) {
      if (Array.isArray(obj[key])) return obj[key] as T[]
    }
  }
  return []
}
