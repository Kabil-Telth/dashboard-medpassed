import type { ResourceKey } from "./types"

export type StatusMeta = {
  value: string
  label: string
  // tailwind classes for the badge
  className: string
}

const STATUS_META: Record<string, StatusMeta> = {
  draft: {
    value: "draft",
    label: "Draft",
    className: "bg-muted text-muted-foreground border-border",
  },
  submitted: {
    value: "submitted",
    label: "Submitted",
    className: "bg-sky-100 text-sky-800 border-sky-200",
  },
  pending: {
    value: "pending",
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  under_review: {
    value: "under_review",
    label: "Under Review",
    className: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  approved: {
    value: "approved",
    label: "Approved",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  rejected: {
    value: "rejected",
    label: "Rejected",
    className: "bg-red-100 text-red-800 border-red-200",
  },
}

export function getStatusMeta(status: string): StatusMeta {
  return (
    STATUS_META[status] ?? {
      value: status,
      label: status,
      className: "bg-muted text-muted-foreground border-border",
    }
  )
}

// Allowed status options per resource, matching the backend enums.
export const STATUS_OPTIONS: Record<ResourceKey, string[]> = {
  institutions: ["pending", "under_review", "approved", "rejected"],
  organisations: ["pending", "under_review", "approved", "rejected"],
  applications: ["draft", "submitted", "under_review", "approved", "rejected"],
}
