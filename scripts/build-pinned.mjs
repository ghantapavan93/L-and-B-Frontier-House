/**
 * `next build` with the programming clock pinned.
 *
 * The public pages prerender their programming — promo bar, market line, drop line —
 * against the build date. Left to the wall clock, the visual baselines record whatever
 * the calendar says on the day they are re-recorded and expire when a window closes
 * (src/content/programming.ts, `renderDate`). The test pipelines build through this
 * script so the suites always see the same day.
 *
 * The pinned date sits between the two 2026 markets on purpose: no market window is
 * open, the drop line is the steady-state message, and the baseline stays true for the
 * longest possible stretch. Move it deliberately, re-record deliberately.
 */
import { spawnSync } from 'node:child_process'

export const PINNED_RENDER_DATE = '2026-09-11'

const result = spawnSync('npx', ['next', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, LB_RENDER_DATE: process.env.LB_RENDER_DATE ?? PINNED_RENDER_DATE },
})
process.exit(result.status ?? 1)
