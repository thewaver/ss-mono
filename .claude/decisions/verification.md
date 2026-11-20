# Decisions: verification

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### What the verification suite cannot see

A green `verify:dom` reads as broader coverage than it is, so the shape of its blind spots is kept here.

- **Appearance.** Nothing checks how anything looks, by the user's decision — the accepted limit on screenshot
  baselines in `backlog.md`. So the `aria-disabled` parity rule (disabled and disabled-but-reachable look identical)
  and the two motion components, `CellAnimation` and `ScanlineAnimation`, are checked by eye and only by eye.
- **A callback the page never consumes.** A suite that drives the page sees only what the page shows, so reaching a
  callback or an `onMount` handoff means giving the page a reason to consume it first — a readout, through
  `ExampleDefs.readout`, as `ImageSwitcher`'s `onLoad` got, with the spec asserting both that a load is reported and
  that the swaps without one report nothing. A component that renders nothing is reached by recording calls on a
  prototype before the app runs: `audioSwitcher.spec.ts` records `play` and `pause`, the trick
  `noAnimationFrames.spec.ts` uses on `requestAnimationFrame`.
- **Covered only through a consumer**, which decides whether a spec of its own is worth writing: `Popover` through
  `Select` and `Menu`, `Radio` through `radioGroup.spec.ts`, `Checkbox` through `binarySwitch.spec.ts`, `MultiSelect`
  through `select.spec.ts`, `CornerHighlight` and `Viewport` through whatever page mounts them, `InteractionWrapper`
  through every control.
- **A page that stops painting.** `noAnimationFrames.spec.ts` replaces `requestAnimationFrame` with a function that
  never calls back, before any application code runs; a frozen clock cannot express this, since Playwright fakes
  frames as a 16ms timer and advancing time to reach a fallback fires the frame first. It shows that
  `ElementFader`'s timer fallback is real (a `Modal` reaches its visible target with no frames) and that the
  positioner needs no frame to open a layer or follow a scroll. It does not show whether the per-frame poll has
  another job: the poll is the only thing watching an anchor that moves with no event to announce it.
- **Other browsers.** `verify:dom` runs desktop Chrome only, in every project. Safari's engine is reached by
  `verify:dom:webkit` (`playwright.webkit.config.ts`), which runs only when asked, against the Solid Playground
  alone, so a spec that follows the framework switch to another Playground fails there for want of a server, not a
  fault. It needs Playwright's WebKit build installed (`npx playwright install webkit`), which the user approved.
  Firefox is not run at all: Playwright's Firefox build shows "Profile Missing" on the user's Mac and does not start.
  What the WebKit run needs from the specs:
    - **Tab is `tabKey(page)`, never `"Tab"`.** WebKit's Tab, like Safari's as it ships, stops only at text fields and
      elements given a `tabindex`; buttons, links and radios take Option+Tab, which is what the helper presses there.
    - **A spec driving the DevTools Protocol skips outside Chromium** (`drawerTouch.spec.ts`, the composition test in
      `textInput.spec.ts`), since WebKit has no such channel.
    - **Playwright's WebKit goes back in history on a Backspace nobody claimed**, which Safari no longer does; a spec
      pressing Backspace on something that rightly ignores it refuses the history step itself (`tagInput.spec.ts`).
    - **Every run draws the Playground at one deliberate scale other than 1** — the user's call, for Chrome and WebKit
      alike. The viewport setting is pinned to "auto" (`PINNED_SETTINGS` in `playwright.config.ts`), which scales by
      the window's height over the screen's, and both configs report the same screen (`SCREEN_SIZE`), so the scale is
      chosen there rather than taken from a device profile. Chrome's profile reports a screen equal to the window, which
      draws at 1 and hides every measurement not divided by the scale; Safari's reports a shorter one, which is how the
      first WebKit run found the windowed list's clipped row and `Table`'s end pin (`backlog.md`). Scale 1 everywhere
      was considered and dropped, since bugs had been caught only under scaling before.
    - **A spec simulating keyboard focus with Shift and `focus()` is Chromium's heuristic**: WebKit carries whether the
      previous focus was keyboard focus over to a scripted one, as the `:focus-visible` specification allows. Arrive
      by `tabKey` instead.
      `.claude/perfCompare.md` describes driving the installed Firefox and Safari through a same-origin probe page
      instead, for the backlog items waiting on other browsers.
- **Two pages with no spec, by the user's call.** `/svg-filters` and `/corner-highlight` stay without one, since what
  matters there is what they draw. The date and time fields' own pages are driven by `datePicker.spec.ts` (typing,
  refusing, clearing), not by specs named after them; the clock's by `clock.spec.ts`, and the form field's by
  `formField.spec.ts`.
- **Time.** Playwright's clock (`install`, `pauseAt`, `fastForward`, `runFor`) fakes `Date`, the timers,
  `requestAnimationFrame`, `requestIdleCallback`, `performance` and `Event.timeStamp`; `install` freezes time until
  it is advanced, so a duration becomes a stepped quantity. `toasts.spec.ts` uses it in one describe block, the
  pattern for anything of that shape. It does not reach motion driven by CSS, nor the absence of frames, which needs
  the stub above — the two look interchangeable and are not.

### Development warnings are checked by unit tests, not by specs

**The specs run against a production build of each Playground, and a production build prints no warnings**, since
every library warning sits behind `process.env.NODE_ENV !== "production"` (R5). So a spec never waits on the console
for a warning; the warning's condition and wording are asserted where they live, in the core's unit tests, by spying
on `console.warn`. The user's pick, over building the specs' Playgrounds in development mode (which would stop the
specs testing a production build) and over a second, development-mode project for the warning cases (a second build
of every Playground on each run). **What it gives up:** nothing checks end to end that each framework names its own
prop in the warning text.
