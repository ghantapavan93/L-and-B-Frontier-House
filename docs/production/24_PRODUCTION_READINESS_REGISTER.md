# 24 — Production Readiness Register

**Status as at 2026-08-01.** Nothing implemented. No dependencies. No application.

---

## 1. Readiness by area

| Area | Status | Blocker |
| :--- | :--- | :--- |
| Research corpus | **READY** | — |
| Design audit, 56/56 frames | **READY** | — |
| Source authority and conflict resolution | **READY** | — |
| Phasing strategy | **READY** | — |
| Information architecture | **READY** | — |
| Route map | **BLOCKED** | **D-04/D-03/D-05 — taxonomy is in every URL** |
| Domain models | **READY** | — |
| Authorisation and security model | **READY** | — |
| Token system | **READY with open decisions** | D-06 price tier · D-07 typeface, voice, accents |
| Motion and experience modes | **READY** | — |
| Frontier Engine | **READY as strategy; storyboard not authored** | Storyboard is Phase 3 work |
| Accessibility spec | **READY** | — |
| Performance budgets | **READY** | — |
| Technical architecture | **READY; no provider selected** | OQ-15 migration strategy |
| Test and CI strategy | **READY** | — |
| Content governance | **READY** | — |
| **Product data** | **NOT READY** | Owner must supply |
| **Product photography** | **NOT READY** | Must be produced |
| **Size and measurement data** | **NOT READY** | Must be authored |
| **Demo buyer account** | **NOT READY** | Owner must provide |
| D-00 remediation | **PLAN READY, NOT RAISED** | **Owner conversation** |

---

## 2. Blockers before Phase 1 implementation

| # | Blocker | Type | Blocks |
| :--- | :--- | :--- | :--- |
| **1** | **D-00 raised with the owner** | Business | Nothing technically — but it is live and costing money. **Raise first** |
| **2** | **Taxonomy answered** (D-04, D-03, D-05) | Owner decision | **All routing.** The earliest hard gate |
| **3** | **Product data supplied** | Data | Every product surface |
| **4** | **Size and measurement tables authored** | Data | PDP, size & fit, inclusive sizing |
| **5** | **Product photography** | Asset | Every product surface |
| **6** | **Demo buyer account** | Access | Verifying the authorised path — the most important unseen surface in the project |
| **7** | **Commerce integration boundary confirmed** | Technical | The adapter's shape; not its implementation |

**Blockers 1 and 2 are conversations. Blockers 3–6 are lead time. Blocker 7 is a decision.**
None requires code to resolve.

---

## 3. Risk register

| Risk | Severity | Mitigation |
| :--- | :--- | :--- |
| **Live wholesale price leak** | **Critical — active** | `21`. Raise before the Aug 18–21 market |
| **Restricted pricing leaks in the new build** | **Critical** | Test 2 + slug purity; absence-not-hiding in the type system |
| **Products disappear from the DOM** | **Critical** | Test 1 |
| **Zero production assets** | **Critical — schedule** | `14`, sequenced by value per unit cost |
| **Taxonomy churn after launch** | High | Gate before routing |
| **INP failure** | High | `16` budgets; no WebGL Phase 1–2; LoAF in CI |
| **Authoring flow slower than copy-paste** | High | CMS judged on that criterion first (`17` §7) |
| **A fabricated claim ships** | High | `20` + claim review before launch |
| **Plus routed to bespoke** | High | `10` §4; never route Plus to Custom |
| **Accessibility retrofit** | High | Focus, pause controls and drag alternatives designed in, not added |
| **Cinema scope creep into Phase 1** | Medium | Phase boundaries in `03`; Cinema never gates commerce |

---

## 4. What is genuinely ready to start

**Workstream A (foundations) and B (domain + data layer) can begin the moment the taxonomy
gate clears** — repo, strict TypeScript, token system, route groups, domain models, the
authorisation helper, fixtures behind the adapter, and **the three CI tests running against
an empty application**.

`INFERRED` — Standing the tests up first is the highest-value opening move. They cost little,
they pass trivially at the start, and they make the two most likely catastrophic failures
structurally impossible from commit one rather than from a retrofit.

---

## 5. Determination

> ### READY FOR PHASE 1 IMPLEMENTATION APPROVAL — conditional
>
> The blueprint is complete and evidence-based. **Two conversations gate the start**: D-00
> (raise immediately, independently) and the taxonomy decision (D-04/D-03/D-05).
>
> **Data and photography are the real critical path**, not front-end work.
>
> Every unresolved decision is carried as an **explicit branch** with a default safe branch
> that introduces **no unsupported business claim**. The blueprint chooses nothing silently.
