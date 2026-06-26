"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useSWRConfig } from "swr"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getStatusMeta } from "@/lib/status"
import type { ResourceKey } from "@/lib/types"
import { Loader2, Trash2 } from "lucide-react"

type Props = {
  resource: ResourceKey
  id: string
  status: string
  statusOptions: string[]
  label: string
}

export function RowActions({ resource, id, status, statusOptions, label }: Props) {
  const { mutate } = useSWRConfig()
  const listKey = `/api/${resource}`
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  async function changeStatus(next: string | null) {
    if (!next || next === status) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/${resource}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) throw new Error(await res.text())
      await mutate(listKey)
      toast.success(`Status updated to "${getStatusMeta(next).label}"`)
    } catch {
      toast.error("Could not update status")
    } finally {
      setUpdating(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/${resource}/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      await mutate(listKey)
      toast.success(`${label} deleted`)
    } catch {
      toast.error("Could not delete record")
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <div className="relative">
        <Select value={status} onValueChange={changeStatus} disabled={updating}>
          <SelectTrigger size="sm" className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt} value={opt} className="capitalize">
                {getStatusMeta(opt).label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {updating ? (
          <Loader2 className="pointer-events-none absolute -left-6 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : null}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive"
        onClick={() => setConfirmOpen(true)}
        aria-label="Delete record"
      >
        <Trash2 className="size-4" />
      </Button>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes <span className="font-medium">{label}</span>{" "}
              from the backend. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
