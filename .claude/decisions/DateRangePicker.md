# Decisions: `DateRangePicker`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Splits, and telling an outside clear from the echo of an inside one

Settled by the user, closing two faults that were one question.

**A split holds two halves and writes the pair outward only when both are filled**, so clearing one half
legitimately sends `undefined` outward — and a moment later that same `undefined` arrives back, where it is
indistinguishable from a consumer's Clear button or a form reset.

`DateTimeValue`'s split guarded against the echo by ignoring every incoming `undefined`, which swallowed real
clears. `DateRangePicker` hand-wrote the same split without the guard and got the opposite failure: clear the
end date and the start field kept its text with nothing behind it, and retyping the end never brought the range
back.

**The rule is "ignore my own echo": the split remembers what it last wrote, and clears both halves only when
the incoming `undefined` is not that value.** One implementation, in
`SignalMirrorUtils.createSplit`, beside `createOptional`, `createPassThrough` and `createValueMirror` — the same
family, one signal in and signals out, and nothing in it is date-specific. It takes `compose`, `decompose` and
an equality test, because a range's halves are the same type and get ordered where a date-and-time pair's are
not.

**Why one helper rather than two guards:** the divergence is how the `DateRangePicker` fault happened, and
`conventions.md` names a date-time **range** as the composition coming next, which would have been the third
hand-written split. `DateTimeValueUtils.createSplit` stays as the named entry point and is now a thin wrapper.

**One case it cannot see, and it is a property of signals rather than of the rule.** A consumer clearing a value
that is _already_ `undefined` — because a half was cleared a moment earlier — writes nothing new, so no effect
runs and the held half stays held. Only a clear that actually changes the outer value arrives. Recorded on the
helper and pinned by a test, so nobody re-derives it as a bug.

### `DateRangePicker` and `DateTimePicker` under one caption: a group named by it, each field keeping its own label

**Inside a `FormField` or `Label`, the picker's root is a `role="group"` named by the caption, and the two fields
keep `startLabel` and `endLabel` (`dateLabel` and `timeLabel`)** — the user's call. A field drops its own
`ariaLabel` whenever a caption exists, which is right for one control and wrong for two: a screen reader announced
both fields as the caption, and the console warned twice about labels the consumer never wrote as `ariaLabel`. The
shape is WCAG technique [ARIA17](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA17): _"Any label associated with
the group also serves as a common label or qualifier for individual controls in the group."_

**How:** around its two fields, the picker provides a `FormField` context that passes everything through but the
caption id, and a `Label` context whose `getIsLabeled` answers `false`, so hints, error messages and "focus the
first field in error" still reach the fields while the caption no longer names each one. Inside a `Label` whose
caption registered no id, the group has no name.

**Turned down:** the field's own label beating the caption, as `Range` does for its thumbs, which loses the caption;
and the caption followed by the field's label on each field, which says the caption twice. Whether `Range` should
follow was not asked.
