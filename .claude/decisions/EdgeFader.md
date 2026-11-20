# Decisions: `EdgeFader`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `EdgeFader`: a mask on the content, fixed or following the scroll

A wrapper whose chosen sides fade to nothing. The consumer picks any mix of `top`, `right`, `bottom` and `left`,
one `size` in pixels for how far in the fade reaches, and whether it follows the scroll.

**A mask, not a gradient laid over the top.** An overlay has to be painted in the color of whatever is behind
the box, which the component cannot know and the consumer would have to keep in step by hand; a mask fades the
content itself to transparent, so any background shows through unasked. Each axis is one `linear-gradient`
layer, and two axes are combined with `mask-composite: intersect` — the default adds layers together, and the
union of a vertical strip and a horizontal one fades nothing at all.

**The scrollbars are kept out of the mask.** A mask covers everything the box paints, its own scrollbars
included, so a plain fade ate the ends of each bar — both bars at once when the box scrolls both ways. The fix
is the documented one ([Pqina](https://pqina.nl/blog/fade-out-overflow-using-css-mask-image/)): the fade layers
are sized to the box minus the scrollbar strips, and a solid layer is added over each strip. The strips are
measured as `offsetWidth - clientWidth` and `offsetHeight - clientHeight`, so a box with no scrollbar gets
zero-sized strips and nothing changes. The layer order is what makes the arithmetic right: the two fades
intersect with each other first, and the strips are then added on top, so neither strip is cut by the other
axis's fade.

**Both modes, the user's call, and fixed is the default.** Fixed works on anything, scrolling or not. Scroll-aware
sets each side's fade to the lesser of `size` and the distance left to scroll that way, so a fade shrinks to
nothing as its end arrives rather than switching off, and a box whose contents fit shows no fade anywhere. That
last case is the answer to "what does scroll-aware do when nothing scrolls", which was the open question when
the user chose to have both.

**The wrapper is the scroll box.** It is `overflow: auto` with `max-width` and `max-height` at `100%`, so it takes
its size from a parent that has one and hugs its content otherwise. The consequence: scroll-aware watches its
own scroll only, so wrapping something that scrolls inside itself — a `Scroller`, whose track is the scrolling
element — finds nothing to follow and draws no fade. Fixed mode still works around such a thing.

**The scroll is measured in script, the way `Scroller` measures its track**: a scroll listener, a resize
observer on the box and its children, and a mutation observer to pick up children arriving later. CSS scroll-driven
animations can produce the same fade with no script; that route was not taken, and its browser support was not
looked into when this was built.

**A box that scrolls with nothing focusable inside becomes a tab stop.** "Nothing focusable" is whatever
`FocusManagerUtils.getFirstFocusableChild` cannot find, and a mutation observer over the whole subtree, filtered to
the attributes that change focusability, keeps the answer current. The user left this call to Claude's judgement.

**`ariaLabel` is optional, and names the box only while it scrolls.** Making it required, as _"A role that requires
a name makes the prop that names it required"_ would suggest, would have charged every non-scrolling use for a role
it never takes; the role is applied only when the name exists, so the convention is not broken.

**The fade drops while the box has keyboard focus.** The mask clips everything outside the box, which is exactly
where an outline is drawn, and would fade an inset one at the edges anyway — WCAG 2.4.7. So `:focus-visible`
sets `mask-image: none !important`, which outranks the inline mask. The person operating the box sees all of it
for as long as they are.

**Sides are physical**, as `Drawer`'s edges are — the user's call "for now", taken again once the text fields went
logical and the first reason given (nothing else in the library was right-to-left aware) stopped holding. So its
Docs page has no right-to-left example, by decision rather than oversight.

### `EdgeFader`'s Docs page: one example per feature, a knob per side

The four examples the page already had became the Docs page, one per section, and the shared panel and the
Examples page went, as on Accordion and Carousel. **Basic** is the scrolling column, top and bottom faded, with the
size knob. **Any mix of sides** is the grid with one checkbox knob per side, since `edges` is a real prop and there
is no multi-pick field; the knobs write the list in `EDGE_FADER_DEFAULTS.edges`' order. **Fading only what is out
of view** is the strip with the scroll-aware knob, starting on. **Around something that does not scroll** is the
card, fixed, no knob.
The intro no longer describes the two modes, which the sections do; it says what only it says — that the box is
the scroll container, becomes a tab stop named by `ariaLabel`, and drops its fade under keyboard focus.
