import type { ShapeConst } from "@thewaver/ss-utils";

export namespace ParticleDissolveKnobs {
    export const STARTING_SHAPE_KIND: ShapeConst.DefaultShape = "lozenge";
    export const MIN_ANGLE = 0;
    export const MAX_ANGLE = 345;
    export const ANGLE_STEP = 15;
    export const MIN_DURATION_MS = 200;
    export const MAX_DURATION_MS = 4000;
    export const DURATION_STEP_MS = 100;
    export const MIN_LIFETIME_MS = 100;
    export const MAX_LIFETIME_MS = 3000;
    export const MIN_FEATHER = 0;
    export const MAX_FEATHER = 1;
    export const FEATHER_STEP = 0.05;
    export const MIN_SPAWN_CHANCE = 0.05;
    export const MAX_SPAWN_CHANCE = 1;
    export const SPAWN_CHANCE_STEP = 0.05;
    export const MIN_CELL_SIZE = 4;
    export const MAX_CELL_SIZE = 40;
    export const CELL_SIZE_STEP = 2;
}
