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

Thirteen sites measured. Every one the owner named, except SSENSE (behind a Cloudflare
challenge) and the two gallery sites, which index other people's work rather than being
work themselves.

| Site | Motion library | Body | `h1` | `h2` | Page height | `<video>` | canvas |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Sézane** | **none** | 13px serif | **30px** | 20px | — | 1 block, 1426px | 0 |
| **Burberry** | **none** | 16px serif | **20px** | 20px | **11,424px** | 1 | 0 |
| **Gucci** | jQuery | 16px | **absent** | **14px** | 6,353px | 3 | 0 |
| **Prada** | Swiper, jQuery | 16px | **absent** | 20px | 5,109px | 1 | 0 |
| **GANNI** | jQuery | 16px | **absent** | 27px | — | 0 | 0 |
| **G-Star** | **none** | **13px** | 0px (hidden) | 40px | 4,515px | 0 | **0** |
| **Double D Ranch** | jQuery | 16px | **37px** | 25px | **6,871px** | **19** | 0 |
| **Tecovas** | jQuery | 16px | 42px | 42px | — | 1 | 0 |
| **Kimes Ranch** | **none** | 16px | **16px** | 19px | — | 3 | 0 |
| **Cavender's** | **none** | 16px | 30px | 22px | — | 0 | 0 |
| **Sterling Kreek** | jQuery | 18px | 30px | — | 2,769px | 0 | 0 |
| **Miss Me** | Swiper, jQuery | 16px | **absent** | 21px | 5,967px | 5 | 0 |
| **Grace in LA** | Swiper | 16px | 13px | 58px | 4,548px | 2 | 0 |
| **Myntra** | **none** | 16px | **14px** | — | 6,153px | 0 | 0 |
| **Burberry × SSENSE** | **none** | — | — | — | — | 1 | **0** |

**Not one of the fifteen runs GSAP, three.js, Lenis or PIXI.** Not Gucci, not Prada, not
Burberry. The heaviest thing any of them loads is Swiper for a carousel. Sézane — the closest
match to L&B's actual price point — ships 92 CSS transitions, 239 transforms and no motion
library at all. **Zero canvas elements across every site measured.**

**And the type is small everywhere.** Four of the fifteen have no `h1` on the homepage at
all. Gucci's `h2` is 14px. Burberry's `h1` is 20px. Kimes Ranch's is 16px — the same size as
its body copy. The largest `h1` in the entire set is Tecovas at 42px, still well under what
this project shipped.

**The pages are long.** Burberry's homepage is **11,424px**. Double D Ranch's is 6,871px,
Gucci 6,353px, Myntra 6,153px, Miss Me 5,967px. These are editorial scrolls, not screens.

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

## 2a. Inner pages — where the shop mechanisms actually live

The homepage shows art direction. The category and product pages show how the shop *works*,
and they are where the differences from this build are largest.

**Sézane, category listing**

| Property | Sézane | This build |
| :--- | :--- | :--- |
| Page height | **48,199px** | ~4,000px |
| Products on one page | **953** | 18, paginated |
| Column width | **244px** | ~320px |
| Product image | **767 × 1282** — ratio **0.60** | 360 × 540 — ratio 0.67 |

Two mechanisms here. Their product image is **3:5, not 4:5** — appreciably taller and
narrower than ours, which is what lets a 244px column still read as a full-length garment
shot. And they do not paginate: 953 products on one continuous scroll, so browsing never
hits a wall and never costs a page load.

Our grid went the other way in `98b55c1` — wider columns, fewer per row. Wider columns make
a 360px source look worse, not better.

**Sézane, product page**

| Property | Value |
| :--- | :--- |
| Product name (`h1`) | **25px** |
| Price | **20px** |
| Gallery images | **40** |
| Collapsible sections | **4** |
| Page height | 2,782px |
| Video | 0 |

The product name is 25px. On the page where the garment is the entire subject, the type is
smaller than this project's *body* copy in places. Forty images and four accordions carry
the page; the type gets out of the way.

Four accordions is the mechanism worth taking: specification, care, sizing and delivery
collapsed by default rather than stacked as a flat list. Our PDP renders one open definition
list, which is honest but long, and pushes the fit table below the fold.

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
