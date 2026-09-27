import type { CellAnimationKeyframes, CellAnimationOrigins, CellAnimationWeights } from "@thewaver/ss-components";
import type { Index2d, ShapeConst } from "@thewaver/ss-utils";

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

    export const STARTING_CELL_COUNT: Index2d = { col: 21, row: 21 };
    export const STARTING_SPAWN_CHANCE = 1;
    export const STARTING_DURATION_MS = 2000;
    export const STARTING_LIFETIME_MS = 800;
    export const STARTING_ITERATION_DELAY_MS = 0;
    export const STARTING_HOLD_SHARE = 0.4;
    export const STARTING_IS_SCATTERED = false;
    export const STARTING_ORIGIN_KEY: CellAnimationOrigins.OriginType = "center";
    export const STARTING_WEIGHT_KEY: CellAnimationWeights.WeightType = "radarSingle";
    export const STARTING_ANIMATION_KEY: CellAnimationKeyframes.AnimationType = "fadeInFlash";
    export const STARTING_SHAPE_KIND: ShapeConst.DefaultShape = "lozenge";
    export const STARTING_JOIN_RADIUS = 0;
}
