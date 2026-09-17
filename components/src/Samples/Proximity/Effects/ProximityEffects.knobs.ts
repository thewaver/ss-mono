import type { SampleKnobs } from "../../Samples.types";
import type { FadeDefs, GlowDefs, ZoomInDefs } from "./ProximityEffects.types";

export namespace ProximityEffectKnobs {
    export const ZOOM_IN_DEFAULTS: Required<ZoomInDefs> = {
        reachRatio: 2.5,
        growthRatio: 0.5,
        pushRatio: 0.75,
    };

    export const GLOW_DEFAULTS: Required<GlowDefs> = {
        reachRatio: 2.5,
        brightnessRatio: 0.5,
        saturationRatio: 0.5,
    };

    export const FADE_DEFAULTS: Required<FadeDefs> = {
        reachRatio: 3,
        opacityRatio: 0.6,
        blurPixels: 2,
    };

    export const DEFAULTS_BY_FAMILY = {
        fade: FADE_DEFAULTS,
        glow: GLOW_DEFAULTS,
        zoomIn: ZOOM_IN_DEFAULTS,
    };

    export const ZOOM_IN_KNOBS: SampleKnobs<ZoomInDefs> = {
        reachRatio: { kind: "number", label: "Reach ratio", min: 0.5, max: 6, step: 0.25 },
        growthRatio: { kind: "number", label: "Growth ratio", min: 0, max: 1.5, step: 0.05 },
        pushRatio: { kind: "number", label: "Push ratio", min: 0, max: 2, step: 0.05 },
    };

    export const GLOW_KNOBS: SampleKnobs<GlowDefs> = {
        reachRatio: { kind: "number", label: "Reach ratio", min: 0.5, max: 6, step: 0.25 },
        brightnessRatio: { kind: "number", label: "Brightness ratio", min: -0.5, max: 2, step: 0.05 },
        saturationRatio: { kind: "number", label: "Saturation ratio", min: -1, max: 2, step: 0.05 },
    };

    export const FADE_KNOBS: SampleKnobs<FadeDefs> = {
        reachRatio: { kind: "number", label: "Reach ratio", min: 0.5, max: 6, step: 0.25 },
        opacityRatio: { kind: "number", label: "Opacity ratio", min: 0, max: 1, step: 0.05 },
        blurPixels: { kind: "number", label: "Blur (px)", min: 0, max: 12, step: 0.5 },
    };

    export const KNOBS_BY_FAMILY = {
        fade: FADE_KNOBS,
        glow: GLOW_KNOBS,
        zoomIn: ZOOM_IN_KNOBS,
    };
}
