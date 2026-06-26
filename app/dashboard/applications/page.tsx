import { PageHeader } from "@/components/page-header"
import { ApplicationsView } from "@/components/views/applications-view"

export default function ApplicationsPage() {
  return (
    <>
      <PageHeader
        title="Applications"
        description="Student admission applications. Click a row for full details."
      />
      <ApplicationsView />
    </>
  )
}
