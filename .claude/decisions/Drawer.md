# Decisions: `Drawer`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Drawer` as a `Modal` preset, and why `AlertDialog` is not one

Settled for `Drawer`, the `Toggle`-over-`Checkbox` shape. `AlertDialog` shipped the same day
on the same reasoning and was **deleted **.

**Placement is geometry, not paint** — a correction to the note that asked for these. The slide is paint (a
painter transitions its own `transform` off `getVisibilityTarget`). Placement is not: the box carrying
`role="dialog"` is `Modal`'s, and only its position within `modalRoot` decides where the dialog is. Making it
paint would mean stretching the container over the viewport and letting the painter position itself inside,
which hands the dialog role a viewport-sized box and breaks the margin-derived `max-width` / `max-height`.

**`modalRoot` became a grid so both axes can say `stretch`.** A flex row has no main-axis equivalent of
`justify-items: stretch`, so a top-edge drawer could stick to the top or fill the width but not both.
`modalContainer` is `display: flex; flex-direction: column` with `flex-grow: 1` on its child so the painter
fills whichever axis the grid stretched. The absolutely positioned overlay is unaffected.

**That grid states its single track as `100%`, and without it a dialog taller than the screen escaped the
screen.** An implicit grid track is auto-sized, so a container holding more than fits grew the track with it;
the container's own `max-height: calc(100% - margins)` then resolved against that grown track and capped
nothing, and the dialog ran off the bottom with the overflow unreachable — no scrollbar, because nothing had
been asked to scroll. Stating `grid-template-rows: 100%` and `grid-template-columns: 100%` pins the area to
the root, the `max-height` and `max-width` become real limits again, and a painter with `overflow: auto`
scrolls inside them. Found when every drawer on the Playground page was given more content than fits.

**`ModalAlignment`, not `ModalPlacement`** — `AnchorPlacement` already names `{ x, y }` collision placement,
and one prop meaning a string union on one component and a record on another is the two-contracts-one-name
trap.

**`Drawer` narrows to four edges and adds nothing else**: `DrawerEdge` drops `"center"`, and `getEdge` is
required where `getAlignment` was optional. An edge-attached dialog that could be centered is not a drawer.

**`AlertDialog` was a preset that earned nothing.** It set `role="alertdialog"`, required
`getInitialFocusRef` and turned overlay-click dismissal off — three props already public on `Modal`, and no
behavior of its own. The line: `Drawer` narrows a vocabulary so a wrong state is unexpressible;
`AlertDialog` only pre-filled values. A component whose whole body is three defaults is a comment with a
build step. This does not overturn the `Toggle`-over-`Checkbox` rule — `Toggle` both removes surface and adds
semantics a consumer cannot reach (the `switch` role, the mixed-state role swap).

Its reasoning now belongs to whoever sets those three props: an alert interrupts to demand a decision, so
focus must land on the control that answers it and the initial focus target is not optional; and a dialog
demanding an answer must not be answerable by clicking next to it. `Escape` still closes it, because every
dialog must be escapable regardless of role. `ModalPage` carries it as a second variant, which is the honest
demonstration — it shows the three props rather than hiding them.

**`FocusManagerUtils.autoFocus` reads the initial ref untracked, and "initial" is why.** The effect already depends
on the container ref and visibility; a third dependency that can change while the dialog is open would
re-run it, re-capture `previouslyFocused` as whatever is focused _now_, and restore focus to the wrong
element on close. A ref assigned during render is set before effects run, so the common path is unaffected.

**`getIsDismissableOnOverlayClick` and `getAriaDescribedBy` are public on `Modal`** — a form with unsaved
changes wants the first, any dialog can want the second.

### `Drawer`: why swipe-to-close follows `isDismissableOnOverlayClick`

**The swipe stays tied to the backdrop tap.** It looks like one flag governing two unrelated gestures, and Mantine
and Vaul do keep them apart, but here the pairing is required. A swipe is a dragging movement, and WCAG 2.5.7 needs
a single-pointer way to do what it does. The backdrop tap is the only such way the library can promise; a close
button inside the panel is the consumer's to paint and may not exist. So a drawer that cannot be tapped away cannot
be swiped away either, and the flag's doc block says so. The user's call, made when a survey listed the coupling as
an accident; the other direction, a tap-only drawer with the swipe off, breaks nothing under 2.5.7 and waits for
somebody to need it.
