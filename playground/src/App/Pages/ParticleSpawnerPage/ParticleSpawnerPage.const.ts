import { Point2d, Point2dUtils } from "@thewaver/ss-utils";

import type {
    IterationPattern,
    IterationPatternFn,
    ParticleTravelKnobs,
    ParticleTravelPattern,
    ParticleTravelPatternFactory,
} from "./ParticleSpawnerPage.types";

export const MIN_PARTICLE_COUNT = 1;
export const MAX_PARTICLE_COUNT = 240;
export const PARTICLE_COUNT_STEP = 1;
export const STARTING_PARTICLE_COUNT = 48;

export const MIN_TRAVEL_DURATION_MS = 200;
export const MAX_TRAVEL_DURATION_MS = 4000;
export const TRAVEL_DURATION_STEP_MS = 100;
export const STARTING_TRAVEL_DURATION_MS = 1000;

export const STARTING_TRAVEL_PATTERN_KEY: ParticleTravelPattern = "arc";
export const STARTING_ITERATION_PATTERN_KEY: IterationPattern = "continuous";

export const MIN_SPAWN_DELAY_MS = 0;
export const MAX_SPAWN_DELAY_MS = 1000;
export const SPAWN_DELAY_STEP_MS = 10;
export const STARTING_SPAWN_DELAY_MS = 50;

export const MIN_RETENTION_MS = 0;
export const MAX_RETENTION_MS = 2000;
export const RETENTION_STEP_MS = 50;
export const STARTING_RETENTION_MS = 0;

const FIELD_WIDTH_KNOB_STEP = 5;

const FADE_IN_SHARE = 0.15;
const ARRIVAL_SCALE = 0.5;

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

export const computeParticleGlow = (t: number) => ({
    opacity: t < FADE_IN_SHARE ? t / FADE_IN_SHARE : 1,
    scale: 1 + t * ARRIVAL_SCALE,
});

const lerp = (from: Point2d, to: Point2d, t: number): Point2d => ({
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
});

const line: ParticleTravelPatternFactory = () => (defs, t) =>
    defs.prefersReducedMotion ? defs.to : lerp(defs.from, defs.to, t);

const arc: ParticleTravelPatternFactory = (knobs) => {
    const heightById = new Map<number, number>();

    const getHeight = (id: number) => {
        const cached = heightById.get(id);

        if (cached !== undefined) return cached;

        const height = randomBetween(knobs.arcHeightMinPx, knobs.arcHeightMaxPx);

        heightById.set(id, height);

        return height;
    };

    return (defs, t) => {
        if (defs.prefersReducedMotion) return defs.to;

        const pos = lerp(defs.from, defs.to, t);
        const bulge = Math.sin(t * Math.PI) * getHeight(defs.id);

        return { x: pos.x, y: pos.y - bulge };
    };
};

const wave: ParticleTravelPatternFactory = (knobs) => {
    const amplitudeById = new Map<number, number>();
    const cyclesById = new Map<number, number>();

    const getAmplitude = (id: number) => {
        const cached = amplitudeById.get(id);

        if (cached !== undefined) return cached;

        const amplitude = randomBetween(knobs.waveAmplitudeMinPx, knobs.waveAmplitudeMaxPx);

        amplitudeById.set(id, amplitude);

        return amplitude;
    };

    const getCycles = (id: number) => {
        const cached = cyclesById.get(id);

        if (cached !== undefined) return cached;

        const cycles = randomBetween(knobs.waveCyclesMin, knobs.waveCyclesMax);

        cyclesById.set(id, cycles);

        return cycles;
    };

    return (defs, t) => {
        if (defs.prefersReducedMotion) return defs.to;

        const pos = lerp(defs.from, defs.to, t);
        const perpendicular = Point2dUtils.getPerpendicular(Point2dUtils.getNormal(Point2d.sub(defs.to, defs.from)));
        const offset = Math.sin(t * Math.PI) * Math.sin(t * getCycles(defs.id) * Math.PI * 2) * getAmplitude(defs.id);

        return Point2d.add(pos, Point2d.mul(perpendicular, { x: offset, y: offset }));
    };
};

export const TRAVEL_PATTERN_FACTORIES: Record<ParticleTravelPattern, ParticleTravelPatternFactory> = {
    line,
    arc,
    wave,
};

export const TRAVEL_PATTERN_KEYS = Object.keys(TRAVEL_PATTERN_FACTORIES) as ParticleTravelPattern[];

export const TRAVEL_KNOBS_BY_PATTERN: Record<ParticleTravelPattern, ParticleTravelKnobs> = {
    line: {},
    arc: {
        arcHeightMinPx: {
            kind: "number",
            label: "Arc height min (px)",
            min: -300,
            max: 300,
            step: FIELD_WIDTH_KNOB_STEP,
        },
        arcHeightMaxPx: {
            kind: "number",
            label: "Arc height max (px)",
            min: -300,
            max: 300,
            step: FIELD_WIDTH_KNOB_STEP,
        },
    },
    wave: {
        waveAmplitudeMinPx: {
            kind: "number",
            label: "Wave amplitude min (px)",
            min: 0,
            max: 150,
            step: FIELD_WIDTH_KNOB_STEP,
        },
        waveAmplitudeMaxPx: {
            kind: "number",
            label: "Wave amplitude max (px)",
            min: 0,
            max: 150,
            step: FIELD_WIDTH_KNOB_STEP,
        },
        waveCyclesMin: { kind: "number", label: "Wave cycles min", min: 0.5, max: 6, step: 0.5 },
        waveCyclesMax: { kind: "number", label: "Wave cycles max", min: 0.5, max: 6, step: 0.5 },
    },
};

export const TRAVEL_DEFAULTS_BY_PATTERN: Record<ParticleTravelPattern, Record<string, number>> = {
    line: {},
    arc: { arcHeightMinPx: -60, arcHeightMaxPx: 60 },
    wave: { waveAmplitudeMinPx: 20, waveAmplitudeMaxPx: 60, waveCyclesMin: 2, waveCyclesMax: 2 },
};

const BURST_SHOT_COUNT = 3;
const BURST_PAUSE_MS = 600;
const INTERMITTENT_PAUSE_MS = 500;
const NO_PAUSE_MS = 0;
const SELF = 0;

const burst: IterationPatternFn = () => [{ count: BURST_SHOT_COUNT, beginDelayMs: BURST_PAUSE_MS, nextIndex: SELF }];

const intermittent: IterationPatternFn = () => [{ count: 1, beginDelayMs: INTERMITTENT_PAUSE_MS, nextIndex: SELF }];

const continuous: IterationPatternFn = () => [{ count: 1, beginDelayMs: NO_PAUSE_MS, nextIndex: SELF }];

export const ITERATION_PATTERNS: Record<IterationPattern, IterationPatternFn> = { burst, intermittent, continuous };

export const ITERATION_PATTERN_KEYS = Object.keys(ITERATION_PATTERNS) as IterationPattern[];
