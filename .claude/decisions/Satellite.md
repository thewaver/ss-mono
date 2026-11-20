# Decisions: `Satellite`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Satellite`: two elements, and a box that covers both

**The problem it solves is layout, not positioning.** A badge on a corner is easy to place with
`position: absolute`; what is hard is that the pair then measures as the subject alone, so the badge either
gets clipped by an ancestor or overlaps whatever sits beside it. `Satellite` grows its own box until both
elements are inside it, which is the whole reason it exists and the thing `satellite.spec.ts` pins.

**The placement vocabulary is `Anchor`'s, and this is where the in-variants pay.** The original took
`left | center | right` and derived the offset from half-widths, which can only express "outside that edge".
`AnchorPlacement` already had five values per axis, so a satellite can sit flush **inside** a corner —
the ordinary case for a badge on a card — and `AnchorUtils.getHPlacementShift` computes the position for both
families. The union arithmetic left over is nine lines in `SatelliteUtils.computeLayout`, with unit tests
against hand-computed numbers per placement.

**The wrapper grows by padding, and the subject stays in flow.** The first build absolutely positioned both
elements and wrote a measured pixel width and height onto the root, which is what the React original did. It
means the root has no size of its own until two `ResizeObserver` callbacks have run, so the first painted frame
is a 0×0 box with the subject spilling out of it, and a subject that wanted to size itself from the parent
could not. Padding inverts it: the root's box is the subject's box plus the overhang on each side, an
absolutely positioned satellite is placed against the **padding box** so its offset needs no correction, and
before anything is measured the padding is zero and the layout is simply the subject. Nothing flashes.

**The wrapper shrinks to its subject, because otherwise it measures a box nobody drew.** The padding
scheme only works if the number fed to `computeLayout` as the subject's size is the subject's size. What is
observed is not the child the consumer passed but the `satelliteSubject` div wrapped around it, and that div
is an ordinary block: it takes the full width of whatever contains it. A 140px subject inside a 260px parent
therefore measured 232px wide, and `right_out` put the satellite 92px past the subject's right edge, floating
in space. `satelliteRoot` carries `width: fit-content`, so the root shrinks to the subject's own width, the
wrapper reports that width, and the placement lands on the corner. The horizontal case is the only one that
was ever wrong — a block already shrinks to its content vertically, which is why the growth up and down looked
correct all along.

The subject still fills the root: `satelliteSubject` has no width of its own, so it takes the whole content
box, and the root's width is the subject's intrinsic width plus the overhang. What the root will not do is
stretch to a parent wider than the pair, which is the premise rather than a cost — the component exists to
hand the parent a box that is exactly the pair, and a box that grows to fill cannot also be a measurement of
what is inside it. Where a satellite needs to sit somewhere the placement vocabulary does not name, the
offset reaches it. Confirmed by the user as working as designed.

**The offset is a nudge in screen space, and that differs from `Anchor` on purpose.** For a floating layer the
offset means a **gap**, so `AnchorUtils.getHPlacementOffset` signs it by the placement and discards it entirely
on a centered axis. A consumer placing a badge is aligning it rather than clearing a gutter, and "nudge it two
to the right" must not become "two to the left" because the placement flipped, nor be silently dropped because
the axis is centered. So `computeLayout` adds the offset raw. Stated because the two components share the
placement type and disagree here.

**The wrapper is always drawn, satellites or not** — the user's call, reversing an earlier "no satellite, no
wrapper". Drawing the subject bare when the list was empty meant two branches, and in Solid each branch builds its own
copy of the children: a button whose badge appeared on press was destroyed and rebuilt inside the new wrapper,
dropping focus, hover, an open tooltip and typed text, and again when the last badge went. The cost taken is a box
around every subject, with no padding while the list is empty. Moving one copy of the subject between the two shapes
and putting focus back was the other option, and cannot be done in React or Vue.

### `Satellite`: one list of satellites, and one padding for all of them

**Satellites come as one list, `satellites`, and each side's padding is the furthest overhang any satellite has there.** Every satellite is positioned against the subject first, then all of them are shifted by the same padding, so they land in one padded box. A satellite that needed no room still moves with the others. An empty or absent list keeps the wrapper with no padding.

**Each entry's fields take a value or an accessor, so a list can stay constant while its satellites move.** Rebuilding the list re-renders every satellite in it. A consumer who only changes a placement changes that field and leaves the list alone.

**Stacking is fixed in three layers, inside a wrapper that isolates them.** Behind satellites are 0, the subject is 1, and front satellites are 2. The root carries `isolation: isolate`, so none of those numbers takes part in the page's own stacking. With one satellite the subject could get away with switching between 0 and 1, but with several, some may be in front and some behind at once.

### `Satellite`: a badge is an example, not a component

**A count badge is a satellite pinned inside a corner and pushed back out by the same distance on both axes, with the sign set by the corner.** The inside placement pins the badge's outer edges to the subject's corner, so a longer number widens it toward the middle and the overhang never changes. That is the owner's reason for having no `Badge` component: the whole behavior is one placement and one offset. The Playground's `badge` example shows it.
