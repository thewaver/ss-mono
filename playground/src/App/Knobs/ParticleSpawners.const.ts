import type {
    IterationPattern,
    ParticleTravelKnobs,
    ParticleTravelPattern,
    TravelEasingKey,
} from "../Pages/ParticleSpawnerPage/ParticleSpawnerPage.types";

const FIELD_WIDTH_KNOB_STEP = 5;

export namespace ParticleSpawnerKnobs {
    export const MIN_PARTICLE_COUNT = 1;
    export const MAX_PARTICLE_COUNT = 240;
    export const PARTICLE_COUNT_STEP = 1;
    export const STARTING_PARTICLE_COUNT = 48;

    export const MIN_TRAVEL_DURATION_MS = 200;
    export const MAX_TRAVEL_DURATION_MS = 4000;
    export const TRAVEL_DURATION_STEP_MS = 100;

    export const STARTING_TRAVEL_PATTERN_KEY: ParticleTravelPattern = "arc";
    export const STARTING_ITERATION_PATTERN_KEY: IterationPattern = "continuous";

    export const MIN_SPAWN_DELAY_MS = 0;
    export const MAX_SPAWN_DELAY_MS = 1000;
    export const SPAWN_DELAY_STEP_MS = 10;
    export const STARTING_SPAWN_DELAY_MS = 50;

    export const MIN_RETENTION_MS = 0;
    export const MAX_RETENTION_MS = 2000;
    export const RETENTION_STEP_MS = 50;

    export const MIN_OVERSHOOT_PERCENT = 0;
    export const MAX_OVERSHOOT_PERCENT = 100;
    export const OVERSHOOT_PERCENT_STEP = 5;
    export const STARTING_OVERSHOOT_PERCENT = 0;

    export const STARTING_TRAVEL_EASING_KEY: TravelEasingKey = "linear";

    export const STARTING_ARE_TARGETS_HIDDEN = false;

    export const TRAVEL_KNOBS_BY_PATTERN: Record<ParticleTravelPattern, ParticleTravelKnobs> = {
        line: {},
        arc: {
            arcHeightMinPx: {
                kind: "number",
                label: "Arc height min (px)",
                hint: "The shallowest bow a particle's path may be given. Each particle draws its own between this and the maximum.",
                min: -300,
                max: 300,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            arcHeightMaxPx: {
                kind: "number",
                label: "Arc height max (px)",
                hint: "The deepest bow a particle's path may be given. Each particle draws its own between the minimum and this.",
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
                min: 0,
                max: 150,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            waveAmplitudeMaxPx: {
                kind: "number",
                label: "Wave amplitude max (px)",
                hint: "The largest swing to each side a particle may be given. Each draws its own between the minimum and this.",
                min: 0,
                max: 150,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            waveCyclesMin: {
                kind: "number",
                label: "Wave cycles min",
                hint: "The fewest complete waves a particle may make along its path. Each draws its own between this and the maximum.",
                min: 0.5,
                max: 6,
                step: 0.5,
            },
            waveCyclesMax: {
                kind: "number",
                label: "Wave cycles max",
                hint: "The most complete waves a particle may make along its path. Each draws its own between the minimum and this.",
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
                min: 0,
                max: 150,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            spiralRadiusMaxPx: {
                kind: "number",
                label: "Spiral radius max (px)",
                hint: "The widest spiral a particle may be given. Each draws its own between the minimum and this.",
                min: 0,
                max: 150,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            spiralTurnsMin: {
                kind: "number",
                label: "Spiral turns min",
                hint: "The fewest turns a particle may make on its way along. Each draws its own between this and the maximum.",
                min: 0.5,
                max: 6,
                step: 0.5,
            },
            spiralTurnsMax: {
                kind: "number",
                label: "Spiral turns max",
                hint: "The most turns a particle may make on its way along. Each draws its own between the minimum and this.",
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
                min: 0,
                max: 150,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            orbitRadiusMaxPx: {
                kind: "number",
                label: "Orbit radius max (px)",
                hint: "The largest circle a particle may be sent round. Each draws its own between the minimum and this.",
                min: 0,
                max: 150,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            orbitTurnsMin: {
                kind: "number",
                label: "Orbit turns min",
                hint: "The fewest times a particle may go round. Each draws its own between this and the maximum.",
                min: 0.5,
                max: 6,
                step: 0.5,
            },
            orbitTurnsMax: {
                kind: "number",
                label: "Orbit turns max",
                hint: "The most times a particle may go round. Each draws its own between the minimum and this.",
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
                min: 0,
                max: 1,
                step: 0.05,
            },
            bezierElbowAlongMax: {
                kind: "number",
                label: "Elbow position max",
                hint: "The latest point along the path a particle's bend may sit. Each draws its own between the minimum and this.",
                min: 0,
                max: 1,
                step: 0.05,
            },
            bezierElbowOffsetMinPx: {
                kind: "number",
                label: "Elbow offset min (px)",
                hint: "The least a particle's bend may be pushed off the straight line. Each draws its own between this and the maximum.",
                min: -200,
                max: 200,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            bezierElbowOffsetMaxPx: {
                kind: "number",
                label: "Elbow offset max (px)",
                hint: "The most a particle's bend may be pushed off the straight line. Each draws its own between the minimum and this.",
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
                min: 1,
                max: 10,
                step: 1,
            },
            zigzagCountMax: {
                kind: "number",
                label: "Zigzag count max",
                hint: "The most turns a particle's zigzag may have. Each draws its own between the minimum and this.",
                min: 1,
                max: 10,
                step: 1,
            },
            zigzagAmplitudeMinPx: {
                kind: "number",
                label: "Zigzag amplitude min (px)",
                hint: "The shallowest a particle's zigzag may be. Each draws its own between this and the maximum.",
                min: 0,
                max: 100,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            zigzagAmplitudeMaxPx: {
                kind: "number",
                label: "Zigzag amplitude max (px)",
                hint: "The deepest a particle's zigzag may be. Each draws its own between the minimum and this.",
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
                min: 0,
                max: 200,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            scatterRadiusMaxPx: {
                kind: "number",
                label: "Scatter radius max (px)",
                hint: "The longest distance a particle may be thrown before it turns for its target. Each draws its own between the minimum and this.",
                min: 0,
                max: 200,
                step: FIELD_WIDTH_KNOB_STEP,
            },
            scatterTurnShareMin: {
                kind: "number",
                label: "Turn point min",
                hint: "The earliest point of the trip at which a particle may stop flying outwards and head for its target. Each draws its own between this and the maximum.",
                min: 0.05,
                max: 0.9,
                step: 0.05,
            },
            scatterTurnShareMax: {
                kind: "number",
                label: "Turn point max",
                hint: "The latest point of the trip at which a particle may stop flying outwards and head for its target. Each draws its own between the minimum and this.",
                min: 0.05,
                max: 0.9,
                step: 0.05,
            },
        },
    };

    export const TRAVEL_DEFAULTS_BY_PATTERN: Record<ParticleTravelPattern, Record<string, number>> = {
        line: {},
        arc: { arcHeightMinPx: -60, arcHeightMaxPx: 60 },
        wave: { waveAmplitudeMinPx: 20, waveAmplitudeMaxPx: 60, waveCyclesMin: 2, waveCyclesMax: 2 },
        spiral: { spiralRadiusMinPx: 20, spiralRadiusMaxPx: 50, spiralTurnsMin: 2, spiralTurnsMax: 3 },
        orbit: { orbitRadiusMinPx: 40, orbitRadiusMaxPx: 70, orbitTurnsMin: 1, orbitTurnsMax: 2 },
        bezier: {
            bezierElbowAlongMin: 0.2,
            bezierElbowAlongMax: 0.4,
            bezierElbowOffsetMinPx: -70,
            bezierElbowOffsetMaxPx: 70,
        },
        zigzag: { zigzagCountMin: 3, zigzagCountMax: 4, zigzagAmplitudeMinPx: 20, zigzagAmplitudeMaxPx: 35 },
        scatter: {
            scatterRadiusMinPx: 40,
            scatterRadiusMaxPx: 90,
            scatterTurnShareMin: 0.2,
            scatterTurnShareMax: 0.35,
        },
    };
}
