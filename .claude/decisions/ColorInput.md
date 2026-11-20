# Decisions: `ColorInput`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `ColorInput` owns its picker, so there is no system color dialog to fall back on

Deliberate: there is no native `<input type="color">` anywhere in it, so no system picker, which is the cost of owning
the surface — React Aria's color suite and Ark UI's are custom the same way, and none keeps the system dialog as a
fallback. Its form value is not part of this; it is submitted through a hidden input, see _"A control with no native
element submits through a hidden input"_.

### `ColorInput`, and a value the field cannot read

Settled by the user, after the field was found replacing a consumer's `"red"` with `#000000` on mount and
calling `onInput` to report the change it had just invented.

**A value the field cannot read is refused visibly**: nothing is written back, the error flag is raised, and
the consumer's text survives. That is an early form of `conventions.md`'s _"A field keeps the text it shows apart from the value it holds"_
applied to color — a control stating that it holds something it cannot show, rather than substituting a
different well-formed value that would survive a round trip.

**What counts as readable was widened rather than hand-written.** `colord` parses every CSS notation and the
named colors, which is a grammar and a 148-entry table nobody should write again, and it reports which notation
a string arrived in.

**The value is emitted in the notation it arrived in.** Hand in `hsl(...)` and `hsl(...)` comes back. This is
what makes the render-props sentence "in whatever notation the consumer handed in" true, where every other
route meant deleting it. The notation is remembered per field; hex is the fallback when a consumer starts
empty, and a named color is written back as hex because not every color has a name.

**`isUnreadable` is published on the render props** so a painter can show the refused text, and the error flag
is raised alongside it.
