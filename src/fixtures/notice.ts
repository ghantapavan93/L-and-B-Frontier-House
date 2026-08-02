/**
 * Every fixture in this project is labelled at the point of render. Nothing here is
 * verified product inventory, and none of it may be presented as real.
 *
 * CLAUDE.md §12: "No invented product facts — names, colours, materials, sizes, prices,
 * availability and wholesale terms come from verified data or clearly-labelled fixtures."
 */

export const FIXTURE_NOTICE = 'DEVELOPMENT FIXTURE — NOT VERIFIED PRODUCT DATA'

export const FIXTURE_NOTICE_DETAIL =
  'Product names, descriptions, imagery, sizing, availability and wholesale terms on this ' +
  'build are development fixtures. They are not Lucky & Blessed inventory and must not be ' +
  'used commercially.'

/**
 * Set on every fixture media reference. The media-integrity test fails the build if a
 * production route ever references media with this provenance.
 */
export const FIXTURE_MEDIA_PROVENANCE = 'generated-placeholder' as const
