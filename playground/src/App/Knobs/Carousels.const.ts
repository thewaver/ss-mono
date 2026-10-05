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
    export const STARTING_IS_DISABLED = false;
    export const STARTING_PLACEMENT: CarouselPlacements.SampleKey = "cover_flow";
    export const RING_LAP_MS = 12_000;
    export const RING_PERSPECTIVE_PX = 900;
    export const RING_SLOT_WIDTH = 440;
    export const RING_PANEL_HEIGHT = 220;

    export const WORD_DRUM_SLOT_HEIGHT = 200;
    export const WORD_DRUM_FACE_COUNT = 12;
    export const WORD_DRUM_FACE_RATIO = 0.25;
    export const WORD_DRUM_PERSPECTIVE_PX = 600;
    export const WORD_DRUM_WORDS = ["Sketch", "Shape", "Build", "Test", "Ship", "Listen", "Learn", "Again"];
}
