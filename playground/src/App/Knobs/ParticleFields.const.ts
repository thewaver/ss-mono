import type { CellAnimationKeyframes, CellAnimationOrigins, SliceAnimationWeights } from "@thewaver/ss-components";
import type { Count2d, ShapeConst } from "@thewaver/ss-utils";

export namespace ParticleFieldKnobs {
    export const MIN_CELL_COUNT = 1;
    export const MAX_CELL_COUNT = 40;
    export const CELL_COUNT_STEP = 1;
    export const MIN_DURATION_MS = 200;
    export const MAX_DURATION_MS = 10000;
    export const MIN_LIFETIME_MS = 100;
    export const MAX_LIFETIME_MS = 5000;
    export const MIN_ITERATION_DELAY_MS = 0;
    export const MAX_ITERATION_DELAY_MS = 5000;
    export const DURATION_STEP_MS = 100;
    export const MIN_HOLD_SHARE = 0;
    export const MAX_HOLD_SHARE = 1;
    export const HOLD_SHARE_STEP = 0.05;
    export const MIN_SPAWN_CHANCE = 0;
    export const MAX_SPAWN_CHANCE = 1;
    export const SPAWN_CHANCE_STEP = 0.05;
    export const MIN_JOIN_RADIUS = 0;
    export const MAX_JOIN_RADIUS = 120;
    export const JOIN_RADIUS_STEP = 5;

    export const STARTING_CELL_COUNT: Count2d = { colCount: 21, rowCount: 21 };
    export const STARTING_SPAWN_CHANCE = 1;
    export const STARTING_DURATION_MS = 2000;
    export const STARTING_LIFETIME_MS = 800;
    export const STARTING_ITERATION_DELAY_MS = 0;
    export const STARTING_HOLD_SHARE = 0.4;
    export const STARTING_IS_SCATTERED = false;
    export const STARTING_ORIGIN_KEY: CellAnimationOrigins.OriginType = "center";
    export const STARTING_WEIGHT_KEY: SliceAnimationWeights.WeightType = "radar_single";
    export const STARTING_ANIMATION_KEY: CellAnimationKeyframes.AnimationType = "fade_in_flash";
    export const STARTING_SHAPE_KIND: ShapeConst.DefaultShape = "lozenge";
    export const STARTING_JOIN_RADIUS = 0;

    export const SHAPE_KIND_TEXT = {
        label: "Shape",
        hint: "The area particles may appear in. A cell spawns only when its center is inside it.",
        controls: "Picks the example contour sent to ParticleFieldProps.computeShapePoints",
    };

    export const JOIN_RADIUS_TEXT = {
        label: "Corner radius",
        hint: "How far each corner of the area is rounded, as the Shape page rounds them.",
        controls: "Sets every corner of ParticleFieldProps.shapeJoinRadii",
    };

    export const ON_GRAPHICS_CARD_TEXT = {
        label: "On the graphics card",
        hint: "Draws the stress test's particles in one canvas per field, with the keyframes worked out on the graphics card. Off, every particle is an element of its own.",
        controls: "Sets ParticleFieldProps.renderer in the stress test",
    };

    export const SPAWN_CHANCE_TEXT = {
        label: "Spawn chance (0-1)",
        hint: "The chance each cell spawns in a given pass. 1 spawns every cell every pass; lower leaves gaps that change from pass to pass. When a cell does spawn is still its weight's call.",
        controls: "Sets ParticleFieldProps.spawnChance",
    };

    export const CELL_COUNT_TEXT = {
        label: "Cell count (cols x rows)",
        hint: "How many columns and rows the field is split into. A cell holds one particle at a time.",
        controls: "Sets ParticleFieldProps.cellCount",
    };

    export const ORIGIN_TYPE_TEXT = {
        label: "Origin",
        hint: "Where in the grid the weights are measured from. It only applies to weights that are measured from a point.",
        controls:
            "Picks the point the example's weights are measured from, sent to ParticleFieldProps.computeCellWeights",
    };

    export const WEIGHT_TYPE_TEXT = {
        label: "Weight",
        hint: "The same weights CellAnimation uses: a heavy cell spawns early in the pass and a light one late.",
        controls: "Picks the example's weight function sent to ParticleFieldProps.computeCellWeights",
    };

    export const ANIMATION_TYPE_TEXT = {
        label: "Animation",
        hint: "How a particle appears, played forwards as it arrives and backwards as it leaves: CellAnimation's own keyframes.",
        controls: "Picks the example's particle keyframes sent to ParticleFieldProps.computeParticleAnimation",
    };

    export const HOLD_SHARE_TEXT = {
        label: "Hold (0-1)",
        hint: "How much of a particle's life it spends fully shown, between appearing and disappearing. 1 cuts in and out.",
        controls:
            "Sets how long the example's particle keyframes hold, sent to ParticleFieldProps.computeParticleAnimation",
    };

    export const IS_SCATTERED_TEXT = {
        label: "Scatter in cell",
        hint: "Places each particle at a random point in its cell rather than at the center, so the grid stops showing.",
        controls:
            "Decides whether the example's ParticleFieldProps.computeParticlePos scatters each particle inside its cell",
    };

    export const ANIMATION_DURATION_MS_TEXT = {
        label: "Duration (ms)",
        hint: "How long one pass over the grid takes, and so the shortest time between two spawns from the same cell.",
        controls: "Sets ParticleFieldProps.animationDurationMs",
    };

    export const PARTICLE_LIFETIME_MS_TEXT = {
        label: "Lifetime (ms)",
        hint: "How long one particle lives, from appearing to being removed.",
        controls: "Sets ParticleFieldProps.particleLifetimeMs",
    };

    export const ITERATION_DELAY_MS_TEXT = {
        label: "Iteration delay (ms)",
        hint: "How long the field waits between one pass and the next.",
        controls: "Sets ParticleFieldProps.animationIterationDelayMs",
    };
}
