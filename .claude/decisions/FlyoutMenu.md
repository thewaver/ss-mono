# Decisions: `FlyoutMenu`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `FlyoutMenu`: a site's navigation bar, after the W3C's fly-out menu tutorial

**It follows the W3C's [Fly-out Menus](https://www.w3.org/WAI/tutorials/menus/flyout/) tutorial, the user's call
after weighing it against the APG's disclosure examples, which leave hover out.** Every entry is a link to its own
page; an entry with pages under it gets a small toggle button after its link ("button as toggle", the tutorial's
second approach). Hovering the entry opens its panel; the toggle opens and closes it from the keyboard or a touch,
and a press puts focus on the panel's first link; tabbing along the bar never opens anything, because a keyboard
user would otherwise have to step through every panel to reach the next entry — so the hover engine is given no
focus delay, which is how it opens nothing on focus. Escape closes the panel and puts focus back on the toggle when
focus was inside it; focus leaving closes it, unless the pointer is still over the entry or the panel.

**It is its own component rather than a mode of `HoverCard`, `Toolbar` or `Menu`.** The user started from a shared
`HoverCard` and a `SharedHoverCard` wrapper, and dropped it once the pattern was settled: a hover card opens on
keyboard focus, writes nothing onto its anchor and is announced as a dialog, and the flyout needs the opposite of all
three. `Toolbar` is one tab stop walked with the arrows and its overflow is a `Menu`; `Menu` and `Menubar` are
application menus. Site navigation is a list of links where every link is its own tab stop — the APG says so of its
own example — so a prop on any of them would have been a different component under their name. **What they share is
underneath**: the hover engine, positioning, the fader, the dismisser, and `HoverCardUtils`' Tab bridging across the
portal (Shift+Tab from the panel's first link to the toggle, Tab past its last to whatever follows the toggle).

**The name is the tutorial's.** `NavigationMenu` (Radix's name) and `NavBar` were set aside because the user calls the
Playground's own left tree "LeftNav", and a component shortening to "nav" would make every conversation about
either ambiguous. `HoverMenu` named the one way in that keyboard and touch users never use.

**One panel serves the whole bar and glides between entries.** One value says which entry is open
(`FlyoutMenuUtils.computeNextOpenIndex`), so hovering the next entry moves the panel there rather than closing one and
opening another, and the skip window keeps it up across the move. The panel's position eases on an anchor change while
it is showing, as `Tooltip`'s does; nothing else that moves it is eased. **The panel's size follows, smoothly, through the consumer.**
The visible box is the consumer's surface, drawn by `renderPanel`, so the library cannot resize it itself. It draws the
links at their natural width, measures them, and hands the size to `renderPanel`; the consumer gives the box around the
links that width and height with a transition and `overflow: hidden`. The size is `undefined` until the first measure,
so an opening panel starts at its natural size rather than growing out of nothing. The user's call, once asked.

**The panel is drawn by `FlyoutMenu` itself, not by `Popover`.** `Popover` requires a role, and its three — listbox,
menu, dialog — are all wrong for a list of links under a disclosure button, which the APG gives no role at all; and
moving between anchors is `Tooltip`'s own work, not `Popover`'s. Building on the layers below, as `Tooltip` does,
left `Popover` untouched for everyone else. `FocusManagerUtils.focusInto`'s restore was not used either: it restores
unconditionally, which would pull focus back to the toggle when Tab carries it on to the next entry.

**While focus is inside the open panel, a hover cannot move it** (`FlyoutMenuUtils.getIsHoverSwitchRefused`), so the
pointer drifting over another entry never swaps the links out from under the keyboard. The tutorial does not cover it;
it follows from its "closes when focus leaves".

**A press on the toggle of a panel that hover opened keeps it open**, the user's call: someone who hovers and then
clicks to open sees the panel vanish otherwise. The component remembers whether the open panel came from a hover — set
only when a hover changes which entry is open, so a press-opened panel the pointer re-enters stays press-opened — and
any press clears it. A press on a hover-opened panel turns it into a press-opened one and puts focus inside; only a
press on a press-opened panel closes it. **Focus goes in a frame later** (`FlyoutMenuUtils.focusFirstLinkAfterPress`):
the toggle answers on pointer down and the browser focuses the pressed button on the mouse down after it, so on a panel
already open — nothing to position, so nothing to wait for — focus moved in at once was taken straight back. Refusing
the button's `mousedown`, as `Popover` does, was not taken: the second press, the one that closes, would then leave
focus in the closing panel instead of on the toggle.

**An entry's link and toggle light up as one, under a highlight floater**, the user's call: an entry reads as one
thing though it is two tab stops, and the first build — telling both painters about the whole entry so each could
light its own half, with squared corners and a shared height — was replaced once they pointed at the floater `Tree` and
`Menu` already use. The bar's floater sits behind the whole `<li>`, so the link and the toggle need nothing special,
and it slides between entries as the panel does. It follows the hovered entry, else the one whose panel is open, else
the one keyboard focus is visibly on. **Every open panel has its own floater too** — the user's words, and how `Menu`
does it per level — following the hovered link, else the visibly focused one; in the overflow panel a collapsed entry's
row, link and toggle together, is one item, and so is each link in a list it expands. One `renderHighlightFloater`
draws both. The bar's floater is drawn in the `nav` rather than the `ul`, because a `div` is not allowed as a child of a
list; the panel's is drawn in the links wrapper. The panel's items are found by a marker class rather than by index,
since the overflow panel nests lists, and the hovered item is dropped whenever the panel's links change, so the floater
never follows an element that has gone.

**`aria-expanded` sits on the toggle only.** The tutorial puts it on the link as well; the APG's hybrid example puts it
on the button alone, and a link announcing "expanded" would suggest that activating it toggles something, when it
navigates.

**Entries that do not fit collapse into a last "more" entry, by Toolbar's rule** — now `OverflowUtils.computeCut`, moved
out of `ToolbarUtils` when a second component needed it, with `computeHasMeasured` and `computeUncut`, and
`ToolbarCollapse` renamed `OverflowCollapse`. Inside the overflow panel each collapsed entry keeps its link and its
toggle, and the toggle expands its links in place — the user's pick over spelling every link out flat (a long list at
the widths where the panel matters most) and over dropping them.

**Where the ports differ from Solid, and why it is not drift.** Solid makes one hover intent per entry inside its
`Index` row. React cannot make hooks in a loop, so an internal `FlyoutMenuEntry` draws each bar `<li>` and holds its
intent, as `Menu`'s `MenuEntry` does; Vue's setup runs once, so each entry gets its own effect scope, created and stopped
as the entry count changes; Svelte splits the same way React does. React works out which entry the panel shows rather
than storing it, since a stored copy lands a render late and a press on another toggle while the panel was open could
focus the previous entry's first link. The nested lists in the overflow panel take ids built from the panel's id and
the entry's position in React and Vue, where `useId` cannot run per entry; Solid and Svelte make a fresh one each.
Svelte attaches the panel's key listener with `svelte/events` rather than `onkeydown`, because Svelte's accessibility
check warns about a key listener on an element with no role and the only way to silence it is a comment. The bar's and the panel's pointer and focus listeners, which feed the highlight floaters, are attached the same
way for the same reason. React and
Svelte portal the panel element itself where Solid's `Portal` wraps it in one more `div` — the same difference Tooltip
already has. Inside the `nav` and inside the panel, the elements, classes, roles and aria attributes are the same in
all four, which is what lets one spec cover them.
