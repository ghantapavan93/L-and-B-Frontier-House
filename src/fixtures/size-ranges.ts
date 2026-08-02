/**
 * DEVELOPMENT FIXTURE — NOT VERIFIED PRODUCT DATA.
 *
 * Measurement tables exist as structured text because the live size chart is a single
 * text-free JPEG (a probable WCAG 1.1.1 failure). These numbers are illustrative and must
 * be replaced with the owner's real grading before any public launch.
 *
 * Extended sizing is `available`, not `made-to-order`. `made-to-order` requires verified
 * evidence and is never a default for extended ranges (docs/production/06).
 */

import type { SizeRange } from '@/domain/size'

export const WOMENS_STRAIGHT: SizeRange = {
  kind: 'straight',
  sizes: ['S', 'M', 'L', 'XL'],
  availability: 'available',
  measurements: [
    { size: 'S', bustIn: '34', waistIn: '27', hipIn: '37', inseamIn: '30' },
    { size: 'M', bustIn: '36', waistIn: '29', hipIn: '39', inseamIn: '30' },
    { size: 'L', bustIn: '38', waistIn: '31', hipIn: '41', inseamIn: '30' },
    { size: 'XL', bustIn: '40', waistIn: '33', hipIn: '43', inseamIn: '30' },
  ],
}

export const WOMENS_EXTENDED: SizeRange = {
  kind: 'extended',
  sizes: ['1X', '2X', '3X'],
  availability: 'available',
  measurements: [
    { size: '1X', bustIn: '43', waistIn: '36', hipIn: '46', inseamIn: '30' },
    { size: '2X', bustIn: '45', waistIn: '38', hipIn: '48', inseamIn: '30' },
    { size: '3X', bustIn: '47', waistIn: '40', hipIn: '50', inseamIn: '30' },
  ],
}

export const GIRLS_RANGE: SizeRange = {
  kind: 'girls',
  sizes: ['7', '8', '10', '12', '14'],
  availability: 'available',
  measurements: [
    { size: '7', bustIn: '26', waistIn: '23', hipIn: '28' },
    { size: '8', bustIn: '27', waistIn: '24', hipIn: '29' },
    { size: '10', bustIn: '28', waistIn: '25', hipIn: '31' },
    { size: '12', bustIn: '30', waistIn: '26', hipIn: '33' },
    { size: '14', bustIn: '32', waistIn: '27', hipIn: '35' },
  ],
}

/** Accessories are one-size; the range still exists so every product has a size story. */
export const ONE_SIZE: SizeRange = {
  kind: 'straight',
  sizes: ['One size'],
  availability: 'available',
  measurements: [{ size: 'One size', waistIn: '—' }],
}

export const BELT_RANGE: SizeRange = {
  kind: 'straight',
  sizes: ['S', 'M', 'L'],
  availability: 'available',
  measurements: [
    { size: 'S', waistIn: '28–30' },
    { size: 'M', waistIn: '32–34' },
    { size: 'L', waistIn: '36–38' },
  ],
}
