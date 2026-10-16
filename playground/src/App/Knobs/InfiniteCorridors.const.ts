import type { CorridorLayoutFamily, CorridorLayouts } from "@thewaver/ss-components";

export namespace InfiniteCorridorKnobs {
    export const MIN_ITEM_COUNT = 1;
    export const MAX_ITEM_COUNT = 40;
    export const ITEM_COUNT_STEP = 1;
    export const STARTING_ITEM_COUNT = 16;

    export const MIN_GLIDE_DURATION_MS = 0;
    export const MAX_GLIDE_DURATION_MS = 2000;
    export const GLIDE_DURATION_STEP_MS = 50;

    export const STARTING_LAYOUT: CorridorLayouts.SampleKey = "walls";

    export const MIN_LAP_MS = 2000;
    export const MAX_LAP_MS = 120_000;
    export const LAP_STEP_MS = 1000;
    export const STARTING_LAP_MS_BY_FAMILY: Record<CorridorLayoutFamily, number> = {
        tube: 2000,
        walls: 20_000,
    };

    export const MIN_SCROLL_LENGTH = 1;
    export const MAX_SCROLL_LENGTH = 10;
    export const SCROLL_LENGTH_STEP = 1;
    export const STARTING_SCROLL_LENGTH = 3;
}
