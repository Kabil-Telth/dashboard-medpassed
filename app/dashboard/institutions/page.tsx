import { PageHeader } from "@/components/page-header"
import { InstitutionsView } from "@/components/views/institutions-view"

export default function InstitutionsPage() {
  return (
    <>
      <PageHeader
        title="Institutions"
        description="University and college partner registrations. Click a row for full details."
      />
      <InstitutionsView />
    </>
  )
}
