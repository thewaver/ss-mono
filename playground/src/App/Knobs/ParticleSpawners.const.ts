import {
    type ParticleIterationPatternType,
    ParticleModifierDefaults,
    type ParticleTravelEasingType,
    type ParticleTravelPathType,
} from "@thewaver/ss-components";

import type { ParticleTravelKnobs } from "../Pages/ParticleSpawnerPage/ParticleSpawnerPatterns.types";

const FIELD_WIDTH_KNOB_STEP = 5;

export namespace ParticleSpawnerKnobs {
    export const MIN_PARTICLE_COUNT = 1;
    export const MAX_PARTICLE_COUNT = 240;
    export const PARTICLE_COUNT_STEP = 1;
    export const STARTING_PARTICLE_COUNT = 48;

    export const MIN_TRAVEL_DURATION_MS = 200;
    export const MAX_TRAVEL_DURATION_MS = 4000;
    export const TRAVEL_DURATION_STEP_MS = 100;

    export const STARTING_TRAVEL_PATTERN_KEY: ParticleTravelPathType = "scatter";
    export const STARTING_ITERATION_PATTERN_KEY: ParticleIterationPatternType = "continuous";

    export const MIN_SPAWN_DELAY_MS = 0;
    export const MAX_SPAWN_DELAY_MS = 1000;
    export const SPAWN_DELAY_STEP_MS = 10;
    export const STARTING_SPAWN_DELAY_MS = 10;

    export const MIN_RETENTION_MS = 0;
    export const MAX_RETENTION_MS = 2000;
    export const RETENTION_STEP_MS = 50;

    export const MIN_OVERSHOOT_PERCENT = 0;
    export const MAX_OVERSHOOT_PERCENT = 100;
    export const OVERSHOOT_PERCENT_STEP = 5;
    export const STARTING_OVERSHOOT_PERCENT = 0;

    export const STARTING_TRAVEL_EASING_KEY: ParticleTravelEasingType = "linear";

    export const STARTING_ARE_TARGETS_HIDDEN = false;

    export const MIN_WIND_DIRECTION_DEGREES = 0;
    export const MAX_WIND_DIRECTION_DEGREES = 345;
    export const WIND_DIRECTION_STEP_DEGREES = 15;
    export const STARTING_WIND_DIRECTION_DEGREES = ParticleModifierDefaults.WIND_DEFAULTS.directionDegrees;

    export const MIN_WIND_STRENGTH_PIXELS = 0;
    export const MAX_WIND_STRENGTH_PIXELS = 150;
    export const WIND_STRENGTH_STEP_PIXELS = 5;
    export const STARTING_WIND_STRENGTH_PIXELS = ParticleModifierDefaults.WIND_DEFAULTS.strengthPixels;

    export const MIN_WIND_GUST_RATIO = 0;
    export const MAX_WIND_GUST_RATIO = 1;
    export const WIND_GUST_RATIO_STEP = 0.05;
    export const STARTING_WIND_GUST_RATIO = ParticleModifierDefaults.WIND_DEFAULTS.gustRatio;

    export const MIN_ATTRACTION_STRENGTH_RATIO = 0;
    export const MAX_ATTRACTION_STRENGTH_RATIO = 1;
    export const ATTRACTION_STRENGTH_RATIO_STEP = 0.05;
    export const STARTING_ATTRACTION_STRENGTH_RATIO = ParticleModifierDefaults.ATTRACTION_DEFAULTS.strengthRatio;

    export const MIN_ATTRACTION_REACH_PIXELS = 0;
    export const MAX_ATTRACTION_REACH_PIXELS = 300;
    export const ATTRACTION_REACH_STEP_PIXELS = 10;
    export const STARTING_ATTRACTION_REACH_PIXELS = ParticleModifierDefaults.ATTRACTION_DEFAULTS.reachPixels;

    export const TRAVEL_KNOBS_BY_PATTERN: Record<ParticleTravelPathType, ParticleTravelKnobs> = {
        line: {},
        arc: {
            arcHeightMinPx: {
                kind: "number",
                label: "Arc height min (px)",
                hint: "The shallowest bow a particle's path may be given. Each particle draws its own between this and the maximum.",
                controls:
                    "Sets the lowest arc height of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: -300,
                max: 300,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            arcHeightMaxPx: {
                kind: "number",
                label: "Arc height max (px)",
                hint: "The deepest bow a particle's path may be given. Each particle draws its own between the minimum and this.",
                controls:
                    "Sets the highest arc height of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: -300,
                max: 300,
                step: FIELD_WIDTH_KNOB_STEP,
            },
        },
        wave: {
            waveAmplitudeMinPx: {
                kind: "number",
                label: "Wave amplitude min (px)",
                hint: "The smallest swing to each side a particle may be given. Each draws its own between this and the maximum.",
                controls:
                    "Sets the lowest wave amplitude of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0,
                max: 150,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            waveAmplitudeMaxPx: {
                kind: "number",
                label: "Wave amplitude max (px)",
                hint: "The largest swing to each side a particle may be given. Each draws its own between the minimum and this.",
                controls:
                    "Sets the highest wave amplitude of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0,
                max: 150,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            waveCyclesMin: {
                kind: "number",
                label: "Wave cycles min",
                hint: "The fewest complete waves a particle may make along its path. Each draws its own between this and the maximum.",
                controls:
                    "Sets the lowest wave cycles of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0.5,
                max: 6,
                step: 0.5,
            },
            waveCyclesMax: {
                kind: "number",
                label: "Wave cycles max",
                hint: "The most complete waves a particle may make along its path. Each draws its own between the minimum and this.",
                controls:
                    "Sets the highest wave cycles of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0.5,
                max: 6,
                step: 0.5,
            },
        },
        spiral: {
            spiralRadiusMinPx: {
                kind: "number",
                label: "Spiral radius min (px)",
                hint: "The tightest spiral a particle may be given. Each draws its own between this and the maximum.",
                controls:
                    "Sets the lowest spiral radius of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0,
                max: 150,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            spiralRadiusMaxPx: {
                kind: "number",
                label: "Spiral radius max (px)",
                hint: "The widest spiral a particle may be given. Each draws its own between the minimum and this.",
                controls:
                    "Sets the highest spiral radius of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0,
                max: 150,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            spiralTurnsMin: {
                kind: "number",
                label: "Spiral turns min",
                hint: "The fewest turns a particle may make on its way along. Each draws its own between this and the maximum.",
                controls:
                    "Sets the lowest spiral turns of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0.5,
                max: 6,
                step: 0.5,
            },
            spiralTurnsMax: {
                kind: "number",
                label: "Spiral turns max",
                hint: "The most turns a particle may make on its way along. Each draws its own between the minimum and this.",
                controls:
                    "Sets the highest spiral turns of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0.5,
                max: 6,
                step: 0.5,
            },
        },
        orbit: {
            orbitRadiusMinPx: {
                kind: "number",
                label: "Orbit radius min (px)",
                hint: "The smallest circle a particle may be sent round. Each draws its own between this and the maximum.",
                controls:
                    "Sets the lowest orbit radius of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0,
                max: 150,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            orbitRadiusMaxPx: {
                kind: "number",
                label: "Orbit radius max (px)",
                hint: "The largest circle a particle may be sent round. Each draws its own between the minimum and this.",
                controls:
                    "Sets the highest orbit radius of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0,
                max: 150,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            orbitTurnsMin: {
                kind: "number",
                label: "Orbit turns min",
                hint: "The fewest times a particle may go round. Each draws its own between this and the maximum.",
                controls:
                    "Sets the lowest orbit turns of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0.5,
                max: 6,
                step: 0.5,
            },
            orbitTurnsMax: {
                kind: "number",
                label: "Orbit turns max",
                hint: "The most times a particle may go round. Each draws its own between the minimum and this.",
                controls:
                    "Sets the highest orbit turns of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0.5,
                max: 6,
                step: 0.5,
            },
        },
        bezier: {
            bezierElbowAlongMin: {
                kind: "number",
                label: "Elbow position min",
                hint: "The earliest point along the path a particle's bend may sit. Each draws its own between this and the maximum.",
                controls:
                    "Sets the lowest elbow position of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0,
                max: 1,
                step: 0.05,
            },
            bezierElbowAlongMax: {
                kind: "number",
                label: "Elbow position max",
                hint: "The latest point along the path a particle's bend may sit. Each draws its own between the minimum and this.",
                controls:
                    "Sets the highest elbow position of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0,
                max: 1,
                step: 0.05,
            },
            bezierElbowOffsetMinPx: {
                kind: "number",
                label: "Elbow offset min (px)",
                hint: "The least a particle's bend may be pushed off the straight line. Each draws its own between this and the maximum.",
                controls:
                    "Sets the lowest elbow offset of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: -200,
                max: 200,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            bezierElbowOffsetMaxPx: {
                kind: "number",
                label: "Elbow offset max (px)",
                hint: "The most a particle's bend may be pushed off the straight line. Each draws its own between the minimum and this.",
                controls:
                    "Sets the highest elbow offset of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: -200,
                max: 200,
                step: FIELD_WIDTH_KNOB_STEP,
            },
        },
        zigzag: {
            zigzagCountMin: {
                kind: "number",
                label: "Zigzag count min",
                hint: "The fewest turns a particle's zigzag may have. Each draws its own between this and the maximum.",
                controls:
                    "Sets the lowest zigzag count of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 1,
                max: 10,
                step: 1,
            },
            zigzagCountMax: {
                kind: "number",
                label: "Zigzag count max",
                hint: "The most turns a particle's zigzag may have. Each draws its own between the minimum and this.",
                controls:
                    "Sets the highest zigzag count of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 1,
                max: 10,
                step: 1,
            },
            zigzagAmplitudeMinPx: {
                kind: "number",
                label: "Zigzag amplitude min (px)",
                hint: "The shallowest a particle's zigzag may be. Each draws its own between this and the maximum.",
                controls:
                    "Sets the lowest zigzag amplitude of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0,
                max: 100,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            zigzagAmplitudeMaxPx: {
                kind: "number",
                label: "Zigzag amplitude max (px)",
                hint: "The deepest a particle's zigzag may be. Each draws its own between the minimum and this.",
                controls:
                    "Sets the highest zigzag amplitude of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0,
                max: 100,
                step: FIELD_WIDTH_KNOB_STEP,
            },
        },
        scatter: {
            scatterRadiusMinPx: {
                kind: "number",
                label: "Scatter radius min (px)",
                hint: "The shortest distance a particle may be thrown before it turns for its target. Each draws its own between this and the maximum.",
                controls:
                    "Sets the lowest scatter radius of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0,
                max: 200,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            scatterRadiusMaxPx: {
                kind: "number",
                label: "Scatter radius max (px)",
                hint: "The longest distance a particle may be thrown before it turns for its target. Each draws its own between the minimum and this.",
                controls:
                    "Sets the highest scatter radius of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0,
                max: 200,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            scatterTurnShareMin: {
                kind: "number",
                label: "Turn point min",
                hint: "The earliest point of the trip at which a particle may stop flying outwards and head for its target. Each draws its own between this and the maximum.",
                controls:
                    "Sets the lowest turn point of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0.05,
                max: 0.9,
                step: 0.05,
            },
            scatterTurnShareMax: {
                kind: "number",
                label: "Turn point max",
                hint: "The latest point of the trip at which a particle may stop flying outwards and head for its target. Each draws its own between the minimum and this.",
                controls:
                    "Sets the highest turn point of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
                min: 0.05,
                max: 0.9,
                step: 0.05,
            },
        },
    };

    export const WIND_DIRECTION_DEGREES_TEXT = {
        label: "Direction (degrees)",
        hint: "Which way the wind blows, in degrees clockwise from rightward. 90 blows down.",
        controls:
            "Sets directionDegrees of ParticleModifierUtils.createWind, sent to ParticleSpawnerProps.particleModifiers",
    };

    export const WIND_STRENGTH_PIXELS_TEXT = {
        label: "Strength (px)",
        hint: "How far a particle is carried off its path halfway along it, between gusts.",
        controls:
            "Sets strengthPixels of ParticleModifierUtils.createWind, sent to ParticleSpawnerProps.particleModifiers",
    };

    export const WIND_GUST_RATIO_TEXT = {
        label: "Gusts",
        hint: "How much the strength swings above and below itself over time. 0 is a steady wind.",
        controls: "Sets gustRatio of ParticleModifierUtils.createWind, sent to ParticleSpawnerProps.particleModifiers",
    };

    export const ATTRACTION_STRENGTH_RATIO_TEXT = {
        label: "Strength",
        hint: "How much of the way to the ring a particle passing right by it is drawn.",
        controls:
            "Sets strengthRatio of ParticleModifierUtils.createAttraction, sent to ParticleSpawnerProps.particleModifiers",
    };

    export const ATTRACTION_REACH_PIXELS_TEXT = {
        label: "Reach (px)",
        hint: "How far from the ring the pull is felt at all. Particles passing farther away are left alone.",
        controls:
            "Sets reachPixels of ParticleModifierUtils.createAttraction, sent to ParticleSpawnerProps.particleModifiers",
    };

    export const ON_GRAPHICS_CARD_TEXT = {
        label: "On the graphics card",
        hint: "Draws each spawner's particles in one canvas that follows them, with their positions worked out as before. Off, every particle is an element of its own.",
        controls: "Sets ParticleSpawnerProps.renderer in the stress test",
    };

    export const TRAVEL_PATTERN_TEXT = {
        label: "Travel pattern",
        hint: "The path a particle takes from where it starts to where it ends. Choosing one brings its own knobs with it.",
        controls: "Picks the example's travel path function sent to ParticleSpawnerProps.computeParticlePos",
    };

    export const PARTICLE_COUNT_TEXT = {
        label: "Particle count",
        hint: "How many particles are sent on each round.",
        controls: "Sets ParticleSpawnerProps.particleCount",
    };

    export const TRAVEL_DURATION_MS_TEXT = {
        label: "Travel (ms)",
        hint: "How long one particle takes to walk its path.",
        controls: "Sets ParticleSpawnerProps.travelDurationMs",
    };

    export const REST_DURATION_MS_TEXT = {
        label: "Rest duration (ms)",
        hint: "How long a particle stays put at the end of its path before it disappears.",
        controls: "Sets ParticleSpawnerProps.restDurationMs",
    };

    export const SPAWN_DELAY_MS_TEXT = {
        label: "Spawn delay (ms)",
        hint: "How long each particle waits after the one before it sets off, which is what staggers them.",
        controls: "Sets ParticleSpawnerProps.spawnDelayMs",
    };

    export const ITERATION_PATTERN_TEXT = {
        label: "Iteration pattern",
        hint: "How the rounds follow each other: in bursts of three with a pause, one at a time with a pause, or without any pause at all.",
        controls: "Picks the example's list of rounds sent to ParticleSpawnerProps.spawnIterationPatterns",
    };

    export const OVERSHOOT_PERCENT_TEXT = {
        label: "Overshoot (%)",
        hint: "How far a particle runs past its destination before coming back to it. 0 stops it dead on target.",
        controls:
            "Sets how far the example's travel path runs past its end, sent to ParticleSpawnerProps.computeParticlePos",
    };

    export const TRAVEL_EASING_TEXT = {
        label: "Travel easing",
        hint: "The speed curve a particle follows along its path.",
        controls: "Picks the speed curve of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos",
    };
}
