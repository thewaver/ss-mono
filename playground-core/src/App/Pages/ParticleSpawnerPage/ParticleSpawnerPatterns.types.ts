import type { ParticleSpawnIterationPattern, ParticleTravelDefs } from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import type { Knob } from "../../PageComponents/Knobs/KnobDefs.types";

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

export type ParticleTravelKnobs = Record<string, Knob>;

export type IterationPatternFn = () => ParticleSpawnIterationPattern[];
