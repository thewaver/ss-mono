# Decisions: `Button`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Button` can be named, and the label wins over the painter

Settled, closing the gap `Calendar`'s paging buttons exposed: a painter drawing only a glyph
left the button announcing "black left-pointing triangle".

**`ariaLabel` joins `InteractionControlProps`**, so it is the wrapper's to hand every leaf rather than each
leaf's to invent, and `ButtonProps` picks it up through the same pass-through `id` and `renderContent` use.
Only `Button` applies it so far; a leaf with its own naming story keeps it (`BinarySwitch` reads the `Label`
context, `TextField` names its input).

**It goes through `LabelUtils.resolveAriaLabel`, so the `Label` rule is inherited rather than restated.**
Inside a `Label` the prop is suppressed and warned about.

**Against painter text, the label wins, and that is the platform's rule rather than a choice.** An
`aria-label` overrides descendant text as the accessible name. There is no way to detect that a painter drew
words, so this cannot be warned about; the requirement that a painter mark decorative glyphs `aria-hidden` is
the other half. The Playground briefly used a visually-hidden span instead, which worked and is gone: it made
every icon button carry a clip-rect idiom the consumer had to know.

### `Button` reports the pointer, and `NumberInput` repeats while held

Settled, on the user's call.

**`ButtonCbs` gained `onPointerDown` and `onPointerUp`**, both gated on disabled like every other callback
there. `pointercancel` is routed to `onPointerUp` as well: a drag that leaves the button, a touch the browser
takes over for scrolling, or a context menu all cancel rather than release, and a control that started
repeating on down must stop in every case or it never stops. Pointer events rather than mouse ones because they
cover touch and pen without a second pair.

**The repeat itself is the library's, not the painter's.** `NumberInputStepper` grew `startSteppingUp`,
`startSteppingDown` and `stopStepping`; the painter calls them from the pointer events and owns no timer. A
painter running its own interval would be four lines of behavior duplicated in every consumer's stepper, and
behavior is the shell's — the argument that put the auto-dismiss clock inside `Toasts`.

**Both timings are props with defaults, because they are tuned values.** `getRepeatDelayMs` at 400 and
`getRepeatIntervalMs` at 60 match a native spin button, and they are exposed rather than baked because a
consumer with a slow store or a coarse step wants different numbers.

**A repeat ends at the first step that cannot move.** Reported by the user as Reset not sticking: a field stepped
down to its minimum, then reset to 5, walked itself back down to 1. The painter's stepper button disables itself
at the bound it reaches, and a disabled `Button` refuses the pointer release and the mouse leaving, so
`stopStepping` was never called and the repeat ran on unseen, refused at every tick, until something moved the value
off the bound and gave it room again. Making a disabled button pass the release on was the other way out, and
was not taken: it changes what every disabled button does for the sake of one pairing. The repeater is the thing
that should not outlive its usefulness, and a refused step is the moment it has none.

**A tap still steps exactly once.** `startStepping` steps immediately and only then arms the delay, so the
first step is not deferred and releasing before the delay leaves that single step behind. Both halves are
pinned in `numberInput.spec.ts`, since a repeat that starts too eagerly is indistinguishable from a working one
until someone taps.

**The painter also stops on `mouseleave`.** Pointer capture is not used here, so dragging off the button would
otherwise keep repeating with nothing under the cursor. That is the painter's call rather than the library's,
and the one part of the arrangement the shell does not enforce.

### Controls: `Button`, and a press that waits for its answer

**`onClick` is the one callback in the library that may answer with a promise, and `Button` waits for it.** Every
other callback typed `void | Promise<void>` was narrowed to `void`, because nothing awaited them and the type
promised handling the component did not do. The button is the exception because it is the one control whose
second press, while the first is still running, is a real fault: a form submitted twice, a payment sent twice. So
when `onClick` returns a promise, the button holds `isPending` until it settles, hands that state to the painter
through `ButtonFlags` the way `isPressed` and `isDisabled` arrive, writes `aria-busy="true"`, and refuses further
presses.

**It does not go `aria-disabled` while pending.** Disabled means "this cannot be used"; pending means "this is
doing what you asked". A pending button keeps its focus and its tab stop, so a keyboard user is not thrown out of
the place they pressed, and a reader hears "busy" rather than "unavailable". A rejection is not caught: the
pending state clears and the error reaches the page as it would without the button in between.

**The cost is a type that is not plain `void`.** A command that answers `boolean`, such as a stepper's
`stepToNext`, cannot be passed straight to `onClick`, because TypeScript only discards a return value when the
target type is exactly `void`. The call site wraps it in `void (...)`.

### Controls: `Button` refuses activation while pending, without going disabled

**A pending button stays silent the way a disabled one does, and still writes no `aria-disabled`.** `onClick`, the
pointer callbacks and the wrapper's `onActivation` are all refused; `onActivation` is wrapped inside `Button` rather
than gated in `InteractionWrapper`, because being pending is `Button`'s own state and the wrapper knows nothing of
it. Pointer enter and leave stay live, because hovering is not pressing. The wrapper still reports `isActive` and
`isHovered`, so a painter that ignores `isPending` can still draw a press; reading the flag is the painter's job.

**A refused click calls `preventDefault`.** Returning early stopped `onClick` but not the browser's default action,
so an `aria-disabled` `type="submit"` button still submitted its form, where a native `disabled` one never does,
and a pending one would have submitted twice. Canceling the click also cancels the implicit submission that Enter
in a text field dispatches through the form's submit button.
