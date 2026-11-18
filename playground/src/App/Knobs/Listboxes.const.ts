export namespace ListboxKnobs {
    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the list off: no option can be picked, and the Tab key skips it.",
        controls: "Sets ListboxProps.isDisabled",
    };

    export const ORIENTATION_TEXT = {
        label: "Orientation",
        hint: "Whether the options run across the page or down it, and so which arrows walk them.",
        controls: "Sets ListboxProps.orientation",
    };

    export const IS_GLIDING_TEXT = {
        label: "Gliding markers",
        hint: "Draws one marker on the picked option and a second that slides between the options. Off, each option lights up on its own.",
        controls: "Passes ListboxProps.renderSelectionFloater and renderHighlightFloater, or leaves them out",
    };
}
