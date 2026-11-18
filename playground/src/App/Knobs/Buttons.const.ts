export namespace ButtonKnobs {
    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Puts the button in its error look. It changes nothing about what the button accepts or does.",
        controls: "Sets Button.hasError",
    };

    export const IS_PRESSED_TEXT = {
        label: "Pressed",
        hint: "Marks the button as holding a state, like a toggle that stays down. What that looks like is up to the painter; here it gets a 4px inner ring in the secondary color.",
        controls: "Sets Button.isPressed",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the button off: it ignores presses and hover, and the Tab key skips it.",
        controls: "Sets Button.isDisabled",
    };

    export const TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Keeps a disabled button's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled button shows no tooltip at all. It only matters while Disabled is on.",
        controls: "Sets Button.isReachableWhenDisabled",
    };
}
