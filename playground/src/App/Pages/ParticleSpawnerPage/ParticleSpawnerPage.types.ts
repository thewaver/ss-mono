import type { Signal } from "solid-js";

import type {
    AccessorProps,
    ParticleSpawnIterationPattern,
    ParticleTravelDefs,
    SampleKnob,
} from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

export type ParticleTravelPattern = "line" | "arc" | "wave" | "spiral" | "orbit" | "bezier" | "zigzag" | "scatter";

export type IterationPattern = "burst" | "intermittent" | "continuous";

export type TravelEasingKey =
    | "linear"
    | "ease"
    | "easeIn"
    | "easeOut"
    | "easeInOut"
    | "easeInQuad"
    | "easeOutQuad"
    | "easeInOutQuad"
    | "easeInCubic"
    | "easeOutCubic"
    | "easeInOutCubic"
    | "easeInQuart"
    | "easeOutQuart"
    | "easeInOutQuart"
    | "easeInQuint"
    | "easeOutQuint"
    | "easeInOutQuint"
    | "easeInSine"
    | "easeOutSine"
    | "easeInOutSine"
    | "easeInExpo"
    | "easeOutExpo"
    | "easeInOutExpo"
    | "easeInCirc"
    | "easeOutCirc"
    | "easeInOutCirc"
    | "easeInBack"
    | "easeOutBack"
    | "easeInOutBack"
    | "easeInElastic"
    | "easeOutElastic"
    | "easeInOutElastic"
    | "easeOutBounce"
    | "easeInBounce"
    | "easeInOutBounce";

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
