# LB — 18–20 Second Brand Film

The optional, **click-to-play** long form. Because it is user-initiated it owes no
autoplay obligations — but it still ships with a poster, a captions track and a
transcript route.

This film is not a longer hero. The hero is an *entry*; this is an *argument* —
the case that Lucky & Blessed makes the clothes, and that a boutique buyer is a
partner rather than a customer.

---

## 1. Beat sheet — 19.0 s

| # | Beat | Time | Source | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Ignition** | 0.0 – 4.0 | Blender buckle master | **Delivered** |
| 2 | **Thread and textile** | 4.0 – 7.0 | Generated, abstract only | D-09 |
| 3 | **Living Contact Sheet** | 7.0 – 10.0 | Owner photography, animated as a sheet | Owner supply |
| 4 | **Product worlds** | 10.0 – 13.5 | Owner photography per verified category | Owner supply + D-04 |
| 5 | **Boutique and partnership** | 13.5 – 16.5 | Owner photography | **Does not exist** |
| 6 | **Resolve** | 16.5 – 19.0 | Buckle macro, thread settling | Blender, producible now |

## 2. What each beat may and may not say

**Beat 3 — Living Contact Sheet.** Real frames from the approved manifest,
arranged as a contact sheet and animated by selection rather than by camera. It
claims only "these are our clothes," which is true and evidenced.

**Beat 4 — Product worlds.** Only categories that are **verified**: Women, Plus,
Girls, Accessories & Home, Wholesale. Menswear does not exist and must not appear
(D-03). Plus must not be visually subordinated to Women — it already has full
parity in the corpus and the open question is structural, not one of prominence
(D-04, OQ-08).

**Beat 5 — Boutique and partnership.** This beat carries the brand's own verified
voice: *"We are partners in your success."* It needs a real boutique interior or a
real market-booth frame. **No such photograph exists in the manifest**, and a
generated interior presented as a partner store would be a fabricated
relationship. Until owner supply arrives, beat 5 is cut and the film runs ~16 s.

**Beat 6 — Resolve.** Macro of the buckle, thread settling, then black. Producible
today from the existing Blender master using the `cam_macro` framing.

## 3. Claims ledger

Every second of this film must trace to one of five permitted sources. Anything
else does not ship.

| Claim on screen | Permitted because |
| :--- | :--- |
| The garments | Owner-supplied, `ownerApproval: 'approved'` |
| "Texas-based manufacturer and designer" | VERIFIED FACT, `00_BRAND_TRUTH.md` |
| "Sells only to approved retailers" | VERIFIED FACT — their own FAQ |
| Operational metrics (100% fill rate, 2.64-day processing) | VERIFIED — never rounded up |
| The buckle artifact | An object we designed and rendered |

**Explicitly barred:** founding dates of any kind, "EST. 1865", 1870s language,
"Made in Texas" (not evidenced, OQ-04), named mills or tanneries (contradicts
verified vertical integration), invented people, invented reviews, menswear,
footwear, and the $45–$1,250 fixture prices.

## 4. Delivery

```
public/media/brand-film/
  lb-brand-film.{mp4,webm}          1920x1080, 24 fps, ~16-19 s
  lb-brand-film-mobile.{mp4,webm}   1080x1920
  lb-brand-film-poster.webp         {828,1280,1920}
  lb-brand-film.vtt
```

Click-to-play only: poster plus a real `<button>`, never a bare `<video controls>`
autoplaying. Placement is a new editorial band below the contact sheet on the
homepage, and the wholesale hero. It never gates a commerce action and never
enters checkout.

## 5. Gate

Beats 3, 4 and 5 are blocked on owner photography at editorial resolution — the
27 approved catalogue shots are **360 × 540** and flagged `needsHigherResolution`
on 18 of 31 assets. No render fixes that; it is a re-shoot. Beat 2 is blocked on
D-09. **Beats 1 and 6 are producible today.**
