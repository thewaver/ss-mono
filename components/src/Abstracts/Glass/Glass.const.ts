import type { GlassDefs } from "./Glass.types";

export const DEFAULT_GLASS_DEFS: GlassDefs = {
    backdrop: {
        blurRadius: 6,
    },
    ripple: {
        frequency: 0.012,
        octaves: 2,
        seed: 9,
        scale: 12,
    },
    tint: {
        color: "#FFFFFF",
        opacity: 0.1,
    },
    sheen: {
        lightHeight: 960,
        surfaceScale: 0.25,
        specularConstant: 1,
        specularExponent: 120,
        grainFrequency: 0.05,
        grainOctaves: 4,
        grainSeed: 4,
    },
};
