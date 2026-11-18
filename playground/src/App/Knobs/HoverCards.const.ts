export namespace HoverCardKnobs {
    export const MIN_OFFSET = 0;
    export const MAX_OFFSET = 40;
    export const OFFSET_STEP = 2;
    export const MIN_DURATION = 0;
    export const MAX_DURATION = 1000;
    export const DURATION_STEP = 50;

    export const STARTING_OFFSET_Y = 8;

    export const OFFSET_Y_TEXT = {
        label: "Offset down (px)",
        hint: "How far the card is held clear of its anchor. The gap is bridged, so the pointer can cross it without losing the card.",
        controls: "Sets HoverCardProps.offset.y",
    };

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Transition duration (ms)",
        hint: "How long the card takes to fade in and out.",
        controls: "Sets HoverCardProps.transitionDurationMs",
    };

    export const FOCUS_SHOW_DELAY_MS_TEXT = {
        label: "Focus delay (ms)",
        hint: "How long a keyboard focus has to rest on the anchor before the card opens.",
        controls: "Sets HoverCardProps.focusShowDelayMs",
    };

    export const HOVER_SHOW_DELAY_MS_TEXT = {
        label: "Hover delay (ms)",
        hint: "How long the pointer has to rest on the anchor before the card opens. Leave before then and nothing opens.",
        controls: "Sets HoverCardProps.hoverShowDelayMs",
    };
}
