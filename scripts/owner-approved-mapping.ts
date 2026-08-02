/**
 * OWNER-APPROVED ASSET MAPPING.
 *
 * Every original under `assets/source/owner-approved/` is listed here exactly once, with a
 * human-verified decision about what it shows and where it belongs.
 *
 * THIS FILE IS THE "DO NOT GUESS" RECORD. Each `describes` string was written after looking
 * at the image. Nothing is inferred from a filename alone, and nothing is inferred from a
 * source URL — the live site encodes wholesale cost into its product slugs, so a mapping
 * derived from a URL would import that leak.
 *
 * Style codes (DR/JE/TO/JO/KD + number + colour) are Lucky & Blessed's own filenames and are
 * recorded as-is. They are NOT expanded into claims about fabric, construction or origin:
 * only what is visible in the photograph is described.
 */

export type Placement =
  /** Primary photograph for a catalogue product. */
  | { kind: 'product'; productId: string; order: number }
  /** Editorial or category imagery for a named slot. */
  | { kind: 'editorial'; slot: string }
  /** Approved by the owner, but deliberately not published. Reason required. */
  | { kind: 'withheld'; reason: string }

export type ApprovedAsset = {
  /** Filename under assets/source/owner-approved/. */
  readonly original: string
  /** Clean local basename. Never derived from a price-bearing URL or slug. */
  readonly slug: string
  /** What the photograph actually shows, written from the image. */
  readonly describes: string
  /** Lucky & Blessed style code as it appears in their own filename, when present. */
  readonly styleCode: string | null
  readonly placement: Placement
}

export const APPROVED_ASSETS: readonly ApprovedAsset[] = [
  /* ── Jeans ───────────────────────────────────────────────────────────── */
  {
    original: 'JE334-DW__1_360x.webp',
    slug: 'dark-wash-flare-jean',
    styleCode: 'JE334-DW',
    describes:
      'A model in dark wash high-rise flare jeans with a white western shirt, photographed ' +
      'full length on a sidewalk',
    placement: { kind: 'product', productId: 'p-je334-dw', order: 0 },
  },
  {
    original: 'JE322-DW3_z1ec-tc_360x.webp',
    slug: 'dark-wash-bootcut-jean',
    styleCode: 'JE322-DW',
    describes:
      'A model in dark wash bootcut jeans with a white pearl-snap western shirt, standing ' +
      'in front of a cactus and ivy wall',
    placement: { kind: 'product', productId: 'p-je322-dw', order: 0 },
  },
  {
    original: 'JE305-DW__6_360x.webp',
    slug: 'black-wash-wide-leg-jean',
    styleCode: 'JE305-DW',
    describes:
      'Back view of a model in black wash wide leg jeans with a western-print tee, showing ' +
      'the rear yoke and pocket stitching',
    placement: { kind: 'product', productId: 'p-je305-dw', order: 0 },
  },
  {
    original: 'JE587-MWback_360x.webp',
    slug: 'mid-wash-cuffed-wide-leg-jean',
    styleCode: 'JE587-MW',
    describes:
      'Back view of a model in mid wash wide leg jeans with a turned-up cuff, worn with a ' +
      'pale green graphic tee',
    placement: { kind: 'product', productId: 'p-je587-mw', order: 0 },
  },
  {
    original: 'JE274-LW-Xback_360x.webp',
    slug: 'light-wash-straight-leg-jean',
    styleCode: 'JE274-LW',
    describes:
      'Back view of a model in light wash straight leg jeans with a raw hem, worn with an ' +
      'aztec-print shirt against a brick wall',
    placement: { kind: 'product', productId: 'p-je274-lw', order: 0 },
  },
  {
    original: 'JE386-LEO-2_360x.webp',
    slug: 'leopard-print-jean',
    styleCode: 'JE386-LEO',
    describes:
      'Back view of a model in leopard-print jeans with a plain white top, photographed ' +
      'against a corrugated shutter',
    placement: { kind: 'product', productId: 'p-je386-leo', order: 0 },
  },
  {
    original: 'je384-leo-2_7cci-gt_4098affd-aa7d-41c7-a80d-cdd295fb21aa_360x.jpg',
    slug: 'leopard-print-tie-waist-flare-jean',
    styleCode: 'JE384-LEO',
    describes:
      'Back view of a model in leopard-print flare trousers with a drawstring tie waist and ' +
      'a blush ribbed top',
    placement: { kind: 'product', productId: 'p-je384-leo', order: 0 },
  },
  {
    original: 'JE393-BTST1_1z2n-6l_360x.webp',
    slug: 'western-swirl-printed-jean',
    styleCode: 'JE393-BTST',
    describes:
      'A model in dark jeans with an all-over tonal western swirl print, worn with a white ' +
      'shirt and boots',
    placement: { kind: 'product', productId: 'p-je393-btst', order: 0 },
  },
  {
    original: 'CF4EA635-738C-4B7F-91A5-43CD07227BE9_uvbr-2l_360x.webp',
    slug: 'embroidered-flare-leg-detail',
    styleCode: null,
    describes:
      'Close crop of the lower leg of dark wash flare jeans with a white embroidered swirl ' +
      'motif, worn with boots',
    // Genuinely good craft photography, but the filename carries no style code and the crop
    // shows no identifying detail. Assigning it to a product would be a guess.
    placement: { kind: 'editorial', slot: 'craft-detail' },
  },

  /* ── Dresses ─────────────────────────────────────────────────────────── */
  {
    original: 'DR047-BLK1_360x.webp',
    slug: 'black-one-shoulder-fringe-mini-dress',
    styleCode: 'DR047-BLK',
    describes:
      'A model in a black one-shoulder mini dress with long fringe down the single sleeve, ' +
      'photographed against a brick wall',
    placement: { kind: 'product', productId: 'p-dr047-blk', order: 0 },
  },
  {
    original: 'DR381-AW_7_360x.webp',
    slug: 'chambray-asymmetric-ruffle-midi-dress',
    styleCode: 'DR381-AW',
    describes:
      'A model in a pale chambray strapless midi dress with tiered asymmetric ruffles and a ' +
      'high-low hem, worn with a concho belt',
    placement: { kind: 'product', productId: 'p-dr381-aw', order: 0 },
  },
  {
    original: 'dr505-blk-2_7xp9-wo_1_360x.webp',
    slug: 'black-fringe-sleeve-embroidered-mini-dress',
    styleCode: 'DR505-BLK',
    describes:
      'A model in a black collared mini dress with fringed short sleeves and a white ' +
      'embroidered swirl motif at the hem',
    placement: { kind: 'product', productId: 'p-dr505-blk', order: 0 },
  },

  /* ── Outerwear and vests ─────────────────────────────────────────────── */
  {
    original: 'JO390-BLK_360x.webp',
    slug: 'black-long-fringe-vest',
    styleCode: 'JO390-BLK',
    describes:
      'A model in a black long fringe vest over a tan top, worn with a straw hat and a ' +
      'concho belt',
    placement: { kind: 'product', productId: 'p-jo390-blk', order: 0 },
  },
  {
    original: 'JO390-CML-3-1_oyl0-k0_1_360x.webp',
    slug: 'camel-long-fringe-vest',
    styleCode: 'JO390-CML',
    describes:
      'Close crop of a camel long fringe vest over a tan top, showing the full length of ' +
      'the fringe',
    placement: { kind: 'product', productId: 'p-jo390-cml', order: 0 },
  },
  {
    original: 'JO632 (5).jpg',
    slug: 'studded-fringe-poncho',
    styleCode: 'JO632',
    describes:
      'A dark brown suede-look fringed poncho with a horse-head appliqué and studded ' +
      'detailing, shown on a hanger against a wooden door',
    placement: { kind: 'product', productId: 'p-jo632', order: 0 },
  },
  {
    original: 'KD039-SER-2_360x.webp',
    slug: 'serape-stripe-fringe-vest',
    styleCode: 'KD039-SER',
    describes:
      'Back view of a serape-striped fringe vest worn over a teal long-sleeve top, showing ' +
      'the woven stripe pattern and suede fringe',
    placement: { kind: 'product', productId: 'p-kd039-ser', order: 0 },
  },

  /* ── Tops ────────────────────────────────────────────────────────────── */
  {
    original: 'TO1069-CMLAZT_2_1_360x.webp',
    slug: 'camel-aztec-print-long-sleeve-top',
    styleCode: 'TO1069-CMLAZT',
    describes:
      'A model in a camel aztec-print long sleeve top, worn with a turquoise squash blossom ' +
      'necklace and a coin belt',
    placement: { kind: 'product', productId: 'p-to1069-cmlazt', order: 0 },
  },
  {
    original: 'to588-s-7_2_360x.webp',
    slug: 'aztec-print-graphic-tee',
    styleCode: 'TO588-S',
    describes:
      'A model in a cream tee with a large aztec geometric print in teal, orange and black ' +
      'across the chest',
    placement: { kind: 'product', productId: 'p-to588-s', order: 0 },
  },
  {
    original:
      'l-b-apparel-sleeveless-top-sleeveless-pearl-snap-top-curvy-size-1155907553_360x.webp',
    slug: 'sleeveless-pearl-snap-western-top',
    styleCode: null,
    describes:
      'A model in a sleeveless pearl-snap western top in a pink and grey aztec print, worn ' +
      'with light wash jeans and a tooled belt',
    placement: { kind: 'product', productId: 'p-pearl-snap-sleeveless', order: 0 },
  },

  /* ── Editorial and category imagery ──────────────────────────────────── */
  {
    original: 'STYLES OF THE WEEK 2.jpg',
    slug: 'lineup-editorial',
    styleCode: null,
    describes:
      'Five models photographed side by side in western looks — a white lace shirt dress, a ' +
      'tan printed shirt with denim shorts, a black leather shirt dress, a chambray shirt ' +
      'dress and a cream printed dress',
    placement: { kind: 'editorial', slot: 'homepage-hero' },
  },
  {
    original: 'main_page_photos__54_.png',
    slug: 'printed-midi-dress-portrait',
    styleCode: null,
    describes:
      'A model in a cream western-scenic printed long sleeve midi dress with a concho belt ' +
      'and a straw hat, photographed full length on a storefront street',
    placement: { kind: 'editorial', slot: 'homepage-hero-portrait' },
  },
  {
    original: 'NEW ARRIVALS (5).jpg',
    slug: 'new-arrivals-editorial',
    styleCode: null,
    describes:
      'A collage of recent western looks including a black corset bodysuit, a fringed pink ' +
      'top, printed shirts and a turquoise snap dress',
    placement: { kind: 'editorial', slot: 'new-arrivals' },
  },
  {
    original: 'main_page_photos__52_.png',
    slug: 'denim-skirt-portrait',
    styleCode: null,
    describes:
      'A model in a light wash denim mini skirt with a horseshoe-print tank and white ' +
      'boots, photographed against a dark brick wall',
    placement: { kind: 'editorial', slot: 'category-women' },
  },
  {
    original: 'main_page_photos__53_.png',
    slug: 'category-tile-tops',
    styleCode: null,
    describes: 'A model photographed full length in a western look on a storefront street',
    placement: { kind: 'editorial', slot: 'wholesale' },
  },
  {
    original: 'main_page_photos__55_.png',
    slug: 'category-tile-skirts',
    styleCode: null,
    describes: 'A model photographed full length in a western look on a storefront street',
    placement: { kind: 'editorial', slot: 'category-accessories' },
  },
  {
    original: 'main_page_photos__56_.png',
    slug: 'category-tile-girls',
    styleCode: null,
    describes: 'A model photographed full length in a western look on a storefront street',
    placement: { kind: 'editorial', slot: 'category-girls' },
  },
  {
    original: 'main_page_photos__57_.png',
    slug: 'extended-sizing-portrait',
    styleCode: null,
    describes: 'A model photographed full length in a western look on a storefront street',
    placement: { kind: 'editorial', slot: 'extended-sizing' },
  },

  /* ── Approved by the owner, deliberately not published ───────────────── */
  {
    original: '2700x1000_MainBanner_Summer_Sale.jpg',
    slug: 'summer-sale-banner',
    styleCode: null,
    describes:
      'A promotional banner reading "SUMMER SALE & TAX FREE WEEKEND, 40% OFF on all ' +
      'in-stock & clearance styles, valid August 1st–10th, use code SUMMER40", alongside ' +
      'showroom details for the Dallas Apparel and Accessories Market',
    placement: {
      kind: 'withheld',
      reason:
        'Embeds a dated promotional claim and a discount code. Publishing it would make a ' +
        'time-bound commercial offer this project has no authority to make, and the stated ' +
        'window (1–10 August) has effectively closed. The showroom details it carries do ' +
        'corroborate the verified #13656 / 18–21 August facts already in the footer.',
    },
  },
  {
    original: 'BuyNowPayLater_2600x320px.jpg',
    slug: 'buy-now-pay-later-banner',
    styleCode: null,
    describes:
      'A banner showing Afterpay, Sezzle and PayPal Credit logos under "BUY NOW PAY LATER"',
    placement: {
      kind: 'withheld',
      reason:
        'Third-party payment branding, not merchandise. Phase 1 has no consumer checkout, ' +
        'and this is the same financing widget the D-00 research found computing on an ' +
        'un-gated pack total.',
    },
  },
  {
    original: 'JE322-DW3_z1ec-tc_360x (1).webp',
    slug: 'dark-wash-bootcut-jean-duplicate',
    styleCode: 'JE322-DW',
    describes: 'Byte-identical duplicate of JE322-DW3_z1ec-tc_360x.webp',
    placement: { kind: 'withheld', reason: 'Duplicate — same SHA-256 as the retained copy.' },
  },
  {
    original: 'video_6a36d58ece9146.64769701.mp4',
    slug: 'campaign-video',
    styleCode: null,
    describes: 'A campaign video file supplied by the owner',
    placement: {
      kind: 'withheld',
      reason:
        'Phase 1 ships no video. A looping hero film needs a visible pause control (WCAG ' +
        '2.2.2), a poster frame and a captions track, and it belongs to Phase 2 media. ' +
        'Preserved as an original; not optimised or published.',
    },
  },
]
