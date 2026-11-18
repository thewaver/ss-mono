export namespace NumberInputKnobs {
    export const MIN_LIMIT = -1000;
    export const MAX_LIMIT = 1000;
    export const LIMIT_STEP = 1;
    export const MIN_STEP = 0.1;
    export const MAX_STEP = 50;
    export const STEP_STEP = 0.1;

    export const IS_READ_ONLY_TEXT = {
        label: "Read-only",
        hint: "Its number can be selected and copied, but neither typing, pasting nor the stepper changes it.",
        controls: "Sets NumberInputProps.isReadOnly",
    };

    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Marks the field invalid, for screen readers as well as for the painter.",
        controls: "Sets NumberInputProps.hasError",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the field off: nothing can write to it, the stepper is off too, and the Tab key skips it.",
        controls: "Sets NumberInputProps.isDisabled",
    };

    export const MIN_TEXT = {
        label: "Min",
        hint: "The lowest value the field accepts.",
        controls: "Sets NumberInputProps.min",
    };

    export const MAX_TEXT = {
        label: "Max",
        hint: "The highest value the field accepts.",
        controls: "Sets NumberInputProps.max",
    };

    export const STEP_TEXT = {
        label: "Step",
        hint: "How far one press of an arrow key or a stepper button moves the value.",
        controls: "Sets NumberInputProps.step",
    };

    export const LOCALE_TEXT = {
        label: "Locale",
        hint: "The language and region whose way of writing numbers the field uses.",
        controls: "Sets NumberInputProps.locale",
    };

    export const TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on.",
        controls: "Sets NumberInputProps.isReachableWhenDisabled",
    };
}
