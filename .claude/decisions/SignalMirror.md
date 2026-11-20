# Decisions: `SignalMirror`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `SignalMirror`, and the form wiring finished

Settled, closing two unblocked items in one pass.

**Every control here owns its value as a two-way signal, and a consumer holding a getter plus a callback had to
build the same mirror by hand.** `PageTextField`, `PageSelectField`, `PageCheckField`, `PageNumberField` and
`PageColorField` were five copies, and the color picker's hue slider made a sixth.
`SignalMirrorUtils.createMirror(getOuter, setOuter, opts)` is that mirror once, with `createValueMirror` for the
common case where nothing converts.

**It takes a getter and a setter rather than a `Signal`**, the escape hatch `backlog.md` named as the
alternative to a signal-only surface. A consumer with a signal passes its two halves; one with a store field,
route param or callback passes those. The first attempt took a `Signal` and could not express any of the
Playground's own wrappers.

**Every control now takes that pair directly, so the mirror is no longer the way in.** A two-way prop is
typed `SignalSource<T>` and `accessSignal` normalizes it — see _"Signal tuples for two-way state"_ in
`conventions.md`, which carries the rule and the reasoning. `createOptional` and `createPassThrough` are both
`accessSignal` underneath. What `SignalMirror` still owns, and what the Playground's `PageNumberField` still
uses it for, is the case a pass-through cannot serve: an **inner** value that survives the outer refusing a
write, which is what lets a field hold `7.` or a half-typed date while the number behind it has not changed.
`PageTextField`, `PageCheckField`, `PageColorField` and both select fields dropped their mirrors and pass the
two halves.

**Each direction reads the far side `untrack`ed**, which is the whole reason this is worth extracting: the two
color-picker bugs were both a mirror whose guard tracked the other side.

**It converts only when the value changes, so a half-written inner value survives.** Typing `7.0` into a
field mirroring a number leaves the text alone, because the number did not change — the rule the hex and date
fields needed, now free for anything built on it.

**It is not unit tested, deliberately.** A mirror is two effects and a scheduler, not a function of its
arguments. Its four consumers are driven in `e2e/`, where its behavior is observable.

**The form wiring is complete.** `Select`, `ColorInput`, `FileInput` and `Range` now read the description
context alongside `TextField` and `BinarySwitch`, so every control that can sit in a `FormField` points at its
message without the consumer wiring anything.
