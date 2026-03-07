import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  signupSchema,
  otpSchema,
  profileSchema,
  addressSchema,
  businessVerificationSchema,
  depositRecipientSchema,
} from './validations'

function validate(schema, data) {
  const result = schema.safeParse(data)
  return result
}

describe('loginSchema', () => {
  it('accepts valid AU mobile 0412345678', () => {
    expect(validate(loginSchema, { phone: '0412345678' }).success).toBe(true)
  })

  it('accepts 0400000000', () => {
    expect(validate(loginSchema, { phone: '0400000000' }).success).toBe(true)
  })

  it('accepts 0499999999', () => {
    expect(validate(loginSchema, { phone: '0499999999' }).success).toBe(true)
  })

  it('rejects non-04 prefix', () => {
    expect(validate(loginSchema, { phone: '0312345678' }).success).toBe(false)
  })

  it('rejects too short', () => {
    expect(validate(loginSchema, { phone: '041234567' }).success).toBe(false)
  })

  it('rejects too long', () => {
    expect(validate(loginSchema, { phone: '04123456789' }).success).toBe(false)
  })

  it('rejects empty string', () => {
    expect(validate(loginSchema, { phone: '' }).success).toBe(false)
  })

  it('rejects letters', () => {
    expect(validate(loginSchema, { phone: '04abcdefgh' }).success).toBe(false)
  })
})

describe('signupSchema', () => {
  const valid = {
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '0412345678',
    terms: true,
  }

  it('accepts valid signup data', () => {
    expect(validate(signupSchema, valid).success).toBe(true)
  })

  it('rejects missing firstName', () => {
    expect(validate(signupSchema, { ...valid, firstName: '' }).success).toBe(false)
  })

  it('rejects missing lastName', () => {
    expect(validate(signupSchema, { ...valid, lastName: '' }).success).toBe(false)
  })

  it('rejects invalid phone', () => {
    expect(validate(signupSchema, { ...valid, phone: '0312345678' }).success).toBe(false)
  })

  it('rejects terms = false', () => {
    expect(validate(signupSchema, { ...valid, terms: false }).success).toBe(false)
  })

  it('rejects firstName over 50 chars', () => {
    expect(validate(signupSchema, { ...valid, firstName: 'A'.repeat(51) }).success).toBe(false)
  })
})

describe('otpSchema', () => {
  it('accepts exactly 6 digits', () => {
    expect(validate(otpSchema, { otp: '123456' }).success).toBe(true)
  })

  it('rejects 5 digits', () => {
    expect(validate(otpSchema, { otp: '12345' }).success).toBe(false)
  })

  it('rejects 7 digits', () => {
    expect(validate(otpSchema, { otp: '1234567' }).success).toBe(false)
  })

  it('rejects letters', () => {
    expect(validate(otpSchema, { otp: 'abcdef' }).success).toBe(false)
  })

  it('rejects mixed alphanumeric', () => {
    expect(validate(otpSchema, { otp: '12ab56' }).success).toBe(false)
  })

  it('rejects empty string', () => {
    expect(validate(otpSchema, { otp: '' }).success).toBe(false)
  })
})

describe('profileSchema', () => {
  const valid = {
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '2000-01-01',
    phone: '0412345678',
  }

  it('accepts valid profile', () => {
    expect(validate(profileSchema, valid).success).toBe(true)
  })

  it('rejects age under 18', () => {
    const young = new Date()
    young.setFullYear(young.getFullYear() - 17)
    expect(validate(profileSchema, { ...valid, dateOfBirth: young.toISOString().split('T')[0] }).success).toBe(false)
  })

  it('accepts age exactly 18', () => {
    const eighteen = new Date()
    eighteen.setFullYear(eighteen.getFullYear() - 18)
    eighteen.setDate(eighteen.getDate() - 1) // just over 18
    expect(validate(profileSchema, { ...valid, dateOfBirth: eighteen.toISOString().split('T')[0] }).success).toBe(true)
  })

  it('accepts +61 phone format', () => {
    expect(validate(profileSchema, { ...valid, phone: '+61412345678' }).success).toBe(true)
  })

  it('accepts landline format', () => {
    expect(validate(profileSchema, { ...valid, phone: '0298765432' }).success).toBe(true)
  })

  it('rejects invalid phone', () => {
    expect(validate(profileSchema, { ...valid, phone: '12345' }).success).toBe(false)
  })
})

describe('addressSchema', () => {
  const valid = {
    addressLine1: '123 Main St',
    city: 'Sydney',
    state: 'NSW',
    postcode: '2000',
  }

  it('accepts valid address', () => {
    expect(validate(addressSchema, valid).success).toBe(true)
  })

  it('accepts all valid states', () => {
    const states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']
    states.forEach((state) => {
      expect(validate(addressSchema, { ...valid, state }).success).toBe(true)
    })
  })

  it('rejects invalid state', () => {
    expect(validate(addressSchema, { ...valid, state: 'XX' }).success).toBe(false)
  })

  it('rejects 3-digit postcode', () => {
    expect(validate(addressSchema, { ...valid, postcode: '200' }).success).toBe(false)
  })

  it('rejects 5-digit postcode', () => {
    expect(validate(addressSchema, { ...valid, postcode: '20001' }).success).toBe(false)
  })

  it('rejects non-numeric postcode', () => {
    expect(validate(addressSchema, { ...valid, postcode: 'abcd' }).success).toBe(false)
  })

  it('accepts 4-digit postcode', () => {
    expect(validate(addressSchema, { ...valid, postcode: '3000' }).success).toBe(true)
  })

  it('rejects empty address', () => {
    expect(validate(addressSchema, { ...valid, addressLine1: '' }).success).toBe(false)
  })

  it('rejects empty city', () => {
    expect(validate(addressSchema, { ...valid, city: '' }).success).toBe(false)
  })

  it('accepts optional addressLine2', () => {
    expect(validate(addressSchema, { ...valid, addressLine2: 'Unit 5' }).success).toBe(true)
  })
})

describe('businessVerificationSchema', () => {
  const valid = {
    abn: '12345678901',
    businessName: 'Test Pty Ltd',
    applicantRole: 'director',
  }

  it('accepts valid business data', () => {
    expect(validate(businessVerificationSchema, valid).success).toBe(true)
  })

  it('accepts valid 11-digit ABN', () => {
    expect(validate(businessVerificationSchema, valid).success).toBe(true)
  })

  it('rejects 10-digit ABN', () => {
    expect(validate(businessVerificationSchema, { ...valid, abn: '1234567890' }).success).toBe(false)
  })

  it('rejects 12-digit ABN', () => {
    expect(validate(businessVerificationSchema, { ...valid, abn: '123456789012' }).success).toBe(false)
  })

  it('accepts valid 9-digit ACN', () => {
    expect(validate(businessVerificationSchema, { ...valid, acn: '123456789' }).success).toBe(true)
  })

  it('rejects 8-digit ACN', () => {
    expect(validate(businessVerificationSchema, { ...valid, acn: '12345678' }).success).toBe(false)
  })

  it('accepts empty ACN (optional)', () => {
    expect(validate(businessVerificationSchema, { ...valid, acn: '' }).success).toBe(true)
  })

  it('accepts authorized_representative role', () => {
    expect(validate(businessVerificationSchema, { ...valid, applicantRole: 'authorized_representative' }).success).toBe(true)
  })

  it('rejects invalid role', () => {
    expect(validate(businessVerificationSchema, { ...valid, applicantRole: 'employee' }).success).toBe(false)
  })
})

describe('depositRecipientSchema', () => {
  const valid = {
    recipientType: 'landlord',
    recipientName: 'John Doe',
    recipientBsb: '123-456',
    recipientAccount: '12345678',
  }

  it('accepts valid recipient data', () => {
    expect(validate(depositRecipientSchema, valid).success).toBe(true)
  })

  it('accepts BSB without dash', () => {
    expect(validate(depositRecipientSchema, { ...valid, recipientBsb: '123456' }).success).toBe(true)
  })

  it('accepts BSB with dash', () => {
    expect(validate(depositRecipientSchema, { ...valid, recipientBsb: '123-456' }).success).toBe(true)
  })

  it('rejects BSB with wrong format', () => {
    expect(validate(depositRecipientSchema, { ...valid, recipientBsb: '12-3456' }).success).toBe(false)
  })

  it('accepts 6-digit account', () => {
    expect(validate(depositRecipientSchema, { ...valid, recipientAccount: '123456' }).success).toBe(true)
  })

  it('accepts 9-digit account', () => {
    expect(validate(depositRecipientSchema, { ...valid, recipientAccount: '123456789' }).success).toBe(true)
  })

  it('rejects 5-digit account', () => {
    expect(validate(depositRecipientSchema, { ...valid, recipientAccount: '12345' }).success).toBe(false)
  })

  it('rejects 10-digit account', () => {
    expect(validate(depositRecipientSchema, { ...valid, recipientAccount: '1234567890' }).success).toBe(false)
  })

  it('accepts landlord and agency types', () => {
    expect(validate(depositRecipientSchema, valid).success).toBe(true)
    expect(validate(depositRecipientSchema, { ...valid, recipientType: 'agency' }).success).toBe(true)
  })

  it('rejects invalid recipient type', () => {
    expect(validate(depositRecipientSchema, { ...valid, recipientType: 'tenant' }).success).toBe(false)
  })

  it('accepts optional email', () => {
    expect(validate(depositRecipientSchema, { ...valid, recipientEmail: 'test@example.com' }).success).toBe(true)
  })

  it('accepts empty email', () => {
    expect(validate(depositRecipientSchema, { ...valid, recipientEmail: '' }).success).toBe(true)
  })

  it('rejects invalid email', () => {
    expect(validate(depositRecipientSchema, { ...valid, recipientEmail: 'not-an-email' }).success).toBe(false)
  })
})
