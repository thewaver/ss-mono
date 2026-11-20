# Decisions: `FileInput`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `FileInput` and `ColorInput`, where the UA owns the activation

Both are the `TextInput` arrangement (overlay geometry, wrapper, flags, private
leaf), and both exist because of one thing the library cannot take over.

**Activation must stay native, so gating a disabled control is `preventDefault` on `click`.** Only a user
gesture on the real element opens a file dialog or the OS color picker, so there is no JS path to gate and
no `readonly` to lean on. `preventDefault` cancels the default action — `BinarySwitch`'s mechanism rather
than `Button`'s early return, which would have left both dialogs opening. `wrapElement`'s `mousedown`
refusal still keeps a disabled control from taking focus.

**Suppressing the UA's own rendering is the rule that kept `placeholder` and the number spinner out**, and
each needed a different mechanism:

- **A file input** hides `::file-selector-button` and sets `color: transparent` for the filename. It stays
  transparent-but-present rather than `opacity: 0`, because opacity paints the outline too.
- **A color input** needs `visibility: hidden` on `::-webkit-color-swatch`; a transparent background is
  **not** enough, since the UA paints the current color onto the swatch through a path an author
  `background` does not reach, covering the painter with a solid rectangle. Visible on screen and invisible
  to every DOM assertion — the shape of what markup checks cannot catch. `visibility` takes the swatch out
  of paint and leaves the input's outline alone.

**Both give the painter the value, and `TextInput` deliberately does not.** `FileInputFlags = { files }`,
`ColorInputFlags = { value }`: once the native rendering is suppressed nothing else draws them. The other
side of one rule — withhold what the element already draws, hand over what it does not.

**`syncElement` returns for a third time**, on `BinarySwitch`'s premise:

- **`ColorInput`** assigns `value` when it differs, so a snapping owner ("nearest of four") sees its
  correction reach the element instead of the picker's raw color.
- **`FileInput`** writes its value back so the element holds exactly what the owner holds; see the next entry,
  which also reverses the drag-and-drop scoping this entry first recorded.

### `FileInput`: a limit on what the control holds is the control's

**A limit on what the control can hold is the control's; a judgment about what the value means is the
consumer's.** Stated by the user. So a file refused as it lands, for count, size or type, is not validation, the
way a mask refusing a character is not. The precedent is the native `accept`, which narrows what the control
takes before a value exists. _"The form story: the library wires, the consumer validates"_ is untouched by this:
nothing here looks at a value the control already holds, and whether the files that were kept are the right ones
is still the consumer's question, answered through `hasError`.

**Three limits, checked in one order, reported in one call.** `accept`, `maxSizeBytes` and `maxFiles` are read
for every file that arrives, from the picker or from a drop, in arrival order: type first, then size, then count,
and a file is refused for the first it fails. Only files that passed type and size take up room, so the ones
refused for count are those that arrived after the control was full, and the earliest are kept. Accepted files
go into the value; the refused ones go to `onReject` together, each with its reason. An arrival with nothing
accepted leaves the value as it was and still reports. The reason is `"count" | "size" | "type"`, a value rather
than a sentence, because the words a reader is told are the consumer's (_"The library says what a component is,
and nothing else a reader hears"_). The checks live in `FileInputUtils.admitFiles`, and the type check re-runs
`accept` itself: the dialog can be switched to show every file, and a drop is never filtered by the browser.

**`maxFiles` on a single control is documented as meaningless rather than typed away.** A control without
`isMultiple` holds one file whatever `maxFiles` says. A union that forbids the pair needs `isMultiple` to be a
literal, and an accessor cannot be one, so the type would refuse legitimate reactive call sites.

**The drop area reverses the earlier scoping.** It was left out because a drop target seemed to belong to
whatever surface accepts the drop, and because it adds a second way in. The second way in is now the point, and
the surface is the control's own box: `FileInputUtils.trackDrop` listens on the wrapper's root, takes only
drags carrying files, counts `dragenter` against `dragleave` so crossing the painter's children does not
flicker, and publishes `isDragOver` in the render props so the painter draws the target. A disabled control
still cancels the drag, so the browser neither opens the file nor lets the native input take it, and it shows a
refused cursor and never reports `isDragOver`.

**The picker press is the single-pointer route, and the consumer may not hide it.** A drop is a drag, so WCAG
2.5.7 needs a single press that reaches the same result, and the press on the control already is one. The doc
block on `isDragOver` says a consumer may not cover the control or paint it as a place to drop alone.

**`syncElement` now writes any value, not only the empty one.** A `FileList` can be built through
`new DataTransfer()` and assigned to `element.files`, which is what the e2e helper `pickFiles` already does
(Chrome 59, Firefox 62, Safari 14.1, per MDN's compatibility data). It had to be, once refusal existed: a partly
refused pick would otherwise leave the refused files in the element, where a native submit sends them, and a
dropped file would never reach the element at all. The empty case is still `element.value = ""`, and it is still
what lets the same file be picked again after an owner writes `[]` back, since re-picking the same file fires no
`change` event.
