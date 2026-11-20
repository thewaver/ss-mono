# Decisions: `Popover`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Popover` extracted, and `Menu` as the second consumer

The standing "private until a second consumer" rule fired: `Select`'s floating layer
became `Essentials/Popover/`.

**This does not reverse _"What stays duplicated is the dozen lines of `<Show><Portal><div>`"_ — it is the
same argument reaching the opposite answer on different inputs.** That entry refused to share markup between
a tooltip and a listbox because they agree on nothing. A listbox and a menu are both _interactive_ floating
layers and agree on every line. `Tooltip` keeps its own dozen lines and stays out.

**`Popover` owns everything true of a floating layer and nothing about what it contains:** the portal mount,
`createPortalPosition`, the `ElementFader`, `inert` while the fade closes, the `mousedown` refusal,
`tabindex="-1"`, and the anchor-width floor. Content arrives as
`renderContent(getVisibilityTarget, getTransitionDurationMs, getPlacement)` — `Tooltip`'s signature.

**The role is the consumer's, so the ARIA that role requires is the consumer's too.** `getRole` plus one
`getAriaAttributes: Accessor<JSX.AriaAttributes>` rather than a prop per role-specific attribute.
`aria-multiselectable` is a listbox word and `aria-labelledby`-to-the-trigger is a menu word; a `Popover`
learning either would grow a branch per consumer. It sits on the same element as the role because it has to
— the options are descendants, so the role cannot be nested one level in.

**The anchor-width floor is opt-in, because the argument for it was a listbox argument.** A menu hanging off
an icon button has no such relationship and should size to its content. `Select` passes
`getHasAnchorMinWidth`, `Menu` does not.

**The fader stays inside and reports out through `onTransitionStatusChange`**, the shape `Modal` uses. A
component cannot return values, and `Select` needs the settled flag to know when it may clear the query.

**`outline: none` on the root is deliberate and is not a color decision.** The root is focusable only to
host `aria-activedescendant`; the visible focus is the highlighted item, painted by the consumer. A ring
around the whole surface would point at the wrong thing.

**It is written twice so a consumer cannot reverse it by accident**, added later. A bare `outline`
on the class ties with a consumer's blanket `:focus-visible` rule on specificity, so the winner is whichever
stylesheet was emitted last — the Playground's was, which is how every popup grew a ring nobody asked for.
The rule is repeated under `&:focus, &:focus-visible`, which outranks a plain pseudo-class rather than racing
it. What it gives up: a `Select` whose filter emptied the list has nothing painted as focused and is
announced empty; a consumer wanting a ring there paints it on their own surface.

**The initial focus is `Popover`'s, and a real bug is why.** `Menu` first called `FocusManagerUtils.autoFocus`
itself and focus stayed on the trigger: the root carries `visibility: hidden` until `Anchor` has produced a
position, and a `visibility: hidden` element silently refuses `focus()`. Being positioned is `Popover`'s own
state, so `getHasAutoFocus` moved the call inside, gated on `getPosition() !== undefined`. **The gate is a
memo of the boolean, not of the position**: the position object is rebuilt on every anchor observation, so
depending on it directly would re-focus the surface on every scroll.

**`Menu` moves focus to the menu, not to the items, and that is where `aria-activedescendant` is allowed to
live.** ARIA supports the attribute on composite roles — `menu` is one, `button` is not — so the APG variant
with a single focus target puts both on the `role="menu"` element. The items are then `Select`'s options
exactly: non-focusable `role="menuitem"` divs at `getIsTabbable={() => false}`, `isFocused` never true, and
a highlight held as a value resolved to an index. `FocusManagerUtils.autoFocus` restores focus to the trigger on
close through the same `onCleanup` `Modal` relies on.

**Two keydown handlers rather than `Select`'s one**, because the two states have different focus owners: the
trigger handles the closed menu (`Enter` / `Space` / `ArrowDown` open on the first item, `ArrowUp` on the
last), the menu handles the open one. They cannot both be focused, so neither tests whether the menu is open.

**Clicking the trigger while the menu is open would otherwise reopen it.** The `mousedown` moves focus to
the trigger, the menu blurs, blur closes, and the click's own toggle then opens it again. The guard is
`relatedTarget === trigger` in the blur handler: focus going to the trigger is not a dismissal, and the
click that follows does the closing. Every other blur still closes with no document-level listener.

**`MenuFlags` is `{ isOpen }` and nothing else.** A menu carries no value, so no `isEmpty`, no
`aria-selected`, no `isSelected` equivalent, and the callback is `onActivate` rather than `onPick`.

**Dismissal was not extracted as an `Abstract`, against the plan that scheduled this work.** `Menu`'s
dismissal turned out to be `Select`'s exactly — `Escape` in a keydown, close on the focused element's blur,
no document listener — while `Modal`'s is a different mechanism (document keydown, overlay click, focus trap,
explicit restore). Two identical siblings and one that does not fit is not the shape that wants an
`Abstract`; the thing genuinely shared with `Modal` was `FocusManagerUtils.autoFocus`, which existed.

### Dismissal is one stack, and `Popover` is the layer

Settled, replacing five stories: `Select` closed on its field's blur, `Menu` on its popup's
blur, `DatePicker` and `ColorInput` each ran their own document-wide press listener, and `Modal` its own
document `keydown`.

**`Dismisser` is a module-level array of open layers with one set of document listeners**, in the
`LiveAnnouncer` position — it belongs to no component and there is one of it. Not owned by `Viewport`: a
consumer with no `Viewport` still needs dismissal, the events are the document's rather than any element's,
and nesting a `Viewport` inside a `Viewport` would need cross-authority ordering a single array does not have.

**A press or a focus move is positional; `Escape` is a stack operation.** Every layer the target sits outside
of hears about a press or a focus move, which closes a whole menu tree at once and is what
`getIsWithinOwnedLayer` keeps from closing a parent when the press was inside a child. `Escape` goes to the
innermost layer and stops — the bug this fixed: every control handled `Escape` locally and let the key travel
on, so a popup dismissed inside a `Modal` took the `Modal` with it. `modal.spec.ts` drives it over a `Select`
inside the modal on `ModalPage`.

**The reason reaches the consumer, because the right response differs by reason.** `DatePicker` and
`ColorInput` return focus to their field on `Escape` and do not on a press, since moving focus to a field
someone just clicked away from is wrong. A submenu closes only its own level whatever the reason; `Tab` still
closes the whole menu, from the menu's own key handler, before focus moves.

**`Popover` registers the layer, so its four consumers get dismissal by existing.** Roots are the popup
element and the anchor. The controls kept `onDismiss` shaped as their own close paths and lost their
listeners, their `onBlur` plumbing and `Menu`'s `computeIsInsideMenu` walk.

**Window blur no longer closes anything.** `focusout` with no `relatedTarget` is ignored, so switching apps
leaves a popup open where `Select`'s old field blur would have closed it. That matches Radix, and it is why a
focus move alone is not enough — the press listener covers a click on dead space.
