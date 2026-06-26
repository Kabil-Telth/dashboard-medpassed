"use client"

import Link from "next/link"
import useSWR from "swr"
import { fetcher, toArray } from "@/lib/fetcher"
import { getStatusMeta } from "@/lib/status"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/status-badge"
import { Building2, Briefcase, FileText, Clock, ArrowRight } from "lucide-react"
import type { ResourceKey } from "@/lib/types"

type WithStatus = { status?: string }

const RESOURCES: {
  key: ResourceKey
  label: string
  icon: typeof Building2
}[] = [
  { key: "institutions", label: "Institutions", icon: Building2 },
  { key: "organisations", label: "Organisations", icon: Briefcase },
  { key: "applications", label: "Applications", icon: FileText },
]

function StatCard({ resource }: { resource: (typeof RESOURCES)[number] }) {
  const { data, error, isLoading } = useSWR(`/api/${resource.key}`, fetcher)
  const rows = toArray<WithStatus>(data)
  const total = rows.length
  const pending = rows.filter(
    (r) => r.status === "pending" || r.status === "submitted",
  ).length

  // count by status for the breakdown
  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    const s = r.status ?? "unknown"
    acc[s] = (acc[s] ?? 0) + 1
    return acc
  }, {})

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <resource.icon className="size-4.5" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {resource.label}
          </span>
        </div>
        <Link
          href={`/dashboard/${resource.key}`}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View <ArrowRight className="size-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-9 w-20" />
        ) : error ? (
          <p className="text-sm text-destructive">Failed to load</p>
        ) : (
          <>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-semibold tabular-nums">{total}</span>
              {pending > 0 ? (
                <span className="mb-1 flex items-center gap-1 text-xs text-amber-600">
                  <Clock className="size-3" />
                  {pending} awaiting review
                </span>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {Object.entries(counts).map(([status, count]) => (
                <span
                  key={status}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                >
                  <StatusBadge status={status} />
                  <span className="tabular-nums">{count}</span>
                </span>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function OverviewView() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {RESOURCES.map((r) => (
        <StatCard key={r.key} resource={r} />
      ))}
    </div>
  )
}
