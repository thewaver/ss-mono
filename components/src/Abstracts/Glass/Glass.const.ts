import type { GlassDefs } from "./Glass.types";

export const DEFAULT_GLASS_DEFS: GlassDefs = {
    noise: {
        frequency: 0.025,
        octaves: 2,
        seed: 9,
    },
    backdrop: {
        blurRadius: 6,
    },
    ripple: {
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
    },
};
