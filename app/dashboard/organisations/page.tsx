import { PageHeader } from "@/components/page-header"
import { OrganisationsView } from "@/components/views/organisations-view"

export default function OrganisationsPage() {
  return (
    <>
      <PageHeader
        title="Organisations"
        description="Recruitment agency registrations. Click a row for full details."
      />
      <OrganisationsView />
    </>
  )
}
