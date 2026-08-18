import { describe, expect, it } from 'vitest'
import { get, PUBLIC_ROUTES } from '../helpers/http'

/**
 * THE DOM DENSITY FLOOR — the measured version of §11's warning.
 *
 * Test 1 asserts that specific, named product facts survive without JavaScript. It is a
 * spot check: it names one product route and a handful of strings. That catches a
 * regression on the thing it names and nothing else. The failure §11 actually describes is
 * gradual and global — "it happens one reasonable-looking transition at a time… nobody
 * decides to remove the products" — and it would drain every route Test 1 does not name
 * while leaving the named ones intact.
 *
 * So this test asserts a FLOOR rather than a fact: every public route must serve at least
 * this much real, semantic, crawlable content in its server HTML. It does not care what the
 * content is. It cares that a page which used to have thirty links has not quietly become a
 * page with two and a canvas.
 *
 * ── The numbers are not arbitrary ──────────────────────────────────────────────────────
 *
 * They are calibrated against a measured production site, recorded in
 * docs/research/teardown-burberry-gstar-vero.md §3.1. VERO Italy is an Awwwards-nominated
 * 3D immersive store selling real clothes, and its entire served document is:
 *
 *     55 DOM nodes · 0 links · 1 heading · 0 product names · 0 prices · no <noscript>
 *
 * — behind 22,210 KB of GLB, video and script. It is precisely the site §11 predicts when
 * it says "an award-winning WebGL fashion store has no product listings in its HTML at
 * all", and it is the reason this floor exists as executable code rather than as a
 * paragraph everyone agrees with.
 *
 * The thresholds sit well beneath what our routes serve today, deliberately. A floor that
 * tracks the current build breaks on every ordinary edit and gets raised until it means
 * nothing. This one should only ever fire when something structural has gone wrong.
 */

/** Anything at or below this is the VERO shape: a shell with a renderer bolted on. */
const VERO_LINK_COUNT = 0
const VERO_HEADING_COUNT = 1

const FLOOR = {
  /** Real anchors with a real href. The single number that separates a page from a canvas. */
  links: 8,
  /** A document with one heading has an outline no screen reader or crawler can use. */
  headings: 3,
  /** Below this, the "page" is chrome. */
  textCharacters: 600,
}

/**
 * HTML documents only. `PUBLIC_ROUTES` also carries `/robots.txt` and `/sitemap.xml`, which
 * are machine formats with no headings, no anchors and no prose by design — the crawl
 * assertion needs them in the sweep and this one must not judge them as pages.
 */
const HTML_ROUTES = PUBLIC_ROUTES.filter((route) => !/\.(txt|xml)$/.test(route))

function countMatches(body: string, pattern: RegExp): number {
  return body.match(pattern)?.length ?? 0
}

/**
 * Visible text, with the parts that are not prose removed first.
 *
 * `<script>` bodies matter here: an RSC flight payload is enormous and consists largely of
 * the page's own strings, so measuring raw HTML length would let a page that renders
 * nothing pass on the weight of its own hydration data — exactly the failure being tested.
 */
function visibleText(body: string): string {
  return body
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

describe('DOM density floor — no public route may collapse to a shell', () => {
  it.each(HTML_ROUTES)('%s serves a usable document without JavaScript', async (route) => {
    const { status, body } = await get(route)
    expect(status).toBe(200)

    const links = countMatches(body, /<a\s[^>]*href="/gi)
    const headings = countMatches(body, /<h[1-6][\s>]/gi)
    const text = visibleText(body)

    expect(
      links,
      `${route} served ${links} links. The VERO Italy reference serves ${VERO_LINK_COUNT} ` +
        `and is unreachable by search, screen reader and Ctrl-F — see ` +
        `docs/research/teardown-burberry-gstar-vero.md §3.`,
    ).toBeGreaterThanOrEqual(FLOOR.links)

    expect(
      headings,
      `${route} served ${headings} headings (the VERO reference serves ${VERO_HEADING_COUNT}). ` +
        `A document with no outline cannot be navigated by assistive technology.`,
    ).toBeGreaterThanOrEqual(FLOOR.headings)

    expect(
      text.length,
      `${route} served ${text.length} characters of visible text, script payloads excluded.`,
    ).toBeGreaterThanOrEqual(FLOOR.textCharacters)
  })

  /**
   * The canvas clause.
   *
   * Phases 1 and 2 ship zero WebGL bytes (CLAUDE.md §13b). This asserts the observable
   * consequence rather than the bundle contents: no public route may serve a <canvas> at
   * all. When Phase 3 is approved, this is the test that must be deliberately amended —
   * which is the point. Atmosphere arrives by decision, not by drift.
   */
  it('serves no canvas element on any public route', async () => {
    for (const route of HTML_ROUTES) {
      const { body } = await get(route)
      expect(
        /<canvas[\s>]/i.test(body),
        `${route} serves a <canvas>. Phases 1 and 2 ship zero WebGL bytes.`,
      ).toBe(false)
    }
  })
})
