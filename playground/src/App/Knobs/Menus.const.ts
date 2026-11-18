export namespace MenuKnobs {
    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the menu off: its button does not open it, and the Tab key skips it.",
        controls: "Sets MenuProps.isDisabled",
    };

    export const PLACEMENT_X_TEXT = {
        label: "Placement across",
        hint: "Where the menu sits across its button: lined up with an edge from inside, centered, or outside it altogether.",
        controls: "Sets MenuProps.placement.x",
    };

    export const PLACEMENT_Y_TEXT = {
        label: "Placement down",
        hint: "Where the menu sits above or below its button: lined up with an edge from inside, centered, or outside it altogether.",
        controls: "Sets MenuProps.placement.y",
    };

    export const SUBMENU_PLACEMENT_X_TEXT = {
        label: "Submenu placement across",
        hint: "Where each submenu sits across the item that opens it. Beside it on the left or the right, the arrow pointing that way opens it.",
        controls: "Sets MenuProps.submenuPlacement.x",
    };

    export const IS_REACHABLE_TEXT = {
        label: "Reachable when disabled",
        hint: "Lets the arrow keys stop on Paste and Duplicate, which then show a tooltip.",
        controls: "Sets MenuItem.isReachableWhenDisabled on the disabled items",
    };

    export const IS_GLIDING_TEXT = {
        label: "Gliding highlight",
        hint: "Draws one marker that slides between the items. Off, each item lights up on its own.",
        controls: "Passes MenuProps.renderHighlightFloater, or leaves it out",
    };

    export const TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Keeps a disabled menu's tooltip available: the Tab key can stop on its button and hovering it shows the tooltip. Without it a disabled menu shows no tooltip at all. It only matters while Disabled is on.",
        controls: "Sets MenuProps.isReachableWhenDisabled",
    };
}
