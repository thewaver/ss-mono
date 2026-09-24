export type ZoomInDefs = {
    reachRatio?: number;
    growthRatio?: number;
    pushRatio?: number;
};

export type GlowDefs = {
    reachRatio?: number;
    brightnessRatio?: number;
    saturationRatio?: number;
};

export type FadeDefs = {
    reachRatio?: number;
    opacityRatio?: number;
    blurPixels?: number;
};

export type ProximityEffectEntry =
    { family: "zoomIn"; defs?: ZoomInDefs } | { family: "glow"; defs?: GlowDefs } | { family: "fade"; defs?: FadeDefs };

export type ProximityEffectFamily = ProximityEffectEntry["family"];
