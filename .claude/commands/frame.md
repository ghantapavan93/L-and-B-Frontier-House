---
description: Port a Stitch v3 frame into production Next.js + Tailwind + Framer Motion
argument-hint: <frame number or slug> [target path]
---

# Port Stitch frame → production component

Frame requested: **$1**
Target path (optional, default `app/(site)/`): **$2**

## Source of truth

Design system (already loaded below — do not re-read it):

@stitch-export/v3-production/stitch_l_b_frontier_house_platform_synthesis/design.md

@stitch-export/v3-production/stitch_l_b_frontier_house_platform_synthesis/engineering_export_package.md

## Steps

1. **Resolve the frame.** Glob
   `stitch-export/v3-production/stitch_l_b_frontier_house_platform_synthesis/v3_frame_$1_*/`.
   If `$1` is a word rather than a number, match it against the directory slugs.
   If nothing matches or more than one matches, list every available frame
   directory and stop — do not guess which one was meant.

2. **Read both artifacts.** `code.html` is the structure; `screen.png` is the
   visual truth. Read the PNG too — the Stitch HTML routinely loses spacing,
   layering, and material treatment that the render shows. Where they disagree,
   the PNG wins.

3. **Throw away the Stitch token layer.** Every export ships a Material-3
   palette (`surface-container-low`, `on-primary-fixed`, …) and a `class="light"`
   root. None of it is ours. Remap to the Modern Frontier V3 tokens above:

   | Stitch role | Frontier token | Hex |
   | :--- | :--- | :--- |
   | background / surface | Ink Black | `#0A0A0A` |
   | on-surface / on-background | Bone White | `#F5F2EE` |
   | primary accent | Tobacco Leather | `#734F36` |
   | secondary surface | Sandstone | `#D9C5B2` |
   | material context | Dark Denim Indigo | `#1B2B45` |
   | outline / hardware | Oxidized Silver | `#A7A6A2` |
   | error / destructive CTA | Rust Red | `#7E241F` |

   Fonts: Playfair Display for display and headline, Inter for UI and body.
   Ignore Hanken Grotesk and Material Symbols from the export.

4. **Emit real code**, not a transcription of the HTML:
   - Next.js App Router, TypeScript, function components, no `any`.
   - Tailwind utilities only. Reference tokens by their theme names — extend
     `tailwind.config.ts` if a token is not yet defined rather than inlining a hex.
   - Extract anything in the design system's Component Inventory
     (`CinematicHero`, `ExperienceSelector`, `LivingContactSheet`, `GarmentPortal`,
     `ProductAnatomy`, `CustomAtelier`) into `components/`, reusing an existing
     implementation if one is already there. The frame's page file composes them.
   - Server components by default. `"use client"` only on components that need
     motion, WebGL, or event handlers.
   - Framer Motion for transitions, React Three Fiber for anything the export
     drives with raw three.js or a shader.

5. **Honour the motion spec.** Eruption is 800ms on
   `cubic-bezier(0.16, 1, 0.3, 1)`, triggered on scroll or enter. Time Tunnel
   scales the outgoing scene down while the incoming scene enters at `z+10`.
   Under `prefers-reduced-motion`, every transition collapses to a 400ms opacity
   crossfade and WebGL plus scrubbed video are disabled — wire the listener,
   do not leave it as a TODO.

6. **Honour the accessibility contract.** AA contrast for Bone White on Ink
   Black, and a `2px solid` Oxidized Silver focus ring on every keyboard-
   reachable element. Check the Interaction Matrix for this frame's desktop,
   mobile, and Instant Shop fallback behaviour and implement all three.

7. **Stub assets, never invent them.** Anything in the Asset Manifest that is
   not on disk gets a typed placeholder and a line in the report — do not
   reference a file path that does not exist.

## Report

Close with, in this order:

- Files created or modified.
- Where you deviated from `code.html` and why.
- Assets still missing.
- Which Interaction Matrix rows are implemented versus stubbed.

Keep the prose tight. No preamble.
