"use client"

import { useState } from "react"
import { ResourceTable, type Column } from "@/components/resource-table"
import { StatusBadge } from "@/components/status-badge"
import { DetailDialog } from "@/components/detail-dialog"
import type { Organisation } from "@/lib/types"

const columns: Column<Organisation>[] = [
  {
    key: "name",
    header: "Organisation",
    render: (r) => (
      <div className="flex flex-col">
        <span className="font-medium">{r.identity?.fullLegalName || "—"}</span>
        <span className="text-xs text-muted-foreground">
          {r.identity?.countryOfRegistration}
        </span>
      </div>
    ),
  },
  {
    key: "licensed",
    header: "Licensed",
    className: "hidden sm:table-cell",
    render: (r) => r.identity?.isLicensedAgency || "—",
  },
  {
    key: "contact",
    header: "Contact",
    className: "hidden lg:table-cell",
    render: (r) => (
      <div className="flex flex-col">
        <span>{r.contact?.fullName || "—"}</span>
        <span className="text-xs text-muted-foreground">{r.contact?.email}</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (r) => <StatusBadge status={r.status} />,
  },
]

export function OrganisationsView() {
  const [selected, setSelected] = useState<Organisation | null>(null)

  return (
    <>
      <ResourceTable<Organisation>
        resource="organisations"
        columns={columns}
        getId={(r) => r._id}
        getStatus={(r) => r.status}
        getLabel={(r) => r.identity?.fullLegalName || "this organisation"}
        getSearchText={(r) =>
          [
            r.identity?.fullLegalName,
            r.identity?.countryOfRegistration,
            r.contact?.fullName,
            r.contact?.email,
          ]
            .filter(Boolean)
            .join(" ")
        }
        onRowClick={setSelected}
        searchPlaceholder="Search organisations..."
      />

      {selected ? (
        <DetailDialog
          open={!!selected}
          onOpenChange={(o) => !o && setSelected(null)}
          title={selected.identity?.fullLegalName || "Organisation"}
          subtitle={selected.identity?.countryOfRegistration}
          status={selected.status}
          sections={[
            {
              heading: "Organisation Identity",
              fields: [
                {
                  label: "Country of Registration",
                  value: selected.identity?.countryOfRegistration,
                },
                {
                  label: "Countries of Operation",
                  value: selected.identity?.countriesOfOperation?.join(", "),
                },
                { label: "Website", value: selected.identity?.websiteUrl },
                {
                  label: "Licensed Agency",
                  value: selected.identity?.isLicensedAgency,
                },
              ],
            },
            {
              heading: "Contact Person",
              fields: [
                { label: "Full Name", value: selected.contact?.fullName },
                { label: "Designation", value: selected.contact?.designation },
                { label: "Email", value: selected.contact?.email },
                { label: "Phone", value: selected.contact?.phone },
                { label: "WhatsApp", value: selected.contact?.whatsapp },
              ],
            },
            {
              heading: "Admin",
              fields: [
                { label: "Notes", value: selected.notes },
                {
                  label: "Submitted",
                  value: selected.createdAt
                    ? new Date(selected.createdAt).toLocaleString()
                    : undefined,
                },
              ],
            },
          ]}
        />
      ) : null}
    </>
  )
}
