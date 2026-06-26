import { PageHeader } from "@/components/page-header"
import { OverviewView } from "@/components/views/overview-view"

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="Submissions across institutions, organisations, and applications."
      />
      <OverviewView />
    </>
  )
}
