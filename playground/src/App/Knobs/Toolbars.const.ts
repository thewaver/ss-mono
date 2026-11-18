export namespace ToolbarKnobs {
    export const STARTING_BAR_WIDTH = 520;
    export const MIN_BAR_WIDTH = 80;
    export const MAX_BAR_WIDTH = 760;
    export const BAR_WIDTH_STEP = 10;
    export const MIN_GAP = 0;
    export const MAX_GAP = 30;
    export const GAP_STEP = 1;

    export const BAR_WIDTH_TEXT = {
        label: "Bar width (px)",
        hint: "How wide the bar is, also set by dragging its corner. Narrow it far enough and actions start moving into the menu at its end.",
        controls: "Sets the width of the box the toolbar fills",
    };

    export const GAP_TEXT = {
        label: "Gap (px)",
        hint: "The space left between actions on the bar.",
        controls: "Sets ToolbarProps.gap",
    };

    export const TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Keeps Clear in the arrow-key walk while it is disabled, so focusing or hovering it shows its tooltip. It only matters while Disabled is on.",
        controls: "Sets ToolbarAction.isReachableWhenDisabled",
    };

    export const TOOLTIP_IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns Clear off: pressing it does nothing and the arrow keys skip it.",
        controls: "Sets ToolbarAction.isDisabled",
    };
}
