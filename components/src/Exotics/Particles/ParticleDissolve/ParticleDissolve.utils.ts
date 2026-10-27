import { type Index2d, MathUtils, type Point2d, type Size2d } from "@thewaver/ss-utils";

import type { ParticleDissolveSweep } from "./ParticleDissolve.types";

const MAX_LIFETIME_SHARE = 0.9;
const MAX_CELLS_PER_AXIS = 80;
const MAX_PARTICLES_PER_CELL = 8;
const REDUCED_MOTION_DURATION_MS = 200;
const COMPLETION_BACKSTOP_MS = 100;
const DEGREES_TO_RADIANS = Math.PI / 180;
const MASK_PRECISION = 3;

const roundForStyle = (value: number) => Number(value.toFixed(MASK_PRECISION));

const getCorners = (size: Size2d): Point2d[] => [
    { x: 0, y: 0 },
    { x: size.width, y: 0 },
    { x: 0, y: size.height },
    { x: size.width, y: size.height },
];

const computeFarthestCornerDistance = (origin: Point2d, size: Size2d) =>
    Math.max(...getCorners(size).map((corner) => Math.hypot(corner.x - origin.x, corner.y - origin.y)));

const computeRamp = (edge: number, featherShare: number) => ({
    from: edge * (1 + featherShare) - featherShare,
    to: edge * (1 + featherShare),
});

/**
 * The arithmetic behind a dissolve: how far along its sweep each point of the content is, where the fading edge has
 * got to, the mask that draws it, and the clock that carries the dissolve from one end to the other.
 *
 * The same position drives the mask and the particles, so a particle is released as the edge reaches the spot it
 * comes from.
 */
export namespace ParticleDissolveUtils {
    /**
     * The sweep the props describe.
     *
     * @param angleDegrees The direction of a straight sweep, in degrees as CSS writes a gradient's.
     * @param originShare Where an outward sweep starts, as a share of the size. When present it wins.
     * @param size The content's size.
     * @returns A radial sweep from the origin in pixels when there is one, and a linear sweep otherwise.
     */
    export const computeSweep = (
        angleDegrees: number,
        originShare: Point2d | undefined,
        size: Size2d,
    ): ParticleDissolveSweep =>
        originShare
            ? { kind: "radial", origin: { x: originShare.x * size.width, y: originShare.y * size.height } }
            : { kind: "linear", angleDegrees };

    /**
     * How far along the sweep a point is: `0` where it starts and `1` where it ends.
     *
     * A linear sweep runs from the corner of the box that comes first along the direction to the one that comes last,
     * which is the length of the gradient line CSS draws, so the position agrees with the mask. A radial sweep runs
     * from the origin to the farthest corner.
     *
     * @param point The point, in the content's coordinates.
     * @param size The content's size.
     * @param sweep From {@link computeSweep}.
     * @returns A position from `0` to `1`. A box with no extent along the sweep answers `0`.
     */
    export const computeSweepPosition = (point: Point2d, size: Size2d, sweep: ParticleDissolveSweep) => {
        if (sweep.kind === "radial") {
            const reach = computeFarthestCornerDistance(sweep.origin, size);

            return reach > 0
                ? MathUtils.clamp01(Math.hypot(point.x - sweep.origin.x, point.y - sweep.origin.y) / reach)
                : 0;
        }

        const radians = sweep.angleDegrees * DEGREES_TO_RADIANS;
        const direction = { x: Math.sin(radians), y: -Math.cos(radians) };
        const projections = getCorners(size).map((corner) => corner.x * direction.x + corner.y * direction.y);
        const first = Math.min(...projections);
        const span = Math.max(...projections) - first;

        return span > 0 ? MathUtils.clamp01((point.x * direction.x + point.y * direction.y - first) / span) : 0;
    };

    /**
     * What share of the duration a particle lives, held below the whole so the edge always has some of the duration
     * to travel in.
     *
     * @param durationMs The dissolve's duration.
     * @param lifetimeMs The lifetime asked for.
     * @returns A share from `0` to `0.9`. A duration of `0` or less answers `0`.
     */
    export const computeLifetimeShare = (durationMs: number, lifetimeMs: number) =>
        durationMs > 0 ? MathUtils.clamp(lifetimeMs / durationMs, 0, MAX_LIFETIME_SHARE) : 0;

    /**
     * Where the fading edge is along the sweep.
     *
     * The edge reaches the end of the sweep when the last particle is released, which leaves the particle lifetime for
     * the last of them to fly in.
     *
     * @param progress How far through the dissolve, `0`–`1`.
     * @param lifetimeShare From {@link computeLifetimeShare}.
     * @returns `0` before the edge has started and `1` once it has passed everything.
     */
    export const computeEdge = (progress: number, lifetimeShare: number) =>
        MathUtils.clamp01(progress / (1 - lifetimeShare));

    /**
     * The weight a cell is given so that it is released as the edge reaches it.
     *
     * @param count The grid's size in cells.
     * @param size The content's size.
     * @param sweep From {@link computeSweep}.
     * @returns A weight from `0` to `1` for each cell by row then column, heaviest where the sweep starts, in the form
     * `ParticleField` takes.
     */
    export const computeCellWeights = (count: Index2d, size: Size2d, sweep: ParticleDissolveSweep) => {
        const cellWidth = size.width / count.col;
        const cellHeight = size.height / count.row;

        return Array.from({ length: count.row }, (_, row) =>
            Array.from(
                { length: count.col },
                (_, col) =>
                    1 - computeSweepPosition({ x: (col + 0.5) * cellWidth, y: (row + 0.5) * cellHeight }, size, sweep),
            ),
        );
    };

    /**
     * The mask that hides the content behind the edge.
     *
     * Everything the edge has passed is transparent and everything it has not is opaque, with a soft ramp between.
     * The ramp starts clear of the content at an edge of `0`, so the content is untouched, and finishes clear of it at
     * `1`, so nothing is left.
     *
     * @param edge From {@link computeEdge}.
     * @param featherShare How wide the ramp is, as a share of the sweep.
     * @param sweep From {@link computeSweep}.
     * @param size The content's size.
     * @returns A CSS gradient for `mask-image`, or `undefined` while the edge has not started, when no mask is wanted.
     */
    export const computeMask = (edge: number, featherShare: number, sweep: ParticleDissolveSweep, size: Size2d) => {
        if (edge <= 0) return undefined;

        const ramp = computeRamp(edge, Math.max(featherShare, 0));

        if (sweep.kind === "linear") {
            return `linear-gradient(${sweep.angleDegrees}deg, transparent ${roundForStyle(ramp.from * 100)}%, #000 ${roundForStyle(ramp.to * 100)}%)`;
        }

        const reach = computeFarthestCornerDistance(sweep.origin, size);

        if (reach <= 0) return undefined;

        return `radial-gradient(circle ${roundForStyle(reach)}px at ${roundForStyle(sweep.origin.x)}px ${roundForStyle(sweep.origin.y)}px, transparent ${roundForStyle(ramp.from * reach)}px, #000 ${roundForStyle(ramp.to * reach)}px)`;
    };

    /**
     * The grid particles are released from.
     *
     * @param size The content's size.
     * @param cellSize The side of one square, in pixels.
     * @returns Enough squares to cover the size, at least one and at most 80 across or down, so a very large content
     * still has a grid it can afford.
     */
    export const computeCellCount = (size: Size2d, cellSize: number): Index2d => {
        const side = Math.max(cellSize, 1);

        return {
            col: MathUtils.clamp(Math.ceil(size.width / side), 1, MAX_CELLS_PER_AXIS),
            row: MathUtils.clamp(Math.ceil(size.height / side), 1, MAX_CELLS_PER_AXIS),
        };
    };

    /**
     * How many particles a grid square releases.
     *
     * @param requested The number asked for.
     * @returns A whole number from `1` to `8`.
     */
    export const computeParticlesPerCell = (requested: number) =>
        MathUtils.clamp(Math.round(requested), 1, MAX_PARTICLES_PER_CELL);

    /**
     * How long the dissolve takes for a reader.
     *
     * @param durationMs The duration asked for.
     * @param prefersReducedMotion Whether the reader asked for reduced motion, which swaps the sweep for a short fade.
     * @returns The duration to run for.
     */
    export const computeDurationMs = (durationMs: number, prefersReducedMotion: boolean) =>
        prefersReducedMotion ? Math.min(durationMs, REDUCED_MOTION_DURATION_MS) : durationMs;

    /**
     * How far along a run is.
     *
     * @param from Where the run began.
     * @param to Where it is going.
     * @param elapsedMs How long it has run.
     * @param totalMs How long it takes in all.
     * @returns A value from `from` to `to`, reaching `to` once the time is up. A run with no time is already there.
     */
    export const computeProgress = (from: number, to: number, elapsedMs: number, totalMs: number) =>
        totalMs > 0 ? MathUtils.lerp(from, to, MathUtils.clamp01(elapsedMs / totalMs)) : to;

    /**
     * Carries the progress from one value to another on animation frames, and finishes on a timer too.
     *
     * A page that is not painting stops delivering frames while timers keep running, so whichever arrives first
     * completes the run. Finishing twice is harmless.
     *
     * @param defs.from Where the progress is now.
     * @param defs.to Where it is going: `1` to dissolve and `0` to rebuild.
     * @param defs.durationMs How long a whole trip from `0` to `1` takes. A trip part of the way takes the matching
     * part of it.
     * @param defs.onProgress Called with each new value, and last with `to`.
     * @param defs.onEnd Called once, after the last `onProgress`. Not called when the run is stopped.
     * @returns The function that stops the run.
     */
    export const run = (defs: {
        from: number;
        to: number;
        durationMs: number;
        onProgress: (progress: number) => void;
        onEnd: () => void;
    }) => {
        const totalMs = Math.abs(defs.to - defs.from) * defs.durationMs;
        const startMs = performance.now();

        let isDone = false;
        let frame = 0;
        let timer: ReturnType<typeof setTimeout> | undefined;

        const stop = () => {
            isDone = true;
            cancelAnimationFrame(frame);
            clearTimeout(timer);
        };

        const finish = () => {
            if (isDone) return;

            stop();
            defs.onProgress(defs.to);
            defs.onEnd();
        };

        const tick = (now: number) => {
            if (isDone) return;

            const elapsedMs = now - startMs;

            if (elapsedMs >= totalMs) {
                finish();

                return;
            }

            defs.onProgress(computeProgress(defs.from, defs.to, elapsedMs, totalMs));
            frame = requestAnimationFrame(tick);
        };

        if (totalMs <= 0) {
            finish();

            return stop;
        }

        timer = setTimeout(finish, totalMs + COMPLETION_BACKSTOP_MS);
        frame = requestAnimationFrame(tick);

        return stop;
    };
}
