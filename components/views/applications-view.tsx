"use client"

import { useState } from "react"
import { ResourceTable, type Column } from "@/components/resource-table"
import { StatusBadge } from "@/components/status-badge"
import { DetailDialog } from "@/components/detail-dialog"
import type { ApplicationRecord } from "@/lib/types"

function fullName(r: ApplicationRecord): string {
  const s = r.step1
  return [s?.firstName, s?.middleName, s?.lastName].filter(Boolean).join(" ") || "—"
}

// Render a Cloudinary URL as a clickable link, or undefined if missing
function fileLink(url?: string | null): React.ReactNode {
  if (!url || !url.startsWith("http")) return undefined
  const name = url.split("/").pop()?.split("?")[0] ?? "View File"
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="text-blue-600 underline underline-offset-2 hover:text-blue-800 text-sm">
      {name}
    </a>
  )
}

const columns: Column<ApplicationRecord>[] = [
  {
    key: "applicant",
    header: "Applicant",
    render: (r) => (
      <div className="flex flex-col">
        <span className="font-medium">{fullName(r)}</span>
        <span className="text-xs text-muted-foreground">{r.step1?.studentEmail}</span>
      </div>
    ),
  },
  {
    key: "program",
    header: "Program",
    className: "hidden sm:table-cell",
    render: (r) => r.step1?.program || "—",
  },
  {
    key: "citizenship",
    header: "Citizenship",
    className: "hidden lg:table-cell",
    render: (r) => r.step1?.countryOfCitizenship || r.step1?.citizenshipStatus || "—",
  },
  {
    key: "joining",
    header: "Joining Date",
    className: "hidden lg:table-cell",
    render: (r) => r.step1?.joiningDate || "—",
  },
  {
    key: "status",
    header: "Status",
    render: (r) => <StatusBadge status={r.status} />,
  },
]

export function ApplicationsView() {
  const [selected, setSelected] = useState<ApplicationRecord | null>(null)

  return (
    <>
      <ResourceTable<ApplicationRecord>
        resource="applications"
        columns={columns}
        getId={(r) => r._id}
        getStatus={(r) => r.status}
        getLabel={(r) => fullName(r) + "'s application"}
        getSearchText={(r) =>
          [
            fullName(r),
            r.step1?.studentEmail,
            r.step1?.program,
            r.step1?.passportNumber,
            r.step1?.countryOfCitizenship,
            r.agentInformation?.name,
          ]
            .filter(Boolean)
            .join(" ")
        }
        onRowClick={setSelected}
        searchPlaceholder="Search applicants…"
      />

      {selected ? (
        <DetailDialog
          open={!!selected}
          onOpenChange={(o) => !o && setSelected(null)}
          title={fullName(selected)}
          subtitle={selected.step1?.program}
          status={selected.status}
          sections={[
            {
              heading: "Personal Information",
              fields: [
                { label: "Program",               value: selected.step1?.program },
                { label: "Joining Date",           value: selected.step1?.joiningDate },
                { label: "First Name",             value: selected.step1?.firstName },
                { label: "Middle Name",            value: selected.step1?.middleName },
                { label: "Last Name",              value: selected.step1?.lastName },
                { label: "Date of Birth",          value: selected.step1?.dateOfBirth },
                { label: "Age",                    value: selected.step1?.age },
                { label: "Gender",                 value: selected.step1?.gender },
                { label: "Place of Birth",         value: selected.step1?.cityStateCountryOfBirth },
                { label: "Passport No.",           value: selected.step1?.passportNumber },
                { label: "Citizenship Status",     value: selected.step1?.citizenshipStatus },
                { label: "Country of Citizenship", value: selected.step1?.countryOfCitizenship },
                { label: "Permanent Resident",     value: selected.step1?.permanentResident },
                { label: "Alien Registration",     value: selected.step1?.alienRegistration },
                { label: "Visa Type",              value: selected.step1?.visaType },
                { label: "UK Entry Date",          value: selected.step1?.ukEntryDate },
                { label: "Photo",                  value: fileLink(selected.step1?.photoUrl) },
              ],
            },
            {
              heading: "Contact Details",
              fields: [
                { label: "Student Email",  value: selected.step1?.studentEmail },
                { label: "Parent Email",   value: selected.step1?.parentEmail },
                { label: "Mobile Phone",   value: selected.step1?.mobilePhone },
                { label: "Home Phone",     value: selected.step1?.homePhone },
                { label: "Street",         value: selected.step1?.currentMailingAddress?.street },
                { label: "State",          value: selected.step1?.currentMailingAddress?.state },
                { label: "Country",        value: selected.step1?.currentMailingAddress?.country },
                { label: "Postal Code",    value: selected.step1?.currentMailingAddress?.postalCode },
              ],
            },
            {
              heading: "Billing Information",
              fields: [
                { label: "Same as Mailing", value: selected.step1?.useSameAddressForBilling?.toString() },
                { label: "First Name",      value: selected.step1?.billingInformation?.firstName },
                { label: "Last Name",       value: selected.step1?.billingInformation?.lastName },
                { label: "Middle Name",     value: selected.step1?.billingInformation?.middleName },
                { label: "Address",         value: selected.step1?.billingInformation?.address },
                { label: "City",            value: selected.step1?.billingInformation?.city },
                { label: "State",           value: selected.step1?.billingInformation?.state },
              ],
            },
            {
              heading: "Emergency Contacts",
              fields:
                (selected.emergencyContacts ?? []).length > 0
                  ? (selected.emergencyContacts ?? []).map((c, i) => ({
                      label: `Contact ${i + 1}`,
                      value: [c.fullName, c.relation, c.phoneNumber].filter(Boolean).join(" · "),
                    }))
                  : [{ label: "Contacts", value: undefined }],
            },
            {
              heading: "Academics — High School",
              fields: [
                { label: "School Name",             value: selected.academics?.highSchool?.schoolName },
                { label: "City",                    value: selected.academics?.highSchool?.city },
                { label: "State",                   value: selected.academics?.highSchool?.state },
                { label: "Country",                 value: selected.academics?.highSchool?.country },
                { label: "Graduation Date",         value: selected.academics?.highSchool?.graduationDate },
                { label: "Completion Certificate",  value: selected.academics?.highSchool?.completionCertificate },
              ],
            },
            {
              heading: "English Tests",
              fields: [
                { label: "IELTS Taken", value: selected.academics?.englishTests?.ielts?.taken?.toString() },
                { label: "IELTS Grade", value: selected.academics?.englishTests?.ielts?.grade },
                { label: "IELTS Date",  value: selected.academics?.englishTests?.ielts?.date },
                { label: "TOEFL Taken", value: selected.academics?.englishTests?.toefl?.taken?.toString() },
                { label: "TOEFL Grade", value: selected.academics?.englishTests?.toefl?.grade },
                { label: "OET Taken",   value: selected.academics?.englishTests?.oet?.taken?.toString() },
                { label: "OET Grade",   value: selected.academics?.englishTests?.oet?.grade },
              ],
            },
            ...(
              (selected.academics?.previousInstitutions ?? []).length > 0
                ? [{
                    heading: "Previous Institutions",
                    fields: (selected.academics?.previousInstitutions ?? []).flatMap((inst, i) => [
                      { label: `Institution ${i + 1}`,   value: inst.institutionName },
                      { label: "City / Country",          value: [inst.city, inst.stateCountry].filter(Boolean).join(", ") },
                      { label: "Dates",                   value: [inst.fromDate, inst.toDate].filter(Boolean).join(" – ") },
                      { label: "Major",                   value: inst.major },
                      { label: "Degree Earned",           value: inst.degreeEarned },
                      { label: "Credits Earned",          value: inst.creditsEarned },
                    ]),
                  }]
                : []
            ),
            {
              heading: "Documents",
              fields: [
                { label: "Passport Copy",          value: fileLink(selected.checklist?.files?.passportCopy) },
                { label: "Personal Statement",     value: fileLink(selected.checklist?.files?.personalStatementSubmitted) },
                { label: "Transcripts",            value: fileLink(selected.checklist?.files?.transcriptsSubmitted) },
                { label: "High School Diploma",    value: fileLink(selected.checklist?.files?.highSchoolDiplomaSubmitted) },
                { label: "Documents Confirmed",    value: selected.checklist?.documentsConfirmed?.toString() },
                ...(Array.isArray(selected.checklist?.files?.passportPhotos)
                  ? selected.checklist!.files!.passportPhotos!.map((url: string, i: number) => ({
                      label: `Passport Photo ${i + 1}`,
                      value: fileLink(url),
                    }))
                  : []),
                ...(Array.isArray(selected.checklist?.files?.recommendationLetters)
                  ? selected.checklist!.files!.recommendationLetters!.map((url: string, i: number) => ({
                      label: `Recommendation Letter ${i + 1}`,
                      value: fileLink(url),
                    }))
                  : []),
              ],
            },
            {
              heading: "Campus Security",
              fields: [
                { label: "Criminal Conviction", value: selected.campusSecurity?.criminalConviction?.toString() },
                { label: "Academic Dismissal",  value: selected.campusSecurity?.academicDismissal?.toString() },
                { label: "Explanation Letter",  value: selected.campusSecurity?.explanationLetter },
              ],
            },
            {
              heading: "Agreement & Agent",
              fields: [
                { label: "Student Agreed",    value: selected.studentAgreement?.agreed?.toString() },
                { label: "Signed Date",       value: selected.studentAgreement?.signedDate },
                { label: "Agent Name",        value: selected.agentInformation?.name },
                { label: "Agent Contact",     value: selected.agentInformation?.contactInformation },
                { label: "Agent Number",      value: selected.agentInformation?.agentNumber },
                { label: "Personal Statement", value: selected.personalStatement },
                {
                  label: "Submitted",
                  value: selected.createdAt ? new Date(selected.createdAt).toLocaleString() : undefined,
                },
              ],
            },
          ]}
        />
      ) : null}
    </>
  )
}
