import type { CarouselPlacements } from "@thewaver/ss-components";

export namespace CarouselKnobs {
    export const MIN_SLIDE_COUNT = 1;
    export const MAX_SLIDE_COUNT = 8;
    export const SLIDE_COUNT_STEP = 1;
    export const STARTING_SLIDE_COUNT = 4;
    export const MIN_DELAY_MS = 500;
    export const MAX_DELAY_MS = 10_000;
    export const DELAY_STEP_MS = 500;
    export const STARTING_DELAY_MS = 2000;
    export const MIN_TRANSITION_MS = 0;
    export const MAX_TRANSITION_MS = 2000;
    export const TRANSITION_STEP_MS = 100;
    export const STARTING_IS_DISABLED = false;
    export const STARTING_PLACEMENT: CarouselPlacements.SampleKey = "cover_flow";

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Transition duration (ms)",
        hint: "How long the move from one slide to the next takes. At 0 the carousel jumps straight there.",
        controls: "Sets CarouselProps.transitionDurationMs",
    };

    export const ORIENTATION_TEXT = {
        label: "Orientation",
        hint: "Which way the slides run and a swipe moves them: across, or up and down.",
        controls: "Sets CarouselProps.orientation",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the carousel off, so neither its controller nor its swipes do anything.",
        controls: "Sets CarouselProps.isDisabled",
    };

    export const PLACEMENT_TEXT = {
        label: "Placement",
        hint: "The rule that says where each slide is drawn from how far it is from the one showing.",
        controls: "Picks the rule sent to CarouselProps.placement",
    };

    export const ORIENTATION_2_TEXT = {
        label: "Orientation",
        hint: "Which way the slides run. Every rule lays its slides out along it.",
        controls: "Sets CarouselProps.orientation",
    };

    export const IS_LOOPING_TEXT = {
        label: "Looping",
        hint: "Whether stepping on from the last slide comes round to the first.",
        controls: "Sets CarouselProps.isLooping",
    };

    export const AUTOPLAY_DELAY_MS_TEXT = {
        label: "Delay (ms)",
        hint: "How long a slide is held before the carousel moves to the next one on its own.",
        controls: "Sets CarouselProps.autoplayDelayMs",
    };
}
