/**
 * SILHOUETTE ACCEPTANCE CHECK.
 *
 * Compares the front-orthographic render against the canonical SVG silhouette.
 * The ortho camera frames exactly 1.10× the buckle width, so the buckle must span
 * imageWidth / 1.10 pixels. Acceptance: deviation within ±1% (production brief §1).
 *
 * Outputs renders/previews/silhouette-overlay.png — the render with the canonical
 * silhouette stroked in rust over it — and prints the measured deviation.
 *
 * Run from the repo root AFTER the Blender proofs exist:
 *     node assets/production/buckle/scripts/silhouette_check.mjs
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = dirname(HERE)
const ORTHO = join(ROOT, 'renders', 'previews', 'buckle-front-ortho.png')
const OVERLAY_OUT = join(ROOT, 'renders', 'previews', 'silhouette-overlay.png')
const CANON = JSON.parse(readFileSync(join(ROOT, 'source', 'canonical-paths.json'), 'utf8'))

const MARGIN = 1.1 // must match cam_front_ortho ortho_scale = width × 1.10

const image = sharp(ORTHO)
const meta = await image.metadata()
const { data, info } = await image
  .raw()
  .toBuffer({ resolveWithObject: true })

const W = info.width
const H = info.height
const CH = info.channels

// Background = the denim ground; sample the four corners.
function px(x, y) {
  const i = (y * W + x) * CH
  return [data[i], data[i + 1], data[i + 2]]
}
const corners = [px(4, 4), px(W - 5, 4), px(4, H - 5), px(W - 5, H - 5)]
const bg = corners
  .reduce((a, c) => [a[0] + c[0], a[1] + c[1], a[2] + c[2]], [0, 0, 0])
  .map((v) => v / 4)

const THRESH = 42
let minX = W
let maxX = -1
let minY = H
let maxY = -1
for (let y = 0; y < H; y += 1) {
  for (let x = 0; x < W; x += 1) {
    const [r, g, b] = px(x, y)
    const dist = Math.hypot(r - bg[0], g - bg[1], b - bg[2])
    if (dist > THRESH) {
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
}

if (maxX < 0) {
  console.error('No buckle pixels detected — render missing or background threshold wrong.')
  process.exit(1)
}

const measuredW = maxX - minX + 1
const measuredH = maxY - minY + 1
const expectedW = W / MARGIN
const deviation = (measuredW - expectedW) / expectedW
const aspect = measuredW / measuredH
const expectedAspect =
  CANON.referenceScale.buckleWidthUnits /
  (CANON.paths ? 180 : 180) /* silhouette spans 180 units tall */

// Canonical silhouette, stroked, scaled to the expected pixel box, centred.
const unitsW = 296
const unitsH = 180
const scalePx = expectedW / unitsW
const offX = (W - unitsW * scalePx) / 2 - 12 * scalePx // path x starts at 12
const offY = (H - unitsH * scalePx) / 2 - 30 * scalePx // path y starts at 30
const overlaySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <g transform="translate(${offX} ${offY}) scale(${scalePx})">
    <path d="${CANON.paths.silhouette.d}" fill="none" stroke="#8b3a3a" stroke-width="${2 / scalePx}"/>
  </g>
</svg>`

await sharp(ORTHO)
  .composite([{ input: Buffer.from(overlaySvg) }])
  .png()
  .toFile(OVERLAY_OUT)

console.log('--- SILHOUETTE CHECK ---')
console.log(`render:            ${meta.width}x${meta.height}`)
console.log(`buckle bbox:       ${measuredW}x${measuredH}px  (x ${minX}..${maxX}, y ${minY}..${maxY})`)
console.log(`expected width:    ${expectedW.toFixed(1)}px (ortho frames width x ${MARGIN})`)
console.log(`width deviation:   ${(deviation * 100).toFixed(2)}%  (accept: within ±1%)`)
console.log(`aspect measured:   ${aspect.toFixed(3)}  canonical: ${(unitsW / unitsH).toFixed(3)}`)
console.log(`overlay written:   ${OVERLAY_OUT}`)
console.log(Math.abs(deviation) <= 0.01 ? 'RESULT: PASS' : 'RESULT: FAIL — do not proceed to final renders')
process.exit(Math.abs(deviation) <= 0.01 ? 0 : 2)
