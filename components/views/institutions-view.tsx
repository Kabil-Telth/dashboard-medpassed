"use client"

import { useState } from "react"
import { ResourceTable, type Column } from "@/components/resource-table"
import { StatusBadge } from "@/components/status-badge"
import { DetailDialog } from "@/components/detail-dialog"
import type { InstitutionPartner } from "@/lib/types"

const columns: Column<InstitutionPartner>[] = [
  {
    key: "name",
    header: "Institution",
    render: (r) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {r.institutionIdentity?.fullLegalInstitutionName || "—"}
        </span>
        <span className="text-xs text-muted-foreground">
          {r.institutionIdentity?.institutionType}
        </span>
      </div>
    ),
  },
  {
    key: "location",
    header: "Location",
    render: (r) =>
      [r.institutionIdentity?.city, r.institutionIdentity?.country]
        .filter(Boolean)
        .join(", ") || "—",
  },
  {
    key: "contact",
    header: "Contact",
    className: "hidden lg:table-cell",
    render: (r) => (
      <div className="flex flex-col">
        <span>{r.contactPerson?.fullName || "—"}</span>
        <span className="text-xs text-muted-foreground">
          {r.contactPerson?.officialEmail}
        </span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (r) => <StatusBadge status={r.status} />,
  },
]

export function InstitutionsView() {
  const [selected, setSelected] = useState<InstitutionPartner | null>(null)

  return (
    <>
      <ResourceTable<InstitutionPartner>
        resource="institutions"
        columns={columns}
        getId={(r) => r._id}
        getStatus={(r) => r.status}
        getLabel={(r) => r.institutionIdentity?.fullLegalInstitutionName || "this institution"}
        getSearchText={(r) =>
          [
            r.institutionIdentity?.fullLegalInstitutionName,
            r.institutionIdentity?.country,
            r.institutionIdentity?.city,
            r.contactPerson?.fullName,
            r.contactPerson?.officialEmail,
          ]
            .filter(Boolean)
            .join(" ")
        }
        onRowClick={setSelected}
        searchPlaceholder="Search institutions..."
      />

      {selected ? (
        <DetailDialog
          open={!!selected}
          onOpenChange={(o) => !o && setSelected(null)}
          title={selected.institutionIdentity?.fullLegalInstitutionName || "Institution"}
          subtitle={selected.institutionIdentity?.institutionType}
          status={selected.status}
          sections={[
            {
              heading: "Institution Identity",
              fields: [
                { label: "Country", value: selected.institutionIdentity?.country },
                { label: "City", value: selected.institutionIdentity?.city },
                { label: "Type", value: selected.institutionIdentity?.institutionType },
                {
                  label: "Website",
                  value: selected.institutionIdentity?.websiteUrl,
                },
                {
                  label: "Accredited",
                  value: selected.institutionIdentity?.accredited ? "Yes" : "No",
                },
                {
                  label: "Accreditation Body",
                  value: selected.institutionIdentity?.accreditationBody,
                },
              ],
            },
            {
              heading: "Contact Person",
              fields: [
                { label: "Full Name", value: selected.contactPerson?.fullName },
                { label: "Designation", value: selected.contactPerson?.designation },
                { label: "Official Email", value: selected.contactPerson?.officialEmail },
                { label: "Phone", value: selected.contactPerson?.phoneNumber },
                { label: "WhatsApp", value: selected.contactPerson?.whatsappNumber },
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
