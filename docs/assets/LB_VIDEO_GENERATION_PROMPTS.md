# LB — Video Generation Prompts

Prompts for the generated continuation only.

**D-09 was answered on 2026-08-03.** Generated media is approved for the buckle
continuation, abstract textile environments, illuminated thread transitions,
atmospheric plates and non-literal material/lighting sequences — and is **not**
approved for sellable product photography, fictional L&B garments, altered models
or faces, showroom or facility claims, manufacturing claims, or fabric and
construction evidence. Every shot below sits on the approved side by design; that
is why the negative list is as long as it is.

Nothing produced from these prompts renders until it carries
`provenance: 'generated-campaign'`, `ownerApproval: 'approved'`, and the full
generation record required by
[LB_CAMPAIGN_MEDIA_MANIFEST.md](LB_CAMPAIGN_MEDIA_MANIFEST.md) §0 — platform,
model version, date, prompt, negative prompt, source references, commercial-use
licence status, route, section, both derivatives and a fallback still.

**Method is image-to-video, always.** Every shot is conditioned on a Blender frame
we rendered. The generator supplies motion and atmosphere; it never supplies the
artifact's design. The buckle, the monogram and the thread are composited from our
own renders in any frame where they are legible.

---

## 1. Master style block — prepend to every shot

> Cinematic luxury product film, western fashion house. Dark editorial
> atmosphere: deep charcoal-black environment, warm 3200K raking light from the
> left, cool steel rim light from the upper right. Materials at extreme fidelity:
> brushed darkened silver, oxidized copper, hand-tooled chestnut leather, deep
> indigo selvedge denim, bone saddle-stitching, small turquoise cabochons.
> Shallow depth of field, 85–100mm macro lens character, slow deliberate dolly,
> no camera shake, fine film grain, floating dust motes in the key light.
> Restrained, premium, jewellery-film pacing. 24fps.

## 2. Master negative — prepend to every shot

> text, letters, numbers, dates, logos, watermark, signature, people, hands,
> faces, skin, mannequin, cowboy costume, sheriff badge, star shape, circular
> coin, medallion, gun, rifle scope, crosshair, horse, cattle, longhorn, skull,
> vehicle, engine, factory interior, warehouse interior, sewing machine, storefront,
> neon sign, lens flare kitsch, HDR halo, cartoon, plastic render sheen, garment
> on a body, folded clothing, price tag

The negative list is not stylistic. Each entry maps to a specific prohibition:
dates and text to fabricated heritage; people to the no-invented-people rule;
factory and warehouse interiors to the unevidenced manufacturing-location claim;
garments to the no-invented-SKU rule; longhorn, badge, coin and scope to the
rejected-geometry contract.

## 3. Shot prompts

Each is ≤ 5 s, generated separately, conditioned on the named anchor.

**G1 — Thread falls (4.0–5.2 s).** *Anchor: final frame of
`lb-buckle-ignition-desktop.mp4`.*
> A single luminous turquoise fibre of light descends through near-total
> darkness. Soft bloom around the fibre. Faint indigo denim texture and bone
> stitching resolve at the edges of frame as pure abstraction. Slow vertical
> camera follow. Nothing else in frame.

**G2 — Woven field (5.2–6.4 s).** *Anchor: a Blender macro of the denim ground.*
> Extreme macro traverse across woven indigo textile structure — warp, weft, the
> selvedge edge — with one turquoise fibre running horizontally through it,
> catching warm light. Abstract, tactile, no object, no place, no machine.

**G3 — Opening (6.4–7.4 s).** *Anchor pair: G2 last frame → first frame of the
approved photograph.*
> The dark woven field lifts and separates like a curtain of fibre, revealing
> clean bright space beyond. Motion only; the revealed content is supplied.

**G4 — Atmosphere plate (layer, not a shot).**
> Abstract dusk horizon: a single warm band of low light across a dark field,
> fine dust in the air. No landscape features, no buildings, no recognisable
> location. Wide, mostly empty.

*Deliberately unlocatable, so it claims nothing.*

## 4. Rules that override any prompt

1. **Never generate a garment.** Not as hero, not as background, not blurred. A
   generated garment shown on an L&B surface is an invented SKU.
2. **Never generate a person**, including hands, silhouettes and reflections.
3. **Never generate a facility.** No mill, factory, warehouse, workshop or store.
4. **Never generate the monogram or any text.** Composite from our renders.
5. **Never generate a continuation of a real photograph.** Animating an approved
   still with a push is allowed; extending it with invented content is not.
6. **Re-generate rather than retouch** if a forbidden element appears. Do not
   paint it out and keep the take — the model that produced it will produce it
   again elsewhere in the shot.

## 5. Acceptance per generated clip

- [ ] Zero items from the master negative present, checked frame by frame
- [ ] The artifact, where visible, is our render — not the generator's version
- [ ] No frame could be mistaken for a product photograph
- [ ] Licence recorded against D-09, with tool, model version, date and terms
- [ ] Manifest entry written with `provenance: 'generated-campaign'` and
      `ownerApproval: 'pending'` until the owner approves
- [ ] Alt text and captions describe abstraction, never a claim
