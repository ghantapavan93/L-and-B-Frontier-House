/**
 * DEVELOPMENT FIXTURE — NOT VERIFIED PRODUCT DATA.
 *
 * Fixture buyer accounts exist so the authorised path — the most important unseen surface
 * in the project — can be exercised before a real demo account is provisioned.
 *
 * Retailer names are deliberately self-evident placeholders. CLAUDE.md §12 forbids invented
 * people; these are labelled fixture organisations, not represented customers.
 *
 * The password below is a development credential for fixture accounts only. It is not a
 * secret, it authenticates nothing real, and it is replaced by the real identity provider
 * when the commerce adapter is implemented against a live backend.
 */

import type { Buyer } from '@/domain/buyer'

export const FIXTURE_PASSWORD = 'frontier-dev'

const FIXTURE_ADDRESS = {
  line1: '1 Fixture Row',
  city: 'Dallas',
  region: 'TX',
  postalCode: '75207',
  country: 'US',
} as const

export const BUYER_RECORDS: readonly Buyer[] = [
  {
    id: 'b-approved',
    email: 'approved@fixture.test',
    retailer: {
      name: 'Fixture Boutique — Approved Account',
      address: FIXTURE_ADDRESS,
    },
    salesTaxId: { value: 'FIXTURE-TAX-ID-0001', verified: true },
    status: 'approved',
    appliedAt: '2026-06-14',
    approvedAt: '2026-06-15',
    terms: {
      paymentTerms: 'Net 30',
      shippingTerms: 'FOB Dallas. Prepacks ship complete.',
    },
    isFixture: true,
  },
  {
    id: 'b-pending',
    email: 'pending@fixture.test',
    retailer: {
      name: 'Fixture Boutique — Pending Application',
      address: FIXTURE_ADDRESS,
    },
    salesTaxId: { value: 'FIXTURE-TAX-ID-0002', verified: false },
    status: 'pending',
    appliedAt: '2026-08-01',
    isFixture: true,
  },
  {
    id: 'b-rejected',
    email: 'rejected@fixture.test',
    retailer: {
      name: 'Fixture Boutique — Application Not Approved',
      address: FIXTURE_ADDRESS,
    },
    salesTaxId: { value: 'FIXTURE-TAX-ID-0003', verified: false },
    status: 'rejected',
    appliedAt: '2026-07-02',
    statusNote:
      'We could not verify a resale tax certificate for this application. Send an updated ' +
      'certificate and we will review it again.',
    isFixture: true,
  },
  {
    id: 'b-suspended',
    email: 'suspended@fixture.test',
    retailer: {
      name: 'Fixture Boutique — Suspended Account',
      address: FIXTURE_ADDRESS,
    },
    salesTaxId: { value: 'FIXTURE-TAX-ID-0004', verified: true },
    status: 'suspended',
    appliedAt: '2025-11-03',
    approvedAt: '2025-11-04',
    statusNote:
      'This account is on hold pending a terms review. Ordering is paused; contact your ' +
      'representative to restore it.',
    isFixture: true,
  },
] as const
