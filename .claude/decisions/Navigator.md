# Decisions: `Navigator`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Navigator` is told the direction, and one observer tells everyone

**A horizontal walk flips under right-to-left**, so `NavigatorUtils.computeNextPosition` takes `direction` beside
`orientation`: under `"rtl"` ArrowLeft steps forward and ArrowRight steps back, and the vertical arrows, Home and
End do not change. A control that handles its own horizontal keys reads them through
`NavigatorUtils.computeLogicalKey` and keeps its left-to-right logic as written: `Menu`'s submenu keys,
`SplitPane`'s grow and shrink keys, `Tree`'s expand and collapse keys. `Drawer`'s edges stay physical, on the
user's call.

**The direction comes from `NavigatorUtils.createDirectionSignal(getRef)`**, which reads
`getComputedStyle(ref).direction` once the owner has mounted and again whenever any `dir` attribute in the
document changes. It reads after mount rather than when the ref arrives, because Solid hands a ref over before the
element is in the document, and a detached element has no computed direction. Every reader on the page shares one
`MutationObserver` on `document.documentElement` (`attributeFilter: ["dir"]`, `subtree: true`), counted up and
down like `Menu`'s pointer reader. A stylesheet that flips `direction` with no `dir` attribute changing is picked
up at the next such change, not at once; that is the accepted cost of watching an attribute rather than polling
style.

**Which element, and which layouts.** A component whose popup is portalled reads the element that stays in place:
`Menu` its anchor or trigger, `ContextMenu` its region, because the popup has left the right-to-left box and would
always answer left-to-right. Only a layout in the flow of text is told the direction: `Tabs` and `Toolbar` pass it
when there is no `computeLayout`, and `Menu` flips its submenu keys only when it is not laid out, since a placed
layout positions its items with physical `left` and `top` and its arrows stay physical too.

**The grid walk flips like the list walk.** `computeNextCell` takes `direction` beside `pageRows`: under `"rtl"`
ArrowRight moves to the previous column and ArrowLeft to the next, still carrying between rows, so in a `Calendar`
or `RangeCalendar` ArrowRight is yesterday, which is where yesterday is drawn in a week that runs from the right.
Rows, the page keys, Home and End do not change. `RadioGroup`, `Sortable`, `Clock` and `Table` pass the direction to
their walkers, and a control that can be placed by a layout (`RadioGroup`, `Sortable`) passes it only when there is
none, as `Tabs` does. `Sortable`'s keyboard carry reads its arrows through `computeLogicalKey` before deciding
forward or back, so choosing a place follows the walk; `Table`'s Ctrl-arrow resize and Shift-arrow column move and
`TagInput`'s hop between its field and its tags read the logical key too.

**A pointer in a right-to-left row measures from the right edge.** `SplitPane`'s drag and click-to-step, `Table`'s
resize drag and click-to-step, and `Range`'s choice of which thumb a press brings forward all count from the start
edge, which under `"rtl"` is the right one, so a drag moves the boundary with the finger.
`CarrierUtils.computeDropIndex` takes an optional `direction` for the same reason: without it a drop into a
right-to-left `Sortable` row or `Table` header landed at the start almost every time. `Sortable`'s insertion marker
sits between the left edge of the item before and the right edge of the item after, and `Table`'s drop markers and
resize handle sit on logical edges (`insetInlineStart`, `insetInlineEnd`), so they move with the columns.

**The default submenu side follows the direction; a side the consumer gave does not.** `MENU_DEFAULTS.submenuPlacement`
holds one placement per direction, `right_out` under `ltr` and `left_out` under `rtl`, and `Menu` and `ContextMenu`
read it with the direction they already hold for their keys, so a submenu opens on the side the opening arrow points
to. It is still one entry keyed by the prop's name, as the defaults rule asks; only its value is keyed a second time,
and a consumer reading the constant gets the pair. A consumer's `submenuPlacement` is used as given in either
direction, because a consumer who named a side meant that side.

**The submenu arrows follow the side, not the text.** The user's call, once a right-to-left menu told to open its
submenus on the right was seen opening them with ArrowLeft: the arrow that opens a submenu is the one pointing at it.
`MenuUtils.computeLevelKeyStep` reads the arrows through the level's own `submenuPlacement`, so `right_out` reads
them as left-to-right and `left_out` as right-to-left whatever the text, and any other placement — overlapping the
item, or centered on it — has no side to point at and leaves them to the direction. With the default placement this
is exactly the old behavior, since the default side is the direction's. The one case it leaves wrong is a named side
with no room, where the anchor flips the popup and the arrow then points at the empty side; the requested side is
what decides, because the flip is the anchor's and happens after the keys are bound.

**A menu hangs from the edge the text starts from.** The user's call, the same rule one level up, taken for
`ContextMenu` first and then for `Menu`: `MENU_DEFAULTS.placement` holds `left_in` under `ltr` and `right_in` under
`rtl`, both hanging below, and both read it with the direction they already hold. So in a right-to-left box a
triggered menu lines up with its trigger's right edge, and a context menu's right edge sits at the pointer so it opens
leftward, the side its submenus open on. A consumer's `placement` is used as given. A laid-out menu reads the same
default, since where its popup hangs from the trigger is a matter of the text around it rather than of the layout
inside it.

**What stays physical.** Anything placed at fixed coordinates: `SortableGrid`, `TileBoard`, `PatchBoard`, `Bracket`
and `Timeline` position their items with `left`, so the first column is on the left whatever the text direction, and
their arrows keep pointing where the items are. `CardStack`'s arrows throw a card toward a screen side and report
that side to `onSend`, and `Drawer`'s edges stay physical on the user's call.

**Every behavior above has a Playground demo and a case in `e2e/rightToLeft.spec.ts`.** Each is an existing example
in a `dir="rtl"` box, keyed `rightToLeft` on its page, on the pages of `Tabs`, `Calendar`, `RangeCalendar`,
`SplitPane`, `RadioGroup`, `Menu`, `Sortable`, `Tree`, `Clock`, `TagInput`, `Range` and `Table`; the menu page adds
`contextRightToLeft` for `ContextMenu` and `rightToLeftPlaced` for a consumer-given submenu side, and the tabs page
adds `switchedDirection`, whose box flips from its own settings so a live `dir` change is reachable. The `Table` demo
is both resizable and reorderable, so one table carries the resize drag, the click-to-step, the Shift-arrow move and
the drop marker. **`rightToLeftPlaced` keeps its trigger at the far edge of its card** (`MenuPage.css`'s
`endAlignedBox`): a right-to-left box puts the trigger at the card's right, near the window's edge, where a
right-hand submenu has no room and the anchor flips it to the left, which would show the opposite of what the demo is
for.

**`Tree` alone asks the walker not to wrap.** The tree pattern, React Aria and Ark stop at the ends: ArrowDown on
the last visible node and ArrowUp on the first do nothing. `computeNextPosition` takes `isLooping: false`, named
after the carousels' prop since it is the same idea, and at an end returns the position it was given rather than
`undefined`, so the tree still claims the key and the page does not scroll. Home and End still reach the ends. The
user's call, made with the Playground's own left navigation in mind, where wrapping had been handy.

### `NavigatorUtils.computeNextCell`: the two-axis walk never wraps and never clamps

Settled, beside the 1D walk rather than replacing it, and deliberately different at the edges.

`computeNextPosition` wraps within its length, because a tab list or menu is a closed ring.
`computeNextCell` does neither: overflow along a row **carries** into the neighboring row, and `y` is
allowed out of range. That lets a caller whose grid is a window onto something larger resolve the overflow by
moving the window — `Calendar` reads `y === -1` as "the previous month" and needs no special case for the
first or last day. `x` is always in range, because carrying is what puts it there.

**Page keys mean a page of rows, and a caller for whom they mean something else turns them off.** A month is
not six weeks, so `Calendar` passes `hasPageKeys: false` and does month arithmetic itself. `hasEdgeKeys`
works as before, and `Home` / `End` are the ends of the **row**, not of the grid.
