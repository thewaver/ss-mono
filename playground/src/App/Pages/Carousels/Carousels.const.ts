import type { CarouselDir } from "@thewaver/ss-components";

export const MIN_SLIDE_COUNT = 1;
export const MAX_SLIDE_COUNT = 8;
export const SLIDE_COUNT_STEP = 1;
export const STARTING_SLIDE_COUNT = 4;
export const MIN_DELAY_MS = 500;
export const MAX_DELAY_MS = 10_000;
export const DELAY_STEP_MS = 500;
export const STARTING_DELAY_MS = 2000;
export const FIELD_WIDTH = 110;
export const DIR_FIELD_WIDTH = 150;

export const TITLES = ["Aurora", "Basalt", "Cinder", "Drift", "Ember", "Fathom", "Glimmer", "Hollow"];

export const DIRS: CarouselDir[] = ["row", "column"];

export const DIR_LABELS: Record<CarouselDir, string> = {
    row: "Across",
    column: "Up and down",
};
