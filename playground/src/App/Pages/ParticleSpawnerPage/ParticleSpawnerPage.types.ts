import type { Signal } from "solid-js";

import type { AccessorProps, ParticleSpawnIterationPattern, ParticleTravelDefs, SampleKnob } from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

export type ParticleTravelPattern = "line" | "arc" | "wave";

export type IterationPattern = "burst" | "intermittent" | "continuous";

export type ParticleTravelPatternFn = (defs: ParticleTravelDefs, t: number) => Point2d;

export type ParticleTravelPatternFactory = (knobValues: Record<string, number>) => ParticleTravelPatternFn;

export type ParticleTravelKnobs = Record<string, SampleKnob>;

export type IterationPatternFn = () => ParticleSpawnIterationPattern[];

export type ParticleSpawnerExampleProps = AccessorProps<{
    particleCount: number;
    travelDurationMs: number;
    retentionMs: number;
    spawnDelayMs: number;
    spawnIterationPatterns: ParticleSpawnIterationPattern[];
    computeParticlePos: ParticleTravelPatternFn;
    playbackSignal: Signal<boolean>;
}>;
