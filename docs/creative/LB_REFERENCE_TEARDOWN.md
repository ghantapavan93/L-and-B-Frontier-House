# LB — Reference Teardown

**Measured, not admired.** Every number below came from running JavaScript against the live
site in a browser on 2026-08-05, reading computed styles and probing for motion libraries —
not from looking at screenshots and guessing.

Method: `getComputedStyle` on `body`, `h1`, `h2`; `window.gsap / THREE / Lenis / Swiper /
jQuery` presence; `naturalWidth × naturalHeight` on sampled images; a count of `<video>`
elements; and a scan of all reachable CSS rules for `transition:`, `transform:`,
`animation-timeline` and `clip-path`.

Nothing here is copied. These are **mechanisms** — how a page is composed and what it costs
— which is the one thing about a competitor that is legitimately learnable.

---

## 1. The finding that overturns our last two passes

| Site | Motion library | Body | `h1` | `h2` | Ground | `<video>` |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Sézane** | **none** | Libre Baskerville **13px** | **30px** | 20px | `#fffcf8` | 1 block, 1426px tall |
| **Double D Ranch** | jQuery only | Source Sans Pro 16px | **37px** | 25px | `#eeeee6` | **19** |
| **GANNI** | jQuery only | Helvetica Neue 16px | **none** | 27px | transparent | 0 (lazy) |

Three sites the owner named as the standard. **Not one runs GSAP, three.js or a smooth-scroll
library.** Sézane, the closest match to L&B's actual price point, ships 92 CSS transitions and
239 transforms and no motion library at all.

**And every one of them sets type SMALL.** Sézane's `h1` is 30px on 13px serif body copy.
GANNI's homepage has no `h1` whatsoever. Double D Ranch's is 37px, and it is a *sentence* —
"A tale as old as Texas." — not a category label.

This directly contradicts the two passes before this document, which raised `h1` to 72px and
`h2` to 56px on the reasoning that the Stitch frames set headings at display scale. That
reasoning was right about the Stitch *renders* and wrong about the *real sites those renders
were imitating*. A generated mockup makes type large because type is the cheapest thing a
generator can make impressive. A working fashion house makes type small because **the
photograph is doing the work** and the type must not compete with it.

### What actually produces the premium feel

1. **Media density, not type scale.** Double D Ranch — a western house at roughly L&B's
   market position — puts **nineteen video elements on one homepage**. Not one hero film:
   many short clips, each carrying a garment in motion. Sézane runs a single video block
   1426px tall. Both spend their page budget on moving imagery and almost nothing on
   typographic scale.
2. **Portrait product imagery, consistently.** 500×750, 616×822, 617×771 — every sampled
   product image is between 2:3 and 4:5, portrait, and large. Our catalogue is 360×540, the
   right *shape* at half the *size*.
3. **Warm off-white grounds.** `#fffcf8` and `#eeeee6`. Our `--surface-page` is already in
   this family, which is the one thing we had right from the start.
4. **Serif set at body size.** Sézane runs Libre Baskerville at 13px for body copy — serif
   as the reading face, not just the display face. It is a strong editorial signal and costs
   nothing.

---

## 2. What this means for the build

**Reverse the type scale.** `h1` back toward 36–44px, `h2` toward 24–28px. The scale raised
in `98b55c1` and `039eca7` was calibrated against generated mockups rather than against
working shops, and the evidence says it is wrong. Section rhythm and whitespace stay —
those the references do share.

**Spend the budget on moving imagery instead.** This is where the "immersive" ask and the
performance budget actually agree: nineteen short clips of garments in motion is a far
stronger signal than one 10-second film plus large headings, and short muted loops are
cheaper per byte than a single long film. It is also the honest answer to a 360×540
catalogue — motion distracts from resolution in a way that stillness cannot.

**Framer Motion is justified, WebGL is not.** None of the three references runs a 3D
library. Scroll-linked reveals, staggered entrances and shared-element transitions between
grid and product page are all achievable in ~40 KB and survive the 180 KB budget; three.js
starts at ~132 KB gzip before an asset loads. The references are evidence for restraint,
not against motion.

---

## 3. The immersive reference, measured

**Burberry × SSENSE *Imaginary Cities*** — the most-cited "blow their mind" example in the
brief. Measured:

| Property | Value |
| :--- | :--- |
| Host | `burberry.ssense.com` — a **separate subdomain**, not the store |
| Cart | **none** |
| Checkout | **none** |
| `<canvas>` elements | **0** |
| GSAP / three.js / Lenis / PIXI | **none** |
| `<video>` | 1 |
| Links back to store | `?utm_medium=**microsite**&utm_campaign=imaginary-cities` |

Two things fall out of this, and both are decisive.

**SSENSE calls it a microsite in their own tracking parameters.** The campaign lives on a
separate host with no cart and no checkout, and every link out of it goes back to the shop.
This is exactly the split §11 already requires — *cinema belongs to discovery, never to
checkout* — arrived at independently by the reference the brief holds up as the standard.

**It contains no WebGL.** Zero canvas elements, no 3D library, no scroll-hijacking library.
The single most admired immersive fashion experience in the reference set is a video and CSS.
Whatever it is that reads as "one of a kind" on that site, it is not the technology — it is
art direction, pacing and photography.

That is good news for this project, because art direction, pacing and photography are exactly
what the budget allows and what a 180 KB JavaScript ceiling does not threaten.

## 4. Still to tear down

Burberry, SSENSE, Gucci, Prada, Tecovas, Kimes Ranch, Cavender's, Miss Me, Grace in LA,
Sterling Kreek, Cowgirl Tuff, Myntra, AJIO, The Souled Store, and the immersive set
(Burberry × SSENSE *Imaginary Cities*, G-Star *Clouds of Denim*, Lusion *Infinite
Passerella*).

The immersive three matter most for the "blow their mind" brief, and the prediction worth
testing is that all three are **campaign microsites separate from the store** — which is the
pattern §11 already encodes as "cinema belongs to discovery, never to checkout".
