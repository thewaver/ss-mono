import type { FanLayoutDefs } from "@thewaver/ss-components";

export const EXAMPLE_NAMES = {
    default: "Default",
    submenus: "Submenus",
};

export const EXAMPLES_ROOT = "/src/App/Pages/Menus/FanMenuPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/Menus/FanMenuPage/Docs";

export const NOTHING_RUN = "nothing run yet";

export const FAN_LAYOUT_SIZE = "640px";

export const FAN_LAYOUT_DEFS: FanLayoutDefs = {
    spreadDegreesPerItem: 22.5,
    tiltRatio: 0.5,
    holeRatio: 0,
    itemRadiusRatio: 0.5,
    itemWidthRatio: 0.25,
    itemHeightRatio: 0.05,
};

export const DOCS_SECTIONS = {
    submenus: {
        title: "Submenus",
        content:
            "Give an item [prop]items[/prop] of its own and picking it replaces the arc with its submenu, rather than opening a second arc beside it. The card at the head of the new arc is the item you came in through, and picking it, or pressing the left arrow, takes you back. A submenu opens on a press, not on a hover, so sweeping the pointer across the arc never drills into a level by accident.",
    },
};
