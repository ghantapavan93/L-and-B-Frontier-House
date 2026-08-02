# 09 — Buyer-First Frontier Passport

---

## 1. What the audit established

| Generation | What the Passport was |
| :--- | :--- |
| **V1** (Mobile A and C) | A **tab** in the five-item bar — `Home · Discover · Custom · Passport · Bag`. A concept, not a surface |
| **V2 Frame 8** | A real surface: *"Member since 2022"* + tabs **Wardrobe · Orders · Saved**. Delivered items with dates, an **"In Production"** state, estimated delivery. **No loyalty points. No store credit. No rewards. No tier.** |
| **V3 Frame 10** | Adds **"FRONTIER TRUST ◆ 4,250"** and **"AVAILABLE CREDIT $150.00"** — plus genuinely valuable **fit feedback**, an **alterations record**, and **REORDER SAME SPEC / REORDER WITH ALTERATIONS** |

> ### The loyalty layer is a V3 invention
> `OBSERVED` — It does not exist in V2. **Deleting it restores the original design intent
> rather than departing from it**, which materially lowers the cost and risk of the
> reinterpretation below. `CLAUDE.md` §11 classifies loyalty **NOT JUSTIFIED**.

---

## 2. The reinterpretation

**Keep the concept. Keep the name. Change the audience. Delete loyalty.**

| V3 as designed (consumer) | Buyer-first Passport |
| :--- | :--- |
| Order in transit, ETA, *Track Journey* | **Open orders, ship window, tracking** |
| **Fit Feedback: "True to Size" / "Slightly Boxy"** | **Sell-through and fit feedback per style** |
| **Alterations: "Sleeves shortened 0.5″"** | **Account-specific pack and size-run adjustments** |
| **REORDER SAME SPEC / WITH ALTERATIONS** | **Reorder same assortment / reorder with changes** |
| *"Viewing 12 Garments"* wardrobe | **Saved assortments and line sheets** |
| *"Member since 2022"* | **Retailer profile · approval date · account status** |
| Frontier Trust points + store credit | **DELETE.** Replace with terms, credit limit, balance |
| Monogram *J.D.* | **DELETE** — invented person |

`INFERRED` — **Reorder is the highest-frequency action a boutique buyer takes**, and V3
already designed it as two distinct affordances. That is the single most valuable mechanic in
the corpus for the audience that actually pays.

---

## 3. Phase 1 scope

**Include:** retailer profile (store name, address, sales-tax ID status) · **approval
state** · order history · **open orders with production and shipment status** · **reorder
same assortment** · **reorder with changes** · **saved assortments** · **saved products** ·
**line-sheet export** · pack preferences · account-specific notes · rep relationship (if a
rep is assigned) · showroom and market appointment record.

**Phase 2:** sell-through feedback · fit feedback per style · waitlists · restock alerts ·
daily-drop watchlist.

**Excluded from Phase 1 unless separately approved:** consumer loyalty points · store credit
· gamification · consumer rewards · a consumer alterations archive · any consumer account.

---

## 4. Evidence basis per feature

Only features with visual precedent or verified business need are scoped.

| Feature | Basis |
| :--- | :--- |
| Order history, status, **"In Production"**, estimated delivery | **VISUALLY PRESENT** — V2 F8 |
| Saved products / Saved tab | **VISUALLY PRESENT** — V2 F8 |
| Wardrobe-as-archive → reorder surface | **VISUALLY PRESENT** — V2 F8 + V3 F10 |
| Reorder same spec / with alterations | **VISUALLY PRESENT** — V3 F10 |
| Fit feedback, alterations record | **VISUALLY PRESENT** — V3 F10 (audience change only) |
| Line sheets, saved assortments | **VISUALLY PRESENT** — V3 F11 *Export Line Sheet*; V2 F6 *Virtual Rack* |
| Approval state, tax-ID status | **VERIFIED BUSINESS REQUIREMENT** — not designed anywhere |
| Rep relationship, showroom appointment | **VERIFIED BUSINESS NEED** (permanent showroom #13656; markets Aug 18–21, Oct 20–23) — **not designed anywhere** |
| Waitlist, restock, drop watchlist | **STRATEGICALLY TRANSFERABLE** — `12f_4` shows Waitlist; the daily drop is verified |
| Terms, credit limit, balance | **FUTURE REQUIREMENT** — pending OQ-10 |

**No feature is scoped merely because it would be useful.**

---

## 5. The future DTC branch

Preserved as documented architecture, **not built in Phase 1**. If D-01 resolves to
dual-audience, the consumer Passport reuses the same order, saved-item and profile models
with a different pricing context and a different set of permitted fields.

**The buyer model is a superset.** Building it first means adding a consumer tier later is
additive. Building the consumer version first would mean retrofitting a permission boundary
that does not exist — the exact failure the audit found in the designs.

---

## 6. Naming

**"Frontier Passport" survives**, subject to D-10 (whether *L&B Frontier House* is a public
name at all). It reads correctly for a trade audience — a passport is credential-bearing,
which is precisely what an approved retailer holds.

`OBSERVED` — Note that **V2 Frame 8's tab bar omits the Passport tab** while showing the
Passport surface, and V3.1's bar restores it. **Restore it** — five items, matching V1's and
V3.1's pattern.
