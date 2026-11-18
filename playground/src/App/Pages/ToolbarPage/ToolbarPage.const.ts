import { type ArcDefs, PlacementLayoutUtils } from "@thewaver/ss-components";

export const EXAMPLE_NAMES = {
    default: "Default",
    refusing: "Refusing",
    pressed: "Pressed",
    sharedTooltip: "One tooltip for the row",
    palette: "A ring of tools",
};

export const NOTHING_RUN = "nothing run yet";

export const EXAMPLES_ROOT = "/src/App/Pages/ToolbarPage/Examples";

export const NO_WIDTH = 0;

export const WIDE_SPAN = 2;

export const DOCS_ROOT = "/src/App/Pages/ToolbarPage/Docs";

export const PALETTE_DEFS: ArcDefs = {
    ovalHeightRatio: 1,
    spreadDegrees: 360,
    facingDegrees: 67.5,
    itemWidthRatio: 0.3542,
    itemHeightRatio: 0.1667,
};

export const PALETTE_LAYOUT = PlacementLayoutUtils.createArc(PALETTE_DEFS);

export const PALETTE_WIDTH = "390px";

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the actions run from the right and the left arrow moves on to the next action. Narrow the bar and the menu button sits at its left end.",
    },
    actionsThatRefuseCollapse: {
        title: "Actions that refuse to collapse",
        content:
            "Each action can say how it takes to a narrow bar through [prop]collapse[/prop]. Set to never, it stays in the row whatever that costs the others, so Share is the last one standing; set to always, it lives in the menu however much room there is, as Print does. A disabled action, Rename here, is skipped by the arrow keys and is still listed in the menu, disabled.",
    },
    actionsThatStayPressed: {
        title: "Actions that stay pressed",
        content:
            "Pass [prop]pressedValues[/prop] and every action becomes a toggle that stays down until it is pressed again, with the list holding the values of those that are down. An action that collapses becomes a checkbox in the menu, checked from the same list, so narrowing the bar loses nothing.",
    },
    tooltips: {
        title: "Tooltips",
        content:
            "Give an action [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, and the same tooltip goes with it into the menu. Inside a SharedTooltip the row shares one tooltip, which moves from action to action instead of closing and opening again. A disabled action shows no tooltip unless [prop]isReachableWhenDisabled[/prop] keeps it in the arrow-key walk; then it can still say why it is off.",
    },
    ringTools: {
        title: "A ring of tools",
        content:
            "Hand [prop]computeLayout[/prop] a layout and the actions are placed by it rather than laid in a row, here round a ring. The layout sizes the bar itself, so nothing runs out of room and there is no menu button, and the arrow keys still walk the actions in the order they are written.",
    },
};

export const MORE_FORMATTING_ACTIONS_LABEL = "More formatting actions";

export const MORE_DOCUMENT_ACTIONS_LABEL = "More document actions";

export const MOVES_SELECTION_CLIPBOARD_TEXT = "Moves the selection to the clipboard";

export const COPIES_SELECTION_CLIPBOARD_TEXT = "Copies the selection to the clipboard";

export const NOTHING_SELECTED_SO_THERE_TEXT = "Nothing is selected, so there is nothing to clear";

export const DELETES_SELECTION_TEXT = "Deletes the selection";

export const PUTS_CLIPBOARD_WHERE_CARET_TEXT = "Puts the clipboard where the caret is";

export const TAKES_BACK_LAST_CHANGE_TEXT = "Takes back the last change";

export const MORE_EDITING_ACTIONS_LABEL = "More editing actions";
