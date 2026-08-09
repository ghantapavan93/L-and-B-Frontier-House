'use client'

/**
 * AISLE DEPTH — the Warehouse scroller with a sprung camera.
 *
 * The aisle stays a REAL horizontal scroller: trackpads pan it, touch swipes it, the
 * scrollbar is honest, fragment links walk it. Nothing about §9 changes — the wheel is
 * never intercepted. What this island adds is a READ: native scroll progress, smoothed
 * through a spring, published as `--aisle-drift` (0…1). The stylesheet spends it on a
 * drifting perspective origin and counter-shifting rack signs — the dolly feeling of
 * walking past racks, not just sliding them.
 *
 * Server children pass straight through; without JavaScript the var is absent, calc()
 * zeroes out, and the aisle is the same complete scroller it was before this island
 * existed. Reduced motion pins the camera: progress still tracks (state, not decoration),
 * but unsprung, so nothing overshoots.
 */

import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion'
import { useRef } from 'react'
import type { ReactNode } from 'react'

export function AisleDepth({ children }: { children: ReactNode }) {
  const scroller = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollXProgress } = useScroll({ container: scroller })
  const sprung = useSpring(scrollXProgress, { stiffness: 90, damping: 26, mass: 0.6 })
  const drift = reduced ? scrollXProgress : sprung

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        ref={scroller}
        className="warehouse__aisle"
        role="region"
        aria-label="The racks"
        tabIndex={0}
        style={{ '--aisle-drift': drift } as Record<string, unknown>}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
