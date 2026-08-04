import { spawn, spawnSync } from 'node:child_process'
import type { ChildProcess } from 'node:child_process'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { get } from '../helpers/http'

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
  it('opens with the ignition and its three poster-first actions', async () => {
    const { body } = await get('/')

    expect(body).toContain('class="ignition"')
    expect(body).toContain('Enter the frontier')
    expect(body).toContain('Skip to shop')
    expect(body).toContain('Wholesale access')
    // The skip target exists on the same page.
    expect(body).toContain('id="sheet"')
    expect(body).toContain('href="#sheet"')
    expect(body).toContain('id="hero"')
  })

  it('draws the buckle proof as the 8B/8C form — and never the coin', async () => {
    const { body } = await get('/')

    expect(body).toContain('ignition__buckle')
    // Engraved initials and restrained turquoise are present…
    expect(body).toContain('scalloped rectangular western belt buckle')
    // …and the dead fabrications stay dead.
    expect(body).not.toMatch(/EST\.?\s*1865/i)
    expect(body).not.toMatch(/1870s/i)
  })

  it('runs the ignition draw once, well under the pause-control threshold', async () => {
    const { body } = await get('/')
    const cssHref = body.match(/href="(\/_next\/static\/css\/[^"]+\.css)"/)?.[1]
    const { body: css } = await get(cssHref as string)

    // WCAG 2.2.2 binds auto-motion that lasts over five seconds or loops. The draw is a
    // one-shot ≤2.8s inside a no-preference media query, so no pause control is owed.
    expect(css).toContain('ignition-draw')
    expect(css).not.toMatch(/ignition-draw[^;}]*infinite/)
    const durations = [...css.matchAll(/ignition-draw\s+([\d.]+)s/g)].map((m) =>
      Number.parseFloat(m[1] ?? '0'),
    )
    expect(durations.length).toBeGreaterThan(0)
    for (const d of durations) expect(d).toBeLessThanOrEqual(3)
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
      'world-women',
      'world-girls',
      'world-accessories',
      'world-wholesale',
    ]) {
      expect(body).toContain(`id="${world}"`)
      expect(body).toContain(`href="#${world}"`)
    }
    // The exported Frame 5 gates on menswear; it must never surface.
    expect(body).not.toMatch(/world-men|for him/i)
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
   * behaviour — so the test now proves each of those rather than being deleted.
   */
  it('ships the ignition film only with its poster, captions, transcript and controls', async () => {
    const { body } = await get('/')

    expect(body, 'the film is missing').toContain(
      '/media/buckle/lb-buckle-ignition-desktop.mp4',
    )
    expect(body, 'no mobile encoding').toContain('/media/buckle/lb-buckle-ignition-mobile.mp4')
    expect(body, 'no poster — the slot must be complete without the film').toContain(
      '/media/buckle/lb-buckle-poster-desktop.webp',
    )
    expect(body, 'no captions track').toContain('/media/buckle/lb-buckle-ignition.vtt')
    expect(body, 'no transcript route').toContain('/transcript/buckle-ignition')
    expect(body, 'no pause affordance').toContain('controls')

    // Four seconds, played once, started by the user: under the WCAG 2.2.2 threshold
    // and never pushed at someone who asked for no motion.
    expect(body, 'autoplays unrequested motion').not.toContain('autoplay')
    expect(body, 'loops past the five-second threshold').not.toMatch(/<video[^>]*\sloop/)
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
    expect(apply.body).toContain('name="salesTaxId"')
  })
})
