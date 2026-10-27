import { style } from "@vanilla-extract/css";

export const particleDissolveRoot = style({
    position: "relative",
    width: "fit-content",
});

export const particleDissolveParticles = style({
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
});

export const particleDissolveParticleLayer = style({
    position: "absolute",
    inset: 0,
});
