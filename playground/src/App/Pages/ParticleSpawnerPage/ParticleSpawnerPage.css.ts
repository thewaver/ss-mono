import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const MARKER_SIZE_PX = 28;
const PARTICLE_SIZE_PX = 10;

export const demoArea = style({
    position: "relative",
    width: "100%",
    height: "100%",
});

export const spawnerRoot = style({
    position: "absolute",
    width: MARKER_SIZE_PX,
    height: MARKER_SIZE_PX,
    transform: "translate(-50%, -50%)",
});

export const spawnerMarker = style({
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
    boxShadow: themeVars.shadow.small,
});

export const targetMarker = style({
    position: "absolute",
    width: MARKER_SIZE_PX,
    height: MARKER_SIZE_PX,
    transform: "translate(-50%, -50%)",
    borderRadius: themeVars.borderRadius.half,
    backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.secondary.light}, ${themeVars.color.secondary.dark})`,
    boxShadow: themeVars.shadow.small,
});

export const particle = style({
    width: PARTICLE_SIZE_PX,
    height: PARTICLE_SIZE_PX,
    borderRadius: "50%",
    backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.success.light}, ${themeVars.color.success.dark})`,
});
