export namespace ProgressKnobs {
    export const MIN_VALUE = 0;
    export const MAX_VALUE = 1;
    export const VALUE_STEP = 0.05;
    export const STARTING_VALUE = 0.4;

    export const VALUE_TEXT = {
        label: "Value",
        hint: "How far along the work is, between 0 and 1, the default range.",
        controls: "Sets ProgressProps.value",
    };

    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Puts the bar in its error look, for work that has failed rather than finished. Whether it has failed is the owner's to say.",
        controls: "Sets ProgressProps.hasError",
    };
}
