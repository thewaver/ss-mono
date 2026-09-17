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

export type ParticleSpawnerProps = AccessorProps<{
    targets: (HTMLElement | undefined)[];
    particleCount: number;
    travelDurationMs?: number;
    retentionMs?: number;
    spawnDelayMs?: number;
    spawnIterationPatterns?: ParticleSpawnIterationPattern[];
    playbackSignal?: SignalSource<boolean>;
    computeTarget?: (index: number, targetCount: number) => number;
    computeParticlePos: (defs: ParticleTravelDefs, t: number) => Point2d;
    renderParticle: (index: number, getT: Accessor<number>) => JSX.Element;
    onParticleArrive?: (index: number) => void;
    onIterationEnd?: () => void;
    onAnimationEnd?: () => void;
}>;
