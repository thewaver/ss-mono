# Decisions: `CheckboxGroup`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `CheckboxGroup`, and `Checkbox`'s `value` opt-in

`CheckboxGroup` is `RadioGroup`'s context shape with the walk taken out, on the user's call. It holds one list,
`value: SignalSource<T[]>`, optional with a list of its own starting empty, and renders `role="group"` named
by a required `ariaLabel`. There is no roving tab stop: each member is a separate choice rather than one spelling
of a single value, so each is its own tab stop and Space toggles it, which is the one thing that separates this
group from the radio one.

**A `Checkbox` opts in by being given a `value`.** `value` is generic, so it is declared beside the
`AccessorProps` block. Inside a group, a box with a value is ticked when the list holds it, and pressing it adds
or removes it. Outside a group, or without a value, the box answers to `checked` as before. `checked`
became optional with a private fallback, so a group member does not need a dummy signal; `BinarySwitchPresetProps`
was not changed, so `Toggle` keeps its required signal.

**The select-all box is the consumer's, and the group hands it a controller through `onMount`.**
`CheckboxGroupController` carries `getCheckedState()`, folded with `CheckedStateUtils.fromMembers`, and
`setIsEveryChecked(isChecked)`, which answers whether anything changed. A render slot was rejected by _"A component
hands out a controller and renders no controls of its own"_: the parent box is a control, and a slot would fix
where it sits. The consumer passes `[() => state === true, setIsEveryChecked]` as the parent's `checked` and
`state === "mixed"` as its `isMixed`.

**Disabled members are left out of the count while any member is enabled, and select-all leaves them as they
are.** Counting a disabled unticked member would leave the parent mixed forever, because pressing it could never
tick that member.
