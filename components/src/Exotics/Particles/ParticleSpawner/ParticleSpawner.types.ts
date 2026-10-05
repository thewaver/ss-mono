import type { Point2d, Rect } from "@thewaver/ss-utils";

export type ParticleTravelDefs = {
    id: number;
    index: number;
    targetIndex: number;
    from: Point2d;
    to: Point2d;
    prefersReducedMotion: boolean;
};

export type ParticleSpawnIterationPattern = {
    count: number;
    beginDelayMs?: number;
    nextIndex?: number;
};

export type ParticleSpawnerParticle = {
    /** Unique across every spawner on the page, for as long as the particle lives. */
    id: number;
    /** Its place in its round, from `0`. */
    index: number;
    /** Which target it is aimed at. */
    targetIndex: number;
    /** When it set off, on `performance.now()`'s clock. */
    spawnedAtMs: number;
};

export type ParticleSpawnerTiming = {
    /** How long each particle waits after the one before it sets off. */
    spawnDelayMs: number;
    /** How long one particle takes to walk its path. */
    travelDurationMs: number;
    /** How long a particle stays put at the end of its path. */
    restDurationMs: number;
};

export type ParticleSpawnerFrame = {
    /** The spawner's box, in viewport content coordinates, or `undefined` before it has been measured. */
    rootRect: Rect | undefined;
    /** Each target's box, in the same coordinates. A missing one sends its particles nowhere but the spawner. */
    targetRects: (Rect | undefined)[];
    /** Whether the reader asked for reduced motion, handed on to `computeParticlePos`. */
    prefersReducedMotion: boolean;
};

export type ParticleSpawnerController = {
    /**
     * Sends one round of particles now, from the spawner's own position, alongside anything already playing.
     *
     * The round is staggered by `spawnDelayMs` and aimed through `computeTarget` exactly as a played round is, and
     * each particle reports through `onParticleArrive`. It is not a round of `spawnIterationPatterns`, so it never
     * calls `onIterationEnd` or `onAnimationEnd`, and stopping playback does not take it back.
     *
     * @param count How many particles to send, rounded to a whole number.
     * @returns `false` when nothing was sent: the count rounds to nothing, there are no targets, the spawner has not
     * been measured yet, or the page is hidden.
     */
    emit: (count: number) => boolean;
};
