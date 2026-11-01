import { keyframes, style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const MARKER_SIZE_PX = 28;
export const PARTICLE_SIZE_PX = 10;
const MOVING_TARGET_LOOP_MS = 4000;
const CORNER_NEAR = "15%";
const CORNER_FAR = "85%";
const LOZENGE_WIDTH_SHARE = 0.75;
const ATTRACTOR_LOOP_MS = 3000;

export const stack = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: themeVars.spacing.full,
});

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
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: themeVars.color.primary.light,
    backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
    boxShadow: themeVars.shadow.small,
});

export const spawnerMarkerReturn = style([
    spawnerMarker,
    {
        backgroundColor: themeVars.color.secondary.light,
        backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.secondary.light}, ${themeVars.color.secondary.dark})`,
    },
]);

const bobUpAndDown = keyframes({
    "0%": { top: CORNER_NEAR },
    "50%": { top: CORNER_FAR },
    "100%": { top: CORNER_NEAR },
});

export const attractorMarker = style({
    position: "absolute",
    left: "50%",
    top: CORNER_NEAR,
    transform: "translate(-50%, -50%)",
    animationName: bobUpAndDown,
    animationDuration: `${ATTRACTOR_LOOP_MS}ms`,
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    width: MARKER_SIZE_PX,
    height: MARKER_SIZE_PX,
    borderRadius: themeVars.borderRadius.half,
    border: `2px dashed ${themeVars.color.secondary.main}`,
    boxSizing: "border-box",
});

export const windArrow = style({
    position: "absolute",
    left: "50%",
    top: "50%",
    height: 0,
    borderTop: `2px dashed ${themeVars.color.secondary.main}`,
    transformOrigin: "0 0",
    selectors: {
        "&::after": {
            content: '""',
            position: "absolute",
            right: 0,
            top: -1,
            transform: "translateY(-50%)",
            borderLeft: `8px solid ${themeVars.color.secondary.main}`,
            borderTop: "5px solid transparent",
            borderBottom: "5px solid transparent",
        },
    },
});

export const targetMarker = style({
    position: "absolute",
    width: MARKER_SIZE_PX * Math.SQRT1_2,
    height: MARKER_SIZE_PX * Math.SQRT1_2,
    transform: `translate(-50%, -50%) scaleX(${LOZENGE_WIDTH_SHARE}) rotate(45deg)`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: themeVars.color.secondary.light,
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
