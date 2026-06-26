"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/status-badge"

export type DetailField = { label: string; value?: React.ReactNode }
export type DetailSection = { heading: string; fields: DetailField[] }

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle?: string
  status?: string
  sections: DetailSection[]
}

export function DetailDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  status,
  sections,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="text-balance">{title}</DialogTitle>
              {subtitle ? (
                <DialogDescription>{subtitle}</DialogDescription>
              ) : null}
            </div>
            {status ? <StatusBadge status={status} /> : null}
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {sections.map((section, i) => (
            <div key={section.heading} className="flex flex-col gap-3">
              {i > 0 ? <Separator /> : null}
              <h3 className="text-sm font-semibold text-foreground">
                {section.heading}
              </h3>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {section.fields.map((f) => (
                  <div key={f.label} className="flex flex-col gap-0.5">
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {f.label}
                    </dt>
                    <dd className="text-sm text-foreground">
                      {f.value === undefined ||
                      f.value === null ||
                      f.value === "" ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        f.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
