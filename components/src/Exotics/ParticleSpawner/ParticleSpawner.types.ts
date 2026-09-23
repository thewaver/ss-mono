import type { Accessor, JSX } from "solid-js";

import type { Point2d } from "@thewaver/ss-utils";

import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

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

export type ParticleSpawnerProps = AccessorProps<{
    /** The elements particles travel to. A missing one is skipped rather than aimed at. */
    targets: (HTMLElement | undefined)[];
    /** How many particles are sent on each round. */
    particleCount: number;
    /** How long one particle takes to walk its path. */
    travelDurationMs?: number;
    /** How long a particle stays put at the end of its path before it disappears. */
    retentionMs?: number;
    /** How long each particle waits after the one before it sets off, which is what staggers them. */
    spawnDelayMs?: number;
    /** How the rounds follow each other — in bursts, one at a time, or without a pause. */
    spawnIterationPatterns?: ParticleSpawnIterationPattern[];
    /** Whether particles are being sent. It is the only thing that starts or stops them. */
    playbackSignal?: SignalSource<boolean>;
    /** Which target one particle is aimed at. */
    computeTarget?: (index: number, targetCount: number) => number;
    /**
     * Where one particle is at a given point along its path, which is what makes the path a curve rather than a
     * straight line.
     */
    computeParticlePos: (defs: ParticleTravelDefs, t: number) => Point2d;
    /** Draws one particle, and is told how far along its path it is. */
    renderParticle: (index: number, getT: Accessor<number>) => JSX.Element;
    /** Runs when one particle reaches its target. */
    onParticleArrive?: (index: number) => void;
    /** Runs at the end of each round. */
    onIterationEnd?: () => void;
    /** Runs once every round is done. */
    onAnimationEnd?: () => void;
    /** Hands the consumer a controller once the spawner is up, for sending particles on demand. */
    onMount?: (controller: ParticleSpawnerController) => void;
}>;
