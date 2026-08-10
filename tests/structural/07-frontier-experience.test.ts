import { spawn, spawnSync } from 'node:child_process'
import type { ChildProcess } from 'node:child_process'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { get, stylesheetsFor } from '../helpers/http'

/**
 * PHASE 2 — THE FRONTIER EXPERIENCE, BOTH SIDES OF THE FLAG.
 *
 * The main structural server runs with the flag at its default (enabled), so every existing
 * guarantee — no-JS product truth, the crawl assertions, availability — is already proven
 * AGAINST the cinematic homepage by the other suites. This file adds the cinematic
 * specifics, then boots a second server with the flag OFF and proves the verified Phase 1
 * experience is what ships.
 */

describe('flag enabled (default) — cinematic specifics', () => {
  it('opens with ONE hero — the ignition, carrying the headline itself', async () => {
    const { body } = await get('/')

    expect(body).toContain('class="ignition"')
    // The ignition IS the hero. It used to sit above a second full-viewport hero that
    // repeated the same statement over a photograph; `id="hero"` moved onto this section
    // when they merged, so "Enter the frontier" would now scroll to itself and is gone.
    expect(body).toContain('id="hero"')
    expect(body).not.toContain('Enter the frontier')
    expect(body, 'a second hero section is back').not.toContain('hero--photographic')

    // Exactly one full-viewport opening, and it carries the page's only h1.
    expect([...body.matchAll(/<h1[\s>]/g)]).toHaveLength(1)
    expect(body).toContain('Western apparel, made for the boutiques that sell it.')

    // §11's one-action exit to shop survives the merge, with its target on the page.
    expect(body).toContain('Skip to shop')
    expect(body).toContain('href="#sheet"')
    expect(body).toContain('id="sheet"')
    expect(body).toContain('Wholesale access')
  })

  it('describes the buckle as the 8B/8C form — and never the coin', async () => {
    const { body } = await get('/')

    // The artifact used to be re-drawn here as inline SVG beside a video of itself. The
    // film and its poster carry it alone now, so the description lives in the poster's
    // alt text — which is also the only copy of it a screen reader ever hears.
    expect(body).toContain('scalloped rectangular western belt buckle')
    // The dead fabrications stay dead.
    expect(body).not.toMatch(/EST\.?\s*1865/i)
    expect(body).not.toMatch(/1870s/i)
  })

  it('leaves one short, one-shot CSS animation in the ignition', async () => {
    const css = await stylesheetsFor('/')

    // The film is the motion now. What remains in CSS is the actions rising once, inside
    // a no-preference query — well under the WCAG 2.2.2 five-second threshold and never
    // looping, so it owes no control of its own. The film's control covers the film.
    expect(css).toContain('ignition-rise')
    expect(css).not.toMatch(/ignition-rise[^;}]*infinite/)

    const durations = [...css.matchAll(/ignition-rise\s+([\d.]+)s/g)].map((m) =>
      Number.parseFloat(m[1] ?? '0'),
    )
    expect(durations.length).toBeGreaterThan(0)
    for (const d of durations) expect(d).toBeLessThanOrEqual(3)

    // The SVG draw is gone with the SVG; a leftover keyframe would be dead bytes on
    // every route, since this is one stylesheet.
    expect(css).not.toContain('ignition-draw')
  })

  it('serves the contact-sheet stories as static, JS-free target panels', async () => {
    const { body } = await get('/')

    // Frames select stories; stories resolve to the product route.
    expect(body).toContain('href="#story-dark-wash-high-rise-flare-jean"')
    expect(body).toContain('id="story-dark-wash-high-rise-flare-jean"')
    expect(body).toMatch(
      /id="story-dark-wash-high-rise-flare-jean"[\s\S]*?href="\/product\/dark-wash-high-rise-flare-jean"/,
    )
    expect(body).toContain('Close story')
  })

  it('replaces category cards with the four verified worlds — and only those', async () => {
    const { body } = await get('/')

    for (const world of [
      'world-denim',
      'world-shirts',
      'world-outerwear',
      'world-accessories',
    ]) {
      expect(body).toContain(`id="${world}"`)
    }

    /*
      The worlds are now the men's COLLECTIONS (owner-directed, 2026-08-08), so the
      guard changes shape but not purpose. What must never surface is the exported
      Frame 5 gateway label, and what must always accompany the imagery is the
      demonstration marker — the line is proposed, not published (D-03).
    */
    expect(body).not.toMatch(/for him/i)
    expect(body, 'the collection grid lost its demonstration marker').toMatch(/demonstration/i)
    // Every world opens the labelled demonstration, never a catalogue route.
    expect(body).toContain('href="/mens#mens-denim"')
  })

  it('renders the journey with honest planes and no invented place', async () => {
    const { body } = await get('/')

    expect(body).toContain('journey__spine')
    expect(body).toContain('Photography pending — nothing real is depicted')
    for (const stage of ['Textile', 'Design', 'Manufacturing', 'Distribution']) {
      expect(body).toContain(stage)
    }
    expect(body).not.toMatch(/kuroki|tannery|factory in|our mill/i)
  })

  /**
   * The ignition film ships. The edit contract allows this assertion to change only in
   * the same commit that adds a poster, a captions track, a transcript route and pause
   * behaviour — so the test proves each of those rather than being deleted.
   *
   * The film is now ten seconds: the buckle ignition cut straight into the thread passage.
   * Past the WCAG 2.2.2 five-second threshold, and it starts by itself — so the pause
   * control moves from "provided anyway by native chrome" to genuinely owed.
   */
  it('ships the ignition film only with its poster, captions, transcript and a pause control', async () => {
    const { body } = await get('/')

    expect(body, 'the film is missing').toContain('/media/hero/lb-hero-ignition-desktop')
    expect(body, 'no portrait encoding').toContain('/media/hero/lb-hero-ignition-mobile')
    expect(body, 'no poster — the slot must be complete without the film').toContain(
      '/media/hero/lb-hero-poster-desktop.webp',
    )
    expect(body, 'no art-directed portrait poster').toContain(
      '/media/hero/lb-hero-poster-mobile.webp',
    )
    expect(body, 'no captions track').toContain('/media/hero/lb-hero-ignition.vtt')
    expect(body, 'no transcript route').toContain('/transcript/buckle-ignition')

    // The control is server-rendered — hidden until the controller can act on it, but
    // present in the HTML so its absence is a test failure rather than a silent
    // regression.
    expect(body, 'no pause control').toContain('data-hero-toggle')

    // Never loops: the passage was authored to END in negative space sized for the copy
    // that sits over it, and looping would drag the frame back to the buckle.
    expect(body, 'loops past the five-second threshold').not.toMatch(/<video[^>]*\sloop/)

    // No autoplay ATTRIBUTE. It cannot be withdrawn for a reduced-motion visitor once
    // served, so playback is started by the inline controller instead — which is also
    // what keeps the no-JavaScript case motionless.
    expect(body, 'ships an ungateable autoplay attribute').not.toMatch(/<video[^>]*\sautoplay/)

    // The IGNITION is a background surface, not an embedded player — its tag carries no
    // chrome. Other films on the page are allowed only as deliberate click-to-play
    // players: controls on, preload="none", and never autoplay (asserted above).
    const videoTags = body.match(/<video[^>]*>/g) ?? []
    const heroTag = videoTags.find((tag) => tag.includes('data-hero-film'))
    expect(heroTag, 'the ignition video tag is missing').toBeDefined()
    expect(heroTag, 'the ignition ships native player chrome').not.toMatch(/\scontrols/)
    for (const tag of videoTags) {
      if (tag === heroTag) continue
      expect(tag, `non-ignition film must be click-to-play: ${tag}`).toMatch(/\scontrols/)
      expect(tag, `non-ignition film must not preload: ${tag}`).toContain('preload="none"')
    }
  })

  it('ships no video on any surface other than the homepage ignition', async () => {
    for (const route of ['/wholesale', '/product/dark-wash-high-rise-flare-jean']) {
      const { body } = await get(route)
      expect(body, `${route} rendered a <video>`).not.toContain('<video')
      expect(body, `${route} autoplays something`).not.toContain('autoplay')
    }
  })

  it('serves the transcript as text, with no product or date claim', async () => {
    const { body, status } = await get('/transcript/buckle-ignition')

    expect(status).toBe(200)
    expect(body).toContain('The ignition film')
    expect(body).toContain('monogram')
    expect(body).not.toMatch(/1865|1870|est\.\s*\d{4}/i)
    // The repo's price shape, not a bare `$\d`: Next's RSC payload is full of `$1`/`$L2`
    // flight markers, so the naive pattern matches every streamed page.
    expect(body).not.toMatch(/\$\s?\d[\d,]*\.\d{2}/)
  })

  it('presents the wholesale showroom with the rack gated and price-free', async () => {
    const { body } = await get('/wholesale')

    expect(body).toContain('The virtual rack')
    expect(body).toContain('Enter the showroom')
    expect(body).toContain('Four steps to your pricing')
    expect(body).not.toMatch(/\$\s?\d[\d,]*\.\d{2}/)
  })
})

describe('flag disabled — the verified Phase 1 experience', () => {
  const PORT = 3213
  const BASE = `http://127.0.0.1:${PORT}`
  let server: ChildProcess | undefined

  /**
   * The public routes are PRERENDERED, so the flag is a build-time boundary — a runtime env
   * flip cannot change static HTML. This test is honest about that: it builds the flag-off
   * variant into its own dist directory and boots exactly what a flag-off deployment would
   * serve. The build is the cost of testing the real thing.
   */
  const FLAG_OFF_ENV = {
    ...process.env,
    NODE_ENV: 'production' as const,
    LB_SESSION_SECRET: 'structural-test-secret',
    NEXT_PUBLIC_ENABLE_FRONTIER_EXPERIENCE: '0',
    LB_DIST_DIR: '.next-flagoff',
  }

  beforeAll(async () => {
    const build = spawnSync('npx', ['next', 'build'], {
      shell: true,
      stdio: 'ignore',
      env: FLAG_OFF_ENV,
      timeout: 300_000,
    })
    if (build.status !== 0) throw new Error('flag-off build failed')

    server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
      shell: true,
      stdio: 'ignore',
      env: FLAG_OFF_ENV,
    })

    const deadline = Date.now() + 90_000
    while (Date.now() < deadline) {
      try {
        const response = await fetch(BASE, { redirect: 'manual' })
        if (response.status < 500) return
      } catch {
        /* not listening yet */
      }
      await new Promise((resolve) => setTimeout(resolve, 400))
    }
    throw new Error('flag-off server did not start')
  }, 420_000)

  afterAll(async () => {
    if (server?.pid) {
      spawn('taskkill', ['/pid', String(server.pid), '/f', '/t'], { stdio: 'ignore' })
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  })

  async function getOff(path: string) {
    const response = await fetch(`${BASE}${path}`, { redirect: 'manual' })
    return { status: response.status, body: (await response.text()).replaceAll('<!-- -->', '') }
  }

  it('serves the Phase 1 homepage with no cinematic layer', async () => {
    const { status, body } = await getOff('/')

    expect(status).toBe(200)
    expect(body).not.toContain('class="ignition"')
    expect(body).not.toContain('sheet-story')
    expect(body).not.toContain('world-women')
    // The Phase 1 fallbacks are what render instead.
    expect(body).toContain('Shop by category')
    expect(body).toContain('thread__stages')
  })

  it('keeps every no-JS product guarantee intact', async () => {
    const { body } = await getOff('/')
    expect(body).toContain('Dark Wash Flare')
    expect(body).toContain('This week&#x27;s sheet')

    const pdp = await getOff('/product/dark-wash-high-rise-flare-jean')
    expect(pdp.status).toBe(200)
    expect(pdp.body).toContain('Dark Wash High Rise Flare Jeans')
    expect(pdp.body).toContain('<table')
    expect(pdp.body).not.toMatch(/\$\s?\d[\d,]*\.\d{2}/)
  })

  it('keeps the wholesale application reachable', async () => {
    const apply = await getOff('/wholesale/apply')
    expect(apply.status).toBe(200)
    expect(apply.body).toContain('name="retailerName"')

    // The credential step still carries the tax-ID field, no JavaScript required.
    const credentials = await getOff('/wholesale/apply?step=2')
    expect(credentials.status).toBe(200)
    expect(credentials.body).toContain('name="salesTaxId"')
  })
})
