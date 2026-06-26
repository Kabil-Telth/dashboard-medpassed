"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { fetcher, toArray } from "@/lib/fetcher"
import { STATUS_OPTIONS } from "@/lib/status"
import type { ResourceKey } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { RowActions } from "@/components/row-actions"
import { getStatusMeta } from "@/lib/status"
import { AlertCircle, Inbox, Search } from "lucide-react"

export type Column<T> = {
  key: string
  header: string
  className?: string
  render: (row: T) => React.ReactNode
}

type Props<T> = {
  resource: ResourceKey
  columns: Column<T>[]
  getId: (row: T) => string
  getStatus: (row: T) => string
  getLabel: (row: T) => string
  getSearchText: (row: T) => string
  onRowClick?: (row: T) => void
  searchPlaceholder?: string
}

export function ResourceTable<T>({
  resource,
  columns,
  getId,
  getStatus,
  getLabel,
  getSearchText,
  onRowClick,
  searchPlaceholder = "Search...",
}: Props<T>) {
  const { data, error, isLoading } = useSWR(`/api/${resource}`, fetcher)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const rows = useMemo(() => toArray<T>(data), [data])

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const matchesStatus =
        statusFilter === "all" || getStatus(row) === statusFilter
      const matchesQuery =
        query.trim() === "" ||
        getSearchText(row).toLowerCase().includes(query.trim().toLowerCase())
      return matchesStatus && matchesQuery
    })
  }, [rows, statusFilter, query, getStatus, getSearchText])

  const colCount = columns.length + 1

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v ?? "all")}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS[resource].map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {getStatusMeta(s).label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((c) => (
                <TableHead key={c.key} className={c.className}>
                  {c.header}
                </TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: colCount }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full max-w-[160px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={colCount} className="h-32">
                  <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                    <AlertCircle className="size-6 text-destructive" />
                    <p className="text-sm">
                      Could not load records from the backend.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colCount} className="h-32">
                  <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                    <Inbox className="size-6" />
                    <p className="text-sm">
                      {rows.length === 0
                        ? "No records yet."
                        : "No records match your filters."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => {
                const id = getId(row)
                return (
                  <TableRow
                    key={id}
                    className={onRowClick ? "cursor-pointer" : undefined}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {columns.map((c) => (
                      <TableCell key={c.key} className={c.className}>
                        {c.render(row)}
                      </TableCell>
                    ))}
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <RowActions
                        resource={resource}
                        id={id}
                        status={getStatus(row)}
                        statusOptions={STATUS_OPTIONS[resource]}
                        label={getLabel(row)}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && !error && filtered.length > 0 ? (
        <div className="border-t px-4 py-3 text-xs text-muted-foreground">
          Showing {filtered.length} of {rows.length} record
          {rows.length === 1 ? "" : "s"}
        </div>
      ) : null}
    </Card>
  )
}
