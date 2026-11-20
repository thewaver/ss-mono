# Decisions: `Modal`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Modal` has to be named, and it seals the page behind it

Both came out of a survey against the mainstream libraries, and both are things `Modal` was doing by half.

**One of `ariaLabel` and `ariaLabelledBy` is required.** `dialog` and `alertdialog` are roles that require a
name, so a `Modal` with neither fails WCAG 4.1.2. `Breadcrumbs`, `Toolbar`, `Toasts`, `Sortable` and the
carousels already made their name required; `Modal` had left both props optional, and so had `Tree` and
`Table`, whose `ariaLabel` is now required outright. `Modal` is the one that needs a choice, because a dialog
that shows its own title should point at it rather than repeat it, so `ModalNameProps` is a union of two
`AccessorProps` blocks, each requiring one name and typing the other as `undefined`. `DrawerProps` composes the
same union in front of its `Omit`, because `Omit` over a union collapses it to the common shape and would have
let the name back out. The Playground's props-table plugin reads a property's first declaration for its written
type, which for a union member declared `undefined` would have shown `undefined`; it now takes the first
declaration that is not, which is the only change to the plugin.

**Everything beside the dialog is made `inert`, through `FocusManagerUtils.sealAround`.** `aria-modal` is a
promise that the page behind cannot be reached, and a reader that ignores it (VoiceOver has) could walk the page
regardless. `Spotlight`'s guide mode already walked from its layer to `<body>` marking every sibling inert;
that loop is now the shared function, with one correction to it: a live region is left alone, because the
`LiveAnnouncer`'s regions hang off `<body>` and an inert region announces nothing, which would have silenced
the very announcements the layer makes. A sibling already inert is skipped and not restored, so two layers
stacked undo only their own work.

**The document stops scrolling behind it, through `FocusManagerUtils.lockScroll`.** `overflow: hidden` on the
root, with the width the scrollbar took handed back as `padding-right` so nothing shifts. The root is the one
thing a wheel over the dialog can still reach: the Playground's own scroller is a sibling subtree of the
portal, not an ancestor, so it was never in the chain. A `Modal` opened over another finds the lock in place,
measures no scrollbar, and restores the outer one's `hidden` when it closes, so the outer lifts the lock.

### `Modal`: Escape can be refused, and refusing both routes is the consumer's responsibility

**`isDismissableOnEscape` defaults to on and is read where the dismiss layer handles `"escape"`.** The alert-dialog
pattern allows Escape, so the default stays. But a dialog that must be answered sometimes cannot let a stray key
count as an answer, and Radix, Mantine and MUI all let it be refused. The key is still consumed by the topmost
layer, so a refused Escape does not fall through to a layer below.

**Both flags off with nothing inside that closes the dialog is a keyboard trap**, and the library cannot see
whether the consumer painted a close control. The doc block says it plainly instead of the library guessing. The
alert-dialog demo switches both off and paints Delete and Cancel inside.
