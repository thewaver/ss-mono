---
paths:
    - "components-solid/**"
    - "playground-solid/**"
---

# Conventions: Solid

Rules that exist only because of how Solid works: how its compiler binds props and handlers, how it delivers
events, and how this library shapes Solid props. The rules that hold in every framework are in `conventions.md`.

### An event handler prop is bound once, so reading a signal in it rebuilds the element

The compiler wraps an attribute expression (`aria-label={getLabel()}`) in its own effect, but assigns an event
handler prop once, inside the surrounding render expression. So `onClick={handle(getItem())}` tracks `getItem()` as
a dependency of the whole insert, and when it changes the element is **replaced**, taking focus and pointer capture
with it — `PatchBoard`'s sockets lost focus to the body every time a carry started. **Write the handler as an arrow
that reads inside itself**: `onClick={(e) => handleSocketClick(getPlaced(), e)}`. The same goes for a `ref`
callback. A string-valued memo is safe, since an equal string notifies nobody; object and array reads are what bite.

**A render callback called inside a reactive expression is the same trap.** `{renderItem(getRow().kind)}` re-runs
whenever the row object is rebuilt and destroys whatever held focus. Narrow the read to what the callback needs — a
`createMemo` yielding the string — so it is called again only when that changes.

### Under `<Index>` an element outlives the item it was drawn for, so anything keyed by the item follows it

`<Index>` keeps the element at each position and swaps the item under it, so when a list is filtered or reordered
the element that showed one item goes on to show another. A `ref` callback runs once, at creation, so a record
written there under the item's value (`refs.set(value, element)`) keeps the value of the first item forever: after a
filter, looking an item up finds the wrong element or none, and `Tree`'s highlight marker slid to the wrong row of
the Playground's menu. **Write the record in an effect that reads the item through its accessor**, clearing the old
entry in the effect's cleanup only if it still points at this element. A record keyed by position (`Menu`'s index
map) or by the element itself (`Listbox`'s element-to-accessor map) is unaffected.

### Solid delegates events at the document, and that changes what stopping one does

For common events (`click`, `pointerover`, `keydown`) Solid attaches one listener to the document and walks up from
the target itself. **`stopPropagation` cannot keep an event from another document listener**, which sits on the same
node: use `stopImmediatePropagation`, or have the other listener ignore targets that are not its own. **A delegated
event walks the component tree, not the document tree, so it crosses portals**: a key pressed in a nested popup
reaches every enclosing popup's handler. A handler that must answer only for its own content checks that
`event.target` is inside its own root, rather than stopping propagation for everyone.

### Props take a constant or an accessor, and carry no `get` prefix

A prop declared `indent: number` is passed as `indent={12}` or `indent={getIndent}` and read as
`access(props.indent)`; `AccessorProps<T>` maps each non-skipped key to `MaybeAccessor<V>` (`V | Accessor<V>`). **The
prefix went at the user's request**: a mapped type that renamed `indent` to `getIndent` broke go-to-definition, and
`[x, setX]` naming does not mark the getter either. Hand-written getters keep it — controllers, contexts, handles and
render-callback parameters (`renderStep(getStep, getState)`).

**`access(props.x)` at the point of use, never a resolver at the component root.** A proxy normalizing all props once
guessed wrong from runtime values twice (wrapping `undefined` into a truthy getter disabled typing in every text
field), and was also slower than `access` when measured.

**A plain value can still be reactive.** `<Cmp x={sig()} />` compiles to a getter, verified against
`babel-preset-solid`, so reading `props.x` in a tracking scope tracks `sig()`. Reading a prop once at setup takes a
snapshot, and a helper resolving a prop eagerly to an accessor would freeze it, which is why none exists. **Hand an
accessor onward as `() => access(props.x)`** only where something stores the function and calls it later
(`createValueMirror`, `createValueSync`, `resolveAriaLabel`); gate it on presence where the target tells "no accessor"
from "an accessor returning undefined". Forwarding to a child needs neither: `min={props.min}` passes straight
through.

### What the mapped types skip, and the hole in `AccessorProps`

`AccessorValues<T>` maps every key to `MaybeAccessor<T[K]>` without asking what the value is — safe only because a
`Base…Values` half holds no functions. `AccessorProps<T>` is for Solid-only props types (an internal leaf) and skips
functions, symbols and both signal forms; everything else, including arrays, `Map`, `Node` and plain objects, is
wrapped. Refs are `elementRef: HTMLElement | undefined`. Both keep `undefined` in an optional value's accessor.

- **`SignalPair<T>` is named in the skip test beside `Signal<T>`**: a pair is a tuple, not a function, and the test
  distributes over `SignalSource<T>`, so naming only `Signal` resolves to `boolean` and wraps the prop into something
  nobody can pass.
- **A generic prop cannot pass through `AccessorProps`**: with `T` unbound the key filter cannot resolve and the key
  silently vanishes. Take it from a shared `Base…Values` through `AccessorValues`, which has no such hole
  (`RadioProps<T>` does), or declare it by hand beside the block. Check for it whenever a generic component is added.
- **An object of functions is wrapped** because it is not itself a function, so it sits beside the block —
  `ScrollerButtonProps` is `AccessorProps<{ step: ScrollerStep }> & { stepper: ScrollerStepper }`.

**Otherwise a props type is one `AccessorProps` block and nothing else** — the user's rule, so one place decides a
prop's shape. Signals, callbacks, records and arrays go inside; the mapped type sorts them out. A hand-written
`MaybeAccessor` outside the block claims to be one of the cases above. Intersecting another named props type is
composition and fine, and so is `AccessorProps<A & B>`, which was checked equivalent to the flattened type.

**`ParentProps` wraps the parameter, never the type** — the user's rule: `(props: ParentProps<XProps>)`, so the type
stays composable without dragging `children` into everything built on it.

### Signal tuples for two-way state

State the component both reads and writes arrives as the whole `createSignal` pair under the bare name
(`visibility={modalVisibility}`); `AccessorProps` skips it. A caller that only writes takes `const [, setOpen] = …`.
Use it only where the component genuinely writes.

**The prop type is `SignalSource<T>` — a `Signal<T>` or a `[get, set]` pair with a plain setter** — so a consumer whose
state is a memo, a store field or a pair of callbacks passes it straight in:
`value={[() => access(props.value), props.onInput]}`. A plain setter cannot take an updater, so the control
normalizes the prop first with `accessSignal(() => props.x)`, which returns a real `Signal<T>` that reads through the
getter, resolves updaters against the untracked current value, skips writes that change nothing, and holds no state.
It takes an accessor of the prop so a swapped source stays correct. `createOptional` and `createPassThrough` are built
on it. **A mirror is still the answer where a field must hold a half-written value the owner has not accepted.** **A
signal handed out stays a real `Signal`**, so a consumer keeps the updater form.

### Accessor or plain value

Ask who needs to track the value, and when. **Pass the accessor** when the parent hands on a signal without reading it
and the callee may subscribe later; **pass the plain value** when the parent already reads it in the same scope or it
cannot change during the call. Shortcut: if `fn(x())` would lose a subscription the callee needs, pass `x`.
`Tooltip.renderContent`'s placement, `Shape.renderChildren`'s size and the SVG defs builders' size take accessors;
`Tabs.renderTab`'s index and `computePoints`' size take plain values.

### A prop is never written `a && b`

Solid's compiler wraps the left side of `&&` in a boolean memo, so `name={props.name && `${props.name}-x`}` gives
`false`, not `undefined`, when the name is unset, and an attribute set to `false` is written as the text "false" — a
form submits a field called "false" and every instance shares `id="false"`. **Write `a === undefined ? undefined : b`.**
Found on `DateRangePicker`, `DateTimePicker` and `ColorArea`.

### An element's `class` never changes while it also uses `classList`

When `class` changes, Solid writes the whole attribute again and the classes `classList` had toggled on are gone
until each toggles again — `PageRangeContent` lost its colors and error look, and `PageTabContent` its selected
marker, whenever the orientation knob switched. **Put the changing class into the `classList` object** and keep
`class` fixed.

### Nothing is created inside a prop expression

The compiler turns `progress={createSignal(0)}` into a getter, so every read of `props.progress` runs the
expression again and gets a new signal: the component writes into one copy and reads a fresh `0` from the next, and
its animation sits on the first frame. **Create the signal, store or object first, in the component or callback
body, and pass the variable.**

### A conditional prop read outside a render is written as a function

Solid compiles `prop={a ? b : c}` into a getter that builds a memo on every read. Read inside a component, that memo
has an owner; read by an observer or a document listener, it does not, and each read leaks one with the warning
"computations created outside a `createRoot` or `render` will never be disposed" — opening one `Menu` submenu
leaked about thirty-six. **Pass a function that does the test inside itself**, unless the receiver checks the prop
for presence (`anchorRect === undefined`), in which case call a named function at the prop instead.
