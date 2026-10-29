import type { CSSAnimationValues, Point2d, Rect } from "@thewaver/ss-utils";

import type { SliceAnimationRenderer } from "../../../Abstracts/SliceAnimation/SliceAnimation.types";

export type ParticleTravelDefs = {
    id: number;
    index: number;
    targetIndex: number;
    from: Point2d;
    to: Point2d;
    prefersReducedMotion: boolean;
};

export type ParticleSpawnerDirectValues = {
    scaleX: number;
    scaleY: number;
    rotate: number;
    opacity: number;
    shiftX: number;
    shiftY: number;
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
    /** The spawner's box, in viewport content coordinates, or `undefined` while the spawner is not on the page. */
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
     * @returns `false` when nothing was sent: the count rounds to nothing, there are no targets, the spawner is not
     * on the page yet, or the page is hidden.
     */
    emit: (count: number) => boolean;
};

export type BaseParticleSpawnerValues = {
    /**
     * The picture every particle is drawn with, at the picture's own size — so an SVG gives itself a `width` and a
     * `height`, or it is drawn at 300 × 150. A white picture takes any color through `computeParticleTint`.
     */
    src: string;
    /** The elements particles travel to. A missing one is skipped rather than aimed at. */
    targets: (HTMLElement | undefined)[];
    /** How many particles are sent on each round. */
    particleCount: number;
    /** How long one particle takes to walk its path. */
    travelDurationMs?: number;
    /** How long a particle stays put at the end of its path before it disappears. */
    restDurationMs?: number;
    /** How long each particle waits after the one before it sets off, which is what staggers them. */
    spawnDelayMs?: number;
    /** How the rounds follow each other — in bursts, one at a time, or without a pause. */
    spawnIterationPatterns?: ParticleSpawnIterationPattern[];
    /**
     * What draws the particles. `"graphics_card"` draws them into one canvas and falls back to page elements by itself
     * wherever it cannot: no WebGL 2, a
     * picture whose server gives no cross-origin permission, or a moment the browser has taken the graphics card away.
     * `"elements"` always draws each particle as an element of its own, which keeps an animated picture playing — the
     * graphics card draws only its first frame.
     */
    renderer?: SliceAnimationRenderer;
};

export type BaseParticleSpawnerCbs = {
    /** Which target one particle is aimed at. */
    computeTarget?: (index: number, targetCount: number) => number;
    /**
     * Where one particle is at a given point along its path, which is what makes the path a curve rather than a
     * straight line.
     */
    computeParticlePos: (defs: ParticleTravelDefs, t: number) => Point2d;
    /**
     * What one particle looks like at a given point along its path — a glow as it nears its target, a fade as it
     * arrives — in the same values `CellAnimation` takes for a cell. Worked out every frame alongside its position.
     * The graphics card draws only its scale, its turn, its fade and its travel; a filter, such as a blur or a change of
     * brightness, shows only with `renderer` set to `"elements"`.
     */
    computeParticleAnimation?: (defs: ParticleTravelDefs, t: number) => CSSAnimationValues;
    /**
     * The color one particle is multiplied by, as CSS writes it, asked once as it sets off. A picture tinted red stays
     * the same picture, only redder; left out, the picture is drawn as it is.
     */
    computeParticleTint?: (defs: ParticleTravelDefs) => string;
    /** Runs when one particle reaches its target. */
    onParticleArrive?: (index: number) => void;
    /** Runs at the end of each round. */
    onIterationEnd?: () => void;
    /** Runs once every round is done. */
    onAnimationEnd?: () => void;
    /** Hands the consumer a controller once the spawner is up, for sending particles on demand. */
    onMount?: (controller: ParticleSpawnerController) => void;
};

export type BaseParticleSpawnerProps = BaseParticleSpawnerValues & BaseParticleSpawnerCbs;
