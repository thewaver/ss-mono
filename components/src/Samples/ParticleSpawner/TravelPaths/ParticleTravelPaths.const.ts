import { EasingUtils, Point2d, Point2dUtils } from "@thewaver/ss-utils";

import type { ParticleTravelPathFactory, ParticleTravelPathType } from "./ParticleTravelPaths.types";

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

const lerp = (from: Point2d, to: Point2d, t: number): Point2d => ({
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
});

const line: ParticleTravelPathFactory = () => (defs, t) =>
    defs.prefersReducedMotion ? defs.to : lerp(defs.from, defs.to, t);

const arc: ParticleTravelPathFactory = (knobs) => {
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

const wave: ParticleTravelPathFactory = (knobs) => {
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

const spiral: ParticleTravelPathFactory = (knobs) => {
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

const orbit: ParticleTravelPathFactory = (knobs) => {
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

const bezier: ParticleTravelPathFactory = (knobs) => {
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

const zigzag: ParticleTravelPathFactory = (knobs) => {
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

const scatter: ParticleTravelPathFactory = (knobs) => {
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

export namespace ParticleTravelPaths {
    export const SAMPLE_PATHS: Record<ParticleTravelPathType, ParticleTravelPathFactory> = {
        line,
        arc,
        wave,
        spiral,
        orbit,
        bezier,
        zigzag,
        scatter,
    };

    export const PATH_TYPES = Object.keys(SAMPLE_PATHS) as ParticleTravelPathType[];

    export const DEFAULT_OPTS: Record<ParticleTravelPathType, Record<string, number>> = {
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
