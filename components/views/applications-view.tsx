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

function fileLink(url?: string | null): React.ReactNode {
  if (!url || !url.startsWith("http")) return undefined
  const name = decodeURIComponent(url.split("/").pop()?.split("?")[0] ?? "View File")
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="text-blue-600 underline underline-offset-2 hover:text-blue-800 text-sm break-all">
      {name}
    </a>
  )
}

function bool(val?: boolean | string | null): string | undefined {
  if (val === undefined || val === null || val === "") return undefined
  return String(val) === "true" || val === true ? "✅ Yes" : "❌ No"
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
            r.step1?.aadharPanNumber,
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
            // ── 1. Programme ─────────────────────────────────────────────────
            {
              heading: "Programme",
              fields: [
                { label: "Program",      value: selected.step1?.program },
                { label: "Joining Date", value: selected.step1?.joiningDate },
                { label: "Photo",        value: fileLink(selected.step1?.photoUrl) },
              ],
            },

            // ── 2. Personal Information ───────────────────────────────────────
            {
              heading: "Personal Information",
              fields: [
                { label: "First Name",         value: selected.step1?.firstName },
                { label: "Middle Name",        value: selected.step1?.middleName },
                { label: "Last Name",          value: selected.step1?.lastName },
                { label: "Date of Birth",      value: selected.step1?.dateOfBirth },
                { label: "Age",                value: selected.step1?.age },
                { label: "Gender",             value: selected.step1?.gender },
                { label: "Place of Birth",     value: selected.step1?.cityStateCountryOfBirth },
                { label: "Passport No.",       value: selected.step1?.passportNumber },
                { label: "Aadhar / PAN No.",   value: selected.step1?.aadharPanNumber },
              ],
            },

            // ── 3. Contact Details ────────────────────────────────────────────
            {
              heading: "Contact Details",
              fields: [
                { label: "Student Email", value: selected.step1?.studentEmail },
                { label: "Parent Email",  value: selected.step1?.parentEmail },
                { label: "Mobile Phone",  value: selected.step1?.mobilePhone },
                { label: "Home Phone",    value: selected.step1?.homePhone },
              ],
            },

            // ── 4. Mailing Address ────────────────────────────────────────────
            {
              heading: "Mailing Address",
              fields: [
                { label: "Street",      value: selected.step1?.currentMailingAddress?.street },
                { label: "State",       value: selected.step1?.currentMailingAddress?.state },
                { label: "Country",     value: selected.step1?.currentMailingAddress?.country },
                { label: "Postal Code", value: selected.step1?.currentMailingAddress?.postalCode },
              ],
            },

            // ── 5. Billing Information ────────────────────────────────────────
            {
              heading: "Billing Information",
              fields: [
                { label: "Same as Mailing", value: bool(selected.step1?.useSameAddressForBilling) },
                { label: "First Name",      value: selected.step1?.billingInformation?.firstName },
                { label: "Last Name",       value: selected.step1?.billingInformation?.lastName },
                { label: "Middle Name",     value: selected.step1?.billingInformation?.middleName },
                { label: "Address",         value: selected.step1?.billingInformation?.address },
                { label: "City",            value: selected.step1?.billingInformation?.city },
                { label: "State",           value: selected.step1?.billingInformation?.state },
              ],
            },

            // ── 6. Immigration / Citizenship ──────────────────────────────────
            {
              heading: "Immigration & Citizenship",
              fields: [
                { label: "Citizenship Status",     value: selected.step1?.citizenshipStatus },
                { label: "Country of Citizenship", value: selected.step1?.countryOfCitizenship },
                { label: "Permanent Resident",     value: selected.step1?.permanentResident },
                { label: "Alien Registration",     value: selected.step1?.alienRegistration },
                { label: "Visa Type",              value: selected.step1?.visaType },
                { label: "UK Entry Date",          value: selected.step1?.ukEntryDate },
              ],
            },

            // ── 7. Emergency Contacts ─────────────────────────────────────────
            {
              heading: "Emergency Contacts",
              fields:
                (selected.emergencyContacts ?? []).length > 0
                  ? (selected.emergencyContacts ?? []).flatMap((c, i) => [
                      { label: `#${i + 1} Full Name`,    value: c.fullName },
                      { label: `#${i + 1} Relation`,     value: c.relation },
                      { label: `#${i + 1} Phone`,        value: c.phoneNumber },
                      { label: `#${i + 1} Email`,        value: c.email },
                      { label: `#${i + 1} Address`,      value: c.addressLine },
                      { label: `#${i + 1} City`,         value: c.city },
                      { label: `#${i + 1} State`,        value: c.state },
                      { label: `#${i + 1} Pincode`,      value: c.pincode },
                      { label: `#${i + 1} Country`,      value: c.country },
                    ])
                  : [{ label: "Contacts", value: undefined }],
            },

            // ── 8. High School ────────────────────────────────────────────────
            {
              heading: "High School",
              fields: [
                { label: "School Name",            value: selected.academics?.highSchool?.schoolName },
                { label: "City",                   value: selected.academics?.highSchool?.city },
                { label: "State",                  value: selected.academics?.highSchool?.state },
                { label: "Country",                value: selected.academics?.highSchool?.country },
                { label: "Graduation Date",        value: selected.academics?.highSchool?.graduationDate },
                { label: "Completion Certificate", value: fileLink(selected.academics?.highSchool?.completionCertificate) },
              ],
            },

            // ── 9. English Tests ──────────────────────────────────────────────
            {
              heading: "English Tests",
              fields: [
                { label: "IELTS — Taken", value: bool(selected.academics?.englishTests?.ielts?.taken) },
                { label: "IELTS — Grade", value: selected.academics?.englishTests?.ielts?.grade },
                { label: "IELTS — Date",  value: selected.academics?.englishTests?.ielts?.date },
                { label: "TOEFL — Taken", value: bool(selected.academics?.englishTests?.toefl?.taken) },
                { label: "TOEFL — Grade", value: selected.academics?.englishTests?.toefl?.grade },
                { label: "TOEFL — Date",  value: selected.academics?.englishTests?.toefl?.date },
                { label: "OET — Taken",   value: bool(selected.academics?.englishTests?.oet?.taken) },
                { label: "OET — Grade",   value: selected.academics?.englishTests?.oet?.grade },
                { label: "OET — Date",    value: selected.academics?.englishTests?.oet?.date },
              ],
            },

            // ── 10. Previous Institutions ─────────────────────────────────────
            ...((selected.academics?.previousInstitutions ?? []).length > 0
              ? [{
                  heading: "Previous Institutions",
                  fields: (selected.academics?.previousInstitutions ?? []).flatMap((inst, i) => [
                    { label: `#${i + 1} Institution`, value: inst.institutionName },
                    { label: `#${i + 1} City`,        value: inst.city },
                    { label: `#${i + 1} State/Country`, value: inst.stateCountry },
                    { label: `#${i + 1} From`,        value: inst.fromDate },
                    { label: `#${i + 1} To`,          value: inst.toDate },
                    { label: `#${i + 1} Major`,       value: inst.major },
                    { label: `#${i + 1} Degree`,      value: inst.degreeEarned },
                    { label: `#${i + 1} Credits`,     value: inst.creditsEarned },
                  ]),
                }]
              : []),

            // ── 11. Personal Statement ────────────────────────────────────────
            {
              heading: "Personal Statement",
              fields: [
                { label: "Method",     value: selected.personalStatementMethod },
                { label: "Statement",  value: selected.personalStatement },
                { label: "File",       value: fileLink(selected.personalStatementFileUrl) },
              ],
            },

            // ── 12. Campus Security ───────────────────────────────────────────
            {
              heading: "Campus Security",
              fields: [
                { label: "Criminal Conviction", value: bool(selected.campusSecurity?.criminalConviction) },
                { label: "Academic Dismissal",  value: bool(selected.campusSecurity?.academicDismissal) },
                { label: "Explanation Letter",  value: fileLink(selected.campusSecurity?.explanationLetter) },
              ],
            },

            // ── 13. Student Agreement ─────────────────────────────────────────
            {
              heading: "Student Agreement",
              fields: [
                { label: "Agreed",      value: bool(selected.studentAgreement?.agreed) },
                { label: "Signed Date", value: selected.studentAgreement?.signedDate },
                { label: "Signature",   value: fileLink(selected.studentAgreement?.signatureUrl) },
              ],
            },

            // ── 14. Checklist — Confirmation Flags ───────────────────────────
            {
              heading: "Checklist — Confirmations",
              fields: [
                { label: "Passport Photos",              value: bool(selected.checklist?.passportPhotos) },
                { label: "Registration Fee Paid",        value: bool(selected.checklist?.registrationFeePaid) },
                { label: "Passport Copy",                value: bool(selected.checklist?.passportCopy) },
                { label: "Health Certificate",           value: bool(selected.checklist?.healthCertificate) },
                { label: "Police Clearance Certificate", value: bool(selected.checklist?.policeClearanceCertificate) },
                { label: "Recommendation Letters",      value: bool(selected.checklist?.recommendationLetters) },
                { label: "Personal Statement",          value: bool(selected.checklist?.personalStatementSubmitted) },
                { label: "Transcripts",                 value: bool(selected.checklist?.transcriptsSubmitted) },
                { label: "High School Diploma",         value: bool(selected.checklist?.highSchoolDiplomaSubmitted) },
                { label: "All Documents Confirmed",     value: bool(selected.checklist?.documentsConfirmed) },
              ],
            },

            // ── 15. Checklist — Uploaded Files ────────────────────────────────
            {
              heading: "Checklist — Uploaded Files",
              fields: [
                { label: "Passport Copy",       value: fileLink(selected.checklist?.files?.passportCopy) },
                { label: "Personal Statement",  value: fileLink(selected.checklist?.files?.personalStatementSubmitted) },
                { label: "Transcripts",         value: fileLink(selected.checklist?.files?.transcriptsSubmitted) },
                { label: "High School Diploma", value: fileLink(selected.checklist?.files?.highSchoolDiplomaSubmitted) },
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

            // ── 16. Agent Information ─────────────────────────────────────────
            {
              heading: "Agent Information",
              fields: [
                { label: "Agent Name",    value: selected.agentInformation?.name },
                { label: "Agent Number",  value: selected.agentInformation?.agentNumber },
                { label: "Contact Info",  value: selected.agentInformation?.contactInformation },
                { label: "Facebook",      value: bool(selected.agentInformation?.hearAboutUs?.facebook) },
                { label: "Instagram",     value: bool(selected.agentInformation?.hearAboutUs?.instagram) },
                { label: "Google",        value: bool(selected.agentInformation?.hearAboutUs?.google) },
                { label: "Others",        value: bool(selected.agentInformation?.hearAboutUs?.others) },
                { label: "Others — Specify", value: selected.agentInformation?.hearAboutUs?.othersSpecify },
              ],
            },

            // ── 17. Meta ──────────────────────────────────────────────────────
            {
              heading: "Submission Details",
              fields: [
                {
                  label: "Submitted",
                  value: selected.createdAt ? new Date(selected.createdAt).toLocaleString() : undefined,
                },
                {
                  label: "Last Updated",
                  value: selected.updatedAt ? new Date(selected.updatedAt).toLocaleString() : undefined,
                },
              ],
            },
          ]}
        />
      ) : null}
    </>
  )
}