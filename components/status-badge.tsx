import { Badge } from "@/components/ui/badge"
import { getStatusMeta } from "@/lib/status"
import { cn } from "@/lib/utils"

export function StatusBadge({ status }: { status: string }) {
  const meta = getStatusMeta(status)
  return (
    <Badge
      variant="outline"
      className={cn("font-medium capitalize", meta.className)}
    >
      {meta.label}
    </Badge>
  )
}
