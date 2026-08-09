'use client'

/**
 * DEPTH FIELD — pointer-tracked spring parallax, as a wrapper above server truth.
 *
 * The first Framer Motion island, and the pattern every later one must follow:
 *
 *   - The CHILDREN are server-rendered HTML passed straight through. The island adds two
 *     CSS custom properties (`--depth-x`, `--depth-y`, unitless -1…1) that stylesheet
 *     rules translate into small per-layer shifts. Remove the island — or load without
 *     JavaScript — and the vars are simply absent, `calc()` resolves to zero, and the
 *     section is its complete static self. Content never rides the motion layer.
 *   - Springs are the one thing the CSS platform cannot do on pointer input; that is the
 *     entire justification for the dependency (docs: the motion-stack rule).
 *   - `useReducedMotion` zeroes the field: no drift for anyone who asked for stillness.
 *   - Nothing is intercepted — pointer positions are read, never claimed.
 */

import { LazyMotion, domAnimation, m, useReducedMotion, useSpring } from 'framer-motion'
import type { PointerEvent, ReactNode } from 'react'

const SPRING = { stiffness: 110, damping: 22, mass: 0.4 }

export function DepthField({
  children,
  className,
  ariaLabelledby,
}: {
  children: ReactNode
  className?: string
  ariaLabelledby?: string
}) {
  const reduced = useReducedMotion()
  const x = useSpring(0, SPRING)
  const y = useSpring(0, SPRING)

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduced) return
    const box = event.currentTarget.getBoundingClientRect()
    x.set(((event.clientX - box.left) / box.width) * 2 - 1)
    y.set(((event.clientY - box.top) / box.height) * 2 - 1)
  }

  function onPointerLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        {...(className ? { className } : {})}
        {...(ariaLabelledby ? { 'aria-labelledby': ariaLabelledby } : {})}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ '--depth-x': x, '--depth-y': y } as Record<string, unknown>}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
