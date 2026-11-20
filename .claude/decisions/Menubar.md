# Decisions: `Menubar`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Menubar`, a preset over `Toolbar`, and the open-follows-focus rule

**`Menubar` is `Toolbar` with its role fixed to `menubar`, in the `SelectComposite` arrangement.**
`ToolbarComposite` takes `role: "toolbar" | "menubar"`. `Toolbar` and `Menubar` each fix it and omit it, the way
`Checkbox` omits `type`, which is the shape the user chose so that layout, Formation's animation, the measured
collapse, the walk and right-to-left are written once. Under `toolbar` the children are buttons. Under `menubar`
each child is a `Menu` whose trigger is a `menuitem`, and `Menu` already writes `aria-haspopup="menu"` and
`aria-expanded` on it. The overflow trigger becomes a `menuitem` too, because every child of a menubar has to be
one. The base sits in `Essentials/Toolbar` rather than `Primitives/`, beside `SelectComposite`'s precedent.

**`role` is a plain literal rather than an accessor, and the props type is a union keyed on it.** The role
decides the type of `actions` (a word carries the `items` of its menu) and of `renderAction` (a word's painter is
told `isOpen`). A setting that can change at runtime cannot decide a type. So the composite's props are the
shared half together with one of two role halves, and each preset is the shared half plus its own half with
`role` omitted.

**A collapsed word becomes a submenu of the overflow menu, which `Menu` already supported.** The overflow item
carries the word's `items`. One `renderItem`, one `renderPopup` and one `checked` serve every menu the bar
opens, the overflow menu included, so a View checkbox keeps its state whether View is in the row or in the
overflow.

**The one rule `Menubar` adds: while a menu is open, the arrow that moves to the next or previous word closes
that menu and opens the next one.** Which menu is open is one value in the composite, the stop that is open, and
each `Menu` reads and writes it through its own `visibility`. That makes one-open-at-a-time a property of
the state rather than something each menu has to arrange, with one side effect: a menu whose word drops out of
the row while it is open closes. The switch happens in a fixed order: the old menu closes, which returns focus to
its own word; focus moves to the next word; only then does the next menu open, so its popup records the new word
as where focus came from and Escape leaves focus there. The switch is taken only for left and right arrows that
the open menu did not use itself: a key that opens or closes a submenu arrives already claimed and is left alone,
as are Home, End and the vertical arrows, which belong to the menu. Moving the pointer from one open menu to
another word does not switch menus; desktop menubars do that, and it was not asked for.

**A key pressed inside a popup reaches the bar's handler, and the handler has to know that.** Solid passes
delegated events through a portal back to where the portal was declared, so a key pressed inside any menu's popup
reaches the toolbar root after the menu has handled it. The handler ignores keys that are already claimed, and
keys from outside its own row, apart from the menubar's two arrows while a menu is open. Before this, ArrowRight,
Home and End inside the plain toolbar's overflow menu also moved focus out to the row, a defect fixed on sight.

**A menubar's triggers are `menuitem`s through `Menu`'s `triggerRole`.** `Menu`'s `role` prop comes from
`InteractionWrapper` and lands on the wrapper div, not on the button that takes focus. So the role a trigger
announces is its own prop, `triggerRole: "button" | "menuitem"`, defaulting to `button` and written on the trigger
button itself, beside the `aria-haspopup="menu"`, `aria-expanded` and `aria-controls` that `Menu` already writes.
`ToolbarComposite` passes `menuitem` for every word and, under the `menubar` role only, for the overflow trigger,
because every child of a menubar has to be one. `FanMenu` and `WheelMenu` take the prop from `MenuProps` and
default to `button`; `ContextMenu` has no trigger button, so it does not apply.
