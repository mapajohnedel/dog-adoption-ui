import { z } from 'zod'

export const partnerApplicantTypes = ['shelter', 'rescuer'] as const
export const partnerApplicationStatuses = ['pending', 'approved', 'rejected'] as const

export type PartnerApplicantType = (typeof partnerApplicantTypes)[number]
export type PartnerApplicationStatus = (typeof partnerApplicationStatuses)[number]

export const partnerApplicationSchema = z.object({
  applicantType: z.enum(partnerApplicantTypes),
  organizationName: z.string().trim().min(2, 'Organization name is required.'),
  contactPersonName: z.string().trim().min(2, 'Contact person name is required.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim().min(7, 'Enter a valid contact number.'),
  addressLine: z.string().trim().min(5, 'Address is required.'),
  city: z.string().trim().min(2, 'City is required.'),
  provinceOrRegion: z.string().trim().min(2, 'Province or region is required.'),
  notes: z
    .string()
    .trim()
    .max(1000, 'Additional notes must be under 1000 characters.')
    .optional()
    .or(z.literal('')),
})

export const partnerApplicationReviewSchema = z.object({
  reviewNotes: z
    .string()
    .trim()
    .max(1000, 'Review notes must be under 1000 characters.')
    .optional()
    .or(z.literal('')),
})

export type PartnerApplicationInput = z.infer<typeof partnerApplicationSchema>
export type PartnerApplicationReviewInput = z.infer<typeof partnerApplicationReviewSchema>

export type PartnerApplicationRecord = {
  id: string
  applicant_type: PartnerApplicantType
  organization_name: string
  contact_person_name: string
  email: string
  phone: string
  address_line: string
  city: string
  province_or_region: string
  notes: string | null
  review_notes: string | null
  status: PartnerApplicationStatus
  reviewed_by: string | null
  reviewed_at: string | null
  approved_auth_user_id: string | null
  approval_email_sent_at: string | null
  approval_email_error: string | null
  created_at: string
  updated_at: string
}

export type PartnerProfileRecord = {
  user_id: string
  application_id: string
  applicant_type: PartnerApplicantType
  organization_name: string
  contact_person_name: string
  email: string
  phone: string
  address_line: string
  city: string
  province_or_region: string
  notes: string | null
  created_at: string
  updated_at: string
}

export function normalizeOptionalText(value?: string) {
  return value?.trim() ? value.trim() : null
}
