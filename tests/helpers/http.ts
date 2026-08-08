import { createHmac } from 'node:crypto'
import { BASE_URL, TEST_SESSION_SECRET } from '../setup/server'

/** Every public route the crawl assertion sweeps. */
export const PUBLIC_ROUTES: readonly string[] = [
  '/',
  '/new-arrivals',
  '/wholesale',
  '/wholesale/apply',
  '/sign-in',
  '/shop/women',
  '/shop/girls',
  '/shop/accessories',
  '/mens',
  '/find-your-denim',
  '/warehouse',
  '/edit/working-west',
  '/edit/modern-west',
  '/edit/rodeo-edit',
  '/edit/after-dark',
  '/size-and-fit/women',
  '/size-and-fit/girls',
  '/size-and-fit/accessories',
  '/product/dark-wash-high-rise-flare-jean',
  '/product/dark-wash-bootcut-jean',
  '/product/black-one-shoulder-fringe-mini-dress',
  '/product/black-wash-wide-leg-jean',
  '/product/leopard-print-tie-waist-flare',
  '/product/ranch-ruffle-hem-denim-short',
  '/product/yee-haw-motif-short-sleeve-tee',
  '/product/tooled-leather-concho-belt',
  '/product/silver-horseshoe-drop-earrings',
  '/search',
  '/search?q=denim',
  '/fit-passport',
  '/wholesale/apply/received',
  '/robots.txt',
  '/sitemap.xml',
]

export const TRADE_ROUTES: readonly string[] = [
  '/trade',
  '/trade/order',
  '/trade/orders',
  '/trade/assortment',
  '/trade/product/dark-wash-high-rise-flare-jean',
]

export type Fetched = {
  readonly status: number
  readonly headers: Headers
  /**
   * The response with React's empty text-node separators removed.
   *
   * React emits `<!-- -->` between adjacent text and expression children, so
   * `Units per prepack ({n} total)` reaches the wire as
   * `Units per prepack (<!-- -->6<!-- --> total)`. The separators are invisible to users and
   * to assistive technology.
   *
   * Normalising before asserting matters for the leak tests specifically: a price emitted as
   * two adjacent children would reach the wire split by a separator, and a regex scanning
   * raw bytes would miss it. Scanning the normalised form closes that gap.
   */
  readonly body: string
  /** Exact response bytes, for the rare assertion that needs them. */
  readonly raw: string
  readonly url: string
}

export async function get(path: string, init: RequestInit = {}): Promise<Fetched> {
  const response = await fetch(`${BASE_URL}${path}`, { redirect: 'manual', ...init })
  const raw = await response.text()

  return {
    status: response.status,
    headers: response.headers,
    body: raw.replaceAll('<!-- -->', ''),
    raw,
    url: path,
  }
}

/**
 * Mints a session cookie using the same wire format the server verifies.
 *
 * This deliberately does NOT go through a test-only login endpoint: an auth bypass route
 * that exists in the app is a real vulnerability regardless of who it was written for. The
 * duplication here is the point — if the token format changes, these tests fail loudly.
 */
export function buyerCookie(buyerId: string, expiresAt = Date.now() + 60_000): string {
  const body = Buffer.from(JSON.stringify({ buyerId, expiresAt })).toString('base64url')
  const signature = createHmac('sha256', TEST_SESSION_SECRET).update(body).digest('base64url')
  return `lb_session=${body}.${signature}`
}

export function asBuyer(buyerId: string): RequestInit {
  return { headers: { cookie: buyerCookie(buyerId) } }
}

/**
 * Every stylesheet the page loads, concatenated.
 *
 * Next splits CSS into chunks on its own schedule, and how many it emits is a function of
 * total size — nothing the application controls. Tests used to read
 * `body.match(/href="(…\.css)"/)` and assert against the FIRST match, which silently meant
 * "assert against whichever chunk happens to be first". Growing `globals.css` past a
 * threshold split one file into two, the token chunk sorted first, and two unrelated
 * assertions failed while the rules they check were present the whole time.
 *
 * The property those tests actually want is "somewhere in the CSS this page loads", so that
 * is what this returns.
 */
export async function stylesheetsFor(path: string): Promise<string> {
  const { body } = await get(path)
  const hrefs = [...body.matchAll(/href="(\/_next\/static\/css\/[^"]+\.css)"/g)].map(
    (m) => m[1],
  )
  if (hrefs.length === 0) throw new Error(`no stylesheet linked from ${path}`)

  const sheets = await Promise.all(hrefs.map((href) => get(href as string)))
  return sheets.map((sheet) => sheet.body).join('\n')
}

/** Every URL emitted anywhere in a response body — hrefs, actions, sitemap entries. */
export function extractUrls(body: string): string[] {
  const urls: string[] = []
  for (const match of body.matchAll(/(?:href|src|action)="([^"]+)"/g)) {
    if (match[1]) urls.push(match[1])
  }
  for (const match of body.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    if (match[1]) urls.push(match[1])
  }
  return urls
}
