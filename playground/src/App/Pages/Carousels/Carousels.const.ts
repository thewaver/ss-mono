import type { CarouselOrientation } from "@thewaver/ss-components";

export const MIN_SLIDE_COUNT = 1;
export const MAX_SLIDE_COUNT = 8;
export const SLIDE_COUNT_STEP = 1;
export const STARTING_SLIDE_COUNT = 4;
export const MIN_DELAY_MS = 500;
export const MAX_DELAY_MS = 10_000;
export const DELAY_STEP_MS = 500;
export const STARTING_DELAY_MS = 2000;
export const FIELD_WIDTH = 110;
export const ORIENTATION_FIELD_WIDTH = 150;

export const TITLES = ["Aurora", "Basalt", "Cinder", "Drift", "Ember", "Fathom", "Glimmer", "Hollow"];

export const ORIENTATIONS: CarouselOrientation[] = ["horizontal", "vertical"];

export const ORIENTATION_LABELS: Record<CarouselOrientation, string> = {
    horizontal: "Across",
    vertical: "Up and down",
};
