# Decisions: `BinarySwitch`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Audit: the React-era `BinarySwitch`, and what of it survives here

A `_TEMP` copy of a two-year-old Preact implementation of these controls (a central
`BinarySwitch` base plus `Checkbox` / `Toggle` / `RadioButton` leaves, 568 lines) was read in full and
deleted — it referenced `@ui/*` and `preact` aliases, so `vite-plugin-checker` failed the build while it
sat in the tree.

**The base was the same idea from the other side**: a shell of a hidden native `<input>` plus a
`children` slot doing all the painting, parameterized by `type: 'checkbox' | 'radio'`. One difference
decides everything else.

**How the painter learns the state.** The old painters read state out of CSS through sibling selectors —
`input[type=checkbox]:checked + container &`, `:disabled + &`, `:focus-visible + &`. Free at runtime, and
uncarryable here for three stacking reasons:

- It hardcodes DOM adjacency. `CheckboxElement` renders the painter **first** and the input after it, so
  the input can be `inset: 0` over the painter and own the hit area and ring. The selector would point
  the wrong way, and fixing that fixes DOM order to the stylesheet forever.
- CSS only sees states the DOM has. `isPressed`, `hasError`, `isActive` and "disabled but reachable" are
  not DOM states, and disabled here is `aria-disabled`, so `:disabled` matches nothing — the old
  disabled and focus rules would silently do nothing.
- It puts library class names inside consumer paint. The settled model is the inverse: the library hands
  over data, the painter owns every pixel.

**`Toggle` needs no new library code**, the audit's most useful result. In the React tree `Toggle` was
141 lines and almost all paint: body size, handle size, radii, two translate distances computed in JS,
the color swap on check. A toggle **is** a `Checkbox` whose painter draws a track and a sliding handle;
`isChecked` is the entire input it needs. The only library-side difference is one line of semantics —
`role="switch"` so it announces on/off rather than checked. So `Toggle` is a thin preset over `Checkbox`
in the `Surface`-over-`Shape` shape: not a new leaf, and not a base extracted from two leaves with
nothing to share.

**`Radio` is where a shared base earns its keep.** _Corrected after the fact: this originally continued
"and it is not the base `BinarySwitch` had", which was wrong. Only the group's state model and keyboard
needed somewhere new — they became `RadioGroup`. The leaf-sharing job was exactly what the old base was
for, down to the `type` parameter, and the shipped component keeps its name for that reason._

Old radio support was `type="radio"` plus `name`, leaving mutual exclusion to the browser. Too little
here, because the two things a radio group needs are behavior, and behavior is the shell's:

- A radio group is a **single tab stop**, arrows both moving and selecting — a roving tabindex, which
  `Tabs` already implements and is the model to follow.
- The **group owns one value**, not one boolean per radio. `checked: Signal<boolean>` is the wrong
  shape for a member of a set; a `RadioGroup` holding `Signal<T>` handing each radio a derived boolean is
  right. Native `name` grouping gets DOM mutual exclusion free but leaves the state model unowned.

**The size / config / token layer is inconsequent here, and it is the bulk of the code.** The three
`*.config.ts` files, the `s | m | l` scale, `BINARY_SWITCH_SIZE_REMAP`, derivations off
`uiCoreConfig.input.height`, `assignInlineVars` pushing per-instance colors, `useBackground` picking a
contrast pair, `hasOutline` switching filled versus outlined — all so the library can paint with values
the consumer chose. This library paints nothing. Port none of it. The `hasOutline` _technique_ (an empty
marker class selecting a variant) is already the idiom here.

**One genuine gap: the flags describe state, not events, and carry no pointer geometry.** The old
controls spawned a ripple on change imperatively through a controller ref, reading the element's width
and calling `controller.spawnEffect(x, y, …)`. `renderDecoration(getFlags)` is declarative and receives a
snapshot: a painter can watch `isActive` flip, but cannot know **where** the pointer was, and a one-shot
animation keyed on a boolean has nowhere to put an origin. The missing piece for ripples or any
positioned one-shot effect is the originating event, or coordinates from it, reaching the decoration
slot. Named now so it is not rediscovered as a styling problem; not worth building until asked for, and
opt-in when it is, or every control pays for a listener it ignores.

**Two smaller things, so they are not re-litigated.**

- _The `<label>` wrapper and `LabelContext`._ `BinarySwitch` wrapped itself in a `<label>` so clicking
  the painter toggled the input, reading a context to skip the wrapper when an ancestor `Label` supplied
  one (nested `<label>` is invalid). The hit-area half is solved better here: the input is `inset: 0`
  over the painter, so it **is** the hit target. The context half has no current need, but the pattern is
  worth remembering if a `Label` or `FormField` arrives — a component supplying a wrapper should let
  descendants detect it rather than making every caller pass "I am already labeled". Incidentally
  `<label disabled>` was never valid HTML and did nothing.
- _`hasOwnValue`._ A controlled-versus-uncontrolled mode flag: false force-wrote the DOM back to the prop
  and reported the inverse; true reported the DOM's checkedness. `checked` replaces the flag with
  one mechanism, so it should not come back. The force-write guards something real and became
  `syncElement` — see below.

### Controls: `BinarySwitch`, and `Toggle` / `Radio` as presets over it

Settled, immediately after the audit, which predicted most of this.

**`BinarySwitch` is a private shared composite, not a leaf and not public API**: `InteractionWrapper` plus
the hidden-native-input leaf plus change gating plus the single-writer DOM sync, parameterized by
`type: "checkbox" | "radio"`. `Checkbox`, `Toggle` and `Radio` are a dozen lines each on top. Checkbox and
Radio shared about nine tenths of their leaf, including `syncElement` — the one piece that must not be
copy-pasted, because the second copy is where the bug comes back.

It lives in `Primitives/BinarySwitch/` and is **absent from `index.ts`**; only
`BinarySwitch.types` is exported, because `CheckboxProps` and `ToggleProps` alias
`BinarySwitchPresetProps` and the emitted `.d.ts` has to resolve it. Shipping no component is what
`Primitives/` is for: it renders DOM so it is not an `Abstract`, and consumers
should reach for the presets so it is not public. Promoting it later is one line; the reason not to is
that a public `BinarySwitch` is the union of three controls and invites use over intent.

**One writer for the input's state.** No JSX `checked` binding. A single `syncElement` pushes
`element.checked = props.getIsChecked()` and `element.indeterminate = getIsMixed()` from state, called
from a render effect and again from `onChange` immediately after reporting.

The reason cost a bug to find: the browser flips `input.checked` **before** firing `change`. If the
owner's setter refuses the write — an optimistic toggle a server rejects, a "keep at least one selected"
rule, a form frozen mid-submit — the signal never changes, the render effect never re-runs, and the input
is left `checked` while state says otherwise. Nothing looks wrong then, because `appearance: none` means
the painter draws from the (correct) flags. The damage lands on the **next** click: the browser flips
back and reports the opposite of what the user did, and stays inverted.

`indeterminate` has the identical failure with a likelier trigger — the browser **clears** it on click,
and an effect keyed on an unchanged mixed value will not put it back, so a mixed checkbox would silently
stop being mixed. Hence both properties in one function.

This holds only while the owner's write is synchronous. A consumer `onChange` returning a promise is
awaited by nobody; an async accept would need the render effect to finish the job.

**`checkedState` is a flag, so the painter stops being told twice.** The flag arrived on
`ExternalInteractionFlags` and now sits on `BinarySwitchFlags`, with `InteractionWrapper` taking a matching
`getCheckedState`, which the presets `Omit` — they own the value, and two sources for one state is what the omission prevents. `PageCheckboxContent` / `PageToggleContent` / `PageRadioContent` now read `getFlags().checkedState` and take nothing
but flags. Before this, `CheckboxPage` passed `checked` to the component _and_ closed over the same signal for the
painter, with the component connecting neither: the faked linkage `renderDecoration(getFlags)` was
introduced to kill. Three states rather than two is also why it had to be a flag: mixed is computed by
the shell, so a painter inferring it from a boolean could not draw it.

**`CheckedState` is an abstract of its own, because a second control asked for it.** It was
`boolean | "mixed"` declared inside `BinarySwitch.types`; it is now
`Abstracts/CheckedState/CheckedState.types`, which `BinarySwitchFlags` imports like anyone else. The
standing _private until a second consumer_ rule fired the moment `Select`'s group header needed the same
three states — a header summarizing a group of options is the same shape as a parent box summarizing a group
of children, and two controls each declaring their own `boolean | "mixed"` would agree by luck rather than by
construction. It is a type and one fold, not a component, so it sits beside `DateValue` — the other abstract
that is a vocabulary rather than a behavior — rather than under `Essentials`.

`CheckedStateUtils.fromMembers` takes the booleans and returns `true` only if every member is checked, `false`
only if none is, and `"mixed"` the moment they disagree. **An empty set is `false`, not `"mixed"`**: mixed means
_these disagree_, and nothing cannot disagree with itself; a group filtered down to no options would otherwise
paint a half-tick over an empty box. Elsewhere confirms the shape rather than the name — MUI's tree view
reports `"selected"` / `"indeterminate"` / `"unselected"` per item, and Ant Design's tree carries a
`halfChecked` list beside its checked one, both of which are this same three-way value spelled differently.

**Mixed is one-way and deliberately not part of the signal.** `getIsMixed` sits beside `getHasError`. A
user can never _click into_ mixed: it is a summary the owner computes (a parent box over disagreeing
children, a setting inherited elsewhere), and clicking always resolves it. Putting `"mixed"` in the
two-way signal would force every plain-checkbox consumer to handle a third case that only arrives from
their own code, and would let the component write a value the user cannot produce. `Radio` has no
`getIsMixed` and it is `Omit`ted: ARIA gives `role="radio"` no mixed state, and a radio that summarizes
anything is a checkbox.

**A switch may not be mixed, so `Toggle` drops its role exactly while mixed.** ARIA disallows
`aria-checked="mixed"` under `role="switch"`, so the leaf computes
`role = isSwitch && !isMixed ? "switch" : undefined`, falling back to the native checkbox whose
`indeterminate` does map to mixed. A tri-state toggle announces as a mixed checkbox while mixed and as a
switch otherwise; the role flips on a state change, which readers re-announce anyway. The one place a
requested feature and the spec disagree, resolved by a role swap rather than an approximation.

**The group owns the value; each radio derives a boolean.** `RadioGroup` takes `value: Signal<T>`
and publishes a context; `Radio` takes `getValue` and reads `context.getValue() === props.getValue()`.
Per-radio `checked` was never on the table: a member of a mutually exclusive set does not own its
truth, and N booleans can represent states the group cannot be in.

Context rather than `Tabs`' count-plus-`renderOption` shape, because each radio keeps the whole
`InteractionWrapper` surface — its own tooltip, decoration, disabled and error state. A data-driven group
would grow a `compute*` prop per capability and re-expose all of them per index. The cost is
registration: `context.register(entry)` runs during each `Radio`'s setup and cleans up through the
caller's `onCleanup`, and the group sorts entries by `compareDocumentPosition` rather than trusting
registration order, so a reordered `<For>` cannot desynchronize keyboard order from the screen.

The context is typed `unknown` on the value, because a context cannot be generic; `Radio<T>` casts at the
boundary. Benign consequence: a `RadioGroup<SizeValue | undefined>` will accept a `Radio<string>`, and
only the group's own signal keeps the type honest.

**Native `name` grouping is used; native arrow-key navigation is not.** Every group generates a
`createUniqueId()` name unless given one, so the browser does DOM-level mutual exclusion. Its keyboard
handling cannot be used: disabled here is `aria-disabled`, so the browser sees no disabled radios and
would happily move to one **and select it**. `RadioGroup` `preventDefault()`s the arrows and walks
itself.

Its rule is one step more generous than either pattern alone: arrows move to the next entry that is
enabled **or** reachable-while-disabled, and select only if enabled. Single tab stop kept, disabled
options unselectable, and a disabled-but-reachable option can still receive focus so its tooltip
explains itself. `Home` / `End` jump to the ends of the same set. All four arrows work regardless of
`getDir`, which only drives layout.

This required `computeIsReachable` to move from `InteractionWrapper` into `InteractionTracker`, since
`Radio` computes the same predicate. Extracting rather than restating is the point: the predicate is
settled and two copies would drift. It does not re-expose reachability to a _leaf_ — `Radio` is a preset
one level above the leaf.

**`tabIndex` is now a conjunction, narrowing a previously absolute rule.** `wrapElement` takes an
optional `getIsTabbable` and computes `(!isDisabled || isReachable) && isTabbable ? 0 : -1`. The
wrapper's veto is still absolute; an ancestor owning a roving tab order can narrow it further. So the
`tabIndex` line still runs for every element, it just no longer decides alone. `getIsTabbable` stays
public on `InteractionWrapper` and is inherited by `Button` and `Checkbox`, because participating in
someone else's roving order is a general capability — unlike `getCheckedState`, which the presets own.

`InteractionWrapper` also gained a `ref` passthrough, since `RadioGroup` must `focus()` a specific radio.

**Known gaps, deliberate.** Arrow keys do not cross groups, and a group with every option disabled has no
tab stop at all — both correct, both look like bugs from outside. And **a caption drawn inside the painter
is not a label**: `PageRadioContent` draws its caption inside the painter under the `inset: 0` input, so
the whole row is clickable, which is legitimate but is not an accessible name and cannot place the caption
anywhere the painter does not reach. `Label` is the answer.
