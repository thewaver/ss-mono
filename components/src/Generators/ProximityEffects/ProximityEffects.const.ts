import type { FadeDefs, GlowDefs, ZoomInDefs } from "./ProximityEffects.types";

export namespace ProximityEffectDefaults {
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
}
