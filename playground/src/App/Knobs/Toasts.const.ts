import type { ToastAnimation, ToastStacking } from "../StyledComponents/ToastContent/ToastContent.types";

export namespace ToastKnobs {
    export const ANIMATIONS: ToastAnimation[] = ["zoom", "slide", "fade"];
    export const STACKINGS: ToastStacking[] = ["flow", "pile"];
    export const LIMITS = [0, 1, 2, 3, 5];
    export const DURATIONS_MS = [0, 2000, 4000, 8000];

    export const STARTING_LIMIT = 3;
    export const STARTING_DURATION_MS = 4000;
    export const STARTING_MARGIN = 20;
    export const STARTING_ANIMATION: ToastAnimation = "zoom";
    export const STARTING_STACKING: ToastStacking = "flow";
    export const MIN_GAP = 0;
    export const MAX_GAP = 40;
    export const MIN_MARGIN = 0;
    export const MAX_MARGIN = 80;
    export const MIN_TRANSITION_DURATION_MS = 0;
    export const MAX_TRANSITION_DURATION_MS = 2000;
    export const TRANSITION_DURATION_STEP_MS = 50;
}
