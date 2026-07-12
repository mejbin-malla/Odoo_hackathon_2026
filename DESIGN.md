# TransitOps — Design Language & Design Doc

**Project:** TransitOps — Smart Transport Operations Platform
**Reference sites analyzed:** MetaMask, Linear, Wickret (Cuberto), Stripe (/in), Opacity

---

## 1. Reference Analysis

A quick breakdown of what each site contributes to the aesthetic, and why it's relevant to a fleet-ops product like TransitOps.

| Site | Core Aesthetic | Key Takeaway for TransitOps |
|---|---|---|
| **MetaMask** | Near-black canvas, one loud accent color (fox-orange), oversized italic/condensed display type, chunky pill buttons, playful illustration against a serious utility product | How to make a "boring" utility tool feel confident and alive without sacrificing legibility |
| **Linear** | Near-black (#08090A) UI, violet/indigo glow gradients, tight geometric grotesk type, hairline borders, dense-but-airy data layouts, quiet micro-motion | The core *system* language — this is the closest analog to an operations dashboard |
| **Wickret (Cuberto)** | Cinematic dark backgrounds, oversized editorial type, generous negative space, deliberate scroll/reveal choreography, duotone imagery | Permission to let hero/empty states and reports feel crafted, not templated |
| **Stripe (/in)** | Light canvas, indigo/violet (#635BFF) accent, crisp grid, embedded "real UI" mockups, high information trust, restrained motion | How to keep a data-heavy B2B product feeling trustworthy and premium in light mode |
| **Opacity** | Dark glassmorphism, gradient orbs, bento-grid cards, monospace accents for data/numbers | Direct template for KPI cards, bento dashboards, and "data as jewelry" |

**Common threads across all five:**
- Dark-mode-first design language (Stripe is the one light exception, used here as the light-mode reference)
- One dominant accent color against a near-monochrome neutral base — never a rainbow palette
- Geometric, grotesk-leaning sans-serif type, used at extremes (very large display / very small data-dense)
- Generous whitespace even in information-dense contexts
- Soft glow/gradient accents rather than flat color blocks
- Rounded-corner cards, hairline borders, subtle glassmorphism
- Micro-interactions and easing over flashy animation
- Numbers and data treated as first-class visual elements (large, tabular, sometimes monospaced)

TransitOps' design language is essentially **Linear's system rigor + Opacity's bento/glass data-density + MetaMask's confidence in one accent color + Stripe's trustworthiness + Wickret's craft in empty/hero states.**

---

## 2. Design Principles

1. **Dark by default, light by choice.** The product is used in ops centers, dashboards, and on the move — dark mode is the primary experience (also a required bonus feature); light mode follows the Stripe reference.
2. **One accent, many neutrals.** A single confident accent color carries all primary actions, active states, and highlights. Status/semantic colors are separate and reserved only for state (Available, On Trip, In Shop, etc.).
3. **Data is the hero.** KPIs, tables, and charts are treated like MetaMask treats its headline type or Opacity treats its bento cards — big, clear, unapologetic.
4. **Calm motion.** Micro-interactions (hover glow, 150–250ms easing, subtle scale) — never decorative animation that slows down a dispatcher trying to work fast.
5. **Density with air.** Fleet ops screens carry a lot of information; generous internal padding and clear grouping (Linear-style) keep it from feeling cluttered.
6. **Structural honesty.** Cards, borders, and dividers are hairline and quiet — structure should organize, not decorate.

---

## 3. Color System

### 3.1 Base neutrals (Dark mode — primary)

| Token | Hex | Usage |
|---|---|---|
| `bg-canvas` | `#08090A` | App background |
| `bg-surface` | `#111214` | Sidebar, panels |
| `bg-elevated` | `#18191C` | Cards, modals |
| `bg-elevated-hover` | `#202226` | Card hover state |
| `border-hairline` | `#26282C` | Dividers, card borders |
| `text-primary` | `#F5F5F6` | Headings, primary text |
| `text-secondary` | `#9A9CA3` | Supporting text, labels |
| `text-tertiary` | `#6C6E76` | Placeholder, disabled |

### 3.2 Base neutrals (Light mode — Stripe-style)

| Token | Hex | Usage |
|---|---|---|
| `bg-canvas` | `#FAFAFB` | App background |
| `bg-surface` | `#FFFFFF` | Sidebar, panels |
| `bg-elevated` | `#FFFFFF` | Cards (with shadow, not border) |
| `border-hairline` | `#E7E7EA` | Dividers, card borders |
| `text-primary` | `#0F1013` | Headings |
| `text-secondary` | `#5B5D66` | Supporting text |

### 3.3 Accent (primary brand color)

A single indigo-violet accent — the Linear/Stripe register, distinct enough from status colors to never be confused with them.

| Token | Hex | Usage |
|---|---|---|
| `accent-500` | `#5B5FEF` | Primary buttons, active nav, links |
| `accent-400` | `#7B7FF5` | Hover state |
| `accent-glow` | `rgba(91,95,239,0.35)` | Glow/gradient backgrounds, focus rings |
| `accent-gradient` | `linear-gradient(135deg, #5B5FEF 0%, #9B5CF0 100%)` | Hero sections, empty states, report headers |

### 3.4 Semantic / status colors (fleet-domain specific)

Kept strictly separate from the brand accent so operational state is always unambiguous at a glance.

| Status | Color | Hex |
|---|---|---|
| Available / Active / On Duty | Green | `#3DD68C` |
| On Trip / Dispatched | Amber | `#F5A623` |
| In Shop / Maintenance | Slate blue | `#7A8CA6` |
| Retired / Suspended / Off Duty | Red | `#F04949` |
| Draft / Pending | Neutral gray | `#9A9CA3` |
| Warning (license expiring, low safety score) | Orange-red | `#F0703A` |

Each status renders as a small pill/badge: 8px dot + label, translucent tinted background (10–15% opacity of the status color) — an Opacity/Linear pattern.

---

## 4. Typography

- **Primary typeface:** A geometric grotesk in the Inter / Suisse Int'l family — e.g. **Inter** (free, closest system match to Linear/Stripe's custom fonts).
- **Display/marketing type** (landing page, report covers, empty states): a tighter, slightly condensed variant with negative letter-spacing — echoing MetaMask/Wickret's oversized italics-and-condensed headlines. Use **Inter Tight** or **General Sans**.
- **Data/numeric type:** tabular-nums enabled everywhere numbers appear (KPIs, tables, odometer, cost). Optional monospace (e.g. **JetBrains Mono** or **IBM Plex Mono**) for IDs, registration numbers, and license numbers — an Opacity-style touch that signals "this is a precise data value."

| Style | Font | Size / Weight | Usage |
|---|---|---|---|
| Display XL | Inter Tight | 56–72px / 600, -2% tracking | Landing hero, report cover |
| H1 | Inter | 32px / 600 | Page titles |
| H2 | Inter | 22px / 600 | Section headers |
| H3 | Inter | 16px / 600 | Card titles |
| Body | Inter | 14px / 400 | Default UI text |
| Small / Caption | Inter | 12px / 500 | Labels, table headers (uppercase, +4% tracking) |
| KPI Number | Inter Tight, tabular-nums | 36–44px / 600 | Dashboard KPI cards |
| Data / Mono | JetBrains Mono | 13px / 500 | Reg numbers, license numbers, IDs |

---

## 5. Layout & Grid

- **12-column responsive grid**, 24px gutter, max content width 1440px (Linear/Stripe convention).
- **Sidebar navigation** (persistent, collapsible), 240px expanded / 72px collapsed — icon + label, active item shown with accent-tinted left rail and soft glow, matching Linear's nav treatment.
- **Bento-grid dashboard**: KPI cards and charts arranged in an asymmetric grid (some 1x1, some 2x1, one 2x2 chart block) — directly modeled on Opacity's bento sections.
- **8px base spacing unit**; card internal padding 20–24px; section gaps 32–48px.
- **Corner radius scale:** 6px (inputs, small badges) / 12px (cards) / 20px (modals, hero panels) — soft but not fully rounded, matching Linear/Opacity.
- **Hairline 1px borders** (`border-hairline` token) rather than heavy shadows in dark mode; in light mode, replace borders with a soft `0 1px 2px rgba(0,0,0,0.04)` shadow (Stripe convention).

---

## 6. Component Style

**Buttons**
- Primary: solid `accent-500` fill, white text, 8px radius, subtle glow on hover (`box-shadow: 0 0 0 4px accent-glow`).
- Secondary: transparent with hairline border, fills `bg-elevated-hover` on hover.
- Destructive (e.g. Retire Vehicle, Suspend Driver): solid `#F04949`, used sparingly.

**Cards**
- `bg-elevated` fill, 1px `border-hairline`, 12px radius, 20–24px padding.
- KPI cards: label (caption, secondary text) → large tabular number → small trend indicator (▲/▼ + %) in status color.

**Tables**
- Zebra-free, hairline row dividers only, sticky header in uppercase caption style, row hover = `bg-elevated-hover`.
- Status column always rendered as colored pill, never plain text.
- Numeric columns right-aligned with tabular-nums.

**Badges / Status Pills**
- 8px dot + label, tinted background at 10–15% opacity of the status color, 6px radius, 12px caption text.

**Forms**
- Inputs: `bg-surface`, hairline border, 6px radius, accent-colored focus ring (2px, `accent-glow`).
- Inline validation messages in the relevant status color (red for cargo-weight-exceeded, amber for license-expiring, etc.) — directly enforces the platform's business rules visually.

**Modals / Drawers**
- Glassmorphism: `bg-elevated` at ~85% opacity + backdrop blur, 20px radius, used for "Create Trip," "Dispatch," and "Maintenance Log" flows — an Opacity/Wickret touch that keeps frequent, fast actions feeling light rather than heavy.

**Charts (Reports & Analytics)**
- Line/area charts use the `accent-gradient` fill at low opacity beneath a solid accent line (fuel efficiency, utilization trends).
- Bar charts use neutral gray bars with the single accent color reserved for the highlighted/selected bar — never a multi-color bar chart.

---

## 7. Iconography & Imagery

- Line icons, 1.5px stroke, 20–24px, from a single consistent set (Phosphor or Lucide) — no mixed icon styles.
- No decorative illustration on operational screens; reserve illustration/gradient-orb treatments (Opacity/MetaMask style) for empty states ("No trips yet — dispatch your first vehicle") and the login/auth screen.
- Vehicle/driver avatars: simple monogram or silhouette icon on a tinted neutral background — not photography, to keep the system consistent across arbitrary fleet data.

---

## 8. Motion

- Standard transition: 150–200ms, `ease-out`.
- Hover: subtle 2–4px lift or glow, never scale beyond 1.02.
- Page/panel transitions: 200–250ms fade + 8px slide, Linear-style — quiet, never bouncy.
- Status changes (e.g., vehicle → In Shop) animate the badge color transition over 200ms so operational state changes are perceptible, not just instant.

---

## 9. Applying the System to TransitOps Screens

| Screen | Design Notes |
|---|---|
| **Login / Auth** | Wickret/MetaMask-style hero: dark canvas, accent gradient glow behind a centered glass card, large display wordmark "TransitOps." |
| **Dashboard** | Bento grid: 7 KPI cards (Active Vehicles, Available Vehicles, In Maintenance, Active Trips, Pending Trips, Drivers On Duty, Fleet Utilization %) up top, filters as a hairline pill bar, utilization/fuel charts below in a 2-column bento block. |
| **Vehicle Registry** | Dense data table, status pill column, mono type for registration number, right-aligned numeric columns (odometer, load capacity, acquisition cost). |
| **Driver Management** | Card or table hybrid — safety score shown as a small radial/ring indicator in status color; license expiry flagged with amber/red pill + icon. |
| **Trip Management** | Kanban-style lifecycle (Draft → Dispatched → Completed → Cancelled) using status-colored column headers; dispatch action opens a glass modal. |
| **Maintenance** | List view with "In Shop" state prominently tied to vehicle record; closing a log animates the vehicle status pill back to green. |
| **Fuel & Expense** | Data-entry forms with mono numeric inputs; running cost total shown as a large tabular KPI at the top of the panel. |
| **Reports & Analytics** | Full Wickret/Stripe treatment — generous whitespace, large chart headers, accent-gradient area charts, CSV/PDF export as a secondary button in the top-right. |

---

## 10. Accessibility Notes

- All status colors meet ≥4.5:1 contrast against their respective dark/light backgrounds for text; pill backgrounds are decorative only and never the sole indicator of status (always paired with text label).
- Focus states use the visible `accent-glow` ring on every interactive element, not color alone.
- Dark and light modes are both first-class, not a simple invert — separate neutral tokens are defined for each (see §3.1–3.2).
