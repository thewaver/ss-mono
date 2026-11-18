export namespace AccordionKnobs {
    export const MIN_GAP = 0;
    export const MAX_GAP = 40;
    export const GAP_STEP = 5;
    export const STARTING_GAP = 5;
    export const MIN_TRANSITION_MS = 0;
    export const MAX_TRANSITION_MS = 2000;
    export const TRANSITION_STEP_MS = 100;

    export const POLICY_TEXT = {
        label: "Policy",
        hint: "How many sections may be open: any number, one at a time, or one at a time with never none, where the only way out of an open section is into another one.",
        controls: "Sets AccordionProps.isSingleExpand and isExpandRequired",
    };

    export const GAP_TEXT = {
        label: "Gap (px)",
        hint: "The space between sections.",
        controls: "Sets AccordionProps.gap",
    };

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Transition duration (ms)",
        hint: "How long a section takes to open and close. At 0 it opens and closes at once.",
        controls: "Sets AccordionProps.transitionDurationMs",
    };

    export const IS_SCROLLED_INTO_VIEW_ON_EXPAND_TEXT = {
        label: "Scroll into view",
        hint: "Brings a section into view once it has finished opening.",
        controls: "Sets AccordionProps.isScrolledIntoViewOnExpand",
    };

    export const ORIENTATION_TEXT = {
        label: "Orientation",
        hint: "Which way the sections run: stacked, each panel opening below its header, or side by side, each panel opening beside it.",
        controls: "Sets AccordionProps.orientation",
    };
}
