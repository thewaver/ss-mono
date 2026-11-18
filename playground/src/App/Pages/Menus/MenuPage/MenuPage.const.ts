export const EXAMPLE_NAMES = {
    default: "Default",
    glide: "A gliding highlight",
    driven: "Driven from outside",
    context: "Opened by a right-click",
    contextRightToLeft: "Opened by a right-click, right to left",
    staysOpen: "Commands worth repeating",
    disabledItems: "Disabled items",
    disabledItemsReachable: "Disabled items + reachable",
    submenus: "Submenus",
    cascader: "Cascader",
    rightToLeft: "Submenus in a right-to-left box",
    rightToLeftPlaced: "Submenus placed on the right, right to left",
    placedAbove: "Placed above",
    scrollingList: "Scrolling list",
    stateful: "Rows that hold a state",
    sections: "Sections",
    disabled: "Disabled",
    reachable: "Disabled + reachable",
};

export const EXAMPLES_ROOT = "/src/App/Pages/Menus/MenuPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/Menus/MenuPage/Docs";

export const FIELD_WIDTH = 110;

export const DOCS_SECTIONS = {
    submenus: {
        title: "Submenus",
        content:
            "Give an item [prop]items[/prop] of its own and it opens a submenu beside it, in a popup of its own. Resting the pointer on the item opens it; from the keyboard the right arrow steps in onto the submenu's first item, and the left arrow or Escape steps back out one level. A submenu sits flush against its item, so set [prop]submenuOffset[/prop] to your surface's padding and border, or it overlaps the menu it came from.",
    },
    pickingPath: {
        title: "Picking a path",
        content:
            "Submenus also make a cascading picker. An item that opens a submenu only opens it, so [prop]onActivate[/prop] runs for a city alone, never for a region or a country, and the code writes the city's whole path. The button shows the path picked so far, and its [prop]ariaLabel[/prop] says it too.",
    },
    openedRightClick: {
        title: "Opened by a right-click",
        content:
            'For a menu opened by a right-click, use ContextMenu: the same menu, without a button. It draws a region through [prop]renderRegion[/prop], and a right-click inside it opens the menu where the pointer is. The region is a tab stop of its own, named by [prop]regionAriaLabel[/prop], so the keyboard can open the menu too, with the ContextMenu key or Shift+F10, against whatever inside the region has focus — as [wcag id="2.1.1"]WCAG 2.1.1[/wcag] asks of anything a pointer can do.',
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the menu hangs from the right edge of its button, and its submenus open to the left, where the left arrow steps in and the right arrow steps back out. Opened by a right-click, it spreads to the left of the pointer instead of the right. Every level takes the box's direction although it is drawn outside it, so its items read from the right. A [prop]placement[/prop] or [prop]submenuPlacement[/prop] you give is used as it stands.",
    },
    placement: {
        title: "Placement",
        content:
            "Set [prop]placement[/prop] to choose where the menu sits against its button, across and down, and [prop]submenuPlacement[/prop] for where each submenu sits against its item. Either is used as it stands in right-to-left text too. The arrow that opens a submenu is always the one pointing at the side it opens on, and the other arrow closes it. The painter given to [prop]renderPopup[/prop] is handed the placement in use, so a surface can grow from the side it hangs on, as this one does when it opens above.",
    },
    rowsThatHoldState: {
        title: "Rows that hold a state",
        content:
            "An item's [prop]kind[/prop] makes it a checkbox or a radio rather than a command. Ticking a checkbox leaves the menu open, since ticking is often done several times over; picking a radio closes it. Radios written next to each other are one group, and picking one turns off whichever other one was on. Every checked value, radios included, is held in one [prop]checked[/prop] list.",
    },
    sections: {
        title: "Sections",
        content:
            "An entry with a label and [prop]items[/prop] of its own, but no value, is a section, as a group is in Select. Its heading is drawn by [prop]renderGroupHeader[/prop] and whatever goes around it by [prop]renderGroupBox[/prop]. A screen reader announces the section's name, the arrows walk straight past the headings, and radios stay one group per section even where two sections of radios meet.",
    },
    disabledItems: {
        title: "Disabled items",
        content:
            "An item can be disabled: the arrows skip it and it cannot be picked. Kept reachable when disabled, through [prop]isReachableWhenDisabled[/prop], the arrows stop on it instead, so a screen reader names it and says it is unavailable, and a tooltip can say why.",
    },
    commandsWorthRepeating: {
        title: "Commands worth repeating",
        content:
            "Picking a command closes the menu. Set [prop]staysOpenOnPick[/prop] on one worth pressing again, such as zooming in, and the menu stays open for the next press.",
    },
    longList: {
        title: "A long list",
        content:
            "A menu taller than the room its popup is given scrolls, and the item the arrows land on is scrolled into view. Home and End reach the first and the last item.",
    },
    highlightThatGlides: {
        title: "A highlight that glides",
        content:
            "Give the menu [prop]renderHighlightFloater[/prop] and one marker slides behind the items to whichever one the pointer or the arrows are on, in this menu and in every submenu, while the items paint no highlight of their own. Without it, each item paints its own highlight from the flags it is handed.",
    },
    openingClosingOutside: {
        title: "Opening and closing from outside",
        content:
            "Hand the menu a [prop]visibility[/prop] signal and anything can open or close it; the menu writes to it as well, when it closes itself. Here the menu also hangs from the toggle below rather than from its own button, through [prop]anchorRef[/prop]. Since the toggle is the anchor, pressing it while the menu is open closes the menu, rather than counting as a press outside it.",
    },
    tooltip: {
        title: "Tooltip",
        content:
            "Give a menu [prop]tooltipDefs[/prop] and its button shows a tooltip on hover and on keyboard focus, read by screen readers as the button's description. A disabled menu shows no tooltip unless you also keep it reachable when disabled; its button can then be focused to read why it is off, and still does not open the menu.",
    },
};

export const NOTHING_CHOSEN = "Choose a destination";

export const EDITING_AREA_RIGHT_LEFT_LABEL = "Editing area in a right-to-left box";
