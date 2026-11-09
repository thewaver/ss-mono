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
`build-config.md` for the Vite config.
`api-naming.md`, `state-and-timing.md`, `interaction-and-layout.md` and `code-pitfalls.md` for the component and
Playground sources: how props and helpers are named and shaped; shared state, popups and timers; pointer, focus and
layout; and a few general coding traps. A new rule goes in a scoped file when it can only matter while such a file
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

### An optional feature costs nothing until it is asked for

While an option is unset, its work is not done — no observer attached, no listener subscribed, nothing computed —
or every instance on every page pays for a feature it does not show. **Guard the work on the option, and only the
work**: anything else on the same path, such as a reference the keyboard needs, stays unconditional. A helper set
up before anyone knows whether it will be used offers a way to be set up without starting.

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
