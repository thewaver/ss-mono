# Decisions: `Stepper`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Stepper`, where the state vocabulary is the consumer's

Built, after the longest design conversation in this file's history. A progress strip over a
multi-step flow.

**The library never computes whether a step is complete.** Each step arrives with a `state` the component
declares as a generic and never inspects — `done`, `failed`, `skipped`, whatever the consumer needs — and
its source is deliberately unknown. This dissolved the months-old "what does the stepper gate on" question:
nothing, because it is told.

**What the library does own is `aria-current="step"`**, which is not a state a consumer may invent.
`aria-current` is enumerated and `step` means exactly this, and an unrecognized value degrades silently to
plain `true` — so a consumer expressing "current" as one of their own states would produce a strip whose
position is invisible to a screen reader. Same split `Breadcrumbs` makes with `aria-current="page"`.

**`computeStepAriaLabel` is required, and that is why the free vocabulary is safe.** No ARIA attribute
exists for "this step failed", for any invented state, so a red ring on step two is indistinguishable from
step three and the only route by which an invented state can be announced is **text in the accessible
name**. The strings are the consumer's, for the reason `TagInput` does not ship the word "Remove".

**Every step is a `<button>`, and navigability is `aria-disabled`.** This reverses an earlier call — a step
you could move to was a `<button>` and one you could not was a `<span>`, on the precedent `Breadcrumbs` sets
for its last crumb — and ARIA is what reversed it. A step's name is the consumer's state string, handed in
as `aria-label`, and a bare `<span>` has the `generic` role, for which ARIA 1.2 says "Authors MUST NOT use
the aria-label or aria-labelledby attributes to name the element". So the `<span>` was throwing the state
away. It is worse than that where the step carries a tooltip: the step then stays reachable, `wrapElement`
gives it `tabindex="0"`, and a focusable element with no role announces as nothing at all (4.1.2 Name, Role,
Value). The `Breadcrumbs` precedent does not actually reach this case — its current crumb carries no
`aria-label` and, since it was taken out of the tab order, is not focusable either.

A non-navigable step with a tooltip still stays reachable, which is `getIsReachableWhenDisabled`'s pairing,
derived from whether a tooltip exists rather than taken as a prop, so that rule's warning can never fire
from here. What changed is only the element it lands on.

**Each step is its own tab stop; there is no roving order.** Researched on request. Roving is legal — no
criterion counts tab stops — but the APG's account of how a user _discovers_ arrow keys is that assistive
technology recognizes the role and says so, and its composite list (combobox, grid, listbox, menu, radio
group, tabs, toolbar, treegrid, tree view) has no stepper. An ordered list of buttons announces "list", so
roving hides most of the strip from anyone who did not guess. No ARIA attribute advertises arrow-key
navigation either: `aria-keyshortcuts` is for shortcuts that activate or focus, `aria-roledescription`
renames a role without adding behavior and is explicitly discouraged, and `role="application"` disables
browse mode wholesale. Getting the announcement would mean claiming `role="tablist"`, which asserts the
steps swap panels — untrue when the state source is agnostic. A stepper that does swap panels is `Tabs`.

The sharper argument is local: a locked or failed step stays reachable **so its tooltip can be read**, and
under roving someone who does not know to press an arrow tabs in, lands on the current step, tabs out, and
never reaches it.

**Both orientations ship**, as a `dir` prop, and nothing in the markup states the axis. `aria-orientation` is
not among the attributes the `list` role supports, so an `<ol>` carrying it is ignored by assistive technology
and flagged by validators — the same position `Carousel` reached for `role="region"`. The `dir` prop drives the
flex direction and the arrow keys, and stops there.

**Not built:** the connector is a slot rather than something the library draws, and nothing enforces that a
linear flow is linear — a consumer who marks every step navigable gets free navigation, which is
`nonLinear` elsewhere and needs no prop here.

**The entry takes the list's direction, and the first build forgot to give it one.** Fixed afterwards.
`dir` was written onto the `<ol>` alone, but the `<li>` holds the step and the connector after it and was a
hard-coded row — so a column strip laid a 2px hairline to the right of the label instead of a track running
down the page. The `<li>` now carries the same `flex-direction`. Nothing else was wrong with the column
case, which is why it looked like a paint bug.

**A row strip wraps rather than overflowing.** Four steps with word-length names are
wider than a 370px column, and the strip had no answer: `stepperList` could not shrink (the painter's labels
are `nowrap`, the connector is a fixed-size slot the library does not own) and could not wrap, so it grew
past its container **in both directions** — the first entry sat at `offsetLeft: -45`. Of shrinking,
scrolling and wrapping: shrinking is not the library's to do, since it needs the painter to let its labels
truncate; scrolling hides steps behind a gesture with nothing saying they are there; wrapping needs nothing
from the painter and truncates no label. A consumer wanting either of the others has `overflow` on their own
container. The `<li>` is the wrap unit, so a connector never separates from its step — a wrapped line can
end on a connector, which is the cost. `maxWidth: 100%` on the list and `minWidth: 0` on the entry stop a
single over-wide step escaping either edge.

### `Stepper`: a layout and `renderBody` are refused together by the type

**A stepper given `computeLayout` will not type-check with `renderBody` as well.** The user's call, after the placed
stepper was found accepting a step body and then not drawing it: a body is a panel beside a straight connector, and a
curve has nowhere to put one. Each prop stays an ordinary documented prop, and the refusal is a separate type,
`StepperLayoutExcludesBody` — `{ computeLayout?: undefined } | { renderBody?: undefined }` — intersected into the props.
**That shape rather than a union carrying the two props themselves**, because the Playground's prop tables list rows
only from object types: a union of two object members printed as source text and the two props vanished from the
`Stepper` table, while a separate rule leaves both rows in place and shows the rule as one line beside them.

**Vue keeps only the warning**, since `renderBody` is a slot there and a slot cannot be refused by a type.
`StepperUtils.warnIfBodyIgnored` still runs in every framework, for a consumer writing plain JavaScript.
