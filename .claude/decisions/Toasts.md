# Decisions: `Toasts`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Toasts`, and a queue the consumer owns

The shape question `backlog.md` parked toasts on rested on a premise that does not
hold here.

**`backlog.md` claimed toasts needed "an out-of-tree queue and an API that is called rather than bound,
which nothing here has". Both halves were already covered.** "Out of tree" is a signal created outside any
component — `createRoot(() => createSignal<Toast<T>[]>([]))`, which `Viewport.context.ts` already does — so
the list outlives whatever raised a notification without the library owning anything. "Called rather than
bound" is what a signal's setter is: `queue[1]((prev) => [...prev, toast])` is an imperative call from
arbitrary code with no component in scope. What the note reached for is sugar — `toast.error("…")` — which is
a layer for a consumer who has been met, and a library that has not met them should not pick their
vocabulary.

So the prop is `toasts: Signal<Toast<T>[]>`, per _"Signal tuples for two-way state"_ in
`conventions.md`.

**The division of writes is what makes the two-way signal correct rather than convenient.** The consumer is
the only thing that adds; the component is the only thing that removes — a duration elapsing, and the limit
being exceeded. `Modal`'s `visibility` argument with a list instead of a boolean.

It also settles an ownership question no other shape answers cleanly. If the consumer owned the list outright
and the component only reported, "show at most three" would be enforced consumer-side, making queue policy
the consumer's job when policy is behavior and behavior is the shell's. If the component owned the list
privately, nothing could raise a toast without a handle to a mounted component. A shared signal is the only
arrangement where the component enforces policy by writing something the consumer can see.

**A controller handed over at mount is deliberately not used.** The `onMount` shape issues commands to a
mounted thing; a queue is state, and state that must outlive the mount cannot be reached through a handle the
mount gives out.

**The component keeps everything with a clock**: the enter transition (`ElementFader` unchanged), the
retention window during which an entry already gone from the consumer's list stays mounted to play its exit,
the auto-dismiss duration and its pausing, and the limit.

**Duration lives on the record and nowhere else — there is no component-wide default.** `Toast<T>` is
`{ id, value, durationMs? }`, and an absent `durationMs` means the toast waits to be dismissed. A default
prop would make per-toast stickiness inexpressible, since `undefined` would then read as "use the default"
and there would be no second spelling for "never" that was not a magic number. A consumer wanting four
seconds everywhere puts it in the push helper they already have. This is _"the absent value is the mode"_
from `Progress`, and it fails visibly.

**`id` is a separate field rather than identity living on `value`.** `Tabs` keys on `value` because two tabs
with the same value are meaningless; two identical toasts are meaningful — "Saved" twice in a row — so keying
on value would collapse them or make a change look like no change.

**One piece of internal state: the ordered list of rendered ids**, the admitted list plus the ids still
playing their exit. Everything else derives — an id absent from the admitted list is leaving. Ids are
strings, so `<For>` keys them by value and each entry keeps a stable node whatever the consumer does with
record references; the problem that forced `Tabs` onto `<Index>` does not arise. The record for an id is
latched inside the `<For>` callback, so an entry keeps painting its last known content while it fades.

**An unexported `ToastsItem` leaf per entry**, in the `TabsItem` shape, owning its own `ElementFader` and
duration timer so both are disposed with the entry rather than accumulating in a container that lives as long
as the application. It reports upward once its exit has finished and the container drops the id then.

**The duration timer arms and disarms through `onCleanup` inside its own effect, which is load-bearing.**
The first version cleared a timeout at the top of the effect and measured elapsed time only when pausing, so
the clock restarted from full whenever the effect re-ran — and it re-ran on every array change, because it
read whether the entry was exiting. Three toasts raised together therefore dismissed one and reset the other
two, indefinitely. It now arms inside the effect and subtracts the elapsed time in its cleanup, with a dependency
set of the duration and whether it is paused. Found by driving the page, invisible to every type and DOM
assertion.

**Pausing is region-wide and forced.** Hovering or focusing anywhere in the region holds every countdown;
there is no prop to switch it off. Focus is the half that matters — a toast must not vanish out from under
the button someone is reaching for. The listeners are `mouseover` / `mouseout` and `focusin` / `focusout` on
the region with a `relatedTarget` containment guard, **not** `mouseenter` / `mouseleave`, because the region
is `pointer-events: none` and is never itself a hit-test target; bubbling from the entries is the only thing
that reaches it.

**Urgency is per toast, and announcing is the announcer's job rather than the visible region's.** A live
region carries one politeness for everything inside it and there is no way to mark one child as more urgent
than its box, so an error could not interrupt while a confirmation waited its turn. `computeAnnouncement` is
the way out: given it, `Toasts` announces each arrival through `LiveAnnouncer` at that toast's own
`ariaLive` — falling back to the region-wide `ariaLive` as the default — and the visible region carries no
politeness at all. This is Radix's arrangement, reached from the same constraint.

**It is a branch on prop presence, and the branch is deliberate rather than lazy.** Without
`computeAnnouncement` the region keeps its own `aria-live` and behaves exactly as before, because the library
does not own the toast's text and cannot start announcing on a consumer's behalf — and silently _stopping_
announcements for a consumer who has already shipped would be an accessibility regression they would never
see. So the mode is chosen by whether the consumer has said what to announce.

**Both announcer regions are reserved when the stack mounts.** A live region only announces what is inserted
after it is already in the document, so a region created by the first message may be silent for exactly that
message — the failure that is hardest to notice, because everything after it works. `LiveAnnouncerUtils.reserve`
exists for this: it creates a region without saying anything into it.

**The keyboard route in is `F8`, and `Escape` is the way back.** A toast is portalled to the end of the
document, so nothing tabs to it in any order a reader would expect; the published answer is a hotkey, and
Radix's default is the one adopted. The region takes `tabindex="-1"` so the key can focus it, the element
focused before the press is remembered, and `Escape` from anywhere inside hands focus back there. A consumer
with two stacks on one page sets `hotkey` to an empty string on the one that should not answer — the only
spelling for "no hotkey", since an absent prop has to mean the default.

**A toast's own `onShow` and `onHide` are `Modal`'s pair, at the same two boundaries.** They fire when the
entry transition starts and when the exit transition starts, not when either finishes, because that is what
`ElementFader` reports and what `Modal` already means by those names. The consumer owns the list, so arrivals
and departures are already visible to them; what an effect over their own array cannot see is the transition
boundary, which is the whole of what these two add.

### `Toasts`: swipe to dismiss follows the stack's edge, and the painter draws the slide

**The direction comes from the alignment, the way Drawer's comes from its edge.** `ToastUtils.computeSwipeDirection`
sends a toast off the side it sits against: a stack against the left or right edge, corners included, swipes
sideways, which also leaves the page's vertical scroll to the browser; a stack centered along the top or bottom
swipes up or down; `middle_center` has no edge to leave by and cannot be swiped, as a centered `Modal` cannot.

**A committed swipe removes the toast from `toasts`**, the same path the timer takes and the same thing a
consumer's close control does, so the toast leaves through its ordinary exit. The toast's countdown is held while
the swipe is under way, per toast, beside the stack-wide hold on hover and focus.

**Unlike Drawer, the library does not move the toast.** `Modal` writes its swipe transform onto its own container
because that container is the library's element. A toast's box belongs to the painter, which already draws the
pile offset and the entry and exit. So `ToastState` hands over `swipeDirection`, `swipeOffsetRatio` and `isSwiping`,
and the painter composes the shift with whatever else it draws. The offset is left where it was on commit, so the
exit plays from where the finger let go.

**WCAG 2.5.7 is met by the consumer's close control.** A swipe is a drag, and the single-pointer alternative is a
pressable control. The library renders none inside a toast, so `isDismissableOnSwipe`'s doc block says a swipeable
toast must paint one, the same shape as _"A component hands out a controller and renders no controls of its own"_.

### `Toasts`: what the painter gets, and why position is not fully delegated

**`renderToast(getToast, getVisibilityTarget, getTransitionDurationMs, getState)` opens with `Modal`'s
contract, in `Modal`'s order.** A consumer's toast painter and their modal painter are the same kind of
object — something that transitions itself between two states over a duration it was handed — and spelling
that two ways would be one contract under two shapes. Four arguments is not new:
`InteractionTooltipDefs.renderContent` already takes four with the same ordering. `getToast` is an accessor
and comes first, following `Tabs.renderTab`, because a consumer may replace the record for an id
("Uploading" becoming "Uploaded") and the painter must see that without remounting and restarting the entry
animation.

**`ToastState` is `{ index, count, isPaused }`, and those are the stacking hints.** The number of cards in
front of an entry is `count - 1 - index`, and newest-ness is a comparison against the ends. `index` is queue
position, oldest first, independent of `getDir` — the consumer sets the direction so they can map it to
visual order. Both are inside the reactive record rather than passed plain like `Tabs.renderTab`'s index,
because they change while an entry is mounted: removing the first toast renumbers everything behind it.
`isPaused` is there so a painter drawing a countdown can hold it; the countdown itself is the painter's, for
`Progress`'s reason.

**Nothing says _why_ an entry is leaving** — elapsed, closed, or pushed out by the limit. A painter drawing
those differently would animate a distinction the reader cannot act on.

**Nothing carries a dismiss action, and that is not an omission.** The consumer owns the signal, so the close
button their painter draws removes the entry from their own list, and the exit still plays because the
component holds the entry through it.

**Position cannot be fully delegated, and the reason is the live region rather than the geometry.** A
notification region only announces content inserted into it if the element was already in the document, so it
has to be a persistent element the component mounts once and keeps — and it has to be the component's, by the
rule that keeps `Select`'s `<div role="group">` out of consumer markup, with more force here because a
subtly wrong live region fails silently. Given that, delegating its position would mean accepting a class name
or a style object, and `TextInput` already argued that out: it accepted a whitelisted style object _only_
because text the browser draws had no other hook. Here there is another hook, used by three components —
`Modal` with `getAlignment` / `getMargins`, `Drawer` with `getEdge`, `Label` with `getDir` / `getGap`. Per
`Modal`: placement is geometry, not paint.

So the region is a viewport-sized layer in the `Viewport` portal that paints nothing and clicks through, and
four geometry props place the stack inside it: `getAlignment` (nine positions), `getDir` (which end new
entries enter from, and whether the stack runs down an edge or along one), `getGap` and `getMargins`. Each
entry sits in a minimal library box that re-enables pointer events and is the flex item; it carries no role,
since politeness is set once on the region and a role per entry would announce twice.

**Alignment is independent of direction, and `ToastUtils.computeStackAlignment` keeps it that way.** A
reversed flex direction inverts "start" on the main axis, so a naive mapping would make `bottom_right` name
different corners depending on `getDir`. The function flips the main axis alone — exact arithmetic over two
enums, and the one part of this component reachable from `npm test`.

**Flow stacking is the geometry props; an overlapping pile is the painter's**, offsetting and scaling itself
off `index` and `count`, which works for a fixed peek distance. Overlapping by each card's own **measured**
height needs the neighbors' heights, which a painter cannot take; `ToastState.sizes` hands them over, and
_"Measuring the element in front"_ is where that was settled. The arithmetic is still the painter's.

**Toasts sit above dialogs** — `z-index` 200 against `Modal`'s 100 — because a toast routinely reports the
outcome of the action a dialog just took.

**`getLimit` is written out as `Accessor<number | undefined>`** for the `AccessorProps` hole: an optional
prop whose value may be `undefined` cannot pass through the mapped type, and "no limit" is a value a consumer
switches to at runtime rather than a prop they omit. `getAriaLabel` is **required**, since a `role="region"`
with no name is not exposed as a landmark at all.

**`getOverflow` keeps both queue behaviors rather than picking one.** `dismiss_oldest` writes the excess out
of the consumer's list so the newest is on screen; `hold_newest` renders only the limit and leaves the rest
queued, entering as slots free. Genuinely different products — latest-news versus lose-nothing — and the
request for a prop rather than a default is why both exist. Held entries are not rendered at all, so they run
no clock, which falls out of the design.

### `Toasts` becomes a provider, and each toast brings its own painter — decided, not yet built

The user's design, settled once Toasts' Docs page showed that two `Toasts` in one corner overlap and claim the same
shortcut — a gap for any page with two independent widgets, not only the Docs. **A provider, declared like
`ViewportWrapper`, wraps the app or any subtree** and holds where its stack sits and how it stacks: alignment,
growth direction, limit, overflow, gap, margins, the shortcut into the region, and an optional default painter.
**Anything inside raises toasts through the nearest provider**, by a `show` and `dismiss` pair that each report whether
they acted, so nesting is the context's ordinary nearest-ancestor rule. **A provider warns** when another is mounted
at the same alignment; two at one alignment stay possible, the consumer's to choose.

**Each queued toast carries its own render function**, its duration, its urgency and the sentence it is announced with
— the user's call over a record painted by the provider, since a toast raised far down the tree, far away in the code,
should decide its own look, and a deliberate difference between toasts is the consumer's to make. It is a render
function rather than a finished element because the painter is handed live state the raiser cannot know: its place
in the stack, its paused countdown, its swipe distance, its transitions. The announcement travels with the toast
because the library ships no words and a painted element is not reliably read. In each framework the painter is that
framework's render form: a function returning JSX in Solid and React, a render function in Vue, a snippet in Svelte.

**The queue stays the consumer's when they want it**: private to the provider unless passed in, as a popup's open
state is, so code outside any component can still raise a toast and a page can still read the list. This keeps what
_"Controls: `Toasts`, and a queue the consumer owns"_ argued for, and replaces its single-instance shape.

### `Toasts` as a provider: what building it settled

The provider keeps the name `Toasts` and wraps children; `useToastsContext()` hands out `show` and `dismiss`, outside
any provider answering inertly through `ToastUtils.UNPROVIDED_CONTEXT`. The core's record is `BaseToast<T>` (`id`,
`value`, a required `announcement`, `durationMs`, `ariaLive`, `onShow`, `onHide`), and each framework adds its own
`renderToast` as `Toast<T>`, since every framework package re-exports the core and cannot export a second `Toast`.
`announcement` is required under _"The library says what a component is"_, so the region carries no `aria-live` and
the provider-wide `computeAnnouncement` and `ariaLive` went. The stack's flow prop is **`flexDirection`**, with CSS's
own values, not `dir`, which is text direction (`orientation` does not apply: nothing walks a toast stack with arrows).

**`show` returns the toast's id, or `undefined` when it refused** — the user's choice between that and returning a
dismiss function, Claude picking: one name for a toast across `show`, `dismiss(id)`, the shared queue and the painter;
a page can close it from elsewhere; and the answer still says whether it acted. A consumer may pass their own id, so
one "Saved" cannot stack twice. A raiser's painter closes its toast with the `dismiss` it got when raising. **The
provider's default painter is handed a `dismiss` for the toast it draws**, since it is given to the provider from
outside and has no raiser to borrow from — only the default painter gets one.

**One shortcut reaches every stack** — the user's call: F8 cycles through the stacks that hold toasts, Shift+F8 back,
Escape returning focus to where it came from. The page-wide record each provider already joins for the same-alignment
warning keeps the stacks in order and holds the one binding, so providers no longer bind the key themselves.

**Each toast reads in the direction of what raised it** — the user's call, as `Modal` reads its opener: the element
focused when `show` was called, or the page's direction with nothing focused. The stack's placement stays as
configured; only each toast's own content takes the direction.

**The SpotlightGuide tour opens its prompt over the guide** — the user's call, now that spotlights stack: Escape on
the prompt returns to the guide rather than pausing the tour, and the `batch` hand-over goes. **A spotlight that comes
back from under another returns focus, on closing, to what first opened it**, not to wherever focus was when it came
back (WCAG 2.4.3).

**Focus goes back to what first opened a spotlight, not to where it was when the spotlight came back** (WCAG 2.4.3).
A spotlight covered by another loses focus and regains it on its return, by which time focus sits wherever the layer
above left it — "Add to basket", for the tour's prompt. So `autoFocus` takes the layer's open state (`getIsOpen` in
Solid and Svelte, `isOpen` in React and Vue), and while the layer stays open it keeps the first origin through
`FocusManagerUtils.createOriginKeeper`, handing it to `focusInto` as `origin`.

**The register is `ToastUtils.registerStack`**, which replaced `claimAlignment` and `createFocusRoute`. A stack's place
is the order its provider first joined, keyed by an owner object the provider keeps for life, so joining again under a
new alignment, region or portal keeps the place. The register binds each pair of keys once, on the page itself, with the
first stack that answers to it, and unbinds it with the last, so a stack inside an open `Modal` is out of reach until
the modal closes.
Escape is listened for on each region, hands focus back to the element focused before the first F8, and only then
calls `preventDefault`. `computeCycleTarget` is the pure step, and `cycleFocus` is exported for a consumer's own
control. **The keys default to F8 and Shift+F8** (`HOTKEY_FORWARD`, `HOTKEY_BACK`) and are set through `InteractionSettings`,
below. **Direction is read once, at `show`**
(`NavigatorUtils.readDirection(FocusManagerUtils.getFocusOrigin())`), since the raiser may be gone afterwards; a toast
written straight into a shared queue takes the page's. **`show` generates ids** (`toast-N`, skipping queued ones)
through `withRequestedToast`. Per framework: React and Vue keep a copy of the queue updated on every write, so several
`show` calls in one handler each see the earlier ones; React and Vue read the default painter on every render, Solid
and Svelte at mount; Vue's default painter is a `renderToast` slot; Vue and Svelte examples keep their raising buttons
in separate files, since a context is read only during a component's setup. Safari does not focus a clicked button,
so there a toast raised by a click takes the page's direction, as `Modal`'s opener does.

**The toast stack is always laid out left to right; each toast takes the direction of whatever raised it.** The region
carries `dir="ltr"`, because flexbox measures start and end from the text's direction: on a right-to-left page
`flex-start` is the right-hand side, so `middle_left` would have drawn on the right. `alignment` names the screen's
sides and must not mirror; each toast's own `dir` overrides the region's for its content.

**React's fader reports each fade once, even in development.** React runs every mount effect twice there, with a
cleanup between, and the cleanup's `fader.cancel()` reset the pending target, so the second `show()` began the same
fade again and `onShow` ran twice — every React fader user saw it, `Modal` included. `ElementFaderReactUtils.useFader`
now remembers the last target it reported and passes `onShow` or `onHide` on only when it changes; the core fader is
unchanged, since only React runs effects twice.
