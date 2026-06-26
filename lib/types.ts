// Types mirror the Mongoose models from the Node.js backend.
// Kept in sync with: src/models/Application.js

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
export type ApplicationRecord = {
  _id: string

  step1?: {
    joiningDate?: string
    program?: string
    photoUrl?: string
    photoUrlPublicId?: string

    firstName?: string
    lastName?: string
    middleName?: string

    passportNumber?: string
    aadharPanNumber?: string

    gender?: string
    age?: string
    dateOfBirth?: string
    cityStateCountryOfBirth?: string

    mobilePhone?: string
    homePhone?: string
    studentEmail?: string
    parentEmail?: string

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
    email?: string
    addressLine?: string
    city?: string
    state?: string
    pincode?: string
    country?: string
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
  personalStatementMethod?: string
  personalStatementFileUrl?: string

  campusSecurity?: {
    criminalConviction?: boolean | string
    academicDismissal?:  boolean | string
    explanationLetter?:  string
  }

  studentAgreement?: {
    agreed?: boolean | string
    signatureUrl?: string
    signedDate?: string
  }

  checklist?: {
    // Boolean confirmation flags
    passportPhotos?:             boolean | string
    registrationFeePaid?:        boolean | string
    passportCopy?:               boolean | string
    healthCertificate?:          boolean | string
    policeClearanceCertificate?: boolean | string
    recommendationLetters?:      boolean | string
    personalStatementSubmitted?: boolean | string
    transcriptsSubmitted?:       boolean | string
    highSchoolDiplomaSubmitted?: boolean | string
    documentsConfirmed?:         boolean | string

    // Uploaded file URLs (Cloudinary)
    files?: {
      passportPhotos?:             string[]
      passportCopy?:               string
      recommendationLetters?:      string[]
      personalStatementSubmitted?: string
      transcriptsSubmitted?:       string
      highSchoolDiplomaSubmitted?: string
    }
  }

  agentInformation?: {
    name?: string
    agentNumber?: string
    contactInformation?: string
    hearAboutUs?: {
      facebook?: boolean | string
      instagram?: boolean | string
      google?: boolean | string
      others?: boolean | string
      othersSpecify?: string
    }
  }

  status: string
  createdAt?: string
  updatedAt?: string
}