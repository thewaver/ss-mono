# Decisions: `Breadcrumbs`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Breadcrumbs`, and why the last crumb is not a control

A trail of links to where you are. The standing position was that it was a `Tabs`
composition; what earns it a file is markup the consumer cannot get from `Tabs` at all.

**A trail is a landmark around an ordered list**: `<nav aria-label>` holding an `<ol>` holding one `<li>` per
crumb. The landmark lets someone jump straight to the trail; the list makes "four of these, in this order"
true for a screen reader. `Tabs` renders `role="tablist"`, which says these swap a region, so the
composition was never right, only convenient.

**The last crumb is the page you are on, so it is a `<span>` with `aria-current="page"`.** Not a disabled
link, which would stay in the tab order and look pressable; not a button that does nothing. Which crumb is
current is positional, so the component decides it and hands the answer to the painter through
`BreadcrumbsFlags.isCurrent`.

**`isCurrent` is an extra flag rather than something the page recomputes.** `Tabs` lets its page derive
`isSelected` because selection is the consumer's state. Here it is not: only the component knows the crumb
count, so a page deriving "last one" would re-derive something known one level up and get it wrong the moment
a trail is trimmed.

**The item is a `<button>` without an `href` and an anchor with one**, with a `linkComponent` escape for a
router's link — the three-way shape `Tabs` and `Paginator` use, reusing `TabLinkProps`.

**Separators are the consumer's paint, live outside the item, and are `aria-hidden`** — otherwise a trail
reads as "Home slash Library slash Inputs". The slot is optional and renders no wrapper when absent.

**There is no keyboard handling at all, and that is correct.** Crumbs are independent destinations, so each
is its own tab stop, as `Paginator` records for its page numbers. A roving order would make the trail one
stop, which is what a `tablist` wants and a `nav` does not.

**Trimming the trail is the consumer's.** Raised by the user: pressing `B` in `A > B > C > D`
ought to leave `A > B`. The behavior is right and so is the component — `onSelect` reports the press and
nothing else, since the component does not own the route and a trail that trimmed itself would fight a
router-driven consumer. The demo was wrong: it reported into a readout and left the trail at four. The page
now derives the trail from the pressed crumb's index, and the panel's `Reset` is the way back.

**Not built:** collapsing a long trail behind an overflow menu. It needs a decision about where the hidden
crumbs go, and nothing has asked.
