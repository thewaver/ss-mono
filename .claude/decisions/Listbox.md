# Decisions: `Listbox`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Listbox` exported, and where focus sits is a setting the list's state is created with

Built from the survey's verdict: `Select`'s option list, standing on its own in the page with no field and no
popup, always open. `Listbox` and `MultiListbox` are presets over a `ListboxComposite`, in the `Select` /
`MultiSelect` shape and for the same reason: the value's type changes between them, so a mode flag cannot
reconcile the two.

**What `Select` and the standalone list share is split in two, and the split follows lifetime.** A `Select`'s
list is unmounted while its popup is closed, but its keyboard still works: an arrow opens it with the picked
option highlighted, and typeahead opens it on a match. So the state cannot live inside the drawn list.
`ListboxUtils.createCursor` holds that state: the highlight (a value resolved to an index, as before), the
reachable options, the typeahead buffer, and one keyboard handler. The `Select` composite creates it at its root,
where it outlives the popup. `ListboxOptions` is the drawn half: mounted and windowed rows, group boxes, the end
marker, and the row window and end observer, gated on an `isLive` prop instead of on the open state. `Select`'s
popup and the standalone list both draw through it. The keyboard handler is `Select`'s own, generalized with
`onOpen` / `onClose` / `getIsOpen`; the standalone list leaves those out, so it is always open and nothing closes
it. The one change in the walk is that the arrow keys are the ones for the list's orientation, with the page's
text direction applied, so a horizontal list in a right-to-left page walks leftward. `Select` stays vertical.

**The focus model is `focusModel: "active_descendant" | "roving"`, a required field of the cursor's defs, fixed
by whoever creates the cursor and never a prop.** A consumer cannot choose it, because the choice follows from
whether a field exists. Where one does, focus has to stay there, and the popup's `mousedown` refusal is what
keeps it there. Under `"roving"`, each option's `isTabbable` is true only for the highlighted one, so the list is
one tab stop; an option taking focus moves the highlight to it; and an effect keyed on the highlight moves focus
to the highlighted option, but only while focus is already inside the list, so a list at rest never pulls focus.
`getActiveOptionId` answers nothing under `"roving"`, and `isHighlighted` on an option is true only while
focus is inside the list, because otherwise a standalone list at rest would paint a highlight on the picked
option that nobody is on.

**A reachable disabled option in a standalone list also gets `isFocusableWhenDisabled`**, gated on the list
itself being enabled: the walk stops there, so focus must be able to land there. Under `Select`, focus never lands
on an option, so only `isReachableWhenDisabled` applies, as before.

**Windowing works only on a vertical list**, because `Virtualizer` measures heights, so a horizontal list mounts
every option whatever estimate it is given. A windowed standalone list must sit inside something that scrolls,
because the row window finds its scroll container by walking up from its sizer.

**The listbox element is the library's, and the consumer's surface goes around it rather than inside it.**
`Select`'s popup root has to carry the role, which is why a consumer div sits between that role and the options
there. The standalone list has no such constraint, so the container owns its option wrappers directly and a
consumer's border or scroll box wraps the whole `Listbox`. The popup listbox is named by `aria-labelledby`
pointing at the field, so it carries the field's name without a second prop.

**It reuses `Select`'s option vocabulary.** `SelectOption`, `SelectItem`, `SelectOptionFlags`, `SelectGroupFlags`
and `SelectUtils` are the list's data types, imported from `Select`. Renaming them after the list that now owns
them is a separate question, unasked. `SelectOptionItemProps` moved with the option leaf and is now
`ListboxOptionItemProps`.

### `Listbox`, `Tooltip` and `Stepper` Docs pages

The three pages the Essentials sorting first missed. **Listbox**: Basic is the countries list with Disabled; groups are
shown with MultiListbox; the old sizes row became "Horizontal, right to left" with an Orientation knob over
`LISTBOX_ORIENTATIONS`, kept off Basic because six countries across overflow the demo column; "Markers that glide"
passes `renderSelectionFloater` and `renderHighlightFloater` together or leaves both out, painted by the ordinary option
painter, so `PageGlideLabel` went. **Tooltip**: Basic carries the old panel's knobs that set real props, less Skip
window, which one tooltip cannot show (as on HoverCard); the word example carries a WCAG 2.1.1 alert for its
`tabindex`; the arrow bed's knobs are keyed `circling…` and `arrowBed…`, and its labels wrap within the anchor box's
width (the user tuned its sizes so the bed fits its column). **Stepper**: Basic has Orientation over
`STEPPER_ORIENTATIONS` and Free navigation; every example holds its own current step and has its own Free navigation
knob, since a linear strip cannot move forward once stepped back; a failed step is a section, since a step's state is
the consumer's word, not a prop; the arc stays physical in right-to-left text, as the fan and the wheel do; Reset
went; step ids are built from the example and the step (`basicDetails`). **The arc sits in a frame of fixed
width (`ARC_WIDTH`), as Radio's and Toolbar's arcs do** — the user's call. An arc is drawn to its own proportions
and then scaled to fill its box's width, so in a frame as wide as the column, every setting that narrows the drawing
(a smaller item width, a sideways sliver of curve) made the whole Stepper taller and its steps wider.
