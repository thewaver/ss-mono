export namespace FormFieldKnobs {
    export const MIN_GAP = 0;
    export const MAX_GAP = 40;
    export const GAP_STEP = 5;

    export const STARTING_MESSAGE = "Shown to everyone who can see your posts.";
    export const STARTING_HAS_ERROR = false;

    export const ORIENTATION_TEXT = {
        label: "Orientation",
        hint: "Whether the caption sits above the control or beside it.",
        controls: "Sets FormFieldProps.orientation",
    };

    export const GAP_TEXT = {
        label: "Gap (px)",
        hint: "The space between the caption, the control and the message.",
        controls: "Sets FormFieldProps.gap",
    };

    export const MESSAGE_TEXT = {
        label: "Message",
        hint: "The line shown under the control. Leave it empty and no line is rendered at all.",
        controls: "Sets FormFieldProps.message",
    };

    export const IS_REQUIRED_TEXT = {
        label: "Required",
        hint: "Tells screen readers a value is expected, and hands the caption the state to mark it. Nothing is enforced.",
        controls: "Sets FormFieldProps.isRequired",
    };

    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Puts the field into its error look and reads the message out as the error rather than as help.",
        controls: "Sets FormFieldProps.hasError",
    };

    export const IN_FORM_HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Puts the field in error, which the form hears without being told.",
        controls: "Sets FormFieldProps.hasError",
    };
}
