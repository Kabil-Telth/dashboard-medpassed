// Types mirror the Mongoose models from the Node.js backend.
// Kept in sync with: src/models/Application.js, Organisation.js, InstitutionPartner.js

export type ResourceKey = "institutions" | "applications" | "organisations"

// ── Institution Partner ───────────────────────────────────────────────────────
export type InstitutionPartner = {
  _id: string
  institutionIdentity: {
    fullLegalInstitutionName: string
    country: string
    city: string
    institutionType: string
    websiteUrl?: string
    accredited?: boolean
    accreditationBody?: string
  }
  contactPerson: {
    fullName: string
    designation: string
    officialEmail: string
    phoneNumber?: string
    whatsappNumber?: string
  }
  status: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

// ── Organisation ──────────────────────────────────────────────────────────────
export type Organisation = {
  _id: string
  identity: {
    fullLegalName: string
    countryOfRegistration: string
    countriesOfOperation?: string[]
    websiteUrl?: string
    isLicensedAgency: string
  }
  contact: {
    fullName: string
    designation: string
    email: string
    phone?: string
    whatsapp?: string
  }
  status: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

// ── Application ───────────────────────────────────────────────────────────────
// Mirrors Application.js schema exactly.

export type ApplicationRecord = {
  _id: string

  step1?: {
    // Program / joining
    joiningDate?: string
    program?: string
    photoUrl?: string
    photoUrlPublicId?: string

    // Personal
    firstName?: string
    lastName?: string
    middleName?: string
    passportNumber?: string
    gender?: string
    age?: string
    dateOfBirth?: string
    mobilePhone?: string
    homePhone?: string
    studentEmail?: string
    parentEmail?: string
    cityStateCountryOfBirth?: string

    // Citizenship
    citizenshipStatus?: string
    permanentResident?: string
    alienRegistration?: string
    countryOfCitizenship?: string
    visaType?: string
    ukEntryDate?: string

    currentMailingAddress?: {
      street?: string
      state?: string
      country?: string
      postalCode?: string
    }
    billingInformation?: {
      firstName?: string
      lastName?: string
      middleName?: string
      address?: string
      city?: string
      state?: string
    }
    useSameAddressForBilling?: boolean | string
  }

  emergencyContacts?: Array<{
    fullName?: string
    phoneNumber?: string
    relation?: string
  }>

  academics?: {
    highSchool?: {
      schoolName?: string
      city?: string
      state?: string
      country?: string
      graduationDate?: string
      completionCertificate?: string
    }
    englishTests?: {
      ielts?: { taken?: boolean | string; grade?: string; date?: string }
      toefl?: { taken?: boolean | string; grade?: string; date?: string }
      oet?:  { taken?: boolean | string; grade?: string; date?: string }
    }
    previousInstitutions?: Array<{
      institutionName?: string
      city?: string
      stateCountry?: string
      fromDate?: string
      toDate?: string
      creditsEarned?: string
      major?: string
      degreeEarned?: string
    }>
  }

  personalStatement?: string

  campusSecurity?: {
    criminalConviction?: boolean | string
    academicDismissal?:  boolean | string
    explanationLetter?:  string
  }

  studentAgreement?: {
    agreed?: boolean | string
    signedDate?: string
  }

  checklist?: {
    files?: {
      passportPhotos?:             string[]
      passportCopy?:               string
      recommendationLetters?:      string[]
      personalStatementSubmitted?: string
      transcriptsSubmitted?:       string
      highSchoolDiplomaSubmitted?: string
    }
    documentsConfirmed?: boolean | string
  }

  agentInformation?: {
    name?: string
    contactInformation?: string
    agentNumber?: string
  }

  status: string
  createdAt?: string
  updatedAt?: string
}
