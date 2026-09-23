import { EasingUtils, Point2d, Point2dUtils } from "@thewaver/ss-utils";
import type { EasingFn } from "@thewaver/ss-utils";

import type {
    IterationPattern,
    IterationPatternFn,
    ParticleTravelKnobs,
    ParticleTravelPattern,
    ParticleTravelPatternFactory,
    TravelEasingKey,
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

export const MIN_OVERSHOOT_PERCENT = 0;
export const MAX_OVERSHOOT_PERCENT = 100;
export const OVERSHOOT_PERCENT_STEP = 5;
export const STARTING_OVERSHOOT_PERCENT = 0;

export const STARTING_TRAVEL_EASING_KEY: TravelEasingKey = "linear";

export const TRAVEL_EASING_FNS: Record<TravelEasingKey, EasingFn> = {
    linear: EasingUtils.linear,
    ease: EasingUtils.ease,
    easeIn: EasingUtils.easeIn,
    easeOut: EasingUtils.easeOut,
    easeInOut: EasingUtils.easeInOut,
    easeInQuad: EasingUtils.easeInQuad,
    easeOutQuad: EasingUtils.easeOutQuad,
    easeInOutQuad: EasingUtils.easeInOutQuad,
    easeInCubic: EasingUtils.easeInCubic,
    easeOutCubic: EasingUtils.easeOutCubic,
    easeInOutCubic: EasingUtils.easeInOutCubic,
    easeInQuart: EasingUtils.easeInQuart,
    easeOutQuart: EasingUtils.easeOutQuart,
    easeInOutQuart: EasingUtils.easeInOutQuart,
    easeInQuint: EasingUtils.easeInQuint,
    easeOutQuint: EasingUtils.easeOutQuint,
    easeInOutQuint: EasingUtils.easeInOutQuint,
    easeInSine: EasingUtils.easeInSine,
    easeOutSine: EasingUtils.easeOutSine,
    easeInOutSine: EasingUtils.easeInOutSine,
    easeInExpo: EasingUtils.easeInExpo,
    easeOutExpo: EasingUtils.easeOutExpo,
    easeInOutExpo: EasingUtils.easeInOutExpo,
    easeInCirc: EasingUtils.easeInCirc,
    easeOutCirc: EasingUtils.easeOutCirc,
    easeInOutCirc: EasingUtils.easeInOutCirc,
    easeInBack: EasingUtils.easeInBack,
    easeOutBack: EasingUtils.easeOutBack,
    easeInOutBack: EasingUtils.easeInOutBack,
    easeInElastic: EasingUtils.easeInElastic,
    easeOutElastic: EasingUtils.easeOutElastic,
    easeInOutElastic: EasingUtils.easeInOutElastic,
    easeOutBounce: EasingUtils.easeOutBounce,
    easeInBounce: EasingUtils.easeInBounce,
    easeInOutBounce: EasingUtils.easeInOutBounce,
};

export const TRAVEL_EASING_KEYS = Object.keys(TRAVEL_EASING_FNS) as TravelEasingKey[];

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

const OVERSHOOT_WINDOW_START_T = 0.85;
const OVERSHOOT_MAX_STRENGTH = 6;

export const applyOvershoot = (rawT: number, valueT: number, overshootPercent: number): number => {
    if (overshootPercent <= 0 || rawT <= OVERSHOOT_WINDOW_START_T) return valueT;

    const windowSpan = 1 - OVERSHOOT_WINDOW_START_T;
    const localT = (rawT - OVERSHOOT_WINDOW_START_T) / windowSpan;
    const strength = (overshootPercent / 100) * OVERSHOOT_MAX_STRENGTH;
    const bump = strength * localT * localT * (1 - localT);

    return valueT + windowSpan * bump;
};

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
        const perpendicular = Point2dUtils.getPerpendicular(Point2dUtils.getNormal(Point2d.sub(defs.to, defs.from)));
        const bulge = -Math.sin(t * Math.PI) * getHeight(defs.id);

        return Point2d.add(pos, Point2d.mul(perpendicular, { x: bulge, y: bulge }));
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

const ORBIT_APPROACH_END_T = 0.35;
const ORBIT_HOLD_END_T = 0.75;

const smoothstep = (edgeStart: number, edgeEnd: number, x: number) => {
    const eased = Math.min(1, Math.max(0, (x - edgeStart) / (edgeEnd - edgeStart)));

    return eased * eased * (3 - 2 * eased);
};

const spinOffset = (normal: Point2d, perpendicular: Point2d, angle: number, radius: number): Point2d => {
    const along = Math.cos(angle) * radius;
    const across = Math.sin(angle) * radius;

    return Point2d.add(
        Point2d.mul(normal, { x: along, y: along }),
        Point2d.mul(perpendicular, { x: across, y: across }),
    );
};

const spiral: ParticleTravelPatternFactory = (knobs) => {
    const radiusById = new Map<number, number>();
    const turnsById = new Map<number, number>();

    const getRadius = (id: number) => {
        const cached = radiusById.get(id);

        if (cached !== undefined) return cached;

        const radius = randomBetween(knobs.spiralRadiusMinPx, knobs.spiralRadiusMaxPx);

        radiusById.set(id, radius);

        return radius;
    };

    const getTurns = (id: number) => {
        const cached = turnsById.get(id);

        if (cached !== undefined) return cached;

        const turns = randomBetween(knobs.spiralTurnsMin, knobs.spiralTurnsMax);

        turnsById.set(id, turns);

        return turns;
    };

    return (defs, t) => {
        if (defs.prefersReducedMotion) return defs.to;

        const pos = lerp(defs.from, defs.to, t);
        const normal = Point2dUtils.getNormal(Point2d.sub(defs.to, defs.from));
        const perpendicular = Point2dUtils.getPerpendicular(normal);
        const angle = t * getTurns(defs.id) * Math.PI * 2;
        const radius = Math.sin(t * Math.PI) * getRadius(defs.id);

        return Point2d.add(pos, spinOffset(normal, perpendicular, angle, radius));
    };
};

const orbit: ParticleTravelPatternFactory = (knobs) => {
    const radiusById = new Map<number, number>();
    const turnsById = new Map<number, number>();

    const getRadius = (id: number) => {
        const cached = radiusById.get(id);

        if (cached !== undefined) return cached;

        const radius = randomBetween(knobs.orbitRadiusMinPx, knobs.orbitRadiusMaxPx);

        radiusById.set(id, radius);

        return radius;
    };

    const getTurns = (id: number) => {
        const cached = turnsById.get(id);

        if (cached !== undefined) return cached;

        const turns = randomBetween(knobs.orbitTurnsMin, knobs.orbitTurnsMax);

        turnsById.set(id, turns);

        return turns;
    };

    return (defs, t) => {
        if (defs.prefersReducedMotion) return defs.to;

        const normal = Point2dUtils.getNormal(Point2d.sub(defs.to, defs.from));
        const perpendicular = Point2dUtils.getPerpendicular(normal);
        const angle = t * getTurns(defs.id) * Math.PI * 2;
        const radius = (1 - smoothstep(ORBIT_HOLD_END_T, 1, t)) * getRadius(defs.id);
        const orbitPoint = Point2d.add(defs.to, spinOffset(normal, perpendicular, angle, radius));

        const approachT = Math.min(1, t / ORBIT_APPROACH_END_T);

        return lerp(defs.from, orbitPoint, approachT);
    };
};

const bezier: ParticleTravelPatternFactory = (knobs) => {
    const alongFracById = new Map<number, number>();
    const offsetById = new Map<number, number>();

    const getAlongFrac = (id: number) => {
        const cached = alongFracById.get(id);

        if (cached !== undefined) return cached;

        const alongFrac = randomBetween(knobs.bezierElbowAlongMin, knobs.bezierElbowAlongMax);

        alongFracById.set(id, alongFrac);

        return alongFrac;
    };

    const getOffset = (id: number) => {
        const cached = offsetById.get(id);

        if (cached !== undefined) return cached;

        const offset = randomBetween(knobs.bezierElbowOffsetMinPx, knobs.bezierElbowOffsetMaxPx);

        offsetById.set(id, offset);

        return offset;
    };

    return (defs, t) => {
        if (defs.prefersReducedMotion) return defs.to;

        const perpendicular = Point2dUtils.getPerpendicular(Point2dUtils.getNormal(Point2d.sub(defs.to, defs.from)));
        const offset = getOffset(defs.id);
        const elbow = Point2d.add(
            lerp(defs.from, defs.to, getAlongFrac(defs.id)),
            Point2d.mul(perpendicular, { x: offset, y: offset }),
        );

        const inverseT = 1 - t;
        const fromWeight = inverseT * inverseT;
        const elbowWeight = 2 * inverseT * t;
        const toWeight = t * t;

        return {
            x: fromWeight * defs.from.x + elbowWeight * elbow.x + toWeight * defs.to.x,
            y: fromWeight * defs.from.y + elbowWeight * elbow.y + toWeight * defs.to.y,
        };
    };
};

const zigzag: ParticleTravelPatternFactory = (knobs) => {
    const countById = new Map<number, number>();
    const amplitudeById = new Map<number, number>();

    const getCount = (id: number) => {
        const cached = countById.get(id);

        if (cached !== undefined) return cached;

        const count = Math.round(randomBetween(knobs.zigzagCountMin, knobs.zigzagCountMax));

        countById.set(id, count);

        return count;
    };

    const getAmplitude = (id: number) => {
        const cached = amplitudeById.get(id);

        if (cached !== undefined) return cached;

        const amplitude = randomBetween(knobs.zigzagAmplitudeMinPx, knobs.zigzagAmplitudeMaxPx);

        amplitudeById.set(id, amplitude);

        return amplitude;
    };

    return (defs, t) => {
        if (defs.prefersReducedMotion) return defs.to;

        const perpendicular = Point2dUtils.getPerpendicular(Point2dUtils.getNormal(Point2d.sub(defs.to, defs.from)));
        const amplitude = getAmplitude(defs.id);
        const segments = getCount(defs.id) + 1;

        const cornerAt = (index: number): Point2d => {
            if (index <= 0) return defs.from;
            if (index >= segments) return defs.to;

            const side = index % 2 === 0 ? 1 : -1;
            const base = lerp(defs.from, defs.to, index / segments);
            const sideOffset = side * amplitude;

            return Point2d.add(base, Point2d.mul(perpendicular, { x: sideOffset, y: sideOffset }));
        };

        const scaledT = t * segments;
        const segmentIndex = Math.min(segments - 1, Math.floor(scaledT));

        return lerp(cornerAt(segmentIndex), cornerAt(segmentIndex + 1), scaledT - segmentIndex);
    };
};

const scatter: ParticleTravelPatternFactory = (knobs) => {
    const angleById = new Map<number, number>();
    const radiusById = new Map<number, number>();
    const turnShareById = new Map<number, number>();

    const getAngle = (id: number) => {
        const cached = angleById.get(id);

        if (cached !== undefined) return cached;

        const angle = randomBetween(0, Math.PI * 2);

        angleById.set(id, angle);

        return angle;
    };

    const getRadius = (id: number) => {
        const cached = radiusById.get(id);

        if (cached !== undefined) return cached;

        const radius = randomBetween(knobs.scatterRadiusMinPx, knobs.scatterRadiusMaxPx);

        radiusById.set(id, radius);

        return radius;
    };

    const getTurnShare = (id: number) => {
        const cached = turnShareById.get(id);

        if (cached !== undefined) return cached;

        const turnShare = randomBetween(knobs.scatterTurnShareMin, knobs.scatterTurnShareMax);

        turnShareById.set(id, turnShare);

        return turnShare;
    };

    return (defs, t) => {
        if (defs.prefersReducedMotion) return defs.to;

        const angle = getAngle(defs.id);
        const radius = getRadius(defs.id);
        const turnShare = getTurnShare(defs.id);
        const peak = Point2d.add(defs.from, { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });

        if (t <= turnShare) return lerp(defs.from, peak, EasingUtils.easeOutQuad(t / turnShare));

        return lerp(peak, defs.to, (t - turnShare) / (1 - turnShare));
    };
};

export const TRAVEL_PATTERN_FACTORIES: Record<ParticleTravelPattern, ParticleTravelPatternFactory> = {
    line,
    arc,
    wave,
    spiral,
    orbit,
    bezier,
    zigzag,
    scatter,
};

export const TRAVEL_PATTERN_KEYS = Object.keys(TRAVEL_PATTERN_FACTORIES) as ParticleTravelPattern[];

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
    scatter: { scatterRadiusMinPx: 40, scatterRadiusMaxPx: 90, scatterTurnShareMin: 0.2, scatterTurnShareMax: 0.35 },
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
