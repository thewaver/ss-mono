import type { Snippet } from "svelte";

import type {
    ParticleSpawnIterationPattern,
    ParticleSpawnerController,
    ParticleTravelDefs,
} from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

export type ParticleSpawnerProps = {
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
     * Whether particles are being sent. Bind it with `bind:playback`; it is the only thing that starts or stops them.
     * Sending when left out.
     */
    playback?: boolean;
    /** Which target one particle is aimed at. */
    computeTarget?: (index: number, targetCount: number) => number;
    /**
     * Where one particle is at a given point along its path, which is what makes the path a curve rather than a
     * straight line.
     */
    computeParticlePos: (defs: ParticleTravelDefs, t: number) => Point2d;
    /** Draws one particle, and is told how far along its path it is. */
    renderParticle: Snippet<[index: number, t: number]>;
    /** Runs when one particle reaches its target. */
    onParticleArrive?: (index: number) => void;
    /** Runs at the end of each round. */
    onIterationEnd?: () => void;
    /** Runs once every round is done. */
    onAnimationEnd?: () => void;
    /** Hands the consumer a controller once the spawner is up, for sending particles on demand. */
    onMount?: (controller: ParticleSpawnerController) => void;
};
