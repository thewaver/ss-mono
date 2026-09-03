# Conventions

Rules that hold across the whole library, and the reasoning behind them, so they are not re-litigated.
This is what would otherwise be code comments.

**What is in here and what is not.** A rule earns a place here only if it would be written again from
scratch in another project built on the same backbone — SolidJS, vanilla-extract, Vite. Anything that
explains one component, one abstract's internals, the shape of this repo or the Playground is a decision
about _this_ codebase rather than a convention, and lives in `decisions.md`. The two files are read the
same way and cross-reference each other by heading name.

Open problems are in `backlog.md`; nothing here is a task. How to work with the user is in `CLAUDE.md`.

## House rules

### House style

`const DEFAULT_X = …` at module scope, `createMemo` for derived props with a default, one blank line
between logical blocks, no destructuring of `props`. Types live in the owning component's own
`<Component>.types.ts` — never in a shared per-directory types file, even when several siblings consume
them. `StressTestDefs` beside `StressTestProps` is the precedent; a shared `Xs.types.ts` is to be
unwound rather than extended, and names drop the redundant directory prefix (`ExampleDefs`, not
`PageExampleDefs`).

Read a neighbouring component before writing a new one.

### `aria-hidden` is always written with a value

`aria-hidden` in JSX with no value renders `aria-hidden=""`, and an empty string is **not** a true value:
the attribute is a true/false enumeration, an invalid value falls back to the default, and the default is
not hidden. So the bare form hides nothing while looking in every review like it does. Checked rather than
recalled — an element carrying `aria-hidden=""` is still in the accessibility tree Playwright reports,
beside one carrying `aria-hidden="true"` which is not.

It was written bare in 37 places across both trees, against 17 written properly, so every decorative glyph
the Playground paints — the tree's `▶`, the select's `✓`, a drag handle's `⠿` — was being announced next to
the text it decorates. **Write `aria-hidden="true"`.** The same holds for any other true/false ARIA
attribute: give it the string.

### An event handler prop is bound once, so reading a signal in it rebuilds the element

`onClick={handle(getItem())}` and `onKeyDown={handle(getKey(), getRow())}` look like the attribute forms
beside them and behave completely differently. The compiler wraps an **attribute** expression in its own
effect, so `aria-label={getLabel()}` re-runs on its own and updates one attribute. An **event handler** prop is
assigned once, from the surrounding render expression — so the call in it is evaluated while that expression is
being tracked, and every signal it touches becomes a dependency of the whole insert. When one of them changes,
the insert re-runs and the element is **replaced**, taking its focus, its pointer capture and anything else the
platform was holding on it.

Found in `PatchBoard`, where a socket's handlers were bound as `handleSocketClick(getPlaced())`: `getPlaced()`
is an object that changes identity whenever the board's geometry is recomputed, which is every time a carry
starts. Picking up a cable therefore rebuilt the socket the person had just pressed, focus fell to the body,
and every arrow key afterwards went nowhere — the component looked as though its keyboard route had never been
written.

**Write the handler as an arrow that reads inside itself**: `onClick={(e) => handleSocketClick(getPlaced(), e)}`.
The arrow is a constant, nothing is tracked at bind time, and the reads happen when the event fires. The same
applies to a `ref` callback, which also runs inside the insert's tracking scope.

**A string-valued memo is safe and does not need the treatment**, because a memo that recomputes to an equal
string notifies nobody — so binding on a stable key costs nothing. It is the object-valued and array-valued
reads that bite, since a fresh object is never equal to the last one.

### A rotation and a centring offset on one element have to be ordered, or the element leaves its point

`transform: translate(x, y) rotate(a) translate(-50%, -50%)` reads as "put it there, turn it, and pull it back
by half itself", and does not do that. The list applies right to left, so the `-50%` shift happens **before**
the rotation and is turned along with the element: the box then sits half its own width away from the point it
was placed at, in whatever direction it happens to be facing. At nought degrees it looks perfect, which is why
it survives review.

Order it `translate(x, y) translate(-50%, -50%) rotate(a)`. The rotation applies first, about the element's own
centre — `transform-origin` is `50% 50%` by default and applies to the whole list, not per function — and the
centring shift is then a fixed vector the rotation cannot reach, so the centre lands on the point at every
angle.

**A square element hides this and an oblong shows it**, by half the difference between its sides. Found in
`Trail`, whose traveller wandered off the curve on the bends of a closed loop while looking exactly right along
the straights: the demo marker is a circle and never showed it, and the demo vehicle is a chevron and did.
`e2e/trail.spec.ts` now asks how far the traveller is from the nearest point of the path rather than from the
point at the reported progress, which is the only form of the question that has an answer at every angle.

### `isFocused` is focus and `isFocusVisible` is the ring

Both are on `InternalInteractionFlags`, both reach every painter, and confusing them draws a focus ring on a
control somebody clicked.

**`isFocused` answers "does this hold focus".** It is what a text field wants: a field clicked into is
focused, and it should look it — a caret is blinking in it.

**`isFocusVisible` answers "should the focus be advertised", and it is the browser's answer rather than
ours.** `wrapElement` reads `element.matches(":focus-visible")` on `focus` and again on `keydown`, and clears
it on `blur`. Nothing here reimplements the heuristic: the browser already tracks the input modality, already
makes a text field focus-visible when it is clicked and a button not, and already keeps the keyboard verdict
across a programmatic `.focus()` — which is what a roving widget's arrow keys do, so a walked-to item still
gets its ring. It is re-read on `keydown` because a control focused by pointer becomes focus-visible the
moment somebody types into it.

**A ring, an outline or a halo reads `isFocusVisible`; anything else about being focused reads `isFocused`.**
This came out of `TileBoard`, whose tile drew its ring on every click, and the user's call was that every
painter follows: `SlideButton`, `TagInput`'s chips, `Range`'s thumbs, `ColorArea`'s marker and the `Shape`
page's example all read the focus-visible half now. Nothing in the library reads `isFocused` for paint any
more; it is there for a painter that wants the other question.

**A control that focuses something itself has to say so, or the browser will guess wrong.** The heuristic
reads the input modality, and a programmatic `.focus()` inherits whatever the last interaction was — which is
right for a roving widget's arrow keys and wrong for a drag. `ColorArea` focuses its saturation axis from the
drag handler so the keyboard carries on from where you pressed, and `trackPointer` has already called
`preventDefault()` by then, so the browser cannot see the pointer and reports focus-visible. The component
suppresses it while `getIsDragging()` is true. **Anywhere a component calls `.focus()` in response to a
pointer, check what the browser then says about it.**

**Where the focus is a descendant's, the flag cannot answer and the component publishes its own.** `wrapElement`
watches one element, so a control whose real focus lands on one of several children — `Range`'s thumbs,
`ColorArea`'s two axes — has to track it. Both did already, as `focusedThumb` and `focusedAxis`; both now
answer the focus-visible question instead and are named for it, **`focusVisibleThumb` and `focusVisibleAxis`**.
A prop that says "focused" and means "focus-visible" is the confusion this whole entry exists to prevent, so
the rename was not optional. They are re-read on `keydown` for the same reason the flag is.

**Do not gate it on disabled.** `isHovered` and `isActive` are forced false while a control is disabled,
because a disabled control is not being hovered or pressed in any sense that matters. Focus is different: a
disabled item that is still reachable — `isFocusableWhenDisabled` below — must keep its ring, or focus lands
somewhere invisible.

### Consult WCAG before settling any interaction, and say what it said

Asked for, after checking WCAG on `SlideButton` turned a settled decision into a
conformance gap nobody had noticed. **At the very least, look it up** — not after the argument, not as
a review pass, not only when a control looks unusual.

**It earns a standing rule because this library's own instincts do not cover it.** The arguments
recorded here are about ownership, slots, flags and who has to know what; none of them would ever have
produced 2.5.7, because a normative requirement is a fact about the outside world rather than a
consequence of the design. `SlideButton` is the shape to expect: the keyboard route was decided, argued
and pinned in a spec, and was still half of what Level AA asks, because 2.5.7 is about **pointers** and
every argument had been about keyboards.

**Cite the criterion by number and quote the normative line.** Understanding documents carry the
deciding part and it is routinely the opposite of the guess — 2.5.1 Pointer Gestures reads as though it
governs any dragging and does not, because a slider using pointer capture is dragging only, not a
path-based gesture. A criterion named without being read is the same failure as a browser-support claim
from memory.

**Say what it said even when it changes nothing**, in the reply and in the entry: "checked 2.5.7, the
existing route conforms" is worth a line, since otherwise nobody can tell a criterion that was
considered from one never opened.

## API naming

### `AccessorProps` — props take a constant or an accessor, and carry no `get` prefix

A prop declared `indent: number` is written by the caller as either `indent={12}` or `indent={getIndent}`, and is
read inside the component as `access(props.indent)`. `AccessorProps<T>` maps each non-skipped key to
`MaybeAccessor<V>`, which is `V | Accessor<V>`. Skipping is unchanged — functions, symbols and `Signal`s pass
through untouched.

**Why the prefix went.** The user's reason is go-to-definition: the old mapped type synthesised `getIndent` from
`indent` through a key remapping, and no IDE can invert a template-literal key transform, so ctrl-clicking a
prop name inside a component always landed nowhere. The type is now homomorphic and keeps the key, so the jump
works. Their second argument: they write their own signals as `[getX, setX]`, but the docs write `[x, setX]`
without marking that `x` is a getter, and the prop side reads the same way. The prefix therefore does not
reappear inside the body either.

**Where the prefix stays.** Controllers, context types, handles and render-callback parameters
(`WheelController.getIndex`, `FormContextType.getIsValid`, `renderStep(getStep, getState)`) are hand-written
declarations that ctrl-click already resolves, and the reason above does not reach them.

**`access(props.x)` at the point of use, not a resolver at the component root.** The first build normalised the
whole props object once, through a proxy, so the body could read `p.indent()`. That is gone. The proxy had to
guess from each runtime value what the type already knew — and guessed wrong twice, once wrapping `undefined`
into a truthy thunk (which silently disabled typing in every text field, because `if (opts.computeMaskedText)`
became true and every keystroke took the masked path) and once wrapping a plain object prop declared beside the
block. It also needed a hard-coded `children` exemption and could not see through a type parameter, so every
generic component hand-wrote its accessor anyway. Reading at the use site confines the guess to where it is
written. It is also faster, not slower: measured over five million reads of a signal-backed prop, the proxy ran
at ~33M reads/s against ~67M for `access` — the trap and the `Reflect.get` indirection cost more than a
`typeof` check. The contrary claim made when the proxy was chosen was never measured and was wrong.

**A plain value can still be reactive, and this is the point the whole design turns on.** `<Cmp x={sig()} />`
compiles to `{ get x() { return sig(); } }` — verified against `babel-preset-solid` — so reading `props.x`
inside a tracking scope re-runs `sig()` and tracks it. A native element gets an effect instead of a getter,
since it has no body to defer to. Two consequences. Reading a prop once at setup takes a snapshot, as anywhere
in Solid. And a helper that resolves a prop to an accessor eagerly — `asAccessor(props.x)` — freezes that
snapshot, which is why no such helper exists here.

**Handing an accessor onward needs `() => access(props.x)`; reading does not.** Inside an effect, a memo or JSX
the surrounding tracking scope is the deferral, so `access(props.x)` is enough. The arrow is only for the few
sites that pass a function to something which calls it later — `SignalMirror.createValueMirror`,
`TextSync.createValueSync`, `LabelUtils.resolveAriaLabel`. Where the target's parameter is itself optional, the
handoff is gated on presence, `props.x === undefined ? undefined : () => access(props.x)!`, because the target
distinguishes "no accessor" from "an accessor returning undefined".

**Forwarding a prop to a child needs neither.** `min={props.min}` passes the `MaybeAccessor` straight through,
because the child's own prop accepts both forms.

### What the mapped type skips, and the two holes in it

**These entries were written when `AccessorProps` produced `getX` names — every one still holds now that it
produces the plain name, because the skip test is unchanged.** Read `getX` below as the prop's plain name and
`Accessor<V>` as `MaybeAccessor<V>`; the shape of each hole is the same, only the spelling differs.

Skips **only** functions, symbols and the two signal forms. Everything else — arrays, `Set`, `Map`,
`Date`, `Node` / `HTMLElement`, plain objects — is accessorized. Refs are declared as
`elementRef: HTMLElement | undefined`.

**`SignalPair<T>` is named in the skip test beside `Signal<T>`, and it has to be.** A `SignalPair` is a
tuple of two functions rather than a function, so the "is it a function" arm does not catch it; and
`IsSkippable` distributes over the `SignalSource<T>` union, so a test naming only `Signal<any>` resolves
to `true | false`, which is `boolean`, which is not `true` — and the prop is silently accessorized into
something no consumer can satisfy. Both members are named, so both arms answer `true`.

**A generic prop cannot pass through it.** `AccessorProps<{ value: T }>` produces no `getValue`: the
key filter depends on `IsSkippable<T>`, which cannot resolve while `T` is unbound, so the key is
silently dropped and every use site fails with "property does not exist". Declare generic props by hand
beside the accessorized block — `RadioProps<T>` writes `getValue: Accessor<T>`, `RadioGroupProps<T>`
keeps `valueSignal: Signal<T>` outside its `AccessorProps<{...}>`. The type compiles and the prop just
vanishes, so check for it whenever a generic component is added.

**It also cannot express an optional prop whose own value may be `undefined`, and a ref is exactly
that.** `AccessorizedPart` maps an optional key to `Accessor<Exclude<T[K], undefined>> | undefined`, so
the `undefined` is stripped from the _return_ type. `initialFocusRef?: HTMLElement` yields
`getInitialFocusRef?: Accessor<HTMLElement>`, which a consumer's `createSignal<HTMLElement>()` cannot
satisfy — an element ref does not exist until mount. Existing refs sidestep it by being **required**
(`Tooltip`'s `anchorRef: HTMLElement | undefined` is not optional, so the union survives). An
_optional_ ref is declared by hand: `ModalProps` writes
`getInitialFocusRef?: Accessor<HTMLElement | undefined>`, as `InteractionWrapperProps` already did with
`getTooltipDefs`. One rule: if the prop mentions a type parameter, or its value can itself be
`undefined`, write the accessor out.

**The rule bites on plain numbers too, not only on refs.** A wheel's `idleDelayMs` is absent when the wheel is
not to turn on its own, so a consumer switching that off at runtime has to return `undefined` from the accessor
— and the accessorized form will not let them, because it promises a `number`. `RotatorDefs` and the three
wheel props types therefore all declare `getIdleDelayMs?: Accessor<number | undefined>` by hand. Worth stating
because the ref cases read as being about refs: **any optional prop whose meaningful "off" value is `undefined`
is in the same position**, and the type error arrives at the call site rather than at the declaration.

**Outside those two holes, a props type is one `AccessorProps` block and nothing else, and the test is
whether the prop mentions a type parameter.** Restated by the user in exactly those terms — one place decides
what a prop's shape is, or two spots fight for control of it. So a signal, a callback, a record or an array
goes _inside_ the block like everything else and the mapped type sorts it out: `Signal`s and functions are
skipped, so putting them in changes nothing about their type and everything about where a reader looks. What
sits outside is what cannot go through — anything naming `T`, the `undefined`-valued optional above, and the
`ScrollerStepper` shape below. A hand-written `MaybeAccessor<X>` moving into the block loses that wrapper,
since the block adds it.

Intersecting another _named_ props type is not a split and stays: `Omit<InteractionWrapperProps<…>, …> &
AccessorProps<{…}>` is composition, and the named half has its own single block.

The rule was also stated once before, after a sweep of the Playground turned up sixteen types declaring
`getX: Accessor<T>` by hand where no type parameter and no `undefined`-valued optional was involved. Writing the accessor out is the exception the two
paragraphs above license, so a hand-written one carries the claim "this is one of those cases" — and when it
is not, the claim is false and the reader has to check the mapped type themselves to find that out. Where a
prop genuinely cannot go through, it sits in an intersection beside the block rather than replacing it:
`ScrollerButtonProps` is `AccessorProps<{ step: ScrollerStep }> & { stepper: ScrollerStepper }`, because
`ScrollerStepper` is an object of functions rather than a function, so the mapped type would accessorize it.

**An intersection handed _to_ `AccessorProps` is fine, and it is the `ScrollerStepper` shape that is not — the
two are easy to confuse.** `AccessorProps<A & B>` was checked against the flattened equivalent and the two are
mutually assignable with identical keys, for plain aliases, for interfaces, for nested intersections and for
overlapping keys; optional modifiers survive and function-valued keys are still skipped. This matters because
`WheelProps` and `ButtonProps` are both built that way and would have to be unpicked if the opposite were
believed. What actually caught `ScrollerStepper` is the `IsSkippable` test: it asks whether the value **is** a
function, and an object whose fields are all functions is not one.

**A required prop typed `T | undefined` is the way through the second hole, and it beats an optional one.**
The Playground's `WheelExampleProps` declares `idleDelayMs: number | undefined`, which accessorizes to
`getIdleDelayMs: Accessor<number | undefined>` — the shape the library wants — where `idleDelayMs?: number`
would have produced `Accessor<number>` and refused the "off" value. The cost is that the prop can no longer be
omitted. That is the right trade for an example page, whose props all arrive from one `commonProps` object
that supplies every field anyway; a library prop a consumer may legitimately leave out is still written by
hand, which is why `WheelSlots.getIdleDelayMs` stays optional.

**`ParentProps` wraps the parameter, never the type.** Stated by the user. A props type describes what the
component is configured with; children are how the caller nests markup inside the element, which is a fact
about the JSX call rather than about the configuration. So the declaration stays bare —
`type PageWheelCardProps = AccessorProps<{ state: WheelWedgeState }>` — and the signature reads
`(props: ParentProps<PageWheelCardProps>)`. It also keeps the type composable: a `ParentProps<X>` cannot be
intersected or `Omit`-ed without dragging `children` along, and every type that spreads into another would
inherit a `children` it never renders.

### Prop prefixes

| Kind                                          | Prefix                        | Examples                                                                                       |
| --------------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------- |
| Reactive data (via `AccessorProps`)           | `get*`                        | `getIsVisible`, `getJoinRadii`, `getHrefs`, `getVisibleCorners`                                |
| Factories / predicates / transforms with args | `compute*`                    | `computePoints`, `computeFillDefs`, `computeIsDisabled`, `computeClassNames`, `computeSVGDefs` |
| Events / lifecycle                            | `on*`                         | `onShow`, `onHide`, `onClick`; **`onMount` for controller handoff**                            |
| JSX producers                                 | `render*`                     | `renderContent` / `renderTab`; nested defs use `renderDefsElement`                             |
| Two-way state the component also writes       | `*Signal` (plain, unprefixed) | `visibilitySignal`, `checkedSignal`, `valueSignal`                                             |

One `compute*` prefix for all factories — reactivity is carried by **argument shape** (`size` vs
`getSize`), not by a second prefix.

### Signal tuples for two-way state

State the component both reads _and_ writes arrives as the whole `createSignal` pair, not an accessor
plus a callback: `<Modal visibilitySignal={modalVisibility} />`. `AccessorProps` skips it like a
function, so the prop keeps its plain name. One variable, both sides write, owner and component cannot
disagree, and there is no handler to forget. Callers that only open the thing drop the getter:
`const [, setModalOpen] = modalVisibility`.

Use it only where the component genuinely writes. One-way data stays `get*`.

**A `*Signal` prop takes a getter and a plain setter as readily as a `Signal`, and that removes the
cost this entry used to accept.** The cost was that the owner had to _have_ a signal, so state living
in a memo, a store field, a route param or a pair of callbacks had to be wrapped in a mirror before a
control would take it — one indirection, written once per consumer wrapper. The prop type is
`SignalSource<T>`, which is `Signal<T> | SignalPair<T>` where `SignalPair<T>` is
`[get: () => T, set: (value: T) => void]`, so a consumer holding the two halves passes them straight in:
`valueSignal={[() => access(props.value), props.onInput]}`.

**The two forms differ in exactly one way, and the control absorbs it.** A real `Setter<T>` also accepts
an updater function and resolves it against the current value; a plain setter takes a value. So a control
declaring `SignalSource<T>` cannot call `[1]` with an updater until it has normalised the prop, and
`accessSignal(() => props.xSignal)` beside `access` in `propUtils` is that normalisation: it returns a
real `Signal<T>` that reads through the getter, resolves an updater against the untracked current value,
skips a write that would not change anything, and calls the plain setter. **It takes an accessor of the
prop rather than the prop**, so the returned pair stays correct if the consumer swaps the source, and it
owns no state of its own — one line at the top of the control, and the rest of the body is unchanged.

**A mirror is still the answer when the consumer's setter refuses values.** `accessSignal` is a
pass-through: what the control shows comes from the getter, so a setter that drops some writes leaves the
control showing the old value. That is right for a consumer who is filtering, and wrong for a field that
must be able to hold a half-written value the owner has not accepted yet — which is what `SignalMirror`'s
inner signal is for. `createOptional` and `createPassThrough` are both `accessSignal` underneath, so the
family has one definition of how a pair becomes a signal.

**A signal handed _out_ stays a real `Signal`.** Where the library gives a consumer a signal to drive — a
picker's `hsvSignal`, a calendar's `monthSignal` inside a render callback — widening it would take the
updater form away from the consumer for nothing. The widening is on what a control _accepts_.

### Asking for a state a thing is already in does nothing

Settled for the whole library. **Open an open thing, close a closed one, play what is
playing, show what is shown, highlight what is highlighted — every one is a no-op.** Nothing fires,
nothing is notified, nothing is re-read.

**A state request states where things should end up, not that a transition should run.** A caller
saying "open" is saying "be open"; work done anyway is work they did not ask for, invisible at the call
site and surfacing as a side effect elsewhere — the `Menu` case that produced this rule re-opened an
already-open menu and the only effect was the highlight jumping back to the first item.

**The guard belongs in the transition, not at the call sites.** One `if` inside `open` is a property of
the component; the same `if` at four call sites is a thing the fifth caller will not know about. Same
argument as _"Anything that has to happen because the popup is open belongs to the state, not to one of
the ways in"_ under `DatePicker`.

**Notifying the consumer counts as work.** Re-selecting the selected tab must not call
`onSelectionChange` again; the callback is how a consumer learns the value _changed_.

**Three things are outside the rule**: a **toggle** requests an inversion so it always acts; an
**explicit restart** (`Typewriter`'s) is a command, and restarting something already running is exactly
when it means something; a **multi-select pick** of a selected value deselects it, which is a change.

### Accessor or plain value

Ask: **who needs to track this value, and when?**

- **Accessor** — parent passes a signal/memo _without reading it_; callee may subscribe later.
- **Plain value** — parent already reads in the same memo/effect, or the value cannot change during the
  call.

Shortcut: **if calling `fn(x())` would lose a subscription the callee needs, pass `x`; otherwise
`x()`.**

| Argument                                          | Where                                               | Shape                         |
| ------------------------------------------------- | --------------------------------------------------- | ----------------------------- |
| `getVisibilityTarget` / `getTransitionDurationMs` | Modal / Tooltip / ElementHighlight render callbacks | accessor                      |
| `getPlacement`                                    | `Tooltip.renderContent`                             | accessor                      |
| `getSize` / `getClipPath` / `getClipPoints`       | `Shape.renderChildren`                              | accessor                      |
| `getSize`                                         | `computeFillDefs` / `computeStrokeDefs`             | accessor (optional subscribe) |
| `getInteractionFlags`                             | sample `computeSVGDefs`                             | accessor                      |
| `index`                                           | `Tabs.renderTab`, `computeIsDisabled`               | plain                         |
| `size`                                            | `computePoints`                                     | plain                         |
| `timeline` / `index`                              | Scanline `compute*Animation`                        | plain                         |

### Hook-like util arg order

`ref` (if any) → enabled / visible / disabled → opts / defs. Prefer `getIsDisabled` over
`getIsEnabled`. Examples: `ElementObserver.createViewportRectObserver(ref, visible, opts)`,
`InteractionTracker.wrapElement(ref, disabled, opts)`, `FocusManager.autoFocus(ref, visible)`,
`ElementFader(visible, opts)`, `FrameRateMonitor.create(disabled, opts)`.

**An observer's name carries its coordinate space**, because the wrong one fails silently — it returns
a plausible number wrong by the `Viewport` scale factor. `createViewportRectObserver` polls on
`requestAnimationFrame` and reports position **and** size through
`ViewportUtils.getAdjustedBoundingClientRect`, scale divided out. It was briefly `createObserver`, which
said neither what was measured nor in which space.

### SVG / factory arg order

Primary args → **defs** → **opts** → **extra** (injected elements / custom render logic) last. Merging
defs and opts is desirable later but is a deeper refactor. Examples:
`computeLinearGradient(defs, custom?)`, `add*Filter(defs, custom?)`, `computeSVGDefs(id, flags, defs)`,
`computeBreakpoints(type, idx, lineCount, defs, opts?)`.

### One aggregated object per painter, named `*Flags` only when it is all flags

Stated by the user. A painter receives **one** object, never a run of positional arguments — the reason being
that positional arguments make a consumer declare and ignore three of them to reach the fourth. So data a
painter needs goes **into** the aggregate beside the booleans, rather than into an argument of its own.

What changes is the **name**, and the name is decided by what the object holds.

- **`*Flags`** when every member is a boolean or a choice from a fixed set — `isFocused`, `isDisabled`,
  `isPressed`, `sortDirection`, `orientation`, `checkedState`. A collection of flags is what the word means,
  and a type named that way is telling a reader there is nothing else in it. `ButtonFlags` is the shape this
  is right for.
- **`*RenderProps`** the moment it also carries a payload — an index, a value, an array, a date, a colour, a
  position. The object is then not a set of flags, and calling it one misdescribes it.

A component's own contribution keeps its own name under this test, independently of what it is combined with:
a boolean-only extras type stays `*Flags` even where the merged object the painter actually receives is a
`*RenderProps`, because the merged type is a different type and gets named on its own merits.

### A grid index names its space and its axis, never `x` and `y`

Stated by the user. Anywhere a row-and-column index reaches a consumer it names both which axis it counts and
which ordering it counts in: **`dataRow`, `dataCol`, `layoutRow`, `layoutCol`**. Never an `x` / `y` pair, and
never a bare `rowIndex` / `columnIndex`. It travels as its own argument, never inside the flags record — see
the rule above.

Two separate faults are being closed. **`x` and `y` do not say which is which**: a reader has to know that
`y` counts rows and `x` counts columns, and the two are the same type, so swapping them compiles and produces
a plausible wrong cell. **`rowIndex` alone does not say which ordering it counts in.** A grid that sorts,
filters, virtualizes or lets its columns be reordered has two different numbers for the same cell: where the
record sits in the array the consumer handed over, and where the cell sits on screen. Naming only one of them
means the component silently picks, and the consumer inherits the choice without being told.

So `data*` is the index into the arrays as given, and `layout*` is the position as painted. A component that
publishes these has to actually hold both — sorting an array of indices rather than an array of rows, so the
original position survives the sort — rather than deriving the missing one by searching, which is a scan of
the data per cell.

`Index2d` in `@thewaver/ss-utils` is the pair type, keyed `row` and `col`. Its name leans towards an index,
but a tally and a zero-based index are the same two numbers — `TileBoard`'s `tileCount` is an `Index2d` as
much as the tile it addresses is — and the name at the call site is what says which is meant.

This is the same rule as _"an observer's name carries its coordinate space"_ above, on a discrete axis instead
of a continuous one, and it exists for the same reason: the wrong one fails silently, returning a number that
looks right.

## Control architecture

### Controls: wrapper owns behaviour, leaf owns the element

Settled when `InteractionWrapper` was split out of `Button`.

**The composition is an implementation detail, not the consumer's job.** `Button` _is_
`InteractionWrapper` wrapping a private `ButtonElement`, and consumers still write
`<Button {...props} />`. Leaf-only with no preset was tried and reverted the same day: it pushed a
six-line `renderControl` block into all eight call sites and put `setElementRef` / `getFlags` /
`getIsReachable` — wiring that should be opaque — in the consumer's face. Follows `Surface`, which
composes `Shape` and keeps `SurfaceSVG` / `SurfaceDiv` unexported. `ButtonElement` is likewise
unexported; `InteractionWrapper` stays public for custom controls.

**What the wrapper hands a leaf is the wrapper's type, not the leaf's.** `InteractionControlProps`
(`id` / `flags` / `isReachable` / `ref`) lives in `InteractionWrapper.types.ts`, declared unaccessorized
so each leaf applies `AccessorProps` itself. Anything applicable to every wrapped element belongs there;
only element-specific props (`ButtonCbs`) stay with the leaf. `ButtonProps` is derived rather than
restated — `Omit<InteractionWrapperProps, "renderControl"> & AccessorProps<ButtonCbs & { id?: string }>`
— so wrapper props reach consumers automatically as the wrapper grows.

**The tooltip anchors on the leaf, not the wrapper.** Anchoring on the wrapper div was rejected: it
drags in four changes to `Tooltip` (`focusin`/`focusout` instead of `focus`/`blur`, a `:has(:focus-visible)`
guard, rerouting `aria-describedby` to the control, losing `pointer-events: none` so the hover region
grows to the wrapper box). `Tooltip` was not modified at all by the split — keep it that way.

**Disabled is one mechanism for every control: `aria-disabled`, never the native attribute.** This
replaces an earlier split where native `disabled` was the default and `aria-disabled` was used only in
reachable mode. Native `disabled` blocks activation for free but kills every event, so the tooltip
explaining _why_ a control is disabled becomes unreachable exactly when it matters — hence the split.
What the split could not do is look the same in both modes: the UA paints a natively disabled control
greyed and drops `accent-color`, and no CSS reproduces that on the `aria-disabled` branch. Appearance
parity is non-negotiable (next section), so the mechanism has to be uniform, and only `aria-disabled`
supports both modes.

Accepted cost: activation gating lives in JS for _every_ disabled control, and disabled controls are no
longer excluded from form submission — they were never form-bound here, and one that must be excluded
can carry the attribute at that point. The gating is unchanged: `Button.tsx` returns early in `onClick`,
`Checkbox.tsx` calls `preventDefault` on click so the pre-click checkedness toggle is reverted, and both
gate `onMouseEnter` / `onMouseLeave` too, since native `disabled` used to suppress those.

Three things had been leaning on the native attribute:

- **Tab order.** `wrapElement` sets `tabIndex = !isDisabled || isReachable ? 0 : -1` for every wrapped
  element. That line used to sit inside `applyButtonSemantics`, which was right when only a
  div-acting-as-button needed it. `role` / `ariaDisabled` / `cursor` stay opt-in there, because forcing
  `role="button"` onto an `<input>` breaks it.
- **Focus traps.** `FOCUSABLE_SELECTOR` in `Focus.utils.ts` is written as `button:not([disabled])` and
  so on, so a disabled control with no attribute started matching and a disabled `Button` inside a
  `Modal` would have taken autofocus. `isReachable` now rejects `tabindex="-1"` up front, which is the
  correct tab-order rule anyway: `-1` means programmatically focusable, not tab-reachable. It also fixes
  `Tabs`, whose roving-tabindex links matched `a[href]` and were all collected regardless of state.
- **Reachable mode is no longer visible to a leaf.** `getIsReachable` as a third `renderControl`
  argument and `isReachable` on `InteractionControlProps` existed only so a leaf could compute its own
  native `disabled`. Both are gone — reachability stops at `wrapElement`, which is the "wiring should be
  opaque" argument applied one level further in.

**Removing tab order is not enough; mouse focus has to be refused too.** `tabIndex = -1` still allows
click focus. This was originally recorded as a consequence with no fix worth building, since nothing is
drawn — `:focus-visible` does not match on mouse focus and `isFocused` stays false because non-reachable
mode attaches no listeners. `TextInput` disproved the premise: a focused text input blinks a caret
regardless, so a disabled field invited typing it would silently refuse. `wrapElement` now attaches one
listener in its disabled-and-not-reachable branch — `mousedown` with `preventDefault()`, the event whose
default action is focusing. Same "activation gating lives in JS" shape as `Button`'s `onClick` return,
applied to focus, uniform across every wrapped control. Disabled controls also stop being
text-selectable by drag, which matches native `disabled`.

Reachable controls are untouched: the branch runs only when disabled **and** not reachable.

One hole remains, deliberately: clicking a `<label>` caption still focuses a disabled control, because
label activation focuses the labelled control directly rather than dispatching `mousedown`. After the
caret suppression below nothing is drawn in that state, so it lands back on the previously acceptable
condition; the only catch-all — blurring from a `focus` handler — buys it with focus flicker and a jump
to `<body>`.

The reachable predicate has two ways in, and the second one arrived with `TileBoard`:

```
reachable = isDisabled && ((isReachableWhenDisabled && tooltipDefs !== undefined) || isFocusableWhenDisabled)
```

Deriving the mode from `getTooltipDefs` presence _alone_ was rejected, and the distinction generalises:
**presence as a trigger fails invisibly** — add hover text and disabled semantics change under you —
while **presence as a guard fails toward the safe default**, only when a prop was explicitly set, and is
findable with a warning. The third clause exists because a focusable `aria-disabled` control with
nothing to reveal is worse than one skipped by the tab order. Two cases it knowingly shuts out, each
earning its own prop if it shows up: an explanation living elsewhere on the page (inline error,
validation summary) needing only `aria-describedby`, and composite widgets where skipping disabled items
makes the set read as incomplete. A control reachable while disabled must keep its focus ring — focus
landing somewhere invisible is worse than being skipped.

**The second of those two showed up, and `isFocusableWhenDisabled` is the prop it earned.** A grid whose
items are disabled one at a time — `TileBoard`'s refused tiles — needs the arrows to reach them, because a
walk that skips them leaves somebody reading with a screen reader unable to find out what shape the set is.
Two things broke without it, and neither is about the tab order the tooltip clause was written to protect.
The disabled branch of `wrapElement` attaches no listeners, so `isFocused` stays false for ever and the
painter draws no ring — the focus-ring sentence above, failed. And `tabIndex` is forced to `-1` on every
disabled element, so **a roving widget whose current item happens to be disabled has no tab stop at all**
and cannot be entered from the keyboard.

**It is unguarded, and that is not a loosening of the clause it sits beside.** The tooltip guard exists
because a focusable disabled control with nothing to reveal pollutes the tab order; an item in a roving
widget is `tabindex="-1"` unless it is the current one, so there is no tab order to pollute and nothing for
a guard to protect. Hover and press are still forced false while disabled, so the only flag that gets
through is `isFocused`, which is exactly the one a focus ring needs. **Set it only on an item inside a
composite**, and gate it on the composite itself being enabled — `TileBoard` passes
`isFocusableWhenDisabled={() => !isDisabled}`, so a board switched off as a whole is skipped entirely.

**The third clause reads the value, not the prop — settled with `Select`.** It was
`props.getTooltipDefs !== undefined`, now `props.getTooltipDefs?.() !== undefined`, which also decides
whether the `Tooltip` renders. Not a loosening: the clause asks _"is there anything to reveal"_, a
property of the value. Prop presence was an exact proxy only because a hand-written control that passes
`getTooltipDefs` always returns something. A group rendering items from records breaks the proxy — the
field is absent on most options, so the group forwards
`getOption().tooltipDefs && (() => getOption().tooltipDefs!)` and a function returning `undefined`
crashes the spread into `Tooltip`. Reading the value makes the honest form the only form, and it types
as `Accessor<InteractionTooltipDefs<TExtra> | undefined>`.

**Presence as a guard survives where it is load-bearing, which is the opt-in.**
`getIsReachableWhenDisabled` is still an explicit prop and still carries "only when asked". The
`console.warn` for reachability-without-a-tooltip stays presence-based on purpose: it catches the
authoring mistake it was written for and stays quiet for a group that forwards both fields
unconditionally and legitimately has options with neither.

The render is `<Show when={getTooltipDefs()}>` with the accessor child form rather than `&&` plus `!`.
Non-keyed, so a record rebuilt under `<Index>` does not remount a visible tooltip and restart its fade;
the accessor child removes the non-null assertion.

**Disabled + reachable has to look disabled — identically, not approximately.** Reachability is an
accessibility affordance, not a state: a control that looks actionable but does nothing is worse than one
that plainly reads as unavailable. Under the old mechanism split this failed on screen — `CheckboxPage`'s
"Disabled" box sat next to a "Disabled + reachable" box in full accent colour, looking like the one
control you were meant to click.

Two rounds were needed and the first is the lesson. It kept both mechanisms and layered one appearance
on top: `filter: grayscale(1)` plus `opacity: 0.5` on `interactionDisabled`, set from `getIsDisabled()`
alone so it covers both. That killed the accent colour and was a real improvement, but it could only
narrow the gap, because the two branches start from different UA paint under the same filter. Emulating
the UA per control instead (`accent-color: GrayText` on `[aria-disabled='true']:not(:disabled)`, then a
rule per control type) trades one approximation for a longer list. Approximating a rendering no spec
defines is not a way to reach "equal" — the mechanisms had to converge, which is what the section above
does.

**Nothing that fades or filters may touch the element that owns the focus ring.** `filter` and `opacity`
paint an element's outline along with everything else, so an early version — those two on the wrapper
root — drew the reachable control's ring grey at half strength. In the Playground that ring is magenta
`:focus-visible { outline: 2px solid var(--clr-highlight) }`, and the ring is the entire reason the
control is reachable. Redrawing it on the unfiltered root via `:has(:focus-visible)` was rejected: the
root is not focusable, so the consumer's own `:focus-visible` rule cannot reach it, and the library would
own one ring appearance for disabled controls and the consumer another for enabled ones.

Two further attempts to keep the fade inside the library are recorded because they look reasonable and
are not. Inherited colour only (`color: GrayText`, `accent-color: GrayText`) spares the ring but cannot
touch anything a consumer painted explicitly, which is most of what you see. Pushing `filter` down to
`interactionDisabled > * > *` reaches consumer paint and spares the ring, but depends on a leaf returning
the focusable element itself and on the painted thing living exactly one level below — a structural
assumption CSS cannot state or check.

Both are gone. The library no longer paints disabled at all: the painter does, from the flags (next
section). Since `Button`'s painter is a child of the `<button>`, fading it can never reach the ring on
the parent — the constraint is satisfied by structure rather than by careful selectors.

### Controls: the shell owns behaviour, the painter owns paint

The user's words: `Button` is a shell, `buttonContent` is the painter, and
`Tooltip` and `Modal` already work this way — functional, not visual.

**A control paints nothing.** The shell owns events, ARIA, focus and tab order, tooltip anchoring,
geometry and the flags. Every pixel comes from `renderContent(getFlags)`, declared on
`InteractionControlProps` so it reaches every leaf and re-exported through `ButtonProps` /
`CheckboxProps` with `Pick<InteractionControlProps, "id" | "renderContent">`. It replaced `children`: a
slot cannot take arguments in Solid, and the painter is useless without the flags. Children-as-function
was the alternative, with precedent in `For` / `Show`; `renderContent` won on consistency with the
`render*` convention and with `Tooltip.renderContent`.

**Where the paint goes is the leaf's decision, not the wrapper's.** `Button` puts it inside the
`<button>`, its label. `Checkbox` cannot — `<input>` is a void element — so the leaf returns a fragment:
the painter first in flow, the input second at `inset: 0` over it. The painter sizes the box, the input
covers exactly that box, the ring lands exactly around what was painted. Consequences:

- The input is a genuine blank slate — `appearance: none` plus `!important` resets for background,
  border, radius, shadow, padding, margin, width, height. The `!important` is not defensive habit:
  `input:not([type="range"])` and `input[type="checkbox"]` in the Playground stylesheet outrank a class,
  so without it the app's border and 20×20 sizing would paint over the painter. `outline` is deliberately
  not reset — that is the ring.
- State parity is now structural. A painter is handed `isDisabled` and nothing about reachability, so
  "disabled" and "disabled but reachable" cannot be drawn differently even by accident.
- A painter rendering text should mark it `aria-hidden`, since the accessible name comes from the input
  and stray glyphs would be announced as page content.

**The tooltip gets the flags too**, since it usually explains a state. `Tooltip` was not touched:
`InteractionTooltipDefs` widens only the consumer-facing `renderContent` to `(getVisibilityTarget,
getTransitionDurationMs, getPlacement, getFlags)`, and the wrapper adapts it down to `Tooltip`'s
three-argument signature.

The honest cost of the model: `PageButtonContent` and `PageCheckboxContent` hold the gradient, border,
check mark and disabled / error / checked rendering; fourteen call sites changed. In exchange the library
carries no colours at all, and a consumer defines their branded control once.

**The wrapper's box has to equal the painted box**, because the decoration slot is `inset: 0` against the
root and the ring is drawn on the control. Two things guarantee it: the root is `display: flex`, so its
in-flow child is a flex item rather than an inline-block with descender slack, and
`interactionRoot > *` forces `margin: 0 !important`.

That `!important` is not defensive habit either. The Playground carries
`input[type="checkbox"] { margin-block: 10px }`, and element-plus-attribute outranks the `margin: 0` in
`Checkbox.css.ts` — so a 20×20 checkbox sat in a 20×40 root and `Corners` drew a decoration twice the
height of the control. That route is closed now the input is absolutely positioned, but the rule still
earns its place: it now guards the painter's margin, and the failure would look identical. Spacing
belongs outside the wrapper; a painter wanting inner space uses padding.

The general invariant, worth stating because it predicts the next bug of this shape: **nothing may
decouple the painted box from the wrapper's box.** Sizing, padding, border and surface paint are the
painter's; `margin`, `transform`, `position`, `float` and `inset` on the in-flow child are not, and only
`margin` is currently defended.

**A painter's declared width is a preference, and `max-width: 100%` on the root is what makes it one.**
Found in the Playground's left menu: the search field's painter asks for 200px in a 240px
column whose usable width drops to 190px once a scrollbar takes its gutter, and the field hung 10px past
the padding.

Why nothing else stopped it, because every instinct about it is wrong.
`interactionSizingVariants["fit-content"]` sets `width: fit-content`, which reads as "never exceed the
space I was given" and is not: it resolves to `max(min-content, min(max-content, available))`, and a flex
item with a definite width has an automatic minimum size equal to it — so the painter's 200px _is_ the
container's min-content size, the outer `max` picks it over 190px, and the root is 200px. The painter
cannot fix this from inside: `max-width: 100%` on the painter resolves against a root sized from the
painter, so it is circular; `min-width: 0` does not reach the container's min-content size; `width: 100%`
collapses it outright, since a percentage against a shrink-to-fit parent is treated as `auto` and an
empty div's `auto` width is zero. All three were measured against the running Playground.

What works is `max-width: 100%` on `interactionRoot`. The root clamps to the space it was given and the
painter — a flex item with default `flex-shrink: 1` — follows it down, so the wrapper's box still equals
the painted box and the absolutely positioned input, decoration and ring all land on the smaller box. It
is on `interactionRoot` rather than the `fit-content` variant because it is the invariant for both: under
`fill` it is a no-op, and stating it once says a control never paints outside the box it was placed in.

Sizing-neutral everywhere else, and checked rather than assumed: every `InteractionWrapper` root on all
29 Playground routes was measured before and after, and the search field is the only box that changes. A
percentage `max-width` against an indefinite containing block computes to `none`, so a control inside a
shrink-to-fit ancestor is unaffected by construction.

**Render props receive what drives them.** `renderDecoration(getFlags)` replaced `Button`'s
zero-argument `renderHighlight()`, under which the pressed linkage was faked consumer-side — `ButtonPage`
closed over its own signal for the colour and passed the same signal as `getIsPressed`, with the
component connecting neither. Renamed because `ElementHighlight.renderHighlight` already means
`(getVisibilityTarget, getTransitionDurationMs)`, and two contracts under one name is a trap.

**The decoration slot belongs to the wrapper for a structural reason**, not because `Button` needed it:
it requires `position: relative` on the root plus `inset: 0` on the overlay, and inherits
`pointer-events: none` so it never eats clicks — all wrapper properties a leaf cannot provide without
becoming a wrapper. One slot, not layered slots; a fragment covers multiple decorations, and ordering
waits until something needs it. Marker classes (`interactionPressed`, `interactionError`,
`interactionDisabled`) are empty and stay only as a CSS-side escape hatch and for the root's `z-index`
rules; a painter reads state from the flags rather than from a class on an ancestor.

**Flags merge, external wins.** `isPressed` / `hasError` / `isDisabled` are the owner's; `isHovered` /
`isFocused` / `isActive` are the element's. `wrapElement` keeps its listeners attached while disabled and
gates the flags instead: `isActive` and `isHovered` are forced false whenever `getIsDisabled()`, while
`isFocused` stays live.

`isHovered` is gated because a painter keyed on hover would light up under the cursor on a disabled
control and read as actionable — and now painters own every pixel, the flags are the only thing between a
disabled control and a live-looking one. Hover behaviour that must survive is untouched: `Tooltip` runs
its own listeners on the anchor, so a disabled but reachable control still reveals its explanation.
`isFocused` is the deliberate exception, because a reachable control has to show where focus landed.

`wrapElement`'s `role` / `ariaDisabled` / `cursor` block stays opt-in via `applyButtonSemantics` — right
for a div acting as a button, wrong elsewhere, since native controls already carry correct semantics. Its
`tabIndex` line is the exception and runs for every wrapped element.

### Controls: the flags are extensible, and a painter is typed to its own control

Settled, on the trigger `backlog.md` named — `Select` wants `isOpen`, `isFiltering` and
more.

**`InteractionFlags<TExtra>` is generic with a `{}` default**, so nothing without extras changed. A control
with private state declares it — `BinarySwitchFlags = { checkedState }`,
`TextInputFlags = { isEmpty, isReadOnly }` — and threads it as `InteractionWrapperProps<BinarySwitchFlags>`,
so its painters receive exactly what it can produce.

**The wrapper receives the extras as one accessor, not a prop per flag.** `getExtraFlags?: Accessor<TExtra>`
is merged into `getFlags` last. This replaces `getCheckedState` / `getIsEmpty` / `getIsReadOnly` and the
`Omit`s that hid them: a private flag is never a public prop in the first place, and only `getExtraFlags` is
omitted, once, per preset.

**The generic props are declared by hand.** `renderControl`, `renderDecoration` and `tooltipDefs` all
mention `TExtra`. The first two would have survived (a function type is not a naked parameter) but sit with
the others so the block reads as one rule and the next prop added there cannot get it wrong.

**Extras are required fields, not optional.** `checkedState: CheckedState`, because the control always
produces one. The universal flags stay optional, since a wrapper genuinely may not know.

**The type immediately found an over-typed painter**: `PageTextFieldAdornment` was typed as a text-input
painter but reads only `isHovered` and `isDisabled`, and the Playground puts it inside a `Button`. Invisible
under one flat flag type; an error at the call site under the generic.

`CheckedState` moved from `Interaction.types.ts` to `BinarySwitch.types.ts`, and `isReadOnly` left the universal set with it — it is a
text concept here, so `getIsReadOnly` is declared on `TextInputState`.

### The 1D walk is a pure function, not a hook

Settled, once `Menu` made it a fourth copy. `Tabs`, `RadioGroup`, `Select` and `Menu` all
carried the same wrap-around arithmetic character for character:

```ts
navigable[(((from + delta) % navigable.length) + navigable.length) % navigable.length];
```

**It is `NavigatorUtils.computeNextPosition(key, from, length, opts)` rather than a `createRovingIndex`
factory, and `RadioGroup` is the reason.** The `create*` names in `Abstracts/` all mean "owns reactive state
and returns accessors". A walker cannot be one, because the state is already owned by each component and
owned _differently_: `Tabs`, `Select` and `Menu` hold a value signal and resolve it against the navigable
list, while `RadioGroup` walks registered entry objects and takes its starting point from
`document.activeElement` first. A factory owning the cursor would have served three of four and lost the one
that motivated the extraction.

**So it takes positions and returns a position, and knows nothing about what is being walked.** No generic
parameter, no collection argument, no reactivity — every caller maps back through its own array. That also
keeps it in `*Utils` rather than the `Anchor` / `ElementFader` family.

**Two options, both because a caller was already gating on them.** `orientation` decides which arrows step —
`"row"` or `"column"` for `Tabs` by its `dir`, `"both"` for `RadioGroup`, `"column"` for `Select` and `Menu`,
where the horizontal arrows must stay with the caret. It defaults to `"column"`, the narrowest: a default
that ignores a key is recoverable, one that hijacks `ArrowLeft` inside a text field is a bug. `hasEdgeKeys`
gates `Home` / `End`.

**What did not move is the part that is genuinely per-control.** `Select`'s "a closed list opens on an arrow
without moving the highlight" stays in `Select`. The rule: the `Abstract` answers _which position is next_,
the control answers _whether to go there_.

**`Tabs` got its first spec out of this**, being the one consumer whose keyboard had no coverage — recorded
as verified by markup dump only, which does not reach a walk. That spec drove the left menu at first and
moved to `TabsPage`.

`computeNextCell` for two axes belongs in the same file when `Calendar` arrives. That is the return on a pure
function: it grows by gaining a sibling rather than a mode.

### A control whose value is a pair holds one composite value, not two signals

**Decided by the user.** Whenever a control's value is naturally a pair — a range's two ends, or a date paired
with a time — the pair is **one value in one signal**, never two signals the consumer is expected to keep in
step. Nothing of this shape is built yet; the decision is recorded ahead of the work because it is the same
question in two unbuilt places and answering it differently in each would be the expensive outcome.

**What follows from it.** A date range is one `{ start, end }` value, reusing the field names `Range` already
ships and that this file argued for on published precedent — so a range `Calendar` takes one signal, and the
half-entered state while the first end is being picked is the component's to hold, not the consumer's. A date
paired with a time is a new value type in `Abstracts` rather than a `{ date, time }` record assembled at the
call site.

**Why it was worth settling before either is built.** The two look independent — a range needs
`isInRange` / `isRangeStart` / `isRangeEnd` on the day flags and touches nothing about time, and a date-time
needs a value type and has no half-entered state at all. What connects them is the third thing neither piece of
outstanding work names: a date-time **range**. If the pair question were answered one way for ranges and the
other way for date-and-time, that composition would inherit both shapes at once, and whichever was built first
would be rewritten. React Aria answers both the same way for the same reason — `{ start, end }` for ranges, a
value type for the date-time pair.

### A portalled layer's z-index is one above its anchor's

Settled, as the tail of the dismissal work: a `Select` opened inside a `Modal` could be
dismissed by key but not clicked, because `Modal`'s overlay is `100` and `Popover` was a fixed `1`.

**The number comes from the anchor, not from a register of layers.** `AnchorUtils.getStackingBase` walks the
anchor's ancestors and takes the highest numeric `z-index` on the chain; `createPortalPosition` publishes that
plus one as `getZIndex`, recomputed each time the layer becomes visible. A popup on an ordinary page lands on
`1`, one inside a dialog on `101`, and a submenu anchored to an item inside a popup at `101` on `102` — so a
chain orders itself without anyone counting.

**Why not the stack.** Open order and paint order are different questions: a `Modal` opened _from_ a menu
should cover the menu that opened it, and the anchor chain says so while a counter does not. It also keeps
`DismisserStack` a listener rather than something that paints, and leaves a consumer's own stacking free of a
number the library invented.

**`Tooltip` takes the same number and no longer takes a prop.** `computeZIndex` went with this change: it
existed so an "in" placement could paint _under_ the button that opened it, and a portalled layer cannot do
that at all — the `Viewport`'s portal is `z-index: 10` above page content, so everything in it clears every
anchor. Getting that effect would mean raising the anchor above the portal while its layer is open, which is
the library writing a `z-index` onto a consumer's element.

### A popup opened from inside a popup is not outside it

Settled, from a bug the calendar caption exposed: opening the month `Select` inside the
`DatePicker`'s calendar and clicking an option shut the whole calendar. `DatePicker` dismisses on a press not
inside its popup, and a popup is portalled to the end of the document — so the select's list is a **sibling**
of the calendar rather than a descendant, and `contains` reported the click as outside. Every nested popup has
this shape.

`DismisserUtils.getIsWithinOwnedLayer(target, roots)` walks up from the pressed element, and every time it
reaches an element something else points at with `aria-controls` it jumps to that controller and keeps
walking. The select's list is controlled by its field, the field is inside the calendar, so the press resolves
as inside. **Ownership is already in the markup**, put there for screen readers, so nothing has to be
registered on open and no order maintained.

It is not the layer stack `backlog.md` asks for and does not pretend to be: a stack also decides which of
several open layers a stray press dismisses, and orders them. It fixes containment only. `ColorInput` runs the
same kind of listener and should adopt it when the stack is built.

### A leaf with more than one focusable element owns the disabled half itself

Settled, closing a defect found while writing `e2e/range.spec.ts`: on a **disabled two-thumb
`Range`** the second thumb kept a `tabIndex` of 0 and took focus from a click, and on a **disabled
`ColorArea`** both axis sliders did. The first thumb was always correct, which is what made it invisible.

**The cause is that `wrapElement` acts on one element, and the wrapper only ever has one.**
`InteractionWrapper` passes a single `setElementRef` into `renderControl`, and everything about disabled — the
`tabIndex` rule and the `mousedown` refusal — is done to that element. `RangeElement` forwards only thumb 0
and `ColorAreaElement` forwards the `role="group"` rather than either slider, so every other focusable element
was outside all of it at a native `tabIndex` of 0.

**`InteractionTracker.wrapExtraControls(getRefs, getIsDisabled, opts)` is the fix, and it is deliberately only
the disabled half.** It sets `tabIndex` and attaches the same focus refusal, and it is in `InteractionTracker`
rather than either leaf because two components needed it the day it was written.

**Reachability deliberately does not enter into it, which keeps the fix small.** A control reachable while
disabled is focusable so its tooltip can be read, and the tooltip is anchored on the wrapper's single element
— one target reveals it. So the extra elements leave the tab order whenever the control is disabled,
reachable or not, and the leaf never has to know whether it is reachable. That matters because _"Reachable
mode is no longer visible to a leaf"_ removed exactly that knowledge.

**Two rejected alternatives.** Having the wrapper apply the rules to every focusable element inside its root
is wrong rather than merely broad: `TextField`'s `renderTrailing` routinely holds a real `Button` with its own
wrapper — the Playground's password field — and a disabled field must not take that button's tab stop away.
And having the leaf compute the rule from its own copy of the predicate is the duplication
`computeIsReachable` was extracted to prevent.

**`ColorArea` had a second bug in the same place, and it is `syncElement`'s rule for the fifth time.** Its
axis `onInput` returned early while disabled, skipping the push-back — so a refused arrow press left the
slider holding a position state never accepted, `aria-valuetext` disagreeing with the element, and the next
press moving on from the wrong base. It now gates the write and always calls `syncAxis`, which is what `Range`
already did. General form: **a disabled control gates the write and still syncs the element**; returning
before the sync is the bug.

**An enabled multi-element control stays one tab stop per element — settled, on the user's call.**
A two-thumb `Range` is two stops and a `ColorArea` is two; the roving single-stop treatment `RadioGroup` and
`Tabs` use is deliberately not applied. The distinction is what the members _are_: a radio group's members are
N spellings of one value, so stopping on each would make the tab order describe the options rather than the
control, while a range's two thumbs are two values with their own names and their own `aria-valuetext`, and a
colour surface's two axes likewise. `Calendar`'s previous and next buttons are the same call one level out.

### The wrapper between a container role and its items is presentational

Settled, on the user's call.

`InteractionWrapper` owns its own root, so any component wrapping each item puts a div between the container's
role and the item's — `Select` between `role="listbox"` and each `role="option"`, `Calendar` between
`role="row"` and each `role="gridcell"`. The wrapper root now carries `role="presentation"`, which removes its
own semantics and leaves the container owning the items directly.

**It is a `getRole` prop defaulting to `"presentation"`, not a hardcoded attribute.** The default fixes every
existing consumer without each one remembering, and it is honest because the wrapper is structural by
definition. Keeping it a prop leaves the door open for a container that wants the wrapper to _be_ the item —
the rejected alternative here, because moving `role="option"` up would take the id, the `aria-selected` and
the `aria-activedescendant` target with it, which is a refactor rather than an attribute.

**`role="presentation"` is only ignored on an element that is focusable or carries global ARIA**, and the
wrapper is neither. Two other rejected alternatives: hand-rolling each item's flags to avoid the wrapper is
what _"the composition is an implementation detail"_ argues against, and `aria-owns` on the container would
state a relationship the DOM no longer shows — indirection that rots silently the moment the markup moves.

**One residue, and it is the consumer's.** `Select`'s popup surround is consumer markup inside the popover
root, so a listbox still has a consumer div between it and the wrapper. The library cannot mark that one —
the same category as the padding agreement `TextInput` records.

### A masked field never spells a value approximately

**The rule.** Given a value its mask cannot hold, a field shows nothing and raises `getHasError` — it is
stating that something is held which it cannot show, the only honest reading of a blank box that is not empty.
Truncating the digit run, clamping the value or dropping a sign each produce a _different_ well-formed value
the field would parse straight back, so the corruption survives a round trip with nothing raised.

Written down after exactly that: the old signed-year `DateValue` accepted any year, `toIso` spelled one outside
0..9999 in expanded form, and `DateInput`'s four digit slots laid the longer run into the mask regardless —
pushing every later part along, so 15 August 44 BC read as `0440-81-5`.

**Where the check belongs, when one is needed.** Not in the mask: `TextSyncUtils` is told a pattern and a
digit run and has no idea which digits were the year, so only the control that built the pattern can know the
run is too long. And the text-to-value effect has to stand down while an unspellable value is held, or the
blank text it just produced parses as "no value" and clears the consumer's — turning a display bug into data
loss.

**`DateInput` needs no such check any more, because the value type stopped being able to hold one.** A
`CalendarDate`'s year is a year _within an era_ and every supported calendar bounds it at four digits, so
`getYearsInEra` is at most 9999. The rule stays written down because the formatted number will meet it again.

**One accepted exception, deliberate rather than overlooked.** `DateValueUtils.withCalendar` clamps when the
target calendar cannot hold the date, and says nothing. Left alone by the user with the cost
of fixing it written out; it sits in `backlog.md` under _"Accepted limits"_, and is named here so the rule
above is not read as absolute.

### A popup's open state is private until a consumer asks for it

Settled by the user, closing the `openSignal` question items 3, 4 and 11 of `backlog.md`
were waiting on. `Select`, `MultiSelect`, `Menu`, `ColorInput` and `DatePicker` each take an optional
`visibilitySignal`, which is `Modal`'s prop under `Modal`'s name and rules.

**One variable, both sides write** — the `*Signal` convention rather than a new idea, and `Modal` already
proved it on this kind of state: it reads `visibilitySignal` and writes `false` when it dismisses itself. A
popup opens and closes for its own reasons, so a one-way "here is a boolean, obey it" prop would fight the
component. A consumer with no signal uses `SignalMirror`.

**`SignalMirror.createPassThrough` is the third shape, and it holds nothing at all.** It takes a getter and
a setter and returns a `Signal` whose reads go straight to the source and whose writes go straight out, with
no inner value between them. That matters wherever a write can be **refused**: a mirror keeps its own copy,
and a copy that has already flipped never hears about a refusal, because the outer value it would compare
against never changed. `Accordion`'s sections use it for exactly that — a section whose expansion is required
must stay open when its own header is pressed, and with a mirror underneath it the header said closed while
the list said open. Same caveat as every setter of this shape: a `T` that is itself a function cannot be
written as a value, only through an updater.

**`SignalMirror.createOptional` is how a control stays private by default.** It returns the signal the
component was handed or one of its own, reading the prop through on every access, so there is one code path
rather than a branch at every use. Without it each of the five would carry "the shared one if I was given one,
otherwise mine".

**Every side effect of opening or closing hangs off the state, never off the path that changed it.** The part
easy to get wrong, and why the change touched more than five prop types: `Select` cleared its highlight inside
`close()`, `DatePicker` moved its calendar to the value's month inside `open()`, and `Menu` set the initial
highlight position inside `open(position)` — all invisible to a consumer writing the signal directly. Each
moved into an effect keyed on the open state, so a popup closed from outside ends up in the same condition a
click outside would leave it.

**An invariant the component owns is enforced against the state too.** A disabled control cannot be open:
`open()` already refused, but a consumer writing `true` bypassed it, so `Select` and `Menu` write `false` back
— the correction `Modal` makes for its own dismissal.

**What this does not buy is an opener the dismiss layer knows about.** A consumer's own button sits outside the
popup, so pressing it while open dismisses the popup and the handler then re-opens it: a toggle button appears
not to close. The Playground demonstrates open and close as two separate buttons for that reason. Fixing it
means `Menu` accepting an anchor and an opener, which is what `backlog.md` item 3 asks for next.

### Playback is a signal; a rewind is a command

Settled by the user, applying the argument that had already retired the controller shape for
`Toasts` and `Calendar` to the components that still carried one.

**Whether a thing is playing is state, so it arrives as `playbackSignal`.** `CellAnimation` and
`ScanlineAnimation` had `start()` / `stop()` on a handle given out at mount, both literally
`setIsPlaying(true/false)` over a private signal; `AudioSwitcher` had `play()` / `pause()`, the same state
behind a pair of fades. All three now take an optional `playbackSignal` through `SignalMirror.createOptional`.

**What that buys is visible in the Playground rather than in the API.** Both animation pages used to collect a
controller per mounted instance into an array and call `start()` on every one when the stress-test modal
closed. They now share one signal and write it once, and nothing has to still be mounted for that to work.

**The cost, and the rule it produced: a shared playback signal also governs whatever mounts later.** The old
controller array only held instances that existed when it was filled, so the stress-test modal's own items were
never in it and started playing on mount regardless. One shared signal has no such boundary — the stress test
writes `false` when the modal opens, the modal's items mount into a signal that already says stopped, and the
thing being measured never runs. So **the animations under measurement own a second signal of their own**,
declared in each page's `StressTestWrapper` and passed over the spread; the page-wide one keeps its job of
suspending the examples behind the modal. Generally: a signal shared across a page is scoped to that page, and
anything mounted into a different lifetime — a modal, a portal, a route — needs its own or it inherits a state
that was never decided for it.

**A command that is not a state stays a handle handed over at mount.** `Typewriter` keeps `restartAnimation`
and `update(cause)`, `AudioSwitcher` keeps `reset`. Restarting an animation and rewinding a track are not
values anyone can read, and the reason they cannot be faked with a signal is timing: restarting means the
element must be **painted** in the pre-animation state for one frame before the animation is re-applied, and a
consumer toggling a signal off and on — even across a `setTimeout(…, 0)` — is not guaranteed that frame, since
the browser may fold both changes into one paint. The same hazard `ElementFader` documents, failing
intermittently rather than outright, which is worse. The frame discipline belongs inside the component that
owns the animation.

**So the boundary is: can a consumer meaningfully read it?** Playing, open, selected, expanded — state, and a
`*Signal`. Restart, rewind, re-measure — commands, and an `onMount` handle. Two of the four components needed
both, so the controller shape is not a legacy to be finished off.

### A popup's anchor is also its dismiss root, which is what lets a consumer's own button toggle it

Settled, finishing what `visibilitySignal` started. `Menu` takes an optional `getAnchorRef` and
positions its popup against that element instead of its own trigger.

**The positioning is the smaller half; the dismissal is the point.** `Popover` builds its dismiss roots as
`[the popup, the anchor]`, so whatever element is the anchor is inside the layer and a press on it is not an
outside press. Before this a consumer's own toggle button was outside, so pressing it while open dismissed the
menu and the handler re-opened it. Making that button the anchor fixes it without `DismisserStack` learning
anything new.

**A split button is now a composition rather than a missing feature**: the arrow half is the anchor, the main
half does its own work, and the consumer's own signal opens the menu.

**A right-click context menu is still not possible**: it opens at the pointer rather than against an element,
and `Anchor` positions against a ref only. That needs a virtual anchor — a rect standing in for an element —
which is a change to `Anchor` rather than to `Menu`, and it is the last piece. `backlog.md` item 3.

## Layout and styling

### Folder layout: `Fundamentals/Input`

`BinarySwitch`, `Checkbox`, `Toggle`, `Radio`, `RadioGroup`, `TextInput` and `Label` live under
`Fundamentals/Input/`. Grouped by what a component is _for_ — carrying a value the user edits — not by what
it is built from. `Button` and `InteractionWrapper` stay at the `Fundamentals` level: `Button` is an
interaction with no value, and `InteractionWrapper` is shared by both families.

`index.ts` still enumerates every export path individually and stays sorted, so the group is a directory
convention rather than a barrel — `Input` sorts between `ImageSwitcher` and `InteractionWrapper`.

### The Playground's element selectors are scoped, and the library keeps its `!important`

Settled, with the props-panel migration. All 43 raw controls in the panels are library
controls now, and since `TextArea` shipped there is no raw form control left in the Playground.

**`style.css` no longer styles `input` or `select` at all.** Those rules sat at specificity 0,1,1 and
outranked any class a control could carry, which forced the escalation recorded under _"The input is a
genuine blank slate"_. They exist to style the app's own chrome, that chrome is no longer raw, and they are
scoped to `textarea`. Two rules went rather than being narrowed: the blanket `label` block, since
`labelRoot` already sets everything it did, and `button:hover { filter: brightness(120%) }`, because
`filter` paints an element's outline and that rule was dimming the focus ring of every hovered button —
found by removing the thing that hid it.

**The library's own `!important` resets stay, and `backlog.md`'s guess that "several could go" is wrong.**
The Playground is not the only consumer; a blank slate that loses to an element selector is broken, and
element-level input styling is what every reset stylesheet ships. What the scoping removes is the
**consumer-side** escalation — a painter no longer reaches its own input through a `globalStyle` to win.

**The panels grew a family of field adapters**, which is the migration's real finding. `PageNumberField`,
`PageTextField`, `PageSelectField`, `PageGroupedSelectField`, `PageCheckField`, `PageColorField` and
`PageFileField` live in one folder as one file, because seven two-line adapters in seven folders is worse
than the family being visible in one place — the call `Select.tsx` makes with its three private components.
Each keeps a local `*Signal` and mirrors the panel's plain value into it. That mirror is written seven times
and is the gap `backlog.md` #10 records: every control owns its value as a signal, so a consumer whose state
is a store builds the bridge themselves.

### Each palette token has one job, and the two rules that follow from it

Stated by the user. A colour group is `dark` / `main` / `light` / `contrast`, or `dark` / `light` /
`contrast` where there is no `main`. Which token goes where is not a matter of taste:

- **`main` is never a background.** It is for highlights, borders, and text over black — the places where a
  colour has to announce itself against something dark, not the places something else has to be read on top
  of it.
- **A background is a gradient from `dark` to `light`, or the reverse — never a flat `main`.** Linear or
  radial, whichever suits the shape: linear for cells and rows, radial for round badges and markers.
- **`color` only ever takes `main` or `contrast`.** `main` when the text is a coloured accent on a dark
  surface, `contrast` when it sits on its own family's background. Never `dark` or `light`, which are
  background shades and are not built to be read against anything.

**What this cost across the Playground**: nine backgrounds became gradients — the calendar's and clock's
selected cells, the paginator's current page, both satellite badges, and the step marker's `done`, `current`,
`failed` and `skipped` states. Four `color` declarations moved from `light` to `main`: the form field's error
message and the three toast severities. Everything left holding `main` paints a line, a dot, a track, a
scrollbar thumb or a drag handle — highlights, which is the token's job.

**Direction is `215deg` for linear and `circle at 70% 30%` for radial, so the light falls the same way
everywhere.** The house already had `linear-gradient(45deg, dark, light)` on the example card and
`linear-gradient(215deg, light, dark)` on the toast, which are the same picture written twice — light at the
top right. The new gradients follow it rather than adding a third convention.

**Contrast was checked at both ends of every new gradient, not just at one.** A gradient background has two
extremes and the text has to clear the worse of them. Against each family's own `contrast` token, after the palette pass
that followed: `primary` 9.17 / 10.85, `success` 9.44 / 11.18 and `alert` 8.25 / 10.21 are **AAA at both
ends**, clearing 7:1 rather than merely 4.5:1. Three groups have one AAA end and one AA end — `secondary`
5.73 / 7.78, `info` 7.89 / 5.76 and `error` 7.30 / 5.22. Nothing in the palette is below AA on either end
any more, so any `dark`-to-`light` gradient is safe to put its own `contrast` on.

**The overhead wheel's wedge is an SVG `path`, so it needed a real gradient def rather than a CSS one.** `fill`
cannot take a CSS gradient. Each `PageWheelWedge` renders its own two-stop `<linearGradient>` under a
`createUniqueId`, and the picked state points the path's `fill` at it through an inline style — inline so it
beats the class rule that carries the unpicked colour, which stays in the stylesheet where every other colour
lives. The stops themselves are vanilla-extract classes rather than attributes, because a presentation
attribute will not resolve a CSS custom property and every colour here is one. Eight wedges means eight
identical defs with eight different ids: redundant, but valid, and a shared id would mean one component
knowing about a def emitted somewhere else on the page.

### A Playground style names a theme token, never repeats its number

Stated by the user after they found `gap`, `padding` and `borderRadius` written as plain `10`, `20` and `40`
across the pages: a number that happens to equal a token is not the same thing as the token, because the
theme can no longer move it. So wherever a value in `playground/src` matches something the theme names, the
style reaches for `themeVars` and the number goes.

**The tokens with numbers behind them are `spacing` — `half` 5, `full` 10, `double` 20, `quad` 40 — and
`borderRadius` — `half` 5, `full` 10 — with `fontSize` in `rem`, where `xSmall` is `0.75rem` and so 12
pixels against the Playground's 16-pixel root.** The first pass took the fourteen declarations whose number
already equalled a token and touched no paint at all, since every token resolves to the number it replaced;
the second took the ones that did not, and the paragraph below is what that cost.

**A number the theme does not name exactly is rounded to the nearest token rather than kept.** The user's
call, over the opposite proposal — that bending a value onto a token changes paint under cover of a
tidy-up — which they overruled: the scale is the thing, and a value sitting a pixel off it is a value that
missed. So the `8`, `10` and `11` pixel font sizes on the steppers, the era cycle, the meridiem toggle and
the two picker triggers all became `fontSize.xSmall`, which is the nearest token at `0.75rem`, and the era
cycle's `0 4px` became `spacing.half`.

**A value too small to approximate stays a number.** `2` may remain, and only inside a `style({})` — it is
below the smallest token by enough that rounding it to `5` would be a change rather than an approximation,
and the hairline `1` values fall under the same reasoning.

**A value that is arithmetic against something else is not a missed token, and rounding it is the wrong
answer.** The rule's boundary, and the user's, drawn on the two cases where rounding moved something. Both
were reported with what they cost and both came back with a correction rather than an acceptance, which is
the shape to expect from the next one.

- **The step connector's `19` is a token minus a pixel, and is now written that way.**
  `calc(${themeVars.spacing.double} - 1px)`. It offsets a two-pixel line against the marker beside it, so
  `20` slid it one pixel right. The `calc` keeps the token visible as the thing the value is derived from,
  which is what the rule is actually asking for — the number is anchored to the scale rather than floating
  free of it.
- **The toggle's `12` is half its own fixed height, and stays a number.** The user's words: it is a
  proportion of the element's height, so it earns its uniqueness. `borderRadius: TOGGLE_HEIGHT / 2` on a
  44-by-24 track, with the height hoisted beside the width the way `TextFieldContent` already hoists its
  own. `10` makes the pill visibly less than round.

    **`borderRadius: "100%"` was tried first and is wrong, which is worth recording so nobody tries it
    again.** A percentage radius resolves against each axis separately, so a 44-by-24 box asks for a 44
    horizontal radius and a 24 vertical one, both scaled down to fit — the result is a full ellipse, not a
    stadium. The track then narrows towards its ends faster than the round 16-pixel handle does and the handle
    spills out at both extremes. **There is no relative CSS value that produces a stadium**; the common dodge
    is a huge pixel radius that clamps to half the shorter side, which is a magic number in a different hat.

**Nothing was done to the transition durations.** `80ms` and `150ms` on the pointer-tracker page sit either
side of the `100ms` token, but a duration is a tuned value and those are the user's to move, so they were
flagged rather than rounded.

**The rule is `playground/src` only, because it is the only tree with a theme.** `components/src` has no
`themeVars` and no colours of its own — a component's paint is the consumer's, which is the whole shape of
this library — so a number there is a layout fact rather than a missed token.

**One exception, and it is mechanical rather than a matter of taste.** `FIELD_STEPPER_PADDING` in
`TextFieldContent.css.ts` is not a CSS declaration; it is a value handed to a component's `padding` prop,
which takes numbers. A `var(--…)` string does not typecheck there and would not survive the arithmetic the
neighbouring `FIELD_PADDING` does either. A value crossing into a prop stays a number; only declarations
inside a `style({})` take tokens.

## Testing

### A measured rect and a written offset are in different spaces inside a `Viewport`

`getBoundingClientRect` reports where a thing is **on screen**. An inline `top` or `left` is a **layout**
value. Inside a `Viewport` the two differ by its scale, so any component that measures with one and writes
with the other is wrong by that factor — and it is wrong _invisibly_, because the scale is 1 whenever the
window happens to match the viewport's design size.

**This trap is recurrent, which is why it is stated here rather than a seventh time inside one component.**
`ElementObserver`, `Anchor`, `Range`'s track, `Scroller`, `SlideButton`, the drum and `Sortable` have each met
it and each recorded their own answer locally; `playwright.config.ts` carries the spec-side half. Read those
as instances of this rule.

**A headless browser is exactly where those two match**, which is what makes this worth its own entry: a
spec can drive the interaction, assert the geometry and pass, while the same code is visibly misplaced on
every real machine. `Sortable`'s landing marker was placed from rect differences and written as a `top`,
landed at a fraction of where it belonged, and every check of it passed. The spec that catches it forces
`window.screen.height` away from the window's height in an init script so the scale is not 1.

**The rule: divide by `viewportContext.getScale()` on the way from a measurement to a written offset, or
measure in layout space to begin with** — `offsetWidth` / `offsetHeight` / `offsetTop`, or
`ViewportUtils.getAdjustedBoundingClientRect`. What must _not_ be converted is a measurement compared
against a pointer's own coordinates: `clientX` and a client rect are both on-screen, and dividing one of
them breaks a hit test that was right.

### Verifying interaction: `e2e/` at the repo root

**It lives at the repo root, above the three packages, and that is the whole placement argument.** `components/src` would ship
it (`package.json` publishes only `dist`, but the folder is the library and the library is what it tests);
`playground/src` would bundle it into the demo. It drives the _built_ Playground over a socket and imports
nothing from either tree. `npm run verify:dom` is the entry point; `verify:dom:ui` opens Playwright's runner.

**Playwright, rather than a driver of our own.** This suite used to be about 900 lines of hand-written
DevTools Protocol plumbing with no dependency, justified because a dependency would need a second tsconfig
and a compile step. That trade did not hold. Every "trap" the driver documented — which key event type
carries text, scrolling before measuring, waiting out a transition, discovering which loopback family the
preview server bound — Playwright solved years ago, and the one it did not solve cost the most: the driver
measured an element's position and clicked that point a frame later, so anything that re-anchored in between
was clicked where it used to be. That is what made `Select` and `Menu` pass alone and fail after `Tabs`.
Playwright re-checks that an element is visible, stable and hit-testable at the instant it acts, and gives
every test a fresh page.

**One test per behaviour, not one per component.** The old specs were one long scenario per control, so
state accumulated within a file and a failure halfway hid everything after it. Each behaviour is its own
`test`, `beforeEach` navigates, the run is parallel across workers, and the suite finishes in about fifteen
seconds.

**Assertions target `data-variant="<name>"` on each Playground variant and `[data-readout]` inside it**, so
a spec reads state the way the page displays it rather than reaching into Solid. `PageExamples` stamps
`data-example` for the same reason. Prefer the auto-retrying `expect(locator)` forms, which are what make a
wait unnecessary.

Three things Playwright cannot do for us, each of which reads as a component bug:

- **`aria-disabled` controls need `{ force: true }` to be clicked.** Playwright's actionability check treats
  `aria-disabled="true"` as disabled and refuses, which is exactly the interaction this library must prove
  does nothing. Forcing also skips the stability checks, which costs nothing on a control with no popup.
- **Opening a popup is two steps that land in either order**, so waiting on the popup being visible is not
  enough. `Menu` mounts, points at a highlighted item, and takes focus; a key pressed between the second and
  third is silently lost. `e2e/menu.spec.ts` waits on both `aria-activedescendant` and `toBeFocused`;
  `Select` waits on the highlight.
- **An element under a looping CSS animation can never be clicked.** Playwright waits for a stable bounding
  box, and an infinite keyframe slide never has one, so the click waits out the full timeout and reads as a
  broken component. `e2e/elementHighlight.spec.ts` focuses its triggers and presses Enter instead: no
  geometry, and a keyboard user reaching a moving button is the same journey.

**Playwright has no IME API**, so `TextSync`'s composition gating is driven over the DevTools Protocol
through `page.context().newCDPSession(page)` — the one place this suite reaches past the library it is built
on.

**What it catches is the argument for it.** `TextSync` destroying an IME commit and `ElementFader` hanging
its state machine on a single frame are both invisible in markup. `backlog.md` #11 carries what the suite
still cannot see.

**A touch gesture is driven through the DevTools protocol, and `drawerTouch.spec.ts` is the only file that
does it.** Playwright's touch API taps and nothing else, and synthetic touch events dispatched from page
script are ignored by the browser's own scrolling — so neither can answer whether a real finger scrolls a
sheet or dismisses it. `Input.dispatchTouchEvent` produces a gesture the browser treats as one. The file is
separate from `drawer.spec.ts` because the touch context is per-file, and because the two are asking
different questions: one is about the gesture's arithmetic, the other about who wins when the browser wants
the same finger.

### Unit tests: `vitest`, colocated, and only for functions

`e2e/` can only reach what a click can reach. A function taking rectangles and returning a placement has no
page to be clicked on, so provoking its edge cases through a browser means a Playground variant per case —
which is why `AnchorUtils`'s flip-and-clamp logic went unchecked long enough to ship the overflow in
`backlog.md` #5. `npm test` calls library functions directly.

**One dependency, and no DOM.** `vitest` reads the repo's own Vite setup, and `vitest.config.ts` sets
`environment: "node"`. A jsdom environment would invite component-rendering tests, the thing not to build
here — jsdom has no layout engine, so every geometry question comes back wrong, and everything else is
already answered by `e2e/`. The line: **if it renders, it is a spec; if it returns a value, it is a unit
test.**

**Tests sit next to the function**, as `<Name>.test.ts`, matching the rule about types. They are inside
`components/src` and therefore type-checked by `npm run typecheck -w components` — a test that no longer compiles against its
subject has stopped describing it. They do not ship: both builds start from `index.ts`.

**Assert the behaviour, not the implementation.** These functions are small enough that a test mirroring
their arithmetic would pass forever and prove nothing. Each case names a situation — an out placement that
would overflow flips to the side with room, a walk that wraps at both ends, a reserved docked panel pushing
the flip earlier — and the numbers are worked out from that situation.

**Covered: every `*.utils` module that neither touches the DOM nor builds JSX** — `Anchor`, `Navigation`,
`InteractionTracker`'s reachability predicate, `Audio`, `Select`'s flattening, `ElementHighlight`'s segment
geometry, `RichText`'s parser and the whole of `CellAnimation` (geometry, origins, all thirty-seven weight
functions, zones, breakpoints). The weights are covered by property rather than value: every type stays
inside 0..1, is deterministic, and — for the origin-free ones — is unaffected by moving the origin. Pinning
thirty-seven grids of numbers would encode the arithmetic rather than describe it, and would have to be
re-blessed wholesale by any change.

**Deliberately not covered:**

- **Anything taking an element or a Solid owner.** `FocusManager`, `ElementObserver`, `ElementFader`, `TextSync`,
  `Anchor`'s own factory, `InteractionTracker.wrapElement` and `Viewport`'s rect adjustment all need a real
  layout to say anything true. They are `e2e/`'s half.
- **The SVG defs builders.** `SVGPatternDefsUtils`, `SVGGradientDefsUtils` and `SVGAnimationUtils` return
  JSX, and their arithmetic — tiling offsets, `resolveStops`' interpolation — is written inline inside the
  element or kept private. Real geometry, unreachable without rendering or a refactor separating arithmetic
  from markup. `backlog.md` #12.
- **A known-broken case is pinned rather than fixed.** `CellAnimation.utils.test.ts` asserts the
  out-of-range weights `backlog.md` #5 describes, with the measured numbers. It passes today and fails the
  moment anyone fixes the bug, which is the point — both candidate fixes change output across every affected
  weight, so the test is re-blessed as part of the fix rather than quietly surviving it.

### The suite finds a demo by a key it was given, never by the caption it displays

The fault `backlog.md` used to carry about locators built from caption text, for the part of it that is now
closed. A locator built out of
editorial text answers two questions in one red — did the behaviour change, and has anybody edited the
copy — and the second answer is worthless. Every variant, example and props row on a Playground page now
carries a key that is chosen once and never displayed.

**A container states the kind it is as a bare attribute and its key in `data-testid`.** `data-variant`,
`data-example` and `data-prop` survive with no value at all; the key is separate. Two reasons, and the first
is the one that decided it: several specs read `[data-variant]` for presence — "the page has rendered
something" in a `beforeEach` — and `surface.spec.ts` counts `[data-example]` to prove a page renders three
examples, so a page that had no kind attribute left would have nothing honest to count. The second is that a
lookup is then only ever made among things of one kind, which is what lets `SplitPanePage` key a variant
`pair` while some other page keys a props row the same word without either lookup becoming ambiguous.

**`variant`, `example` and `prop` in `e2e/helpers.ts` are the only three spellings of it**, and each pairs
the kind with the key. A props row is `[data-prop][data-testid="…"]` rather than being scoped to the panel
it sits in, because a local panel repeats the same row inside every variant that owns one — `ScanLineAnimationPage`
has two rows keyed `shift`, one per variant — so a row key is unique within its panel and not across the page.
Scoping by panel would have found both; scoping by variant is what the specs already do.

**Where the keys came from, since "chosen once" is only honest if the first choice was not a slug of the
caption.** A variant's key is the name the spec had already given it — `const MULTI = variant("Many open at
once")` becomes `variant("multi")` — because a spec's own const is a name for the demo written by somebody who
was thinking about what it demonstrates. Where no spec had named one, the key is a short reduction of the
caption, which is a starting value rather than a derivation: nothing re-derives it, so rewording the caption
afterwards cannot reach it. A props row's key is **the signal the row drives** — `getKey={() => "spinDurationMs"}`
beside `getLabel={() => "Spin duration (ms)"}` — which is the page's own state rather than anything editorial,
and reads as the prop it stands for.

**The key is required on `VariantDefs`, `ExampleDefs` and `PageProp`, and that is the mechanism rather than a
formality.** An optional key would let the next variant arrive without one, and the first spec to want it would
reach for the caption again because that is what is there. Required means the compiler names every site, which
is also how all 218 variants and 103 props rows were found rather than by grepping for `name:`.

**A key may be renamed deliberately; what it may not be is re-derived.** The user's call, when two examples
called "Custom" became "Custom Input" — the caption was the thing being fixed, and leaving the key reading
`custom` underneath it would have left the page saying one thing and the suite another for no gain. So the
rule this section states is about the mechanism rather than the string: nothing derives a key from a caption,
which is why rewording one cannot silently reach the suite. Moving a key is an edit like any other, and it
moves in one change with everything that names it — the `path`, the example file, its exported component, any
`id` composed from it, and the spec's locators.

**A demo control a spec drives carries an `id`, and the spec finds it by `#key`.** The user's call, over two
alternatives: wrapping each control in a keyed element, rejected because every wrapped demo grows a box and a
few of them sit in layouts where that is not free; and adding a test-attribute pass-through to the library,
rejected because the library would grow a prop that exists only for the suite. An `id` needs nothing new at
all — `Button`, `Range`, `BinarySwitch`, `Select`, `TextField` and the rest already take `getId`, and each puts
it on the element a spec actually wants: the `<input>`, the `<button>`, the combobox. Their reason for
preferring it: an id is multipurpose and far more stable than a caption.

**The one real consequence is that an id must be unique in the document, so a control rendered more than once
composes its id.** A control that appears once per variant cannot carry a literal, and this is why
`PageCalendarCaption` and `PageDatePickerTrigger` take a `key`: three calendars sit on `CalendarPage` at once,
so their paging buttons are `defaultNextMonth`, `boundedNextMonth`, `weekdaysNextMonth`. `PageExamples` keys its
own source-code button after the example it belongs to for the same reason, and each wheel example names its
spin button in its own file. Where the id had nowhere to land, the Playground component gained the prop rather
than the library: `PageNumberField` and `PageLabelCaption` pass one through.

**Two locators were better off structural than keyed.** A toast's close button is the only button inside a
toast, so it is `${TOASTS} button` rather than a keyed control that would have to compose an id per toast; and
the toasts region is `[role="region"]`, since a role is the sound kind and nothing else on that page is one.

**A control rendered once per datum keeps its name, because the datum is what the spec is reasoning about.**
A radio named `Small`, a tag named `solid`, a menu item named `Paste`, an option named `Denmark`, a props
select's value `hourglass` — the string is the fixture the test chose, not furniture somebody may reword for
prose reasons, and there is no single control to key. This is the line worth being exact about: what was
converted is a control the page **names**, and what stays is a control the page **lists**.

**An assertion reads the mapping, not the value.** The user's rule, and the same argument as this section one
step further in. A locator built from a caption answers "did the behaviour change" and "has somebody edited the
copy" in one red; an assertion built from a hardcoded style answers "did the wiring break" and "has somebody
restyled it" in one red. **A border going from `1px dashed` to `2px solid` is a change, not a failure**, and a
spec pinning the value cannot tell which it is looking at. So an assertion checks the relationship — this
element came back carrying the class it was mapped to, and that class is not the one something else was mapped
to — and says nothing about what the class draws. **Where a spec has no mechanism to separate a change from a
failure, it does not check that thing at all.** It bites hardest on pure aesthetics, which is where it was
found: an underline written into `richText.spec.ts` turned the user's own restyle of their own Playground into
a red run.

**What is left reading CSS reads state rather than paint, which is the line to hold when adding one.**
`visibility` on the image switcher, `animation-play-state` on the toast countdown, the tabs floater's
`transform`, `caret-color: transparent` on a disabled field, `resize: none` on a textarea: each is a
component's own behaviour with nowhere else to show, not a choice about how something looks. Satellite reads
padding as a measurement and Formation reads `left` only to ask which side resolved the unit. None of them
pins an appearance.

**Three kinds of locator are sound and stay**: a role, a role description or a state attribute
(`[aria-roledescription="wedge"]`, `[role="log"]`, `[aria-disabled]`, `[inert]`) is the component's published
contract, so a spec is meant to break when one changes; an accessible name that **is** the assertion stays,
because there the string is the thing under test; and a name the **library** owns rather than a page —
`ColorInput`'s own default hue label, for instance — is contract too. Between those and the keys, no locator in `e2e/` now
reads a string the Playground wrote as furniture.
