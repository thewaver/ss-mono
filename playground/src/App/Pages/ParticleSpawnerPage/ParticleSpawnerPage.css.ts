import { keyframes, style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const MARKER_SIZE_PX = 28;
const PARTICLE_SIZE_PX = 10;
const MOVING_TARGET_LOOP_MS = 4000;
const CORNER_NEAR = "15%";
const CORNER_FAR = "85%";

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

const moveAroundCorners = keyframes({
    "0%": { left: CORNER_NEAR, top: CORNER_NEAR },
    "25%": { left: CORNER_FAR, top: CORNER_NEAR },
    "50%": { left: CORNER_FAR, top: CORNER_FAR },
    "75%": { left: CORNER_NEAR, top: CORNER_FAR },
    "100%": { left: CORNER_NEAR, top: CORNER_NEAR },
});

export const movingTargetMarker = style([
    targetMarker,
    {
        animationName: moveAroundCorners,
        animationDuration: `${MOVING_TARGET_LOOP_MS}ms`,
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
    },
]);

export const isHiddenMarker = style({
    visibility: "hidden",
});

export const particle = style({
    width: PARTICLE_SIZE_PX,
    height: PARTICLE_SIZE_PX,
    borderRadius: "50%",
    backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.success.light}, ${themeVars.color.success.dark})`,
});

export const burstRoot = style({
    position: "absolute",
    transform: "translate(-50%, -50%)",
});

export const spawnerOverlay = style({
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
});
