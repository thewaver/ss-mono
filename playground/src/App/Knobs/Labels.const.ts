export namespace LabelKnobs {
    export const ORIENTATION_TEXT = {
        label: "Orientation",
        hint: "Whether the caption and the checkbox sit side by side or one above the other, in the order they are written.",
        controls: "Sets LabelProps.orientation",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the checkbox off: pressing it or its caption changes nothing, and the Tab key skips it.",
        controls: "Sets CheckboxProps.isDisabled on the checkbox inside the label",
    };
}
