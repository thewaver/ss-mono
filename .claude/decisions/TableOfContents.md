# Decisions: `TableOfContents`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `TableOfContents`, where the article is the consumer's

Built at the user's request, reversing the earlier call that left a table of contents as an abstract
(`ElementObserverUtils.createViewportCurrentIndexObserver`) with the links as consumer markup. The trigger was
that its demo had to be parked on the Scroller page, whose last example was then not a scroller. The condition
the user set was the house's usual abstraction: like `Stepper`, the list is drawn however the consumer likes.

**The component renders the link list and nothing else.** A `<nav>` holding an `<ol>`, one `<li>` per link,
each link an `InteractionWrapper` over an unexported `TableOfContentsItem` leaf. Unlike `Stepper`'s
`renderBody`, the sections are not drawn by the component: a table of contents usually sits in a sidebar far
from its article, often in another column or another component, so a slot inside the `<nav>` would put the
article inside the landmark and decide the page's layout on the consumer's behalf — the same argument as
_"A component hands out a controller and renders no controls of its own"_.

**Each link record carries its target element, rather than the component taking a separate list of elements.**
`TableOfContentsLink<T> = { value, target, href?, depth?, id? }`, where `target: HTMLElement | undefined` is
required and is `undefined` until the consumer's heading mounts. Two alternatives were weighed. A second prop
holding an array of elements was the shape `createViewportCurrentIndexObserver` itself takes, and it is the
parallel-arrays fault `Tabs` was rebuilt to remove (_"Parallel arrays became one array of records"_): two
sources indexed against each other that nothing keeps aligned. Finding the element from `href` by id was the
other, and it needs a document query the component cannot make reactive and a fragment the link may not have.
The field keeps what the component needs next to the thing it belongs to, and the consumer owns the keying,
as it does for the list observer. A consumer collects refs into a signal and maps them into the records, which
is what the Playground example does.

**The library owns three things**: the `<nav>` landmark and its name, `aria-current` on the link whose section
is being read, and "pressing a link scrolls its target into view and moves focus to it". Current-section
tracking is the existing observer, not a reimplementation, and its `offsetRatio` passes through as a prop whose
default in `TABLE_OF_CONTENTS_DEFAULTS` is `CURRENT_INDEX_OBSERVER_DEFAULTS.offsetRatio`, so the user's tuned
number still has one home.

**The name is required, as a union where exactly one of `ariaLabel` and `ariaLabelledBy` is given** —
`Modal`'s `ModalNameProps` shape, under _"A role that requires a name makes the prop that names it
required"_. A table of contents always shares a page with the site's own navigation, so it is always the
`navigation` with a sibling that ARIA says needs a name.

**`aria-current="location"`, not `page` and not `true`.** ARIA's tokens: `page` "represents the current page
within a set of pages" — the link to the document you are on, which is `Breadcrumbs`' and `Paginator`'s case and
not this one, since every link here points into the same page. `location` "represents the current location
within an environment or context", which is the reader's place within the article. `true` "represents the
current item within a set" and is what any unrecognized token degrades to; it was what the parked demo used,
and it is the least specific answer available where a specific one fits. The spec that moved with the demo
expected `true` and now expects `location`.

**A link with an `href` is a real anchor; without one it is a button that does the same thing** — `Tab<T>`'s
terms, as `Tree` and `Breadcrumbs` follow them. An anchor keeps middle-click, open-in-new-tab and copy-link,
none of which a click handler can give. The click is intercepted only when the target exists: then the default
is canceled, the target is scrolled to the top of the box it scrolls in (honoring a consumer's `scroll-margin-top`;
see _"The line is drawn inside the box the targets scroll in"_ below) and focused with `preventScroll`. With no target yet the anchor follows its fragment as any link would. There is no
`linkComponent`, which `Tabs` takes because an `<a>` reloads a routed application: a fragment link does not, and
the click is canceled before a router sees it.

**The component makes the target focusable itself, and only where the consumer said nothing.** Moving focus is
the half of "pressing a link" a keyboard or screen reader user depends on — without it the next Tab carries on
through the table of contents rather than into the section — and a heading cannot take focus unless it carries
`tabindex`. Argued from ownership: the element is the consumer's, but the promise is the component's, and a
promise that silently fails when the consumer forgets an attribute is the fault _"A component generates the id
a relationship attribute needs"_ closes for ids. So the same rule: `tabindex="-1"` is written only onto a target
that has no `tabindex` of its own and is not focusable already, and removed again when the target leaves the
list. A consumer who set a value keeps it; `-1` means focusable without joining the tab order, so nothing the
consumer tabs through changes.

**The current section is reported, not held.** `onCurrentChange(value | undefined)` fires only when the value
changes (_"Asking for a state a thing is already in does nothing"_ counts notifying as work), and not at mount.
It is not a two-way `current`: the scroll position owns it, and a consumer writing a value the page is not
scrolled to would contradict the observer on the next scroll event. A consumer wanting to move the reader
scrolls the target element, which they already hold, and the mark follows.

**The painter is `renderLink(getLink, getFlags, getPlacement)`, `Tabs`' shape.** The record comes first as its
own accessor, then `InteractionFlags<TableOfContentsFlags>` — which holds `isCurrent` and nothing else, so it is
`*Flags` — then the placement. The depth is read off the record. The first build put the record, index, depth and
placement inside one `*RenderProps` object, following `SegmentedInput`'s cells; the user chose the neighbors' shape
instead, so every list-of-records control reads the same (_"One aggregated object per painter"_ now says where
a record goes). The painter's text is the link's accessible name, so there is no `computeLinkAriaLabel`.

**A depth is paint, and the list stays flat.** It is handed to the painter so it can indent, and the markup is
one `<ol>` whatever the depths, so a sub-section is reached by the same Tab and announced as one more item. A
nested list would say more about the outline's structure; it waits until something asks for it.

**It takes `computeLayout` and `computeEffect` like `Stepper`**, with the same placed-`li`-as-layer arrangement,
and an `orientation` that defaults to `vertical` and drives the flex direction only. There are no arrow keys:
every link is its own tab stop, as `Breadcrumbs` and `Paginator` record for independent destinations.

**What WCAG said.** 2.4.1 Bypass Blocks: "A mechanism is available to bypass blocks of content that are repeated
on multiple web pages" — the named `navigation` landmark is one such mechanism for the links themselves, and
the in-page links are another for the article; the component supplies the landmark and cannot supply its name,
hence the required prop. 2.4.3 Focus Order: "focusable components receive focus in an order that preserves
meaning and operability" — this is what moving focus to the target is for; a scroll alone would leave the
sequential order at the link. 2.4.7 Focus Visible: "Any keyboard operable user interface has a mode of
operation where the keyboard focus indicator is visible" — the links are wrapped controls whose painter
receives `isFocusVisible`, and the focused target is the consumer's element and its ring the consumer's style.
4.1.2 Name, Role, Value: "the name and role can be programmatically determined; states … can be programmatically
set; and notification of changes to these items is available" — real anchors or buttons give the role, the
painter's text the name, and `aria-current` is the state, updated in place as the reader scrolls. 1.3.1 Info and
Relationships: "Information, structure, and relationships conveyed through presentation can be programmatically
determined" — the highlighted link is presentation, and `aria-current` is what makes it determinable; the
indentation a depth draws is not exposed, which is the cost of the flat list above. 2.4.4 Link Purpose (In
Context) was checked too: the purpose comes from the link's text, which is the consumer's heading text.

**Two rules sit on top of the line, both the user's call once the Docs table of contents showed the gap.** With the line a
fifth of the way down, a page whose last sections are short runs out of scroll before their headings reach it: on
the Breadcrumbs Docs page, pressing `Breadcrumb<T>` scrolled correctly and marked `BreadcrumbsStyles`.

**At the end of the scroll, the line drops to the bottom of what is on screen.** `observeCurrentIndex` finds the box
the elements scroll in — `VirtualizerUtils.findScrollParent` from the last element, or the document's own scroller —
and once `computeIsScrolledToEnd` says it can go no further, the last element whose top is on screen is current. A
box that has not been scrolled at all never counts as at its end, so a page that fits on screen keeps the plain
rule rather than marking its last section on load. This lives in the shared observer, so every framework has it.
Padding the bottom of the page instead was rejected: it puts most of a screen of blank space under every article,
and every consumer would have to know to add it.

**The line is drawn inside the box the targets scroll in, not across the window.** The user's call, made when the
Playground's two tall examples were to be replaced by one in a 320-high scrolling box. With the line at a share of the
window's height, an article scrolling in a panel of its own was followed only by coincidence: a panel below the line
never marked past its first section, and one straddling it marked at a point that moved as the page scrolled. So
`observeCurrentIndex` takes the box it already found for the end rule, keeps the part of it inside the viewport, and
puts the line `offsetRatio` of the way down that. When the targets scroll with the document the box is the window and
nothing changed. The Playground's Docs pages scroll in a panel whose top is the window's top, so nothing moved there. A
consequence worth knowing: a first heading sitting at the very top of its box is above the line at once, so it is
marked before any scroll — which is right, since it is what the reader is looking at.

**Pressing a link scrolls only that box.** `scrollIntoView` scrolls every scrolling ancestor, so the page jumped
until the box's top met the window's. Its `container: "nearest"` option is the clean answer and is Chromium-only
(caniuse lists no Firefox or Safari support), so `TableOfContentsUtils.goToTarget` works out the `scrollTop` itself
when the box is not the document's scroller: the distance between the two on-screen tops, divided back out of any
scaled ancestor by the box's on-screen height over its laid-out one, less the target's `scroll-margin-top` and the
box's `scroll-padding-top`, which is what `scrollIntoView` honors. `scrollTo` with no `behavior` keeps the box's own
`scroll-behavior`. When the box is the document, `scrollIntoView` is used unchanged. The cost: a table of contents
whose box is scrolled out of sight scrolls inside it without bringing it on screen — a table of contents sits beside
its article, so the case was judged not worth a second scroll.

**A pressed link holds the mark until the reader does something of their own.** The end rule alone still marks the
wrong link when the second-to-last one is pressed, since both headings are then on screen and the last wins. So
the press pins its index, and `TableOfContentsUtils.observeNextReaderInput` releases it on the first wheel, touch,
key or pointer press anywhere, listened for in the capture phase. Pressing another link releases the pin on its
`pointerdown` or `keydown` and pins anew on its `click`. Releasing on any later scroll was considered and dropped,
because the press's own scroll cannot be told apart from a later one once a consumer's `scroll-behavior: smooth`
animates it. The cost is that a scroll from script alone keeps the pin, which is why the spec that scrolls back to
the top now does it with the wheel. A scrollbar drag counts only where the browser reports a `pointerdown` for it.

**Not built:** updating the address bar's fragment as the reader scrolls or presses a link, a nested list for
the outline, and a `linkComponent`.
