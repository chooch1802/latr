import { z } from 'zod'

export const loginSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^04\d{8}$/, 'Please enter a valid Australian mobile number (04XXXXXXXX)'),
})

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be 50 characters or less'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be 50 characters or less'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^04\d{8}$/, 'Please enter a valid Australian mobile number (04XXXXXXXX)'),
  terms: z
    .literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
})

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'Code must be 6 digits')
    .regex(/^\d{6}$/, 'Code must be 6 digits'),
})

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be 50 characters or less'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be 50 characters or less'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((val) => {
      const date = new Date(val)
      const age = (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      return age >= 18
    }, 'You must be at least 18 years old'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^(\+?61|0)[2-478]\d{8}$/, 'Please enter a valid Australian phone number'),
})

export const addressSchema = z.object({
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City/suburb is required'),
  state: z.enum(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'], {
    errorMap: () => ({ message: 'Please select a state' }),
  }),
  postcode: z
    .string()
    .min(1, 'Postcode is required')
    .regex(/^\d{4}$/, 'Must be a 4-digit postcode'),
})

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^(\+?61|0)[2-478]\d{8}$/, 'Please enter a valid Australian phone number'),
  email: z.string().email('Please enter a valid email'),
  addressLine1: z.string().min(1, 'Address is required'),
  suburb: z.string().min(1, 'Suburb is required'),
  state: z.enum(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'], {
    errorMap: () => ({ message: 'Please select a state' }),
  }),
  postcode: z.string().regex(/^\d{4}$/, 'Must be a 4-digit postcode'),
})

export const rentalHistorySchema = z.object({
  landlordName: z.string().min(1, 'Landlord/agent name is required'),
  landlordPhone: z.string().min(1, 'Phone is required'),
  currentRent: z.string().min(1, 'Current rent is required').regex(/^\d+$/, 'Must be a number'),
  leaseStartDate: z.string().min(1, 'Lease start date is required'),
  reasonForMoving: z.string().min(10, 'Please provide a reason (min 10 characters)'),
})

export const employmentSchema = z.object({
  employmentStatus: z.enum(['employed', 'self-employed', 'unemployed', 'student', 'retired'], {
    errorMap: () => ({ message: 'Please select your employment status' }),
  }),
  employerName: z.string().optional(),
  jobTitle: z.string().optional(),
  annualIncome: z
    .string()
    .min(1, 'Annual income is required')
    .regex(/^\d+$/, 'Must be a number'),
})

const referenceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Please enter a valid email'),
  relationship: z.string().min(1, 'Relationship is required'),
})

export const referencesSchema = z.object({
  employment: referenceSchema,
  landlord: referenceSchema,
  character: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    relationship: z.string().optional(),
  }),
})

export const businessVerificationSchema = z.object({
  abn: z
    .string()
    .min(1, 'ABN is required')
    .regex(/^\d{11}$/, 'ABN must be exactly 11 digits'),
  acn: z
    .string()
    .regex(/^\d{9}$/, 'ACN must be exactly 9 digits')
    .optional()
    .or(z.literal('')),
  businessName: z
    .string()
    .min(1, 'Business name is required')
    .max(200, 'Business name must be 200 characters or less'),
  applicantRole: z.enum(['director', 'authorized_representative'], {
    errorMap: () => ({ message: 'Please select your role' }),
  }),
})

export const depositRecipientSchema = z.object({
  recipientType: z.enum(['landlord', 'agency'], {
    errorMap: () => ({ message: 'Please select recipient type' }),
  }),
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientBsb: z
    .string()
    .min(1, 'BSB is required')
    .regex(/^\d{3}-?\d{3}$/, 'BSB must be in format XXX-XXX'),
  recipientAccount: z
    .string()
    .min(1, 'Account number is required')
    .regex(/^\d{6,9}$/, 'Account number must be 6-9 digits'),
  recipientEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  agentName: z.string().optional(),
})
