import type { ToastsAlignment } from "@thewaver/ss-components";

import type { ToastAnimation, ToastStacking } from "../StyledComponents/ToastContent/ToastOptions.types";

export namespace ToastKnobs {
    export const ANIMATIONS: ToastAnimation[] = ["zoom", "slide", "fade"];
    export const STACKINGS: ToastStacking[] = ["flow", "pile"];
    export const LIMITS = [0, 1, 2, 3, 5];
    export const DURATIONS_MS = [0, 2000, 4000, 8000];
    export const TIMED_DURATIONS_MS = [2000, 4000, 8000];

    export const STARTING_LIMIT = 3;
    export const STARTING_DURATION_MS = 4000;
    export const STARTING_MARGIN = 20;
    export const STARTING_ANIMATION: ToastAnimation = "zoom";
    export const STARTING_STACKING: ToastStacking = "flow";
    export const STARTING_PLACEMENT_ALIGNMENT: ToastsAlignment = "top_center";
    export const MIN_GAP = 0;
    export const MAX_GAP = 40;
    export const MIN_MARGIN = 0;
    export const MAX_MARGIN = 80;
    export const MIN_TRANSITION_DURATION_MS = 0;
    export const MAX_TRANSITION_DURATION_MS = 2000;
    export const TRANSITION_DURATION_STEP_MS = 50;

    export const ALIGNMENT_TEXT = {
        label: "Alignment",
        hint: "Which corner or edge of the screen the toasts gather at.",
        controls: "Sets ToastsProps.alignment",
    };

    export const FLEX_DIRECTION_TEXT = {
        label: "Flex direction",
        hint: "Which way the stack grows from there, and so whether a new toast joins at the near end or the far one.",
        controls: "Sets ToastsProps.flexDirection",
    };

    export const GAP_TEXT = {
        label: "Gap (px)",
        hint: "The space between one toast and the next.",
        controls: "Sets ToastsProps.gap",
    };

    export const MARGIN_TEXT = {
        label: "Margin (px)",
        hint: "How far the stack is held off the edges of the screen.",
        controls: "Sets every side of ToastsProps.margins",
    };

    export const STACKING_TEXT = {
        label: "Stacking",
        hint: "Whether the toasts sit in a row of their own, or pile up on each other with only the newest fully shown.",
        controls: "Picks how the example painter places each toast",
    };

    export const LIMIT_TEXT = {
        label: "Limit",
        hint: "How many toasts may be on screen at once. Choose none and they all show.",
        controls: "Sets ToastsProps.limit, with no limit sent as undefined",
    };

    export const OVERFLOW_TEXT = {
        label: "Overflow",
        hint: "What happens once the limit is reached: the oldest toast is dismissed, or the newest waits its turn.",
        controls: "Sets ToastsProps.overflow",
    };

    export const DURATION_MS_TEXT = {
        label: "Duration",
        hint: "How long a Timed toast stays before it dismisses itself. Sticky ones wait to be closed.",
        controls: "Sets Toast.durationMs on each Timed toast raised",
    };

    export const ANIMATION_TEXT = {
        label: "Animation",
        hint: "How a toast arrives and leaves.",
        controls: "Picks how the example painter draws the arrival and the exit",
    };

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Transition duration (ms)",
        hint: "How long a toast takes to arrive, to leave, and to slide when the stack shifts.",
        controls: "Sets ToastsProps.transitionDurationMs",
    };
}
