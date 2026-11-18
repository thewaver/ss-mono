export namespace CollapsibleKnobs {
    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Transition duration (ms)",
        hint: "How long the panel takes to open and close. At 0 it opens and closes at once.",
        controls: "Sets CollapsibleProps.transitionDurationMs",
    };

    export const SIDE_TEXT = {
        label: "Side",
        hint: "Which side of the trigger the panel opens on.",
        controls: "Sets CollapsibleProps.side",
    };
}
