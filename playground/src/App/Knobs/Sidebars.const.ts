export namespace SidebarKnobs {
    export const MIN_TRANSITION_MS = 0;
    export const MAX_TRANSITION_MS = 1000;
    export const TRANSITION_STEP_MS = 50;
    export const MIN_DELAY_MS = 0;
    export const MAX_DELAY_MS = 1000;
    export const DELAY_STEP_MS = 50;

    export const EDGE_TEXT = {
        label: "Edge",
        hint: "Which side of its neighbor the sidebar is docked to, and so which way it grows. Docked to the top or bottom, it spans the width and grows in height.",
        controls: "Sets SidebarProps.edge",
    };

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Transition duration (ms)",
        hint: "How long the sidebar takes to grow and shrink. At 0 it changes size at once.",
        controls: "Sets SidebarProps.transitionDurationMs",
    };

    export const LAYOUT_TEXT = {
        label: "Layout",
        hint: "Whether growing pushes the content beside the sidebar aside or grows over it.",
        controls: "Sets SidebarProps.layout",
    };

    export const IS_EXPANDED_ON_HOVER_TEXT = {
        label: "Expands on hover",
        hint: "Whether resting the pointer on the sidebar expands it, without changing its expanded state.",
        controls: "Sets SidebarProps.isExpandedOnHover",
    };

    export const HOVER_SHOW_DELAY_MS_TEXT = {
        label: "Hover delay (ms)",
        hint: "How long the pointer has to rest on the sidebar before it expands.",
        controls: "Sets SidebarProps.hoverShowDelayMs",
    };
}
