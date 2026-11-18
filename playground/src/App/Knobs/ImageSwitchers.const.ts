import type { SourceType } from "../Pages/ImageSwitcherPage/ImageSwitcherPage.types";

export namespace ImageSwitcherKnobs {
    export const MIN_DURATION_MS = 0;
    export const MAX_DURATION_MS = 5000;
    export const DURATION_STEP_MS = 50;

    export const SOURCE_TYPES: SourceType[] = ["profile", "date", "missing_file", "none"];

    export const STARTING_SOURCE_TYPE: SourceType = "profile";

    export const SOURCE_TYPE_TEXT = {
        label: "Source",
        hint: "Which picture to show. Switching crossfades from the old one once the new one has loaded; missing_file points at a file that does not exist, and none passes no source at all.",
        controls: "Picks the example picture sent to ImageSwitcherProps.src and ImageSwitcherProps.alt",
    };

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Transition duration (ms)",
        hint: "How long the crossfade from one picture to the next takes.",
        controls: "Sets ImageSwitcherProps.transitionDurationMs",
    };
}
