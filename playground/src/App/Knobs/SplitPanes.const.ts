export namespace SplitPaneKnobs {
    export const MIN_GUTTER = 2;
    export const MAX_GUTTER = 24;
    export const GUTTER_STEP = 1;

    export const STARTING_IS_DISABLED = false;

    export const ORIENTATION_TEXT = {
        label: "Orientation",
        hint: "Whether the panes sit side by side or stack. Stacked, the divider lies across between them and the up and down arrows move it.",
        controls: "Sets SplitPaneProps.orientation",
    };

    export const GUTTER_SIZE_TEXT = {
        label: "Gutter size (px)",
        hint: "How wide the draggable divider between two panes is.",
        controls: "Sets SplitPaneProps.gutterSize",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the divider off, so the panes keep the sizes they have.",
        controls: "Sets SplitPaneProps.isDisabled",
    };
}
