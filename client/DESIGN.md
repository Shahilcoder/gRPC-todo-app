---
version: alpha
name: Clay
description: >-
  A calm, dense, keyboard-first design system for the gRPC todo app. Warm
  neutrals, a single clay accent, flat surfaces separated by hairlines rather
  than shadows. Light and dark themes are both normative.
colors:
  # ---- Light theme ----------------------------------------------------------
  canvas: "#FAF9F8"
  surface: "#FFFFFF"
  surface-alt: "#F4F2F0"
  border: "#E5E1DD"
  border-interactive: "#8A817A"
  ink: "#1F1D1B"
  ink-muted: "#5C5651"
  ink-faint: "#726B65"
  primary: "#A63D2F"
  primary-hover: "#8E3427"
  primary-active: "#7A2C21"
  primary-wash: "#F7EAE7"
  on-primary: "#FFFFFF"
  priority-1: "#C0392B"
  priority-2: "#965900"
  priority-3: "#1F6FB2"
  priority-4: "#726B65"
  success: "#1E7A4C"
  warning: "#8C5A00"
  error: "#B3261E"
  # ---- Dark theme -----------------------------------------------------------
  canvas-dark: "#1A1918"
  surface-dark: "#232120"
  surface-alt-dark: "#2C2A28"
  border-dark: "#3A3734"
  border-interactive-dark: "#807A73"
  ink-dark: "#F2EFEC"
  ink-muted-dark: "#B0A9A2"
  ink-faint-dark: "#9E9790"
  primary-dark: "#E8896F"
  primary-hover-dark: "#F09A82"
  primary-active-dark: "#DD7E63"
  primary-wash-dark: "#3A2620"
  on-primary-dark: "#1A1918"
  priority-1-dark: "#F08C7A"
  priority-2-dark: "#F0A94C"
  priority-3-dark: "#6FB6EE"
  priority-4-dark: "#9E9790"
  success-dark: "#5FCB92"
  warning-dark: "#F0B65C"
  error-dark: "#F2938B"
typography:
  headline-lg:
    fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline-md:
    fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body-lg:
    fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
  label-lg:
    fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.2
  label-md:
    fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.01em"
  label-sm:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.02em"
    fontFeature: '"tnum" 1'
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  gutter: 16px
  page-margin: 24px
  divider: 1px
  checkbox: 20px
  control-height: 44px
  row-height: 48px
  content-max: 42rem
  sidebar: 16rem
components:
  # ---- List container + dividers -------------------------------------------
  list-container:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    width: "{spacing.content-max}"
  list-container-dark:
    backgroundColor: "{colors.surface-dark}"
    rounded: "{rounded.lg}"
    width: "{spacing.content-max}"
  list-divider:
    backgroundColor: "{colors.border}"
    height: "{spacing.divider}"
    rounded: "{rounded.none}"
  list-divider-dark:
    backgroundColor: "{colors.border-dark}"
    height: "{spacing.divider}"
    rounded: "{rounded.none}"
  # ---- Task row -------------------------------------------------------------
  task-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: "{spacing.row-height}"
  task-row-hover:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.ink}"
  task-row-completed:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-faint}"
  task-row-pending:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.warning}"
  task-row-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-dark}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: "{spacing.row-height}"
  task-row-hover-dark:
    backgroundColor: "{colors.surface-alt-dark}"
    textColor: "{colors.ink-dark}"
  task-row-completed-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-faint-dark}"
  task-row-pending-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.warning-dark}"
  # ---- Checkbox -------------------------------------------------------------
  checkbox:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.full}"
    size: "{spacing.checkbox}"
  checkbox-ring:
    backgroundColor: "{colors.border-interactive}"
    height: 2px
  checkbox-hover:
    backgroundColor: "{colors.surface-alt}"
    rounded: "{rounded.full}"
  checkbox-checked:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    size: "{spacing.checkbox}"
  checkbox-dark:
    backgroundColor: "{colors.surface-dark}"
    rounded: "{rounded.full}"
    size: "{spacing.checkbox}"
  checkbox-ring-dark:
    backgroundColor: "{colors.border-interactive-dark}"
    height: 2px
  checkbox-hover-dark:
    backgroundColor: "{colors.surface-alt-dark}"
    rounded: "{rounded.full}"
  checkbox-checked-dark:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.on-primary-dark}"
    rounded: "{rounded.full}"
    size: "{spacing.checkbox}"
  # ---- Add-task input -------------------------------------------------------
  add-task-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: "{spacing.control-height}"
  add-task-input-placeholder:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-faint}"
  add-task-input-success:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.success}"
  add-task-input-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: "{spacing.control-height}"
  add-task-input-placeholder-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-faint-dark}"
  add-task-input-success-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.success-dark}"
  # ---- Buttons --------------------------------------------------------------
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: "{spacing.control-height}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
  button-primary-dark:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.on-primary-dark}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: "{spacing.control-height}"
  button-primary-hover-dark:
    backgroundColor: "{colors.primary-hover-dark}"
    textColor: "{colors.on-primary-dark}"
  button-primary-active-dark:
    backgroundColor: "{colors.primary-active-dark}"
    textColor: "{colors.on-primary-dark}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: "{spacing.control-height}"
  button-secondary-hover:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.ink}"
  button-secondary-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-dark}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: "{spacing.control-height}"
  button-secondary-hover-dark:
    backgroundColor: "{colors.surface-alt-dark}"
    textColor: "{colors.ink-dark}"
  button-ghost:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  button-ghost-hover:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.ink}"
  button-ghost-danger:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.error}"
    typography: "{typography.label-md}"
  button-ghost-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.ink-muted-dark}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  button-ghost-hover-dark:
    backgroundColor: "{colors.surface-alt-dark}"
    textColor: "{colors.ink-dark}"
  button-ghost-danger-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.error-dark}"
    typography: "{typography.label-md}"
  # ---- Text input -----------------------------------------------------------
  text-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: "{spacing.control-height}"
  text-input-error:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.error}"
  text-input-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: "{spacing.control-height}"
  text-input-error-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.error-dark}"
  # ---- Empty state ----------------------------------------------------------
  empty-state:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.headline-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.3xl}"
  empty-state-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.ink-muted-dark}"
    typography: "{typography.headline-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.3xl}"
  # ---- Page header ----------------------------------------------------------
  page-header:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.headline-lg}"
    padding: "{spacing.page-margin}"
  page-header-subtitle:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-faint}"
    typography: "{typography.body-sm}"
  page-header-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.ink-dark}"
    typography: "{typography.headline-lg}"
    padding: "{spacing.page-margin}"
  page-header-subtitle-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.ink-faint-dark}"
    typography: "{typography.body-sm}"
  # ---- Priority flag (phase 2) ---------------------------------------------
  priority-flag-1:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.priority-1}"
    rounded: "{rounded.sm}"
    size: "{spacing.lg}"
  priority-flag-2:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.priority-2}"
    rounded: "{rounded.sm}"
    size: "{spacing.lg}"
  priority-flag-3:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.priority-3}"
    rounded: "{rounded.sm}"
    size: "{spacing.lg}"
  priority-flag-4:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.priority-4}"
    rounded: "{rounded.sm}"
    size: "{spacing.lg}"
  priority-flag-1-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.priority-1-dark}"
    rounded: "{rounded.sm}"
    size: "{spacing.lg}"
  priority-flag-2-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.priority-2-dark}"
    rounded: "{rounded.sm}"
    size: "{spacing.lg}"
  priority-flag-3-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.priority-3-dark}"
    rounded: "{rounded.sm}"
    size: "{spacing.lg}"
  priority-flag-4-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.priority-4-dark}"
    rounded: "{rounded.sm}"
    size: "{spacing.lg}"
  # ---- Label chip (phase 2) ------------------------------------------------
  label-chip:
    backgroundColor: "{colors.primary-wash}"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
  label-chip-dark:
    backgroundColor: "{colors.primary-wash-dark}"
    textColor: "{colors.primary-dark}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
---

# Clay — Task App Design System

A design system for the gRPC todo app, written in the
[DESIGN.md](https://github.com/google-labs-code/design.md) format (spec version
`alpha`). The YAML front matter above is normative and machine-readable; the
prose below is rationale and application guidance. Where the two appear to
disagree, the tokens win.

Validate changes to this file with:

```
npx @google/design.md lint client/DESIGN.md
```

## Overview

**Clay** is the design language for a task app that expects to be used dozens of
times a day, for years, by someone who does not want to think about it. Its
personality is **calm, dense, and quietly warm** — a tool, not a destination.

- **Calm.** The UI holds still. Nothing pulses, bounces, or slides in to
  announce itself. Color is spent almost entirely on one accent and one
  destructive state; everything else is warm neutral. The interface should be
  boring to look at and fast to read.
- **Dense.** A task list is a list. Rows are compact (48px) and separated by
  hairlines, not by gaps and drop shadows. The goal is to fit a real day's work
  on one screen without scrolling. Density is a feature, not a compromise —
  but it stops at the touch-target floor (44px), which is never violated.
- **Warm.** The neutral ramp is built on a warm grey (a hint of red and yellow
  in the mix) rather than the cool blue-grey that is the default in most
  utility UI. Paired with the clay accent, it reads closer to paper than to a
  dashboard.
- **Keyboard-first.** Every action has a keyboard path, and focus is always
  visibly located. The pointer is an option, never a requirement.
- **It gets out of the way.** Chrome earns its pixels or it is deleted. If a
  label, border, icon, or shadow can be removed without losing meaning, remove
  it.

### Reading this document

Colors are named by **role**, not by hue — `ink`, `surface`, `canvas`,
`primary`. Renaming a hue never requires touching a component. Prose introduces
each role in the spec's bold-lead convention:
`- **Role (#HEX):** what it is for.`

### Build phases

The app's data model is currently four fields (`id`, `title`, `completed`,
`created_at`) behind four unary RPCs (`ListTodos`, `CreateTodo`, `ToggleTodo`,
`DeleteTodo`) — see `proto/todo.proto`. Some of what a mature task app needs
visually has no backing data yet, so every component in `## Components` carries
a status marker:

- **Buildable now** — drivable by the existing four RPCs and four fields.
- **Phase 2** — requires proto and schema changes first. Tokens are defined so
  the visual language is settled in advance, but nothing should ship using them
  until the data exists.

### Originality

Clay's structural conventions — list density, the anatomy of a task row, a
circular checkbox that fills on completion, a four-step priority ramp — are
common to the category, and Todoist is the reference point that made them
familiar. Everything expressed here is original: the palette was computed from
scratch for this document, and the type scale, spacing scale, and component
specs are our own. No third-party logo, brand color, marketing copy, or trade
dress is reproduced. Todoist is credited here as inspiration and is not
referenced anywhere else in this document.

## Colors

The palette is one warm neutral ramp, one accent, and a small set of semantic
signals. Roles carry meaning; hex values are implementation detail.

### Surfaces and ink (light)

- **Canvas (#FAF9F8):** The page background. A warm off-white — never pure
  white — so that `surface` can sit on top of it and read as raised without a
  shadow.
- **Surface (#FFFFFF):** Content that holds tasks: the list container, inputs,
  menus. The one place pure white appears.
- **Surface-alt (#F4F2F0):** Transient background states — row hover, pressed
  rows, input fills. Also the fallback background for a "recessed" area.
- **Border (#E5E1DD):** Hairline dividers between rows and around containers.
  Decorative only.
- **Border-interactive (#8A817A):** The outline of a control a user can operate
  — an unchecked checkbox ring, an input border, a segmented control edge.
- **Ink (#1F1D1B):** Primary text. Task titles, headings, values. A very dark
  warm brown-black rather than pure black, to match the warm surfaces.
- **Ink-muted (#5C5651):** Secondary text that is still content — helper text,
  section labels, counts.
- **Ink-faint (#726B65):** De-emphasised text: timestamps, placeholders,
  metadata, and the title of a completed task.

### Accent (light)

- **Primary (#A63D2F):** Clay. The single accent, and the only saturated color
  in the default view. It marks the primary action, the checked state, and the
  focus ring — nothing else.
- **Primary-hover (#8E3427)** / **Primary-active (#7A2C21):** Pointer states
  for filled primary surfaces. Both darken; the accent never lightens on hover
  in light mode.
- **Primary-wash (#F7EAE7):** A tint of clay for chip backgrounds and selected
  rows, light enough that `ink` and `primary` both stay legible on it.
- **On-primary (#FFFFFF):** Text and icons on any filled `primary` surface.

### Why clay

The accent needed to be warm and decisive — a task app's accent is pressed
constantly and marks "done", so it should feel like a confirmation rather than
an alert. Clay is a red-brown at moderate saturation: it belongs to the same
warm family as the neutral ramp (so the UI reads as one material), it is
unmistakably not the crimson of the reference app, and it is a deliberate step
away from the stock indigo currently hard-coded in
`client/public/index.html`. At `#A63D2F` it clears AA on every surface in the
system while still being dark enough to carry white text — a combination a
brighter red cannot manage in both directions at once.

### Dark theme and a spec limitation

**The `colors` map in the DESIGN.md front matter is flat — the format has no
concept of themes.** Rather than pretend dark mode is out of scope, Clay
expresses it as a parallel set of tokens with a `-dark` suffix. The pairing rule
is mechanical:

> For any role `X`, the dark-theme value is the token named `X-dark`.
> A component's dark variant is `<component>-dark`.

Consumers that understand themes should treat the two sets as light/dark pairs
of one role. Consumers that do not will still read valid, contrast-checked
tokens. This is a documented workaround for a gap in the `alpha` spec, not a
naming preference — if a future spec version adds themes, these should collapse
into it.

Dark mode is **not** an inversion. Surfaces get *lighter* as they come forward
(`canvas-dark` #1A1918 → `surface-dark` #232120 → `surface-alt-dark` #2C2A28),
which is the opposite of the light theme's ordering, because raised things catch
more light. The accent is also lifted rather than reused: saturated clay on a
near-black background is muddy and fails contrast, so `primary-dark` (#E8896F)
is a desaturated, lightened partner, and its hover state *lightens* (#F09A82)
where the light theme's darkens.

- **Canvas-dark (#1A1918)** / **Surface-dark (#232120)** /
  **Surface-alt-dark (#2C2A28):** The same three-step surface ramp, ascending.
- **Border-dark (#3A3734)** / **Border-interactive-dark (#807A73):** Divider
  and control outline.
- **Ink-dark (#F2EFEC)** / **Ink-muted-dark (#B0A9A2)** /
  **Ink-faint-dark (#9E9790):** Never pure white — pure white on near-black
  vibrates and hurts at length.
- **Primary-dark (#E8896F)**, **Primary-hover-dark (#F09A82)**,
  **Primary-active-dark (#DD7E63)**, **Primary-wash-dark (#3A2620)**,
  **On-primary-dark (#1A1918):** Note that on a lifted accent, the readable
  foreground is *dark*, not white. Note also the token names: it is
  `primary-hover-dark`, not `primary-dark-hover` — the `-dark` suffix always
  comes last, so that stripping it always yields the light-theme partner.

### Priority tiers and semantic signals

Four priority levels, ordered most to least urgent. They are deliberately drawn
from four different hues rather than four steps of one — priority must survive
being perceived by someone who cannot distinguish red from green, so the tiers
differ in hue *and* in luminance, and shipping UI must always pair the color
with a shape or text label.

| Role | Meaning | Light | Dark |
|---|---|---|---|
| `priority-1` | Urgent — do it today | `#C0392B` | `#F08C7A` |
| `priority-2` | High — this week | `#965900` | `#F0A94C` |
| `priority-3` | Medium — scheduled | `#1F6FB2` | `#6FB6EE` |
| `priority-4` | None — the default | `#726B65` | `#9E9790` |

`priority-4` is intentionally identical to `ink-faint`: "no priority" is the
default state of almost every task, and the default state should be silent.

- **Success (#1E7A4C / #5FCB92):** A completed action confirmed — a task
  created, a change saved.
- **Warning (#8C5A00 / #F0B65C):** In-flight or degraded, not broken. Used for
  a row whose toggle or delete RPC has not yet returned.
- **Error (#B3261E / #F2938B):** A failed request or invalid input. Distinct
  from `primary` on purpose: an accent that also means "danger" makes every
  primary button feel risky.

### Contrast

Every value above was computed with the WCAG 2.1 relative-luminance formula and
checked against **all three** backgrounds in its own theme — `surface`,
`canvas`, *and* `surface-alt`. Text tokens clear the AA 4.5:1 minimum on the
worst of the three; interactive boundaries clear 3:1 (WCAG 1.4.11) on the worst
of the three. Checking against the lightest surface only is the usual way a
palette passes review and still fails in practice.

Light theme, ratio against `surface` / `canvas` / `surface-alt`:

| Token | Hex | Ratios | Floor |
|---|---|---|---|
| `ink` | `#1F1D1B` | 16.80 / 15.98 / 15.05 | 4.5 ✔ |
| `ink-muted` | `#5C5651` | 7.23 / 6.87 / 6.47 | 4.5 ✔ |
| `ink-faint` | `#726B65` | 5.24 / 4.98 / 4.69 | 4.5 ✔ |
| `primary` | `#A63D2F` | 6.31 / 6.00 / 5.65 | 4.5 ✔ |
| `primary-hover` | `#8E3427` | 7.86 / 7.48 / 7.04 | 4.5 ✔ |
| `primary-active` | `#7A2C21` | 9.50 / 9.04 / 8.51 | 4.5 ✔ |
| `priority-1` | `#C0392B` | 5.44 / 5.17 / 4.87 | 4.5 ✔ |
| `priority-2` | `#965900` | 5.64 / 5.36 / 5.05 | 4.5 ✔ |
| `priority-3` | `#1F6FB2` | 5.28 / 5.02 / 4.73 | 4.5 ✔ |
| `priority-4` | `#726B65` | 5.24 / 4.98 / 4.69 | 4.5 ✔ |
| `success` | `#1E7A4C` | 5.33 / 5.06 / 4.77 | 4.5 ✔ |
| `warning` | `#8C5A00` | 5.87 / 5.58 / 5.26 | 4.5 ✔ |
| `error` | `#B3261E` | 6.54 / 6.22 / 5.85 | 4.5 ✔ |
| `border-interactive` | `#8A817A` | 3.82 / 3.63 / 3.42 | 3.0 ✔ |

Dark theme, ratio against `surface-dark` / `canvas-dark` / `surface-alt-dark`:

| Token | Hex | Ratios | Floor |
|---|---|---|---|
| `ink-dark` | `#F2EFEC` | 14.00 / 15.33 / 12.48 | 4.5 ✔ |
| `ink-muted-dark` | `#B0A9A2` | 6.90 / 7.56 / 6.16 | 4.5 ✔ |
| `ink-faint-dark` | `#9E9790` | 5.56 / 6.09 / 4.96 | 4.5 ✔ |
| `primary-dark` | `#E8896F` | 6.29 / 6.89 / 5.61 | 4.5 ✔ |
| `primary-hover-dark` | `#F09A82` | 7.37 / 8.07 / 6.57 | 4.5 ✔ |
| `primary-active-dark` | `#DD7E63` | 5.53 / 6.05 / 4.93 | 4.5 ✔ |
| `priority-1-dark` | `#F08C7A` | 6.67 / 7.30 / 5.95 | 4.5 ✔ |
| `priority-2-dark` | `#F0A94C` | 8.00 / 8.77 / 7.14 | 4.5 ✔ |
| `priority-3-dark` | `#6FB6EE` | 7.33 / 8.03 / 6.54 | 4.5 ✔ |
| `priority-4-dark` | `#9E9790` | 5.56 / 6.09 / 4.96 | 4.5 ✔ |
| `success-dark` | `#5FCB92` | 7.97 / 8.73 / 7.11 | 4.5 ✔ |
| `warning-dark` | `#F0B65C` | 8.82 / 9.66 / 7.86 | 4.5 ✔ |
| `error-dark` | `#F2938B` | 7.12 / 7.79 / 6.35 | 4.5 ✔ |
| `border-interactive-dark` | `#807A73` | 3.78 / 4.14 / 3.37 | 3.0 ✔ |

Foreground-on-accent pairs: `on-primary` on `primary` 6.31, on `primary-hover`
7.86, on `primary-active` 9.50. `on-primary-dark` on `primary-dark` 6.89, on
`primary-hover-dark` 8.07, on `primary-active-dark` 6.05. On the washes,
`primary` on `primary-wash` is 5.37 and `primary-dark` on `primary-wash-dark`
is 5.57.

**Two tokens exist because of contrast, and are worth explaining.**

`border` and `border-interactive` are separate roles that look like they should
be one. They cannot be. A decorative divider is explicitly exempt from WCAG
1.4.11, so it is free to be a whisper (`#E5E1DD`, 1.30:1 — invisible as text,
correct as a hairline). The outline of a checkbox or input *is* a control
boundary and must clear 3:1. One token cannot honestly be both: at 3:1 the
dividers become heavy cages, and at 1.3:1 the checkboxes fail accessibility.
Two roles is the honest answer.

`priority-2` and `warning` are both amber and both had to be deepened during
verification. Amber is the hardest hue to make pass AA on light surfaces —
its luminance is high at every saturation worth using. `warning` sits at
`#8C5A00`, dark enough to read as text; if it looks too brown to feel like a
warning, that is amber's cost of admission on a light background, and the fix
is an icon, not a lighter color.

## Typography

**The repo ships no webfonts**, and adding one to a page whose entire payload is
two static files would be a poor trade. So Clay uses the platform UI stack, and
this section stays honest about that: the typeface is whatever the user's OS
uses for its own interface, which is also the fastest and most familiar option.

- **Sans (all levels except `label-sm`):**
  `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Mono (`label-sm` only):**
  `ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`

Roles, by intent:

- **Headlines** (`headline-lg`, `headline-md`) are set bold with negative
  letter-spacing. There is at most one `headline-lg` per screen — the page
  title. Tight tracking at large sizes keeps a two-word heading from looking
  loose.
- **Body** (`body-lg`, `body-md`, `body-sm`) carries content. `body-lg` at
  16px is the task title — the single most-read string in the app, and the one
  size that must never shrink to gain density. `body-md` is form and control
  text; `body-sm` is helper and subtitle text.
- **Labels** (`label-lg`, `label-md`, `label-sm`) are UI furniture: buttons,
  chips, metadata. Semibold and short. Labels are **never** set in all-caps in
  Clay — caps costs legibility and adds a shoutiness that works against the
  calm brief.
- **`label-sm` is monospaced and uses tabular figures** (`font-feature-settings:
  "tnum" 1`). This exists for one real reason: `created_at` is one of the four
  fields the API actually returns, so timestamps are genuine content, and a
  column of timestamps that shifts as digits change is a small, constant
  irritation. Tabular numerals fix it.

| Token | Size | Weight | Line height | Tracking | Used for |
|---|---|---|---|---|---|
| `headline-lg` | 30px | 700 | 1.15 | -0.02em | Page title |
| `headline-md` | 20px | 600 | 1.25 | -0.01em | Empty-state heading, section titles |
| `body-lg` | 16px | 400 | 1.5 | — | Task title |
| `body-md` | 14px | 400 | 1.5 | — | Inputs, controls, dialog copy |
| `body-sm` | 13px | 400 | 1.45 | — | Helper text, page subtitle |
| `label-lg` | 15px | 600 | 1.2 | — | Primary button |
| `label-md` | 13px | 600 | 1.2 | 0.01em | Secondary/ghost button, chip |
| `label-sm` | 12px | 500 | 1.2 | 0.02em | Timestamps, counts (mono, tnum) |

Two weights only — 400 and 600 — with 700 reserved for `headline-lg`. Three
weights in one view is the point at which hierarchy starts to read as noise.

## Layout

### Spacing

A **4px base**, with the scale below. Every margin, padding, and gap in the app
resolves to one of these; there are no arbitrary values.

| Token | Value | Typical use |
|---|---|---|
| `xs` | 4px | Icon-to-label, chip padding |
| `sm` | 8px | Checkbox-to-title, tight stacks |
| `md` | 12px | Task row padding, control padding |
| `lg` | 16px | Gap between groups |
| `xl` | 24px | Page margin, header-to-list |
| `2xl` | 32px | Between major sections |
| `3xl` | 48px | Empty-state padding |

Structural values: `gutter` 16px, `page-margin` 24px, `divider` 1px,
`checkbox` 20px, `control-height` 44px, `row-height` 48px,
`content-max` 42rem, `sidebar` 16rem.

### The reading column

The task list is capped at **`content-max` (42rem / 672px)** and centered.
This is a reading-column decision, not a stylistic one: task titles are prose,
and prose past roughly 75 characters per line loses the reader between the end
of one line and the start of the next. A full-width task list on a 27-inch
display is unusable in exactly this way. Note that the current
`client/public/index.html` uses `max-w-xl` (36rem); `content-max` widens it to
42rem, which fits a realistic title plus its metadata without wrapping.

**`sidebar` (16rem) is reserved and unused.** It is specified now so that
phase-2 navigation (projects, filters, labels) does not have to reopen the
layout question, but nothing today should render a sidebar — there is no
second-level navigation to put in it.

### Task-row density

The row is the unit of the app, so its dimensions are the most consequential
numbers in this document.

- **`row-height` 48px** is the resting height of a single-line task row: 12px
  padding, a 20px checkbox / 24px line box, 12px padding.
- **`control-height` 44px** is the floor for anything tappable —
  buttons, inputs, the checkbox's hit area. The checkbox is drawn at 20px but
  its target extends to 44px; the visual size and the touch size are
  deliberately decoupled.
- Rows grow taller when a title wraps. They never shrink below 48px, and
  density is never bought by dropping under the 44px target.

### Breakpoints

Three, matching Tailwind's defaults so the utility classes and this document
agree:

| Range | Name | Behaviour |
|---|---|---|
| `< 640px` | Mobile | Single column. `page-margin` drops to 16px. Row actions (delete) are revealed by swipe or an always-visible icon, never by hover. Full-width controls. |
| `640px – 1023px` | Tablet | Single centered column at `content-max`. `page-margin` 24px. Hover states active. |
| `≥ 1024px` | Desktop | Centered `content-max` column. Space is reserved on the left for the phase-2 `sidebar`; until it exists, the column stays centered on the viewport rather than shifting. |

**Hover is not available on touch.** Any affordance that only appears on hover
must have a non-hover equivalent below 640px. This is the most common way a
dense list becomes unusable on a phone.

## Elevation & Depth

Clay is **flat by default**. Hierarchy comes from the three-step surface ramp
and from hairlines — not from shadows.

The reason is specific to this app: at 48px rows, a list of floating cards
produces a shadow every 48 pixels down the page. The shadows stack visually
into grey mud, the eye loses the row boundaries it was supposed to gain, and
scanning gets *harder*. A single flat `surface` panel with 1px `border`
dividers between rows reads faster, renders faster, and scales to hundreds of
rows without turning into texture. **A flat list with dividers beats a stack of
floating cards at this density** — this is the governing rule of the section.

Depth is therefore expressed in this order of preference:

1. **Tonal layering.** `canvas` → `surface` → `surface-alt`. Enough to say
   "this is in front" without a single pixel of shadow.
2. **Hairlines.** 1px `border` for dividers; `border-interactive` for control
   outlines.
3. **Shadow**, only for things that genuinely float above the page and can be
   dismissed.

There are exactly two shadow steps. Both are warm-tinted and low-opacity — a
neutral black shadow over warm surfaces reads as a grey smudge.

| Step | Value | Used for |
|---|---|---|
| `shadow-raised` | `0 1px 2px rgba(31, 29, 27, 0.06), 0 1px 3px rgba(31, 29, 27, 0.04)` | The one element being dragged; a sticky add-task bar once the list scrolls under it |
| `shadow-overlay` | `0 4px 12px rgba(31, 29, 27, 0.10), 0 1px 3px rgba(31, 29, 27, 0.06)` | Menus, popovers, dialogs, toasts |

In dark mode, shadows are nearly invisible against `canvas-dark` and do almost
no work. Overlays there gain depth by stepping **up** the surface ramp instead
— a dialog uses `surface-alt-dark` on a `canvas-dark` page — plus a 1px
`border-dark` edge. Keep the shadow declarations; just do not rely on them.

### Motion

Motion is functional and short. Nothing in Clay animates to be noticed.

- **Durations:** 120ms for state changes (hover, focus, checkbox fill), 180ms
  for entrances and exits (row removal, overlay), 240ms ceiling. Anything
  slower than 240ms is felt as lag in an app used this often.
- **Easing:** `cubic-bezier(0.2, 0, 0.2, 1)` — a standard decelerate. No
  overshoot, no spring, no bounce.
- **Hover lift is a color change, not a transform.** Rows and buttons shift
  background (`surface` → `surface-alt`) rather than translating or scaling.
  Transforms on 48px rows in a long list cause visible reflow and cost more
  than they communicate. The only permitted `translateY` is on a genuinely
  dragged element, which pairs with `shadow-raised`.
- **The checkbox is the one place motion is expressive** — see
  `## Components`.
- **Honor `prefers-reduced-motion: reduce`:** drop all transitions to 0ms and
  replace exit animations with immediate removal. State must remain legible
  from color and position alone.

## Shapes

Corners are softened just enough to feel current, and no more. The radius scale
is small and used consistently; the mix of very round and very square shapes in
one view is what makes an interface look assembled from parts.

| Token | Value | Applied to |
|---|---|---|
| `none` | 0px | Dividers, full-bleed edges |
| `sm` | 4px | Priority flags, small indicators |
| `md` | 8px | Buttons, inputs, task rows — the workhorse |
| `lg` | 12px | The list container and other panels |
| `xl` | 16px | Empty-state panel, dialogs |
| `full` | 9999px | Checkbox, chips, avatars |

Two shapes are load-bearing:

- **The checkbox is a full circle** (`rounded.full` at 20px). This is the most
  important shape decision in the system. A circle is unambiguously "an action
  I take", where a square checkbox reads as "a form field I fill in" — and in a
  task app, completing a task is the action, not a form submission. The circle
  also gives the completed state somewhere satisfying to go: a ring that fills.
- **Chips are pills** (`rounded.full`), which distinguishes a soft, removable
  piece of metadata from an 8px-radius button that performs an action.

Nesting rule: a child's radius should be smaller than its parent's. Inside a
`lg` (12px) list container, rows use `md` (8px). Matching radii on nested
elements make the inner one look misaligned.

## Components

Ten core components. Each lists anatomy, states, motion, and its build status.
Sub-tokens are in the front matter; only `backgroundColor`, `textColor`,
`typography`, `rounded`, `padding`, `size`, `height`, and `width` are valid
there, so anything the spec cannot express (borders, shadows, transitions) is
specified in prose here and marked as such.

### 1. Task row — *buildable now*

The core unit. Backed by `Todo.id`, `Todo.title`, `Todo.completed`,
`Todo.created_at`.

**Anatomy**, left to right: a 20px circular checkbox (44px hit area) · 8px gap ·
the title in `body-lg`, flexible width, truncating at one line by default ·
optional `label-sm` timestamp from `created_at` · a trailing delete action.
Vertical padding `md` (12px); resting height `row-height` (48px).

**States**

| State | Spec |
|---|---|
| Default | `task-row` — `surface` / `ink` |
| Hover | `task-row-hover` — background to `surface-alt`, 120ms. Delete action fades in. |
| Focus-visible | 2px `primary` ring, 2px offset. Never removed without replacement. |
| Completed | `task-row-completed` — title to `ink-faint` with a strikethrough. Background does **not** change; a completed row is still a normal row. |
| Pending | `task-row-pending` — title to `warning` while `ToggleTodo`/`DeleteTodo` is in flight. Row stays interactive-looking but ignores further input. |
| Error | Title to `error` with a retry affordance, if the RPC fails. |

**Motion.** On completion, the checkbox fills over 120ms and the title's
strikethrough draws left-to-right over 120ms. On delete, the row collapses its
height and fades over 180ms — this is the one place a layout animation is worth
it, because a row vanishing instantly makes the list appear to jump.

**Notes.** Rows are separated by `list-divider`, not by gaps. Title truncates
at one line by default; wrapping to two is acceptable, three is not — the row
stops being scannable. There is no edit-title RPC today, so **the title is not
inline-editable**; do not build an affordance that implies it is.

### 2. Checkbox — *buildable now*

Backed by `Todo.completed` via `ToggleTodo`.

**Anatomy.** A 20px circle (`spacing.checkbox`, `rounded.full`) with a 2px
stroke in `border-interactive` (expressed as `checkbox-ring`; the spec has no
border sub-token, so the ring's color is carried as that element's
`backgroundColor`). Hit area 44px.

**States**

| State | Spec |
|---|---|
| Unchecked | `checkbox` — `surface` fill, `border-interactive` ring |
| Hover | `checkbox-hover` — fill to `surface-alt`, ring darkens |
| Focus-visible | 2px `primary` ring at 2px offset, outside the circle |
| Checked | `checkbox-checked` — fill `primary`, checkmark in `on-primary` |
| Disabled | Ring and fill at 40% opacity; no hover response |

**Motion.** Fill scales from 0 to 100% from the center over 120ms; the
checkmark path draws over the following 80ms. Unchecking reverses without the
draw. This is the app's one moment of expressive motion, and it is 200ms long.

**Phase 2.** When priorities exist, the ring takes the task's `priority-N`
color and the fill uses a wash of it — the pattern this palette's four tiers
were designed for. Until then every ring is `border-interactive`.

### 3. Add-task input — *buildable now*

Backed by `CreateTodo`. The single most-used control in the app.

**Anatomy.** A full-width `text-input` at `control-height` (44px), `rounded.md`,
`body-md`, with placeholder in `ink-faint` ("What needs doing?"). Paired with a
primary submit button, or submitting on Enter alone.

**States.** Resting `add-task-input`; placeholder
`add-task-input-placeholder`; on focus a 2px `primary` ring replaces the
`border-interactive` border; on success `add-task-input-success` flashes the
confirmation in `success` for ~1s. Empty submit is a no-op, not an error —
matching `server.js`, which rejects a blank title before it reaches gRPC.

**Motion.** On successful create, the input clears immediately and the new row
enters at the list's sort position over 180ms. The input keeps focus so the
next task can be typed without reaching for the pointer — this is the
keyboard-first principle at its most load-bearing.

**Notes.** Never disable this input while a create is in flight; queue instead.
Blocking the primary input on network latency is the fastest way to make a
fast app feel slow.

### 4. Button — *buildable now*

Three variants. **At most one `button-primary` is visible per screen.**

| Variant | Resting | Hover | Active | Use |
|---|---|---|---|---|
| Primary | `button-primary` (`primary` / `on-primary`, `label-lg`) | `button-primary-hover` | `button-primary-active` | The one main action — "Add task" |
| Secondary | `button-secondary` (`surface` / `ink`, 1px `border-interactive`, `label-md`) | `button-secondary-hover` | — | Cancel, secondary confirms |
| Ghost | `button-ghost` (`canvas` / `ink-muted`, no border, `label-md`) | `button-ghost-hover` | — | Row actions, low-emphasis controls |

`button-ghost-danger` (`error` text on `surface`) is the destructive ghost —
the row's Delete action, which `client/public/app.js` renders today as a
`<button>` carrying `text-rose-600`. Destructive actions are **never**
`button-primary`: a filled red button invites the click it is warning about.

All buttons: `rounded.md`, `padding.md`, `control-height` 44px minimum,
120ms background transition, 2px `primary` focus ring at 2px offset. Disabled
is 40% opacity with no hover response and no pointer cursor.

### 5. Text input — *buildable now*

The generic form field; the add-task input is its specialization.

`text-input` at `control-height`, `rounded.md`, `body-md`, 1px
`border-interactive` border, `surface` fill. Placeholder `ink-faint`; helper
text `body-sm` in `ink-muted`. Focus swaps the border for a 2px `primary` ring.
Error state is `text-input-error` — border and message in `error`, with the
message in `body-sm` directly below the field. **Error state is never
color-only**: the message text is required, since color alone fails
non-visual and color-blind access.

### 6. Empty state — *buildable now*

Shown when `ListTodos` returns zero todos. Today `app.js` toggles a
`hidden` class on a one-line "No todos yet."

`empty-state` — a `rounded.xl` panel on `canvas`, `3xl` (48px) padding,
centered. A `headline-md` line in `ink-muted` and one `body-sm` line in
`ink-faint` below it. Optionally a single `button-secondary`.

The copy should read as a clean slate, not a failure — "Nothing left to do"
rather than "No results found". Distinguish three cases that all render zero
rows: nothing created yet, everything completed, and **the list failed to
load**. The third is an error state and must not be dressed as an empty one;
that is how a broken API gets mistaken for an empty database.

### 7. Page header — *buildable now*

`page-header` — the page title in `headline-lg` / `ink`, with
`page-header-subtitle` in `body-sm` / `ink-faint` beneath. `page-margin`
(24px) below it before the list. Exactly one per page.

On mobile the header may condense on scroll but must not become sticky at the
cost of a row of list content — on a phone, list rows are worth more than a
persistent title.

### 8. List container — *buildable now*

`list-container` — a `surface` panel at `rounded.lg`, capped at
`content-max` (42rem), holding task rows separated by `list-divider` (1px,
`border`). **No shadow** (see `## Elevation & Depth`).

Dividers appear *between* rows only — never above the first or below the last,
where they collide with the container's own edge. The container's `rounded.lg`
clips the first and last rows' corners, which is why rows can carry `rounded.md`
without the two radii fighting.

### 9. Priority flag — *phase 2, blocked on proto changes*

> **Blocked.** `proto/todo.proto` has no priority field, and `server/store.go`
> has no column for one. This requires a new field on `Todo`, a schema
> migration, and an RPC that can set it. **Do not ship this component.** Its
> tokens are defined so the color language is settled before that work starts.

`priority-flag-1` … `priority-flag-4` — a 16px flag or chevron at
`rounded.sm`, colored by tier, placed at the row's trailing edge. Tier 4 (the
default) renders **nothing at all**; a flag on every row is noise, and the
absence of a flag is the clearest possible signal of "no priority".

Always pair the color with a text label or a distinct glyph. Four hues is a
usable ramp for most people and no ramp at all for someone who cannot separate
them.

### 10. Label chip — *phase 2, blocked on proto changes*

> **Blocked.** There is no label or tag field in the proto, and no join table
> in SQLite. Requires a repeated field on `Todo` plus schema and RPC work.
> **Do not ship this component.**

`label-chip` — a `rounded.full` pill, `primary-wash` background, `primary`
text, `label-sm`, `xs` padding. Optional trailing dismiss affordance. Chips sit
after the title on the row and wrap to a second line rather than truncating.
Cap at three visible with a `+N` overflow chip; a row of chips must never push
the title out of view.

## Do's and Don'ts

**Color**

- Do reference tokens by role (`{colors.ink}`, `{colors.surface}`) — never a
  raw hex value in a component or utility class.
- Do keep `primary` scarce: one `button-primary` per screen, plus the checked
  checkbox and the focus ring.
- Don't use `primary` for destructive actions — that is `error` and
  `button-ghost-danger`.
- Don't use `border` where a control boundary is needed; that is
  `border-interactive`, and the difference is a WCAG 1.4.11 failure.
- Don't convey status by color alone. Every priority tier, error, and pending
  state needs a glyph, label, or text string beside it.
- Do maintain WCAG AA contrast: **4.5:1 for normal text, 3:1 for interactive
  boundaries and large text** — verified against `surface`, `canvas`, *and*
  `surface-alt`, not just the lightest one.
- Do pair every new light token with a `-dark` partner in the same commit, and
  re-run the linter.

**Type**

- Do use at most two weights in a view (400 and 600); 700 belongs to
  `headline-lg` alone.
- Don't set labels in all-caps.
- Don't shrink `body-lg` to gain density — the task title is the thing being
  read.
- Do use `label-sm` with tabular figures for anything numeric that sits in a
  column.

**Layout and shape**

- Do keep the list within `content-max` (42rem); long prose lines are harder to
  scan, not more efficient.
- Do keep every interactive target at 44px or larger, however dense the row.
- Don't mix radii arbitrarily; nest smaller inside larger (`md` rows inside an
  `lg` container).
- Don't rely on hover alone below 640px — there is no hover on touch.

**Depth and motion**

- Do separate rows with 1px `border` hairlines.
- Don't put a shadow on a task row. A shadow every 48px is texture, not
  hierarchy.
- Don't animate anything longer than 240ms, and don't use spring or bounce
  easing.
- Do honor `prefers-reduced-motion: reduce` by dropping transitions to 0ms.

**Process**

- Do mark any component that needs proto or schema changes as phase 2, and
  don't ship it against invented data.
- Don't add a visual affordance for an action the API cannot perform — there is
  no edit-title RPC, so nothing should look editable.
- Do run `npx @google/design.md lint client/DESIGN.md` after editing this file.

## Implementation Tokens

> **Off-spec section.** `Implementation Tokens` is not one of the eight
> canonical DESIGN.md headings. The spec's stated behaviour for an unknown
> heading is to preserve it without error, and it is placed last so it cannot
> disturb the enforced order of the sections above.

These are a convenience mirror of the front matter, not a second source of
truth. **If the two disagree, the front matter wins.** Both blocks below can be
regenerated:

```
# Tailwind v3 theme.extend JSON (this repo — see client/tailwind.config.js)
npx @google/design.md export --format json-tailwind client/DESIGN.md

# Tailwind v4 CSS @theme block
npx @google/design.md export --format css-tailwind client/DESIGN.md
```

Note that `css-tailwind` emits a **Tailwind v4** `@theme` block, while this
repo is on Tailwind v3 with a `tailwind.config.js` — so `json-tailwind` is the
format that matches what `client/tailwind.config.js` can consume.

### CSS custom properties

```css
:root {
  /* surfaces + ink */
  --color-canvas: #FAF9F8;
  --color-surface: #FFFFFF;
  --color-surface-alt: #F4F2F0;
  --color-border: #E5E1DD;
  --color-border-interactive: #8A817A;
  --color-ink: #1F1D1B;
  --color-ink-muted: #5C5651;
  --color-ink-faint: #726B65;

  /* accent */
  --color-primary: #A63D2F;
  --color-primary-hover: #8E3427;
  --color-primary-active: #7A2C21;
  --color-primary-wash: #F7EAE7;
  --color-on-primary: #FFFFFF;

  /* priority + semantic */
  --color-priority-1: #C0392B;
  --color-priority-2: #965900;
  --color-priority-3: #1F6FB2;
  --color-priority-4: #726B65;
  --color-success: #1E7A4C;
  --color-warning: #8C5A00;
  --color-error: #B3261E;

  /* radius */
  --rounded-none: 0px;
  --rounded-sm: 4px;
  --rounded-md: 8px;
  --rounded-lg: 12px;
  --rounded-xl: 16px;
  --rounded-full: 9999px;

  /* spacing */
  --space-base: 4px;
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;
  --space-3xl: 48px;
  --space-gutter: 16px;
  --space-page-margin: 24px;
  --space-divider: 1px;
  --space-checkbox: 20px;
  --space-control-height: 44px;
  --space-row-height: 48px;
  --size-content-max: 42rem;
  --size-sidebar: 16rem;

  /* type */
  --font-sans: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas,
    "Liberation Mono", monospace;

  /* elevation */
  --shadow-raised: 0 1px 2px rgba(31, 29, 27, 0.06),
    0 1px 3px rgba(31, 29, 27, 0.04);
  --shadow-overlay: 0 4px 12px rgba(31, 29, 27, 0.1),
    0 1px 3px rgba(31, 29, 27, 0.06);

  /* motion */
  --duration-state: 120ms;
  --duration-enter: 180ms;
  --ease-standard: cubic-bezier(0.2, 0, 0.2, 1);
}

.dark {
  --color-canvas: #1A1918;
  --color-surface: #232120;
  --color-surface-alt: #2C2A28;
  --color-border: #3A3734;
  --color-border-interactive: #807A73;
  --color-ink: #F2EFEC;
  --color-ink-muted: #B0A9A2;
  --color-ink-faint: #9E9790;

  --color-primary: #E8896F;
  --color-primary-hover: #F09A82;
  --color-primary-active: #DD7E63;
  --color-primary-wash: #3A2620;
  --color-on-primary: #1A1918;

  --color-priority-1: #F08C7A;
  --color-priority-2: #F0A94C;
  --color-priority-3: #6FB6EE;
  --color-priority-4: #9E9790;
  --color-success: #5FCB92;
  --color-warning: #F0B65C;
  --color-error: #F2938B;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-state: 0ms;
    --duration-enter: 0ms;
  }
}
```

The `.dark` block **overrides the same variable names** rather than introducing
`--color-*-dark` ones. That is the point of the indirection: components
reference `var(--color-surface)` and never learn which theme is active. The
`-dark` suffix exists only in the front matter, where the flat `colors` map
gives no other way to express a second theme.

### `tailwind.config.js` — `theme.extend`

Drop-in replacement for the empty `theme: { extend: {} }` currently in
`client/tailwind.config.js`. Add `darkMode: "class"` so the `.dark` block
above is what toggles the theme.

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        surface: {
          DEFAULT: "var(--color-surface)",
          alt: "var(--color-surface-alt)",
        },
        hairline: "var(--color-border)",
        "border-interactive": "var(--color-border-interactive)",
        ink: {
          DEFAULT: "var(--color-ink)",
          muted: "var(--color-ink-muted)",
          faint: "var(--color-ink-faint)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          active: "var(--color-primary-active)",
          wash: "var(--color-primary-wash)",
        },
        "on-primary": "var(--color-on-primary)",
        priority: {
          1: "var(--color-priority-1)",
          2: "var(--color-priority-2)",
          3: "var(--color-priority-3)",
          4: "var(--color-priority-4)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        "headline-lg": ["30px", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["20px", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "1.5" }],
        "body-md": ["14px", { lineHeight: "1.5" }],
        "body-sm": ["13px", { lineHeight: "1.45" }],
        "label-lg": ["15px", { lineHeight: "1.2", fontWeight: "600" }],
        "label-md": ["13px", { lineHeight: "1.2", letterSpacing: "0.01em", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "1.2", letterSpacing: "0.02em", fontWeight: "500" }],
      },
      borderRadius: {
        none: "var(--rounded-none)",
        sm: "var(--rounded-sm)",
        md: "var(--rounded-md)",
        lg: "var(--rounded-lg)",
        xl: "var(--rounded-xl)",
        full: "var(--rounded-full)",
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        gutter: "var(--space-gutter)",
        "page-margin": "var(--space-page-margin)",
        divider: "var(--space-divider)",
        checkbox: "var(--space-checkbox)",
        control: "var(--space-control-height)",
        row: "var(--space-row-height)",
      },
      maxWidth: {
        content: "var(--size-content-max)",
      },
      width: {
        sidebar: "var(--size-sidebar)",
      },
      boxShadow: {
        raised: "var(--shadow-raised)",
        overlay: "var(--shadow-overlay)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
      },
      transitionDuration: {
        state: "var(--duration-state)",
        enter: "var(--duration-enter)",
      },
    },
  },
  plugins: [],
};
```

`border` is exposed as `hairline` because Tailwind already defines a `border`
utility for border-width; `border-hairline` sets the divider color without
colliding with it.

### Migrating today's classes

How the stock Tailwind utilities currently in `client/public/index.html` and
`client/public/app.js` map onto these tokens. This table is the migration
checklist; **no source file has been changed by this document.**

| Where | Today | Becomes | Why |
|---|---|---|---|
| `index.html` `<body>` | `bg-slate-100 text-slate-800` | `bg-canvas text-ink` | Cool slate → warm canvas; `ink` is AA on it at 15.98:1 |
| `index.html` `<main>` | `max-w-xl` | `max-w-content` | 36rem → 42rem reading column |
| `index.html` `<h1>` | `text-3xl font-bold tracking-tight` | `text-headline-lg` | Size, weight, and tracking travel together as one token |
| `index.html` subtitle | `text-sm text-slate-500` | `text-body-sm text-ink-faint` | `slate-500` is 4.34:1 on `slate-100` — below AA. `ink-faint` is 4.98:1 on `canvas`. |
| `index.html` input | `border-slate-300 bg-white focus:ring-indigo-400` | `border-border-interactive bg-surface focus:ring-primary` | `slate-300` is 1.48:1 on white — fails 1.4.11 for a control boundary |
| `index.html` submit | `bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800` | `bg-primary hover:bg-primary-hover active:bg-primary-active` | Stock indigo → clay |
| `app.js` row `<li>` | `rounded-lg bg-white px-4 py-3 shadow-sm` | `rounded-md bg-surface px-md py-md h-row` + `divide-hairline` on the parent | Drops the per-row shadow for dividers; `md` radius nests inside the `lg` container |
| `app.js` checkbox | `h-5 w-5 accent-indigo-600` | `h-checkbox w-checkbox rounded-full accent-primary` + 44px hit area | Square → circle; hit area decoupled from visual size |
| `app.js` completed title | `line-through text-slate-400` | `line-through text-ink-faint` | `slate-400` is 2.56:1 on white — a completed task must still be readable |
| `app.js` delete | `text-rose-600 hover:text-rose-700` | `text-error hover:underline` | One `error` role instead of an ad-hoc rose |
| `app.js` empty state | `text-center text-slate-400` | `text-headline-md text-ink-muted` | `slate-400` on `slate-100` is 2.34:1; `ink-muted` on `canvas` is 6.87:1 |

Note the recurring theme: four of today's stock utility choices
(`slate-500` subtitle, `slate-300` input border, `slate-400` completed title,
`slate-400` empty state) do not meet WCAG AA. That is the strongest single
argument for tokens over ad-hoc classes — the palette above cannot express
those combinations, because every value in it was checked before it was named.
