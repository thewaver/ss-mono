# Conventions

Rules that hold across the whole library, and the reasoning behind them, so they are not re-litigated. This is
what would otherwise be code comments.

**What belongs here.** A rule earns a place only if it would be written again from scratch in another project on
the same backbone — SolidJS, vanilla-extract, Vite. Anything explaining one component, one abstract's internals,
the shape of this repo or the Playground is a decision about _this_ codebase and lives in `.claude/decisions.md`.
The two cross-reference each other by heading name.

**This file plus the scoped files beside it.** This one loads in every session. Each other file names what it
governs in its `paths` header and loads once one of those files is read or written: `solid.md` for the Solid
packages, `reactive-effects.md` for the three frameworks that track what an effect reads, `controls.md` for the
component and Playground sources, `styling.md` for stylesheets, `testing.md` for specs and unit tests, and
`build-config.md` for the Vite config. A new rule goes in a scoped file when it can only matter while such a file
is open, and here otherwise.

**A rule that holds in every framework is written in terms of what the component and the consumer do**, with one
line per framework naming the mechanism where the mechanisms differ, so a session in any one of them reads it
without translating.

Open problems are in `backlog.md` at the repo root; nothing here is a task.

## House rules

### House style

`const DEFAULT_X = …` at module scope, one blank line between logical blocks, and a prop with a default resolved
in one place rather than at each read. Props are read as `props.x`, never destructured — except in Svelte, where
`$props()` is destructured for its `$bindable` members and the rest are read through `props`. Types live in the
owning component's own `<Component>.types.ts`, never in a shared per-directory types file even when siblings
consume them; a shared `Xs.types.ts` is unwound rather than extended. Names drop a redundant directory prefix
(`ExampleDefs`, not `PageExampleDefs`).

### Dividing by a constant is written as multiplying by its reciprocal

The user's rule: `width * 0.5`, never `width / 2` — `* 0.25` for four, `* 0.125` for eight, up the powers of two.
For a power of two the two forms are the same value bit for bit, so converting one can never move a pixel or
flip an assertion, and that is why it applies everywhere, `e2e/` included. A divisor whose reciprocal is not
exact in binary stays a division — `/ 3`, `/ 60`, `/ 100`, `Math.PI / 180` — because `* 0.333…` or `* 0.01` is a
different number in the last bit.

**It is not about speed.** Measured: V8 already turns a division by a power of two into a multiply, so the two
spellings run identically. A real division (`/ 3`, `/ 100`) costs about twice a multiply — fine everywhere it
appears today, worth knowing before putting one in a per-frame, per-cell loop.

**A ratio is not a disguised division.** `box.x + box.width * 0.2` or `count * 0.05` is a point on a 0-to-1 scale
or a tuned coefficient and stays a multiplication. The test is whether the number means "divide by a count" —
halve a width, quarter a size — not whether it happens to equal `1/N`. **A rounded decimal standing in for a
fraction does convert**: `* 0.33` and `* 0.66` meaning thirds become `/ 3` and `(x * 2) / 3` — doubling first,
so there is one rounding rather than two.

**Where a file already names its numbers, a named constant beats a bare `0.5`** (`HALF`, `NOTHING`, `SINGLE` in
`Barrel`, `Bracket`, `TileBoard`, `SortableGrid`), and the name must agree with the value — `const HALF = 2` was
correct arithmetic under a name that said the opposite.

### At an edge value, clamp the input and keep one formula

When a calculation misbehaves at the end of its range, do not branch for the edge case: two formulas rarely agree
where they meet, so the output jumps at the boundary, and the branch adds a mode every reader must remember.
**Clamp the input** to the range where the one formula is right and let it run to the edge. A caller who wants
what the branch used to give asks for it through the existing inputs.

### `aria-hidden` is always written with a value

`aria-hidden` written with no value renders `aria-hidden=""`, which is not a true value: the attribute is a
true/false enumeration, an invalid value falls back to the default, and the default is not hidden. Checked in
Playwright's accessibility tree. **Write `aria-hidden="true"`**, and give every other true/false ARIA attribute
its string.

### A `<button>` always states its `type`

The user's rule. A `<button>` with no `type` is a submit button, so once it lands inside any `<form>` — a
consumer's, a dialog's — pressing it submits and reloads. `type="button"` on every button not meant to submit,
`type="submit"` on the one that is.

### A style reuses an existing painter first, the theme second, and its own values last

The user's rule. Before a Playground example, page or sample paints anything, it uses a painter in
`StyledComponents` that already draws that kind of thing; failing that, it builds from `themeVars`; only when
neither fits does it write its own. A painter written for one example is a second answer to a settled question,
and the two drift. **A design asking for an exception is argued before it is built**: first whether something
existing covers it, then whether the new look can join the design as a variant or token others could use. A true
one-off is the last resort, and the case for it goes to the user before any code.

### A frequently changing value is passed as a getter, and read only after a cheap test says it is needed

In a framework that updates only what read a value — Solid, Svelte, Vue's computed values — every instance that
reads a value changing on each pointer move is subscribed to every move, even when only one uses it, and a helper
taking the value as an argument has already read it at the call site. **Hand over a getter and call it only once a
cheap test has passed** — is this the item on top, the item under the pointer. React re-renders anyway, so it
passes a getter returning the value it already has and loses nothing.

### A timer that must survive its effect re-running is armed in the effect and settled in its cleanup

An effect re-runs whenever anything it depends on changes, so a countdown cleared and restarted at the top of the
effect restarts from full on every unrelated change and can be postponed indefinitely. **Arm it for the time that
is left, and in the effect's cleanup clear it and subtract the time that passed since it was armed.** The effect
then depends only on what changes the countdown — its duration and whether it is paused.

- Solid: `onCleanup`, called inside the effect.
- React: the function returned from `useEffect`.
- Vue: `onWatcherCleanup`, called inside the watcher.
- Svelte: the function returned from `$effect`.

### A key from outside the code is looked up as an object's own key

Every plain object inherits `constructor`, `toString` and the rest, so `table[name]` with a `name` from a person,
from content or from a consumer finds a built-in function when the name is `constructor`. **Check
`Object.hasOwn(table, name)` before reading.**

### A sort comparator answers every pair consistently, so sort only once every item can be compared

Given an inconsistent comparator, `Array.prototype.sort` may return any order, the reverse included. The usual
cause is answering "equal" for an item that lacks what the comparison needs, such as an element not yet mounted.
**Sort only once every item can be compared, and keep arrival order until then.** The fault hides wherever the
next render recovers, and shows the moment the order decides something that does not.

### Word boundaries in text are found with Unicode letter classes, never `\b`

`\b` knows only ASCII word characters, with or without the `u` flag, so capitalizing after a boundary turns
"état" into "éTat". Use property classes under `u` — a letter with no letter or digit before it is
`(?<![\p{L}\p{N}])\p{L}`. It matches `\b` on ASCII and keeps every other script intact.

### An optional feature costs nothing until it is asked for

While an option is unset, its work is not done — no observer attached, no listener subscribed, nothing computed —
or every instance on every page pays for a feature it does not show. **Guard the work on the option, and only the
work**: anything else on the same path, such as a reference the keyboard needs, stays unconditional. A helper set
up before anyone knows whether it will be used offers a way to be set up without starting.

### Code imported for behavior never imports a string-keyed table of variants

Tree-shaking — the bundler dropping imported code nobody uses — cannot see through a table looked up by string
(`{ line: lineFn, spiral: spiralFn }`), so it keeps every entry, however many files they are split across.
**The machinery takes the variant itself; the table is a separate export**, imported only by code that really
holds a name at run time — a dropdown, a saved setting — and a convenience call taking a name lives beside it.
**A TypeScript `namespace` compiles to one object and is all-or-nothing the same way**: a fine home for machinery
used together, the wrong one for variants chosen from.

### A rotation and a centering offset on one element have to be ordered, or the element leaves its point

A transform list applies right to left, so `translate(x, y) rotate(a) translate(-50%, -50%)` rotates the
centering shift along with the element and leaves it half its own size off the point, in whatever direction it
faces. Write `translate(x, y) translate(-50%, -50%) rotate(a)`. It looks right at nought degrees and on any square
element, which is why it survives review; an oblong shows it.

### A component that turns in 3D takes the room of its content at rest, and a turn spills past it

The user's rule. Something turning under perspective is drawn larger on its near side part-way through a turn, so
it reaches past its own box; that spill is allowed. **What the box is sized to is the content at rest**, and room set
aside only for the bulge of a turn stands empty whenever nothing moves. A solid that shows several faces at rest — a
drum of three faces or more, a die — is sized to that silhouette, since it is content at rest. Where which face rests
in front varies, the faces the box is sized for are decided once rather than followed (a cuboid is sized to its front
face), so the page never moves as it turns.

### `isFocused` is focus and `isFocusVisible` is the ring

Both reach every painter, and confusing them rings a control somebody clicked.

- **`isFocused`** — does this hold focus. What a text field wants: clicked into, it has a caret and should look it.
- **`isFocusVisible`** — should focus be advertised, and it is the browser's answer: `wrapElement` reads
  `element.matches(":focus-visible")` on `focus` and on `keydown` (a pointer-focused control becomes
  focus-visible once somebody types), and clears it on `blur`. Nothing reimplements the heuristic; the browser
  already keeps the keyboard verdict across a roving widget's programmatic `.focus()`.

**A ring, outline or halo reads `isFocusVisible`; anything else about being focused reads `isFocused`** — the
user's call, applied to every painter.

**A control that focuses something itself must check what the browser then says.** A programmatic `.focus()`
inherits the last input modality, which is right for arrow keys and wrong for a drag: `ColorArea` focuses an axis
from its drag handler after `preventDefault()`, the browser cannot see the pointer and reports focus-visible, so
the component suppresses it while dragging.

**Where real focus is on a descendant, the component publishes its own focus-visible state**, named for it
(`focusVisibleThumb`, `focusVisibleAxis`) and re-read on `keydown` — a prop saying "focused" and meaning
"focus-visible" is the confusion this entry exists to prevent.

**Not gated on disabled.** `isHovered` and `isActive` are forced false while disabled; focus is not, because a
disabled item that is still reachable must keep its ring or focus lands somewhere invisible.

### Consult WCAG before settling any interaction, and say what it said

Asked for by the user. **Look it up** — not after the argument, not as a review pass, not only when a control looks
unusual. The library's own arguments are about ownership, slots and flags, and none of them produces a normative
requirement: `SlideButton`'s keyboard route was argued and pinned in a spec and still covered half of Level AA,
because 2.5.7 is about pointers. **Cite the criterion by number and quote the normative line** — the Understanding
documents are routinely the opposite of the guess (2.5.1 does not govern a slider that only drags). **Say what it
said even when it changes nothing** — "checked 2.5.7, the route conforms" — or nobody can tell a criterion
considered from one never opened. Where it conflicts with a convention, `CLAUDE.md`'s _"WCAG outranks"_ decides.

### Consult OWASP before settling anything that handles input, identity, data or secrets, and say what it said

The security counterpart, asked for by the user, for the same reason. Wherever the library touches that ground — a
parser turning a consumer's string into markup, a URL handed to an `href`, anything a consumer passes that reaches
the DOM — look up the Top 10 or ASVS first, **cite it by number, quote the requirement, and say what it said even
when it changes nothing**. Conflicts are decided by `CLAUDE.md`'s _"OWASP outranks them the same way"_.

### An accessibility mistake the library can detect is warned about, never blocked or filled in

The user's rule, in two parts. **The library always ships the accessible way**: for every affordance a criterion
needs there is a builtin that gets it right with nothing from the consumer but where to put it and how it looks.
**When a consumer's choice leaves a control failing a criterion and the library can tell, it warns loudly in
development**, naming what is missing — it does not refuse to render and does not draw a fallback. The consumer
owns the product and may decide looks outweigh a criterion, as they can by hiding a focus ring; the library makes
sure that is never decided by accident. **No option silences the warning.** A fallback is also refused because
placing it is exactly the layout decision the slot existed to hand over.

### Moving a focused element in the document drops its focus, so put it back

Moving a node — `insertBefore`, `append` — removes it first, and removing the focused element sends focus to the
body; the next key goes nowhere. **A component that reorders its own children notes which holds focus and focuses
it again afterwards**, with `preventScroll`.

### A box that scrolls with nothing focusable inside is itself focusable while it overflows

WCAG 2.1.1: a keyboard user scrolls a box by focusing something in it, and a box of only text and images has
nothing to focus. Copying recent Chrome's rule: **while it overflows and holds nothing focusable, it takes
`tabindex="0"`**, kept current by observing both conditions. **It takes `role="region"` only when it has a name**,
since a region requires one.

### A subtree is disabled with `inert`, not `pointer-events: none`

`pointer-events: none` is inherited, so any descendant that sets the property itself takes presses again, and it
leaves focus and the accessibility tree untouched. **`inert` disables the subtree for pointer, focus and the
accessibility tree whatever its descendants declare** — use it for anything present but not operable right now.

### Text meant only for screen readers is transparent or visually hidden, never `visibility: hidden` or `display: none`

Those two remove the element from the accessibility tree too. Text that must be heard and not seen is either
`color: transparent` (in layout and tree) or the visually-hidden pattern (a one-pixel clipped box out of the flow,
in the tree only). What is drawn over it carries `aria-hidden="true"`, so the two are not read together.

### An item is revealed by scrolling only the scrollers between it and its container, never with `scrollIntoView`

`scrollIntoView` scrolls every scrollable ancestor, the document and `overflow: hidden` containers included — so
revealing a row of an unpositioned popup jumps the page. **Walk from the item up to the container that owns it,
scrolling each scroller by the least that shows the item, and stop there**, in each scroller's layout pixels so a
scaled ancestor does not skew it. The exception is an item that holds focus among scrollers the component does not
own: there `scrollIntoView` does what the platform would have done had focus not used `preventScroll`.

## API naming

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

## Shared state and timing

### A control whose value is a pair holds one composite value, not two

The user's decision. A range's two ends, or a date with a time, is **one value**, never two the consumer keeps in
step: a date range is `{ start, end }` (the fields `Range` ships), with the half-picked state held by the
component, and a date-time is a value type in `Abstracts`, not a `{ date, time }` assembled at the call site. It
was settled before either was built because a date-time **range** would otherwise inherit two shapes. React Aria
answers both the same way.

### A text field corrects a value only when it is committed, never on each keystroke

Correcting while typing makes values untypeable — with a minimum of 40, the `5` that begins `50` becomes `40`. The
same happens when the owner corrects what a field reports and writes it back. **A correction happens on commit —
blur, Enter — or not at all**; until then a refused half-typed value stays in the text and is not reported. A step
from an arrow key or a button is a whole gesture and is corrected at once. **A control that can be handed a value
it refuses refuses it itself**, so no owner has to remember not to correct.

### A field keeps the text it shows apart from the value it holds, and only the reader moves the value

The user's model, replacing an earlier "show nothing" rule that hid from the reader what was wrong. Every input holds
two things: **the text it shows**, which the reader may edit into anything, invalid included ("#FFCCGG", "25:61"),
and **the value it holds**, which changes only when the reader's edit makes the text valid — until then it stays at
the last valid value, or none. Invalid text raises the error and nothing else.

- **Only the reader's edits change the value.** A field never writes a value it produced itself: not by rewriting its
  text under new settings and reading that text back, not by clamping, rounding, snapping to a step or picking the
  nearest option on mount or when a prop changes — the one exception being a limit's correction on blur, below. Each of those turns a value nobody chose
  into one that survives a round trip — `CurrencyInput` turned a held −250 into 250 when its sign was switched off.
- **A value handed in that the field may not hold under its current settings is shown as its text, marked as an
  error, and kept as it is**: −250 with no sign allowed shows "−250.00", flagged, and the consumer still holds −250.
  The reader can edit it like any invalid text; the value moves only once the edit is valid. When the settings allow
  it again, the same text is simply valid again — nothing is remembered or restored.
- **A format is enforced by an error; a limit is enforced by a correction on blur** — the user's split. A format is
  what the value is (a sign, a number of decimals, a date or time pattern, a colour notation): breaking it raises the
  error and moves nothing. A limit is where the value sits (a `min` and `max`, an earliest and latest date or time):
  a value outside one is kept as typed or as handed in, and pulled to the nearest bound when the field loses focus,
  edited or not, as `NumberInput` always did. It holds for every input with a limit — `NumberInput`, `CurrencyInput`,
  `DateInput`, `TimeInput`. The user took it with low certainty; it is to be revisited once lived with.

**The user widened the old rule, and that part stands**: any conversion into a form that cannot hold the value — a
storage format, a payload, a file, a serialized string — fails loudly rather than approximating. The one accepted
exception is `DateValueUtils.withCalendar`, which clamps silently; it is in `backlog.md` under _"Accepted limits"_.

### A popup's open state is private until a consumer asks for it

The user's call. `Select`, `MultiSelect`, `Menu`, `ColorInput` and `DatePicker` take an optional `visibility`,
`Modal`'s prop under its name and rules. **One value, both sides write**: a popup opens and closes for its own
reasons, so a one-way "obey this boolean" prop would fight it.

- Solid: a signal pair, `visibility={[getIsOpen, setIsOpen]}`.
- React: a `[value, setValue]` pair, `visibility={[isOpen, setIsOpen]}`.
- Vue: `v-model:visibility`.
- Svelte: `bind:visibility`.

**Left unshared, the component keeps its own, through one code path** — a helper answering with the consumer's
value when shared and the component's own otherwise, so no use site branches:

- Solid: `SignalMirrorSolidUtils.createOptional(() => props.visibility, false)`.
- React: `SignalMirrorReactUtils.useOptionalState(props.visibility, false)`.
- Vue: `useTwoWay(props, "visibility", false)`, from the package's `propUtils`.
- Svelte: `visibility = $bindable(false)` in `$props()`; an unbound bindable is already the component's own.

**Where a write can be refused, the component holds no copy.** A copy that already flipped never hears about the
refusal — an `Accordion` section required to stay open showed closed in its header while the list said open. So the
shared value is handed straight through:

- Solid: `SignalMirrorSolidUtils.createPassThrough(getValue, setValue)`. A `T` that is itself a function can only be
  written through an updater.
- React: hand the `[value, setValue]` pair on as it is.
- Vue: bind the value and its `onUpdate:` listener to the source; `useTwoWay` then shows only what the consumer holds.
- Svelte: a function binding, `bind:expanded={() => value, (next) => …}`.

**Every side effect of opening or closing hangs off the state, not off the path that changed it** — clearing a
highlight, moving a calendar to the value's month, placing the initial highlight all run in an effect keyed on the
open state, so a popup closed from outside ends where a click outside would leave it. **An invariant the component
owns is enforced against the state**: a disabled `Select` or `Menu` written open writes `false` back.

### A popup's anchor is also its dismiss root, which is what lets a consumer's own button toggle it

`Popover`'s dismiss roots are `[the popup, the anchor]`, so a press on the anchor is not an outside press. A
consumer's own toggle button is made the anchor (`Menu`'s optional anchor ref), or pressing it while open would
dismiss the popup and the handler re-open it. A split button is then a composition: the arrow half is the anchor.
A context menu opened at the pointer anchors to a rect (`anchorRect`), which nobody can press, so its dismiss root
is the component's own region.

### A popup opened from inside a popup is not outside it

Popups are portalled to the end of the document, so a `Select` list opened inside a `DatePicker` calendar is a
sibling, not a descendant, and `contains` calls a press on it outside. `DismisserUtils.getIsWithinOwnedLayer`
walks up from the target and, at any element something points at with `aria-controls`, jumps to that controller
and keeps going. **Ownership is already in the markup** for screen readers, so nothing is registered on open. This
fixes containment only; it is not the layer stack `backlog.md` asks for.

### A portalled layer's z-index is one above its anchor's

The number comes from the anchor, not a register of layers: `AnchorUtils.getStackingBase` takes the highest numeric
`z-index` on the anchor's ancestors and the layer uses that plus one, recomputed each time it becomes visible — so a
chain of popups orders itself. Not an open-order stack, because a `Modal` opened from a menu should still cover that
menu, and the library should not invent a number that competes with the consumer's stacking. `Tooltip` takes the
same number; a portalled layer cannot paint under its own anchor.

### A component that sets `z-index` on its own parts makes its own stacking context

A `z-index` is compared only within one stacking context, and `position: relative` does not start one, so indices a
component gives its parts escape and compete with a dialog's counter or a consumer's header. **The component's root
starts a stacking context with `isolation: isolate`** (`z-index: 0` would also place the root among its siblings,
which is the consumer's business). **A layer painting behind the content sits at a negative `z-index` inside it**,
or it takes presses meant for the content. **A `backdrop-filter` layer is the exception**: `isolation`, `clip-path`
and `mask` each make a Backdrop Root that blinds the filter, so there the context is `position: relative; z-index: 0`
and a layer needing clipping clips itself.

### Playback is a two-way value; a rewind is a command

The user's call. **Whether a thing is playing is state, so it arrives as an optional two-way `playback`**
(`CellAnimation`, `ScanlineAnimation`, `AudioSwitcher`), shared and kept private exactly like `visibility`: a signal
pair in Solid, a `[value, setValue]` pair in React, `v-model:playback` in Vue, `bind:playback` in Svelte. A page
writes one shared value instead of collecting controllers.

**A value shared across a page governs whatever mounts later**, so anything mounted into a different lifetime — a
modal, a portal, a route — gets its own value, or it inherits a state nobody decided for it (a stress-test modal's
animations mounted into "stopped" and never ran).

**A command that is not a state stays a handle handed over through `onMount`**: `Typewriter`'s `restartAnimation`,
`AudioSwitcher`'s `reset`. A restart cannot be faked by toggling a value, because the element must be painted in its
starting state for a frame before the animation re-applies, and the browser may fold an off-and-on into one paint.
**The test is whether a consumer can meaningfully read it**: playing, open, selected, expanded are values; restart,
rewind, re-measure are commands.

### An animation something waits on is backed by a timer, and a transition's end is asked of the browser

A page that is not painting stops delivering animation frames while timers keep running. Where something waits on
an animation — a dialog handing focus back when its fade ends, a spin announcing its result — frames alone leave the
state half-changed. **So what must finish also runs on a timer, whichever arrives first completes it**, the
completion is safe to run twice and the loser is canceled. Pure decoration gets no timer.

**A CSS transition's end is asked of the browser**: it is over when every animation in
`element.getAnimations({ subtree: true })` has finished (the subtree, since the animating element is often the
consumer's), awaited with `Promise.allSettled` because cancellation rejects. A timer for the duration plus a margin
stays as the backstop, for an element animating nothing or an endless animation. A transition reversed part-way
starts a second wait; a counter stops the older wait from declaring the newer one done.

## Pointer and keyboard

### A pointer gesture swallows the click that ends a drag, and takes pointer capture only past a small movement

Press, move and release is still a `click`, so a drag ends by also doing what a tap does. **Swallow exactly one click
after a gesture that moved**, with a capture-phase `click` listener on the gesture's root. **Take pointer capture
only past a few pixels of movement**: capture on `pointerdown` would send every click to the capturing element, so a
plain press would never reach its target.

### A hover the pointer did not cause is ignored

The browser fires a fresh `mouseenter`/`mouseover` whenever the layout moves under a resting pointer — a popup
opening, a list scrolling — so a control acting on enters moves its highlight or opens a submenu by itself. **A hover
counts only from `pointermove`**, which a still pointer never sends. (Comparing an enter's point with the last move
fails for slow movement, since enters report whole pixels; `movementX` reads zero either way.) The item a popup
opens on top of still sees the smallest twitch as movement, so where that matters it ignores the pointer until it
has left and come back, as a desktop context menu does (`MenuUtils.createOpeningHoverGuard`).

### The 1D walk is a pure function, not a hook

`NavigatorUtils.computeNextPosition(key, from, length, opts)` takes positions and returns one, knowing nothing
about what is walked, because every control already owns its cursor, each differently (`RadioGroup` starts from
`document.activeElement`). `orientation` chooses which arrows step and defaults to `"vertical"`, the narrowest —
**when unsure, a default does less**, since one that steals `ArrowLeft` from a text field breaks something nobody
asked about. `hasEdgeKeys` gates `Home`/`End`. The abstract answers _which position is next_; the control answers
_whether to go there_. A second axis arrives as a sibling function, not a mode.

**A factory is right when the state it would own belongs to nobody else.** A walker's cursor is already held by every
consumer, so a factory would be a second copy; `SelectionUtils.create` passes because the anchor a shifted pick
measures from lives in no consumer's data. **Transient state is held as the thing, not its position**: an anchor
kept as an index silently addresses whatever arrives at that index after a sort or filter; kept as the item and
resolved with `indexOf`, it moves with its row and resolves to nothing once the row is gone.

## Layout

### What a component reports runs at its own rate, never at the gesture's

The user's rule. A control driven by a continuous gesture has two jobs — change the thing, and tell the consumer
what it now is — and the second is rarely wanted at the first's rate. **Throttle the report, don't debounce it**: a
debounce waits for a pause the person may never make; a throttle reports at once, then at a bounded rate, with a
trailing call so the final value lands. Anything watching the report inherits the delay, so check it before choosing
the interval. A value derived from accumulated state is measured on a clock the input cannot move.

### An element positioned from a measurement is kept out of the layout the measurement reads

A marker placed by measuring its neighbors must not move them: in the flow, it pushes them, the next measurement
moves it, and it oscillates. The same loop forms when an element moves the box its own reading comes from. **Position
it out of the flow** (`position: absolute`, offset from the measured rects), **or measure something it cannot move**
— the layout at rest, or a still container rather than the element transformed inside it.

### A mask changes what is painted, not what can be clicked

Hit testing ignores `mask`, so a masked hole still swallows clicks; `clip-path` removes the clipped region from hit
testing. **A layer letting presses through a hole uses `clip-path`**, or pairs a masked painted layer carrying
`pointer-events: none` with a transparent layer clipped to the same hole.

### A data URI in a CSS `url()` is quoted

An unquoted `url(…)` cannot hold an unescaped parenthesis, and an SVG data URI almost always has one (`hsl(…)`,
`url(#id)`) that `encodeURIComponent` leaves alone; the browser drops the declaration silently. **Write `url("…")`**
with the value's own double quotes encoded.

### A measured rect and a written offset are in different spaces inside a `Viewport`

`getBoundingClientRect` is on-screen; an inline `top`/`left` is layout. Inside a `Viewport` they differ by its scale,
which is 1 whenever the window matches the design size — and always in a default headless browser, so a spec passes
while the code is misplaced on every real machine. **Divide by `viewportContext.getScale()` on the way from a
measurement to a written offset, or measure in layout space** (`offsetWidth`, `offsetTop`,
`ViewportUtils.getAdjustedBoundingClientRect`). Never convert a measurement compared against the pointer's own
coordinates: `clientX` and a client rect are both on-screen. `ElementObserver`, `Anchor`, `Range`, `Scroller`,
`SlideButton`, the drum and `Sortable` each record their instance of this.

**The user widened it for specs**: wherever the test environment differs from a real one in a way the code depends
on — scale, timezone, locale, screen size, input device — the spec forces the real-world condition, because the
default is exactly where the bug cannot show.

## Verifying work

### Work is not reported done until the type check passes

Run `tsc --noEmit` on every package the work touched (`npm run typecheck -w components` for the core) before
handing over. `vitest` strips types without checking them, so a test file with a real type error still passes, and
the build typechecks only what declarations reach — never the tests.

### A rendering fix checked only headless is not checked

Headless and unaccelerated browsers draw filters, backdrops, masks and compositing on the software path, which
disagrees with the GPU path in both directions. **A fix to how something is drawn — as opposed to where it sits or
what it does — is unverified until seen in a real, GPU-accelerated window.** A test-runner screenshot is evidence
about the software path only.

## US English everywhere

The user's rule: every word in the repository — code, strings, file names, comments, documents — is US English:
`color`, `center`, `neighbor`, `behavior`, `-ize` (`normalize`, `serialize`), `traveled`. **A spelling the platform
owns is kept**: `aria-labelledby`, and the props named after it (`labelledBy`). Words like `emphasis`, `analysis`,
`promise` and `cancellation` are already correct.
