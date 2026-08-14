import type { Metadata, Viewport } from 'next'
import { Fraunces, IBM_Plex_Mono, Inter } from 'next/font/google'
import './globals.css'

/**
 * THE HOUSE VOICES — three, each with one job.
 *
 * Display is FRAUNCES, a variable serif with real optical sizing: at caption sizes it is
 * sturdy and quiet, at display sizes the contrast opens and it turns editorial — one file
 * behaving like a family. It replaces Libre Caslon Text (the Stitch theme's placeholder
 * face), owner-directed 2026-08-13; the committed-typeface decision D-07 remains open and
 * this is the working direction offered for it. Inter keeps the working text. IBM Plex
 * Mono is new: the TECHNICAL voice — eyebrows, spec terms, style codes, counts — the
 * line-sheet register every trade reference carries and no consumer site does.
 *
 * `next/font` downloads them at build time and serves them from this origin: no CDN, no
 * runtime request to a third party, and no layout shift because the metrics are known.
 * All three are OFL, keeping the "zero licensed font files" blocker clear
 * (docs/production/14).
 */
const display = Fraunces({
  subsets: ['latin'],
  /* Variable weight + the optical-size axis — the whole reason to choose Fraunces. */
  axes: ['opsz'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display-loaded',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono-loaded',
})

const ui = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ui-loaded',
})

export const metadata: Metadata = {
  title: {
    default: 'Lucky & Blessed — Western apparel for approved retailers',
    template: '%s · Lucky & Blessed',
  },
  description:
    'Lucky & Blessed is a Texas-based manufacturer and designer of western apparel, selling ' +
    'to approved retailers.',
  // No price appears in any title or description. Restricted values never reach metadata.
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  /*
    The design is a single deliberate light theme (bone ground, ink type, dark bands as
    art direction). Without a declared scheme, browsers with forced/auto dark mode
    (Chrome's Auto Dark on Android, Edge's force-dark, dark-reader extensions) invert the
    whole site algorithmically — black ground, guessed font colors, mangled imagery
    edges. Declaring the scheme is the documented opt-out; the CSS root pairs it with
    `color-scheme: only light`.
  */
  colorScheme: 'light',
}

/*
  EXPERIENCE STATES ARE NOT RESOLVED HERE, AND THE REASON IS MEASURED.

  Reading the experience cookie in a layout forces every route to render per request. That
  was implemented, built and tested in this pass, and it cost two guarantees that are worth
  more than the feature:

    1. The designed 404 stopped being server-rendered. With dynamic routing, `notFound()`
       streams its boundary as RSC payload and the body is empty without JavaScript — the
       exact defect fixed as D-2 in the browser pass.
    2. Public product, category and size-and-fit routes lost static prerendering and began
       responding `private, no-cache, no-store`.

  The selector, the cookie action and the three CSS presentation states are all built and
  covered by styles; what is missing is a way to apply the attribute per visitor without
  per-request rendering. That needs either a small client script or Partial Prerendering, and
  both are decisions for the next pass rather than something to slip in here.
*/

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-experience="balanced"
      className={`${display.variable} ${ui.variable} ${mono.variable}`}
    >
      <body>
        {/* First focusable element in the DOM. */}
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
