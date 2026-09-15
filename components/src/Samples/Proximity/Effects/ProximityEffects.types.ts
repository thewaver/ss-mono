export type SwellDefs = {
    reachRatio?: number;
    growthRatio?: number;
    pushRatio?: number;
};

export type LiftDefs = {
    reachRatio?: number;
    shiftRatio?: number;
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
    | { family: "swell"; defs?: SwellDefs }
    | { family: "lift"; defs?: LiftDefs }
    | { family: "glow"; defs?: GlowDefs }
    | { family: "fade"; defs?: FadeDefs };

export type ProximityEffectFamily = ProximityEffectEntry["family"];
