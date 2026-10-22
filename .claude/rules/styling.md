---
paths:
    - "**/*.css.ts"
    - "**/*.css"
---

# Conventions: stylesheets

Rules for what a stylesheet says and how it reaches the page. Layout that code computes — measured positions,
transforms, masks — is in `conventions.md`, since it is as often written in a component as in a stylesheet.

### The Playground's element selectors are scoped, and the library keeps its `!important`

The Playground has no raw form controls, so `style.css` styles neither `input` nor `select` (those element rules
outranked any class a control carried), keeps its `textarea` rule, and has no blanket `label` block and no
`button:hover` filter — `filter` paints the outline and dimmed every hovered button's focus ring. **The library's
own `!important` resets stay**: the Playground is not the only consumer, and a blank slate that loses to an
element selector is broken.

The props panels use a family of field adapters (`PageNumberField`, `PageTextField`, `PageSelectField` and the rest)
kept in one file, each mirroring the panel's plain value into a local signal — the bridge a consumer whose state is
a store has to write themselves.

### Each palette token has one job

The user's rule. A color group is `dark` / `main` / `light` / `contrast` (or without `main`):

- **`main` is never a background.** It is for highlights, borders and text over black — a color announcing itself
  against something dark. Lines, dots, tracks, thumbs and drag handles hold `main`.
- **A background is a gradient between `dark` and `light`**, never a flat `main` — linear for cells and rows,
  radial for round badges and markers. **Direction is `215deg` linear and `circle at 70% 30%` radial**, so light
  falls from the top right everywhere.
- **`color` only takes `main` or `contrast`**: `main` for a colored accent on a dark surface, `contrast` on its own
  family's background. Never `dark` or `light`.

Every family's `contrast` clears at least AA against both ends of its own `dark`-to-`light` gradient, so any such
gradient is safe to put its `contrast` on; a new family or shade is checked at both ends.

An SVG `fill` cannot take a CSS gradient, so a gradient-filled path renders its own `<linearGradient>` under a
generated id, with the stops as vanilla-extract classes (a presentation attribute will not resolve a CSS custom
property) and the picked state pointing `fill` at it inline.

### A Playground style names a theme token, never repeats its number

The user's rule: a number equal to a token is not the token, because the theme can no longer move it. In
`playground/src`, a declaration inside a `style({})` uses `themeVars`. The scales are `spacing` (`half` 5, `full` 10,
`double` 20, `quad` 40), `borderRadius` (`half` 5, `full` 10) and `fontSize` in `rem` (`xSmall` is `0.75rem`, 12px).
`components/src` has no theme and no colors, so a number there is a layout fact.

- **A value off the scale by 2 to 3 pixels is rounded to the nearest token** — the user overruled keeping it: a
  value a pixel off the scale is one that missed. **Past 3 pixels, ask.** Their answers so far: the Card sample's
  role line is `fontSize.medium`; `CodeBox`'s `calc(spacing.double - spacing.half)` stays, since the page makes up
  the difference elsewhere; `playground/landing/index.html` has no theme and its `15px` / `20px` padding is
  deliberate.
- **A value too small to approximate stays a number** — `2` and hairline `1`s.
- **A value that is arithmetic against something else is written as that arithmetic, not rounded**:
  `calc(${themeVars.spacing.double} - 1px)` for the step connector's offset, and `TOGGLE_HEIGHT / 2` for the
  toggle's radius, a proportion of its own height. No relative CSS value makes a stadium — `borderRadius: "100%"`
  makes an ellipse.
- **A value handed to a component prop stays a number**, since a `var(--…)` string does not typecheck there; it is
  still rounded onto the scale (`FIELD_STEPPER_PADDING`).
- **Durations are tuned values**, the user's to move; flag one off the scale rather than rounding it.

**No `lineHeight` in the Playground** except the `body` rule in `Theme.css.ts` and the Typewriter sample's
`textHighlight` (`2`, the user's call) — the user abolished the rest, since the theme has no line-height scale.
Where a line height was centering text vertically, flex centering replaces it.

### A style never wins by stylesheet order alone

Two bundles of the same styles — two entry points, two framework builds, a late chunk — can load them in different
orders, so equal-specificity rules flip winners with neither changed. **A rule that must beat another wins by
specificity, by sitting on an element the other does not reach, or because the other does not set the property.**

### A vanilla-extract stylesheet can drop out of the build whole, with no error

A `.css.ts` file can be left out of the output while the build succeeds silently, and the first sign is a
component with no styles at all. **Check that the stylesheet reached the bundle first** — search the built CSS for
one of its class names — and if it is missing, remove declarations one at a time until it comes back; a single
declaration can cause it.
