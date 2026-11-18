export namespace RadioKnobs {
    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Marks the group and its radios invalid, for screen readers as well as for the painter.",
        controls: "Sets RadioGroupProps.hasError and RadioProps.hasError",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns every radio off: none can be picked, and the Tab key skips the group.",
        controls: "Sets RadioProps.isDisabled on every radio",
    };

    export const IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Lets the arrow keys stop on the disabled radio, which then shows its tooltip.",
        controls: "Sets RadioProps.isReachableWhenDisabled",
    };
}
