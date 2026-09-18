import type { GlassDefs } from "./Glass.types";

export const DEFAULT_GLASS_DEFS = {
    noise: {
        frequency: 0.025,
        octaves: 2,
        seed: 9,
    },
    backdrop: {
        blurRadius: 6,
    },
    ripple: {
        scale: 24,
    },
    tint: {
        color: "#FFFFFF",
        opacity: 0.2,
    },
    sheen: {
        lightHeight: 960,
        surfaceScale: 0.25,
        specularConstant: 1,
        specularExponent: 120,
    },
} satisfies GlassDefs;
