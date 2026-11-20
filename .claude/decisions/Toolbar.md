# Decisions: `Toolbar`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Toolbar`, and why the overflow is the component

The toolbar was dropped once, on the reading that it is a flex row of buttons — which was right about the
toolbar and wrong about the problem. A real one has more actions than room, and what happens to the ones that
do not fit is behavior rather than paint. `backlog.md` records the reopening; this records what got built.

**Every action is rendered whether or not it fits, and the ones that do not are taken out of the flow.** They
keep `position: absolute` at the row's origin with `visibility: hidden`, `pointer-events: none`, `inert` and
`aria-hidden`, which leaves them measurable at their natural width while removing them from the layout, from
the pointer, from the tab order and from the accessibility tree. A `display: none` action has no width to
measure, so the cut could only ever be computed from what is already showing — which is the shape that
oscillates.

**The cut is two questions asked once each, in a fixed order, and never a loop.** First: does the whole row
fit with no overflow button at all? If it does, everything shows and there is no button. If it does not, the
button is now certain to exist, so its width comes off the budget and the remaining actions are filled in
greedily from the front. Iterating instead — add the button, re-measure, discover one more action now fits,
remove the button, discover it does not — is the failure this ordering exists to prevent, and a single pixel
of container resize is enough to start it. `toolbar.utils.test.ts` pins that going from a width where
everything fits, to one pixel less, and back, returns the first answer again.

**The greedy fill stops at the first action that does not fit rather than skipping to a narrower one.** A
skip would show the first, third and fourth actions and hide the second, which reorders the row from the
reader's point of view; a toolbar's row is a prefix of its list.

**`collapse` is per action, and `"never"` is reserved before anything else is fitted.** The default is
`"auto"`; `"never"` keeps an action in the row whatever it costs the ones around it — including when there is
no room for it at all, since an action that refuses to collapse and then collapses is worse than an
overflowing row; `"always"` keeps it out of the row however much room there is. Without this the most
important action in a narrow toolbar is the first to disappear, because importance and position are
unrelated.

**An action is described once and painted twice.** `renderAction` paints it as a button in the row and
`renderOverflowItem` paints it as a row in the menu, and both are driven by the same `ToolbarAction` record
with one `onActivate`. The overflow is a real `Menu` rather than a private popup, so the submenu machinery,
the dismissal stack and the highlight all come with it; the toolbar hands it the collapsed actions as
`MenuItem`s and forwards its own `onActivate`.

**The row is one tab stop, and an action that leaves the row leaves the walk with it.** The published toolbar
pattern is a single tab stop with the arrows moving along the row, focus landing on the first control that is
not disabled; wrapping and `Home` / `End` are optional and both are provided through
`NavigatorUtils.computeNextPosition`. What is unusual here is that the set of stops changes with the
container's width, so the roving index is derived from the cut rather than stored: the stops are the shown,
enabled actions plus the overflow button, and the overflow button is the last of them. An effect catches the
case where the action currently holding focus is collapsed by a resize and moves focus to the overflow
button, which is where that action has just gone.

**Disabled actions are skipped by the walk rather than kept in it.** The pattern allows either and notes that
keeping them focusable helps where discoverability of a function is crucial; the library's existing answer is
`Tabs`, which skips them, and there was no argument for the toolbar differing from its neighbor. A disabled
action that collapses is still handed to the menu as a disabled item, so it is discoverable there.

**The toolbar is invisible until it has measured, which is one or two frames.** Measuring after mounting means
the first paint would otherwise show every action at full width before the cut lands, and that flash only
shows up on a slow machine. `visibility: hidden` on the root until the root's width and every action's width
have arrived is the whole of it.

**The Playground's bar is resizable by dragging, and the drag writes back into the width field.** A demo
whose whole subject is what happens as the container changes width is not demonstrated by a number field
alone. The container carries CSS `resize: horizontal` and an `ElementObserver` on it feeds its measured width
back into the same signal the field drives, so there is one width rather than two that must agree, and the
field is also the way to put the demo back where it started.

**The button inside each action takes `buttonElement` from `Button.css`.** `InteractionWrapper`'s root sets
`pointer-events: none` and the control inside re-enables it — `Tabs` composes the same style for the same
reason. A control that forgets it renders correctly, measures correctly, and cannot be clicked.

### Controls: `Toolbar`'s `pressedValues`, and why a toggle group is a toolbar

**A toolbar holds actions that do something; with `pressedValues` its actions hold states that stay
pressed.** The reference libraries ship this as a separate toggle group (Radix, Kobalte, Ark, MUI's
ToggleButtonGroup, Mantine's Chip.Group): several independent pressed buttons behind one tab stop. Every part of
that already existed here. `Button` carries `isPressed` through the shared wrapper, `Navigator` walks the row, and
`Toolbar` owns the single tab stop and the overflow. So a toggle group is one optional two-way list on `Toolbar`
rather than a second component, on the user's call. Single choice is still `RadioGroup`'s Segmented variant; this
is the multiple-choice case that was missing.

**Present, every action is a toggle button; absent, nothing changes.** An action whose value is in the list
writes `aria-pressed="true"`. Every other action writes `"false"` rather than leaving the attribute off, because a
toolbar that mixed toggle buttons with plain buttons would announce the plain ones as something they are not.
Pressing an action adds its value to the list or takes it out, and `onActivate` still runs, so a consumer who only
wants to hear about presses keeps the callback it already had. The painter sees `isPressed` in its flags through
`InteractionWrapper`, as `Button`'s does.

**A collapsed action becomes a checkbox item in the overflow menu, checked from the same list.** The overflow
`Menu` is handed `pressedValues` as its `checked`, so an action pressed in the row is checked in the
menu and the other way round, and the state survives the collapse. The row and the menu toggle through one rule,
`MenuUtils.computeNextChecked`, rather than two copies of it.
