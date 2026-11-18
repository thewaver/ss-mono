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

    export const SCROLL_LENGTH_TEXT = {
        label: "Scroll length",
        hint: "How far the box scrolls to walk one lap of the corridor, in heights of the box. Longer is slower.",
        controls: "Sets how long the example scroll runway that drives InfiniteCorridorProps.progress is",
    };

    export const LAP_MS_TEXT = {
        label: "Lap (ms)",
        hint: "How long the clock takes to walk the whole corridor once, past every room and back to the first.",
        controls: "Sets how fast the example clock advances InfiniteCorridorProps.progress",
    };

    export const LAYOUT_TEXT = {
        label: "Layout",
        hint: "Where the items stand: walls is one row on each wall, from flat against it to turned towards the viewer, and tube lines the inside of a ring of sides, every item upright towards the center. Choosing one brings its own knobs with it.",
        controls: "Picks the sample layout sent to InfiniteCorridorProps.layout",
    };

    export const SPIN_DEGREES_PER_SECOND_TEXT = {
        label: "Rotation speed (°/s)",
        hint: "How fast the tube spins round its axis, whatever the corridor's position. The page turns the layout's spinDegrees on a clock; 0 stops it, and below 0 spins it the other way.",
        controls: "Sets how fast the example turns the tube layout sent to InfiniteCorridorProps.layout",
    };

    export const ITEM_COUNT_TEXT = {
        label: "Item count",
        hint: "How many rooms line the corridor. Too few to fill it are repeated, and only the copy nearest the viewer can be reached.",
        controls: "Sets the number of example rooms sent to InfiniteCorridorProps.items",
    };

    export const GLIDE_DURATION_MS_TEXT = {
        label: "Glide (ms)",
        hint: "How long the corridor takes to bring a room into view when it is tabbed to from out of view. It times nothing else, so it shows only on Tab.",
        controls: "Sets InfiniteCorridorProps.glideDurationMs",
    };
}
