---
paths:
    - "components/src/**"
    - "components-solid/src/**"
    - "components-react/src/**"
    - "components-vue/src/**"
    - "components-svelte/src/**"
    - "playground/src/**"
    - "playground-solid/src/**"
    - "playground-react/src/**"
    - "playground-vue/src/**"
    - "playground-svelte/src/**"
---

# Conventions: naming and shaping an API

How props, helpers, namespaces and painters are named and shaped. The library-wide rules are in `conventions.md`.

### A prop is named the same in every framework

The user's guideline whenever a name is in doubt: one name for one thing across the Solid, React, Vue and Svelte
packages and Playgrounds. A name never carries the framework's mechanism — two-way state is `value`, not
`valueSignal` or `valueState` — and only the way it is handed in differs: a signal pair in Solid, a
`[value, setValue]` pair in React, `v-model:value` in Vue, `bind:value` in Svelte. A `render*` callback keeps its
name as a Vue slot and a Svelte snippet; `ref` stays `ref`. Where a framework makes the name impossible, use the
framework's own way of reaching it rather than a new name — Vue reserves `ref`, so a Vue consumer uses `$el`.

### A word-valued name is snake_case, and a picker shows the key itself

The user's rule, widened from samples to every value. **Every string naming a choice is snake_case**: sample and
registry keys (`cover_flow`, `ease_in_out_quad`), a prop's value (`"top_out"`, `"month_day_year"`), a built-in
shape (`"triangle_up"`), a tiling, a `kind` a utility hands back (`"pick_up"`). **A picker shows the key, never a
prettier label**, so a sample has one spelling in the registry, its type, the picker, the readout and the spec. The
functions behind keys keep camelCase, mapped by the registry (`right_to_left: rightToLeft`); pattern files named for
their keys (`circle_g_2`) predate the rule.

**A value a platform reads under its own name keeps that spelling** — CSS values (`"fit-content"`, `"ease-in-out"`,
including hand-computed easings that are the CSS curves), SVG attribute values (`"userSpaceOnUse"`,
`"fractalNoise"`) and `Intl` calendar ids (`"islamic-umalqura"`). **Identifiers are not values** and stay camelCase:
property names, function names, and the Playground's `data-testid` keys (`selectAll`).

### "Outline" means the focus indicator; paint along an edge is a "stroke", and the edge itself is a "contour"

The user's terms, because CSS already owns `outline` for the focus ring:

- **Stroke** — paint along an edge: SVG `stroke`, a shape's painted border, a ring around a carried item.
- **Contour** — the edge as geometry, the closed path a shape, tile, die face or particle area is cut to, painted
  or not. Not "edge", which means one side of a polygon here (`edgeThicknesses`).
- **Border** — paint around a box that takes no geometry of its own (`Surface`, `GlassSurface`, mirroring CSS). A
  component that takes a geometry draws a stroke; a box has a border.
- **Outline** — the focus indicator and the CSS property, nothing else. The heading list a table of contents walks
  is "the page's headings", and the component is a **table of contents**.

### When a function grows a sibling, both names get the distinguishing word

The user's rule. A bare name beside a qualified one reads as the default with a variant hanging off it. So
`trackSwipe` became `trackAxialSwipe` when `trackFreeSwipe` arrived, **in the same change** — once the pair ships
with one bare name, the asymmetry is in every call site. A name with nothing to be confused with stays short.

### A component's props are written once, in the core, as `Base<Component>Values` and `Base<Component>Cbs`

The user's call. Every member that means the same thing in every framework is declared and documented once, in the
core's `<Component>.types.ts`:

- **`Base<Component>Values`** — everything handed in as data. No functions.
- **`Base<Component>Cbs`** — every callback and compute function (`on*`, `compute*`, any non-painter function).
- **`Base<Component>Props`** — the two intersected.

React, Vue and Svelte write `type XProps = BaseXProps & { …own }`; Solid writes
`AccessorValues<BaseXValues> & BaseXCbs & { …own }`. **Only what differs by framework stays per framework**:
painters, two-way state, children, slots, snippets and refs. A union naming the component (`TableOfContentsNameProps`)
moves to the core; a framework never re-declares a name the core exports, since every framework package re-exports
the core and two exports of one name break its index.

**A `Base…` type holds only what is identical everywhere, so no framework narrows one** — `Omit<BaseXProps,
"onKeyDown"> & { onKeyDown… }` is wrong; such a member leaves the base. Where three frameworks would declare it
identically (a callback taking a browser `MouseEvent`, which React replaces with its own event type), the core
carries it beside the base as `XCbs = BaseXCbs & { … }` and React declares its own. Where a framework already owns
that type name (`TextFieldCbs`), the members go into each framework's own. An `Omit` over a `Base…` type is fine in
an internal leaf taking a subset of values.

### A component generates the id a relationship attribute needs

The user's rule. Where a component needs an `id` to write `aria-controls`, `aria-describedby`, `aria-labelledby` or
`aria-activedescendant`, a consumer's `id` is a preference, not a precondition: the component falls back to a
generated one, so the relationship is always expressed and never depends on an unrelated optional prop.

### An id in markup that can render more than once is unique in the document

A reference to an id — `url(#…)`, `aria-labelledby`, a label's `for` — resolves to the first element carrying it
in the whole document. Markup that can appear twice builds its ids from something unique to the instance (a
generated id joined to a local key), or the second instance silently points at the first's element. **Nothing
references an id unless its target was rendered**: a reference to nothing is not harmless — a missing filter
paints artifacts, a missing description leaves a dangling attribute — so the reference and its target are decided
by the same condition.

### A role that requires a name makes the prop that names it required

WCAG 4.1.2. For `dialog`, `alertdialog`, `tree`, `grid`, `navigation` with a sibling, `toolbar`, `region`,
`progressbar` and `meter`, the prop is required (`ariaLabel: string`), with the doc block saying why. A component
that shows its own title offers `ariaLabelledBy` instead, and the two form a union with exactly one required
(`ModalNameProps`) — never two optionals and a runtime warning, because a type fails before the page opens. Where a
role only recommends a name, the prop stays optional.

### The library says what a component is, and nothing else a reader hears

The user's rule. The one English string a component may ship is its `aria-roledescription` ("carousel"), and even
that is a default behind a `roleDescription` prop. Every other phrase — an announcement, key hint, button name,
place label — is the consumer's, arrives through a required prop, and has no default, because a hardcoded phrase
is read in the page's declared language and fails WCAG 3.1.2 on a German page. Text with parts is a `compute*`
function taking the parts only the library knows (a label, a count, an index from zero), never a half-built
sentence; text without parts is a plain `string`. Several travel as one required object (`announcements`). What
stays in the library: numbers, a percent sign, a date formatted through the consumer's locale, and text the
consumer supplied.

### Anything non-local is exported

The user's preference. **What crosses a folder boundary between two public components is exported; only what
stays inside one folder is private** — `InteractionWrapper` is public because controls in other folders are built
on it, `ButtonElement` private because it never leaves `Button`'s. **Publishing a helper publishes its edge cases**,
so its doc block names them (`usePlacementBoxContext` answers with an inert context outside a box rather than
throwing).

### A default is stated once, and everything else imports it

The user's rule: two copies of a default drift and nothing complains. **Every prop default lives in
`<Component>.const.ts` as one exported object keyed by prop name** — `TILE_BOARD_DEFAULTS = { gap: …, … }` — the
component reads `props.gap ?? TILE_BOARD_DEFAULTS.gap` (through `access` in Solid), the barrel exports it, and the
Playground seeds its knobs from the same object. A constant that is not a prop default stays private. Where a
library default and a Playground copy disagree, the Playground's number is the current one — the page is where
numbers get tuned. A string default inside the object widens to `string`, so write `as <Type>` for a named union
and `as const` otherwise.

**The library holds a tunable's default and nothing else**; its range, step, label and hint are the demo app's,
also as `.const.ts` files, with the `hint` required. A subject with several sets of defaults exports a
`<Subject>Defaults` namespace of them, and a `.utils.ts` reads its defaults from the `.const.ts`.

**A lookup over a library type is the library's, exported, even when only the demo app reads it** — every member of
a union, the keys of a registry, a map from a family to its defaults — because any consumer building a picker
needs exactly that list. The line is vocabulary: a label or hint keyed by the type is the demo app's, a list adding
a demo-only option spreads the library's lookup, and a hand-picked subset is the page's choice.

### A component hands out a controller and renders no controls of its own

The user's rule. The consumer gets a controller through `onMount` and draws the buttons wherever they like; a slot
drawing controls inside the component's box decides layout for them, and a box including a toolbar can no longer
be measured or framed honestly. **The accessibility duty travels with the controller**: a drag or path gesture
needs a single-pointer alternative (WCAG 2.5.7, 2.5.1), which only controls satisfy, so the component makes the
route reachable through its commands and the consumer wires it to something pressable.

### Every controller callback reports whether it succeeded

The user's rule. A command handed over at mount returns `boolean` — `true` when it acted, `false` when it declined —
so a caller can tell a refused request from a done one (the counterpart of _"Asking for a state a thing is already
in does nothing"_). **The boolean stays even where it can only be `true`**, so a caller never has to know which
commands can refuse.

### One namespace per folder, and the file it lives in names it

The user's rules for `components/src` and `playground/src`:

- **A folder exports one namespace.** Splitting a subject's arithmetic from its stateful half makes the consumer
  learn which half a function landed in; the two merge.
- **Every namespace of functions is `<Subject>Utils`, in `<Subject>.utils.ts`**, at every layer. The bare name is
  kept for a type: types live in `.types.ts`, a type and a namespace of one name can only meet in the flat barrel,
  and there TypeScript reports `TS2308`, drops the name, and every consumer gets "only refers to a type".
  **`Utils` does not promise purity** — it marks a namespace with no same-named type to be a companion to.
- **The subject is singular**: `ToastUtils` from `Toasts.utils.ts`, `KeyframeUtils` from `Keyframes.utils.ts`.
  The one exception, taken by the user reluctantly and not a licence for a second, is `Defs`, the SVG element's
  name: `SVGDefsUtils`, `SVGGradientDefsUtils`.
- **Everything inside the braces is exported; private helpers sit above the namespace.** Reading the namespace is
  reading the contract. Two silent hazards: a member shadowing a same-named private calls itself, so a private never
  shares a published name; and a module-level `const` runs before the namespace exists, so a private needing a
  published constant gets it from module level, never the reverse.
- **A type lives in `<Subject>.types.ts`**, so importing a type does not pull in an implementation. Exempt:
  `Utils/typeUtils.ts`, a home for type transformers. A type that is a companion to a `.const.ts` value
  (`WithNoSample`) owns the literal and the const annotates against it.
- **Something small used only where it is declared stays there; something reusable goes to `.utils.ts` or
  `.types.ts`**, judged by what it is rather than who calls it today.
- **Outside the rule**: a `.const.ts` registry keeps the subject's plain name (`SVGDefsSamples`,
  `CellAnimationZones`); a `.factory.tsx` exports its factory; a `.context.ts` exports a provider and hooks bare.

`ss-utils` keeps its own layout: one lowercase file per subject (`math.ts` exports `MathUtils`), a type's companion
namespace sharing its name in the same file (`point2d.ts` holds `Point2d`, `Point2dString` and `Point2dUtils`), and
`Color` and `ShapeConst` as they are. A file in `components/src` or `playground/src` holding more than one
namespace is a question to ask before merging.

### Documentation blocks

These are the two exceptions to the comment ban in `CLAUDE.md`, and the rules for writing them.

- **Every export in a `.utils.ts` carries a `/** */` block, wherever the file sits**: a one-line summary, a blank
  line, then what the signature cannot say — why it exists, what the caller is spared, what happens at the edges —
  then `@param` and `@returns` where they add something, and `{@link}` to a neighbor rather than restating it. A
  `.factory.tsx` is held to the same: class, constructor and public methods. Read `utils/src` for the style.
- **Every member of an exported `*Props` type carries one**, and so does a type that feeds a props type, since its
  members show up as that component's props — documenting a shared wrapper's props once fills every control's table.
  Say what the prop is for, what it does at the edges and what the caller is spared.
- **A block says what a consumer needs, never why the code is shaped that way** — the user's rule. The test is
  whether the sentence would change what a caller writes. A dependency's shortcomings, a rejected alternative, an
  earlier version, a measurement or a person fail it; **that** a value is clamped is contract, **why** is
  reasoning, and reasoning goes in `decisions.md`.
- **Sample data is exempt and sample implementation is not.** A registry, a keyframe table or a knob set carries no
  comments; a factory that computes is utility, documented wherever it sits — which is why generators live in
  `Generators/`.

### `orientation` is the one axis word, and its values are `horizontal` and `vertical`

The user's rule. A control laying its children along one axis and walking them with arrows takes
`orientation: "horizontal" | "vertical"` — ARIA's own values, written straight through to `aria-orientation`.
`SplitPane`'s divider is the exception, since a separator's orientation is opposite to its panes'. Not `dir`, which
is text direction and is read by the keyboard walk too; not `row`/`column`, reserved for grid cells. **A direction
keeps its own word** (`Staircase`'s `dir: "up" | "down"`), and **a thing that turns names what it turns about**
(`axis: "row" | "column"` on `Barrel`, `Wheel`, `FlipCard`). Older `decisions.md` entries saying `dir` or
`row`/`column` for an axis mean `orientation`.

### Prop prefixes

| Kind                                          | Prefix               | Examples                                                                     |
| --------------------------------------------- | -------------------- | ---------------------------------------------------------------------------- |
| Data                                          | none                 | `isVisible`, `joinRadii`, `hrefs`, `visibleCorners`                          |
| Factories / predicates / transforms with args | `compute*`           | `computePoints`, `computeFillDefs`, `computeIsDisabled`, `computeClassNames` |
| Events / lifecycle                            | `on*`                | `onShow`, `onHide`, `onClick`; **`onMount` for controller handoff**          |
| Markup producers                              | `render*`            | `renderContent` / `renderTab`; nested defs use `renderDefsElement`           |
| Two-way state the component also writes       | none (the bare stem) | `visibility`, `checked`, `value`                                             |

A `get*` prefix appears only on hand-written members that are getters — a controller's or a context's
(`WheelController.getIndex`), and a render callback's parameters in Solid (`renderStep(getStep, getState)`). One
`compute*` prefix covers every factory; whether an argument is reactive is carried by its shape, a value or a
getter, never by a second prefix.

### Asking for a state a thing is already in does nothing

Settled for the whole library. **Opening an open thing, closing a closed one, playing what is playing, showing what
is shown, highlighting what is highlighted — each is a no-op**: nothing fires, nothing is notified, nothing re-read.
A request says where things should end up, not that a transition should run (a re-opened `Menu` used to jump its
highlight back to the first item). **The guard lives in the transition**, not at the call sites, and **notifying
the consumer counts as work** — re-selecting the selected tab does not call `onSelectionChange`. Outside the rule: a
**toggle** always acts, an **explicit restart** is a command, and a **multi-select pick** of a selected value
deselects it.

### Argument order for a helper that attaches to a component

A helper a component sets up once and that keeps working for it — an observer, a tracker, a focus helper, a
frame-rate monitor — takes the element first (if any), then the on/off condition (visible, disabled — phrased as
disabled rather than enabled), then an options object. The order is the same everywhere; the name and the argument
form differ:

- Solid: `create…` or a verb, each argument a getter — `ElementObserverSolidUtils.createViewportRectObserver(getRef,
getIsVisible, opts)`, `FrameRateMonitorSolidUtils.create(getIsDisabled, opts)`.
- React: `use…`, the element as a ref object, the condition a plain value —
  `ElementObserverReactUtils.useViewportRect(ref, isVisible, opts)`.
- Vue: `use…`, each argument a ref or getter — `FocusManagerVueUtils.useAutoFocus(ref, isVisible, opts)`.
- Svelte: as Solid — `ElementObserverSvelteUtils.createViewportRectObserver(getRef, getIsVisible, opts)`.

**An observer's name carries its coordinate space**, because the wrong space fails silently, a plausible number off
by the `Viewport` scale. The viewport rect observer reports position and size through
`ViewportUtils.getAdjustedBoundingClientRect`, scale divided out.

### SVG / factory arg order

Primary args → **defs** → **opts** → **extra** (injected elements or custom render logic) last:
`computeLinearGradient(defs, custom?)`, `computeSVGDefs(id, flags, defs)`,
`computeBreakpoints(type, idx, lineCount, defs, opts?)`.

### One aggregated object per painter, named `*Flags` only when it is all flags

The user's rule. A painter receives **one** object, never positional arguments a consumer must declare and ignore
to reach the fourth; data it needs goes into that object. **`*Flags`** when every member is a boolean or a choice
from a fixed set (`ButtonFlags`); **`*RenderProps`** once it carries a payload — an index, a value, a date, a
position. A component's own boolean-only extras stay `*Flags` even when the merged object a painter receives is a
`*RenderProps`.

**A record the consumer handed over travels ahead of the aggregate, as its own argument** — the user's call:
`renderStep(step, flags)`, `renderTab(tab, flags, placement)` and every list-of-records control read that way
(each argument a getter in Solid).
Anything derivable from the record is read off it, not copied into the flags. A painter with no record behind it
keeps the one object.

**A run of tuning numbers becomes a defs object; genuine operands stay positional** — the user's rule.
`(pos, count, origin, 4, 0, 1, 2, 3)` gives a reader nothing to check the order against, so it takes
`{ quadrantsPerSection, clockDownMul, … }`; `greatestCommonDivisor(a, b)` stays as it is. A defs object on a
per-frame path is a module-level `const` passed by reference, not built at the call.

### A grid index names its space and its axis, never `x` and `y`

The user's rule. A row-and-column index reaching a consumer is **`dataRow`, `dataCol`, `layoutRow`, `layoutCol`** —
never an `x`/`y` pair (same type, swaps compile into a plausible wrong cell) and never a bare `rowIndex` (a grid
that sorts, filters, virtualizes or reorders columns has two different numbers per cell). `data*` indexes the
arrays as given, `layout*` is the painted position; a component publishing both holds both, sorting an array of
indices so the original survives, rather than searching per cell. It travels as its own argument, never inside
the flags. `Index2d` (`{ row, col }`) is the pair type, and the name at the call site says which is meant.

**`width` and `height` are lengths, in pixels unless the name says otherwise; a tally of cells is a count** —
`{ rowCount, colCount }`, or an `Index2d` named for what it tallies. **A length in any other unit carries the unit
in the nearest name the reader sees** — the user's choice: `sizeShare`, `NODE_SIZE_SHARE`, or on the fields where
nothing holds them (`PlacementRect` is `{ leftShare, topShare, widthShare, heightShare }`). `Share` is a fraction of
the container's width, on both axes. A name that already says ratio (`aspect`) needs nothing added. The name only
warns — a mix-up still compiles, and that was accepted.
