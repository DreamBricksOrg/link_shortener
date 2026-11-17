
# DreamBricks Design System

DreamBricks is a **project dashboard** product: a website that shows information
about projects — the ones currently underway and the ones already completed.
This design system captures the brand's visual identity and provides a UI kit
and component library for building the dashboard experience.

**Source material**: `uploads/brandbook_v1.1.pdf` (23-page brand guideline PDF,
in Portuguese, "Brandbook v1.0" / labeled "Projeto 1" internally). No Figma
file, codebase, or slide deck was attached — everything here is derived from
that single PDF plus reasoned, clearly-flagged additions where the brandbook
is silent (no components, no neutrals/semantic colors, no real UI screens are
defined in it). If a Figma link or codebase exists for the live product,
attach it and this system should be revised to match it as ground truth.

The brandbook itself contains no component library or product screens — it is
a logo/color/mascot guideline only. The **Dashboard UI kit** and all
**components** in this project are therefore original interpretations built to
serve a project-dashboard product, styled with the extracted brand tokens.
Treat them as a starting point, not a recreation of an existing product.

## Index

- `styles.css` — root stylesheet, imports everything below
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`
- `assets/logos/` — DreamBricks cloud wordmark (vertical/horizontal × on-blue/on-light/black) + icon-only mark
- `assets/illustrations/` — J0Bson mascot + black cat companion artwork, extracted from the brandbook
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand) shown in the Design System tab
- `components/` — reusable React UI primitives (`core/`, `forms/`, `feedback/`, `navigation/`, `layout/`)
- `ui_kits/dashboard/` — click-through recreation of the DreamBricks project dashboard
- `SKILL.md` — portable skill file for use in Claude Code

## Content fundamentals

The brandbook is a visual guideline only — it contains no product copy, taglines,
or voice examples, so this section is built from what the brand *does* express
visually rather than invented wholesale.

- **Name as wordplay**: "Dream" + "Bricks" — building (concrete, bricks) tangible
  outcomes from projects (dreams). A dashboard for turning plans into finished
  work reads naturally against that name.
- **Tone signal from the mascot**: the brand's only "voice" artifact is **J0Bson**,
  a friendly worker-robot mascot (antennae, wrench, expressive round eyes) shown
  fixing things, walking a small black cat, and interacting with its environment.
  This suggests a warm, approachable, slightly playful register for a product
  that is otherwise operational/informational (project status dashboards) —
  competent and helpful, not corporate-cold, but not silly either.
- **Rigor over looseness**: the brandbook's "incorrect usage" pages (15–21) are
  extensive and strict — precise color values, exact minimum sizes (60px/35px),
  fixed protection areas, no tilting/stretching/recoloring. This signals a brand
  that values consistency and craft even while the mascot stays playful — i.e.
  friendly voice, disciplined execution.
- **Casing**: the wordmark is set in title case as a single compound word split
  across two lines/weights ("Dream" over "Bricks", or side-by-side) — not
  all-caps, not all-lowercase. Follow that lead for product lockups.
- **Emoji**: none used in the source material. Use the J0Bson mascot in
  illustration spots instead of emoji.
- **No copy examples exist** to extract UI microcopy conventions (button labels,
  empty states, error tone) from — write these using the "competent and helpful"
  register above, and flag to the brand owner for review once real copy exists.

## Visual foundations

- **Color**: a tight, cool blue-only palette — deep ink blue `#034a5d`, mid
  brand blue `#42b0d5`, bright sky blue `#52cdef`, pale tint `#c7f1ff`, and
  white. No secondary hue appears anywhere in the source (not even in the
  mascot, which is monochrome blue). Neutrals and semantic colors used in this
  system are intentional additions layered in to make a real UI possible.
- **Type**: one typeface family (Araboto/Poppins) used in exactly two weights
  in the brandbook — Bold for the wordmark and headlines, Light for body/support
  text. The wordmark itself is always bold, rounded, geometric.
- **Logo shape language**: three overlapping puffy cloud lobes (a wordplay on
  "dream" as much as literal cloud/hosting imagery) with the wordmark inset
  into the largest lobe. The cloud is always outlined with a contrasting inner
  stroke in the darker blue, giving it a layered, dimensional feel even though
  the fill is flat.
- **Backgrounds**: solid color fields only (blue or white) in the source — no
  photography, gradients, patterns, or textures appear anywhere in the
  brandbook. Panels/plates use a distinctive **capsule / stadium shape**: a
  rectangle with one fully-rounded corner (see brandbook pages 1, 9, 10, 22) —
  this asymmetric rounding (not a uniform rounded-rect) is a recurring brand
  motif worth reusing for section dividers or card accents.
- **Illustration**: a single recurring character (J0Bson, a blocky antenna'd
  robot) and its black-cat companion, both flat-shaded with a single dark
  drop-shadow silhouette beneath them (no soft blur shadows). Body parts are
  simple boxes/rectangles; limbs are thin wire-like lines; the style is
  geometric-flat, not painterly or textured.
- **Corner radii**: generous and consistent — logo protection-area corners,
  panel plates, and UI chrome should all read as "softly rounded," not sharp.
  No sharp 90° corners are used decoratively (the guidelines explicitly call
  out avoiding 90° angles in the circuit/element motifs).
- **Borders & shadows**: the brandbook uses flat fills with a single offset
  drop-shadow under illustrations (solid dark blue-teal, no blur/gradient) —
  no soft/inner shadows, no glows, no blur effects anywhere in the source.
  Cards in this system use a soft, cool-toned shadow (see `--shadow-*` tokens)
  as a pragmatic addition for UI depth, since the brandbook doesn't define
  card treatments.
- **Transparency/blur**: not used in the source material at all.
- **Animation**: not addressed by the brandbook. This system defaults to
  quick, standard-easing transitions (120–280ms, `--ease-standard`) for UI
  state changes — a neutral choice, not derived from source.
- **Hover/press states**: not defined in the brandbook. Components in this
  system darken on hover (toward `--db-blue-600`) and slightly scale down /
  deepen further on press, consistent with the flat, high-contrast brand
  palette.
- **Imagery color vibe**: N/A — no photography exists in the brand source;
  everything is flat vector/illustration in the blue palette.

## Iconography

- The brandbook defines **no icon system, icon font, or SVG icon set** — icons
  are absent from all 23 pages except the mascot illustrations themselves.
- No emoji or Unicode glyphs are used as icons in the source.
- **Substitution**: this system links **Lucide** icons from CDN
  (`unpkg.com/lucide@latest`) for all UI iconography (component states, nav,
  dashboard cards) as the closest neutral, stroke-based match to the brand's
  flat/geometric linework — flagged here as a substitution, not a brand-defined
  choice. If DreamBricks has a real icon set, replace this.
- The **J0Bson mascot** (`assets/illustrations/`) is the brand's only real
  illustrated asset — use it for empty states, onboarding, and marketing
  moments; do not use it as a functional UI icon (it's an illustration, not a
  glyph).

## Component inventory

- **core/** — Button, IconButton, Badge, Tag
- **forms/** — Input, Select, Checkbox, Radio, Switch
- **navigation/** — Tabs
- **layout/** — Card
- **feedback/** — Dialog, Toast, Tooltip

## Caveats / intentional additions

- **Font substitution**: brandbook specifies "Araboto" (Bold + Light only). Araboto
  is a commercial font not on Google Fonts — substituted with **Poppins**, the
  closest widely-available geometric-rounded match. Ask the brand owner for the
  real Araboto `.woff2`/`.ttf` files and swap them into `tokens/fonts.css`.
- **Neutrals & semantic colors** (grays, success/warning/danger) are not in the
  brandbook — derived in oklch from the brand blue to stay harmonious.
- **Components**: the brandbook defines no component library, so a standard set
  was authored from scratch (Button, IconButton, Badge, Tag, Input, Select,
  Checkbox, Radio, Switch, Tabs, Card, Dialog, Toast, Tooltip).
- **Dashboard UI kit**: not present in source material — an original screen set
  designed for "a dashboard with information about projects," using the
  extracted brand tokens, logo, and mascot.
