export namespace TabKnobs {
    export const ORIENTATION_TEXT = {
        label: "Orientation",
        hint: "Whether the tabs run across the page or down it, which also decides which arrow keys walk them: left and right in a row, up and down in a column.",
        controls: "Sets TabsProps.orientation",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns every tab off: none can be selected, and the Tab key skips the list.",
        controls: "Sets Tab.isDisabled on every example tab sent to TabsProps.tabs",
    };

    export const HAS_AUTO_ACTIVATION_TEXT = {
        label: "Automatic activation",
        hint: "Selects a tab as soon as an arrow key reaches it. Off, Enter or Space selects it.",
        controls: "Sets TabsProps.hasAutoActivation",
    };

    export const IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Lets the arrow keys stop on the disabled Metrics tab without selecting it.",
        controls: "Sets Tab.isReachableWhenDisabled on the disabled tab",
    };

    export const HAS_LINK_COMPONENT_TEXT = {
        label: "Custom link component",
        hint: "Draws the tabs with a custom link component, as a router's link would be. Off, they use the native HTML anchor element.",
        controls: "Sets TabsProps.linkComponent",
    };
}
