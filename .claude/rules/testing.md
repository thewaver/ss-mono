---
paths:
    - "e2e/**"
    - "**/*.test.ts"
    - "playwright.config.ts"
    - "vitest.config.ts"
---

# Conventions: specs and unit tests

Where each kind of test lives and how it is written. The type check and the real-window check for rendering fixes
apply to every change, so they are in `conventions.md`. How specs are run — which ones, in the background, `@solo`
filters — is in `CLAUDE.md`.

### Verifying interaction: `e2e/` at the repo root

**At the repo root**, so neither the library nor the demo ships it; it drives the _built_ Playground and imports
nothing from either tree. `npm run verify:dom` runs it; `verify:dom:ui` opens Playwright's runner.

**Playwright, rather than a driver of our own.** A hand-written DevTools Protocol driver measured an element and
clicked that point a frame later, so anything that re-anchored in between was clicked where it used to be.
Playwright re-checks that an element is visible, stable and hit-testable at the instant it acts, and gives every
test a fresh page. **One test per behavior**, `beforeEach` navigates, workers run in parallel. Prefer the
auto-retrying `expect(locator)` forms, which make waits unnecessary.

**A test that the machine's load can move runs alone, tagged `@solo`** — the user's rule. A scroll that must
settle, a painted box read mid-turn, a sampling loop inside a live region's window: these fail under a full
parallel sweep and pass alone, and a red that is about the machine teaches everyone to re-run instead of look. The
`chromium` project excludes the tag; a `solo` project runs the tagged tests afterwards with one worker, through
`dependencies`, and is skipped when the main project goes red. **The tag is earned**: watch the test fail in a sweep
and pass alone first — one that fails both ways is broken.

Things Playwright cannot do for us, each of which reads as a component bug:

- **`aria-disabled` controls need `{ force: true }` to be clicked**, since Playwright treats them as disabled — and
  proving the click does nothing is the point.
- **Opening a popup is two steps that land in either order** — highlight and focus — so wait on both
  (`aria-activedescendant` and `toBeFocused` for `Menu`); a key pressed between them is lost.
- **An element under a looping CSS animation can never be clicked**, because it is never stable. Focus it and press
  Enter instead (`elementHighlight.spec.ts`).
- **No IME API**: `TextSync`'s composition handling is driven through `page.context().newCDPSession(page)`.
- **Touch taps only**, and synthetic touch events from page script are ignored by the browser's scrolling, so a real
  finger's scroll-or-dismiss is driven with `Input.dispatchTouchEvent`, in `drawerTouch.spec.ts` alone (the touch
  context is per file).

`backlog.md`, under _"What the verification suite still cannot see"_, carries the gaps.

### Unit tests: `vitest`, colocated, and only for functions

`e2e/` reaches only what a click reaches; a function taking rectangles and returning a placement has no page, so
`npm test` calls library functions directly. **If it renders, it is a spec; if it returns a value, it is a unit
test.** `environment: "node"`, no jsdom — jsdom has no layout engine and would invite rendering tests.

**Node must still load Solid's client build**, or `createEffect` never runs and `createMemo` never recomputes, with
no error — a test can pass asserting the opposite of the truth. `vitest.config.ts` sets `ssr.resolve.conditions`
and `ssr.resolve.externalConditions` to `["browser", "development"]`; a plain `resolve.conditions` does nothing,
because vitest resolves through its SSR pipeline. An effect created inside `createRoot` runs as `createRoot`
returns, then every write flushes synchronously, so a reactive test builds its subject inside `createRoot` and
drives and asserts outside it.

**Tests sit next to the function** as `<Name>.test.ts`, are typechecked with their package and never ship. **Assert
the behavior, not the implementation**: each case names a situation (an overflowing placement flips to the side with
room) and its numbers are worked out from it. Families of functions are covered by property — every weight stays in
0..1, is deterministic — not by pinned grids that any change would re-bless wholesale.

**Not covered**: anything that needs a real element — a layout, an observer, `matchMedia`, an animation frame — which
is `e2e/`'s half. The line runs where the DOM starts inside a module, not at the file. A stand-in is honest only where
the API it replaces has no geometry (`contains` can be faked; `getBoundingClientRect` cannot). The SVG defs builders
keep their arithmetic inside markup, so they are not reachable yet. **A known-broken case is pinned rather than
fixed** (`CellAnimation.utils.test.ts`'s out-of-range weights), so the fix re-blesses it rather than quietly passing.

### The suite finds a demo by a key it was given, never by the caption it displays

A locator built from editorial text answers "did the behavior change" and "has somebody edited the copy" in one red.
So every variant, example and props row carries a key chosen once and never displayed.

**A container states its kind as a bare attribute and its key in `data-testid`** — `[data-variant]`,
`[data-example]`, `[data-prop]` — so a `beforeEach` can wait on the kind's presence, and a lookup searches only one
kind. `variant`, `example` and `prop` in `e2e/helpers.ts` are the only spellings; a props row is found by
`[data-prop][data-testid="…"]` within its variant, since row keys repeat across variants. **The key is required** on
`VariantDefs`, `ExampleDefs` and `PageProp`, so the compiler names every site. A props row's key is the signal it
drives (`spinDurationMs`).

**A key may be renamed deliberately; it may never be derived from a caption** — the user's call. A rename moves in
one change with everything that names it: the `path`, the example file, its component, any composed `id`, the
spec's locators.

**A demo control a spec drives carries an `id`, found by `#key`** — the user's call, over a keyed wrapper (grows a
box) and a test-only library prop. Controls already take an `id` and put it on the element a spec wants. A control
rendered more than once composes its id (`defaultNextMonth`, `boundedNextMonth`), and where the id has nowhere to
land, the Playground component gains the prop, not the library.

**Sound locators besides keys**: a role, role description or state attribute (`[role="log"]`, `[aria-disabled]`) —
published contract, meant to break when it changes; an accessible name that **is** the assertion; a name the
library owns; a structural locator where a control is the only one of its kind (a toast's only button); and a
control rendered once per datum (a radio named `Small`, an option `Denmark`), because the datum is the fixture.

### An assertion reads the mapping, not the value

The user's rule, and the same argument as the keys one step further in. A hardcoded style answers "did the wiring
break" and "has somebody restyled it" in one red — **a border going from `1px dashed` to `2px solid` is a change,
not a failure**. So an assertion checks the relationship: the element came back carrying the class it was mapped
to, and that class is not the one something else was mapped to. **Where a spec has no way to separate a change from
a failure, it does not check that thing at all.** CSS a spec may read is state, not paint — `visibility`,
`animation-play-state`, a floater's `transform`, `caret-color` on a disabled field.

### A spec never counts things that can change for editorial reasons

The user's rule: examples, menu entries, tiles — any collection someone may add to or trim without touching a
behavior — is not a number a spec pins. Where a claim sits under the count, read the count off the page (every
radio group's name differs from the others'); where none does, delete the assertion. **A count inside one demo
stays** — five records give five items, a month shows six weeks — because it moves only when data or arithmetic
does. To check that a page has examples at all, use `toBeGreaterThan(0)`.

### A test enters input the way a person does

`fill()` or setting `.value` from script goes around a field that cannot be clicked, focused, or is painted over.
**Click the field, then type**, which fails exactly where a person would.
