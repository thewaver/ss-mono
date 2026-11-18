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

    export const ANGLE_DEGREES_TEXT = {
        label: "Angle (degrees)",
        hint: "The direction the edge travels: 0 sweeps up, 90 to the right, 180 down.",
        controls: "Sets ParticleDissolveProps.angleDegrees",
    };

    export const ON_GRAPHICS_CARD_TEXT = {
        label: "On the graphics card",
        hint: "Draws each card's ash in one canvas, with each particle's motion worked out on the graphics card. Off, every particle is an element of its own.",
        controls: "Sets ParticleDissolveProps.renderer in the stress test",
    };

    export const SHAPE_KIND_TEXT = {
        label: "Shape",
        hint: "The SVG shape that dissolves. Particles rise only from inside the shape's fill and along its stroke, however its corners fall in the box.",
        controls: "Picks the built-in shape drawn into the SVG inside ParticleDissolve",
    };

    export const DURATION_MS_TEXT = {
        label: "Duration (ms)",
        hint: "How long the whole dissolve takes, from the first of the content going to the last particle gone.",
        controls: "Sets ParticleDissolveProps.durationMs",
    };

    export const PARTICLE_LIFETIME_MS_TEXT = {
        label: "Lifetime (ms)",
        hint: "How long one particle lives. It is held below the duration, so a longer lifetime leaves less time for the edge to travel.",
        controls: "Sets ParticleDissolveProps.particleLifetimeMs",
    };

    export const FEATHER_SHARE_TEXT = {
        label: "Feather (0-1)",
        hint: "How gradually the edge fades the content, as a share of the distance the sweep travels. 0 gives a hard edge.",
        controls: "Sets ParticleDissolveProps.featherShare",
    };

    export const SPAWN_CHANCE_TEXT = {
        label: "Spawn chance (0-1)",
        hint: "The chance each particle is released. Lower thins the ash out.",
        controls: "Sets ParticleDissolveProps.spawnChance",
    };

    export const CELL_SIZE_TEXT = {
        label: "Cell size (px)",
        hint: "The side of one square of the grid particles are released from. Smaller squares mean finer ash and more of them.",
        controls: "Sets ParticleDissolveProps.cellSize",
    };
}
