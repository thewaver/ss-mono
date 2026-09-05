import { keyframes, style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const HINT_BOX_WIDTH = 240;
export const HINT_BOX_HEIGHT = 200;

const HINT_LANE_HEIGHT = 50;

const slideH = keyframes({
    "0%": {
        transform: "translateX(0)",
    },
    "50%": {
        transform: `translateX(calc(${HINT_BOX_WIDTH}px - 100%))`,
    },
    "100%": {
        transform: "translateX(0)",
    },
});

const slideV = keyframes({
    "0%": {
        transform: "translateY(0)",
    },
    "50%": {
        transform: `translateY(calc(${HINT_BOX_HEIGHT - HINT_LANE_HEIGHT}px - 100%))`,
    },
    "100%": {
        transform: "translateY(0)",
    },
});

export const root = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.double,
});

const anchorWrapper = style({
    position: "absolute",
    width: "fit-content",
    animationDuration: "10000ms",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationFillMode: "both",
});

export const anchorSlidingH = style([anchorWrapper, { top: 0, left: 0, animationName: slideH }]);

export const anchorSlidingV = style([anchorWrapper, { top: HINT_LANE_HEIGHT, right: 0, animationName: slideV }]);

export const overlayOn = style({
    backdropFilter: "blur(5px) grayscale(75%)",
});

export const overlayOff = style({
    backdropFilter: "none",
});

export const tourStrip = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.double,
    height: 48,
    padding: themeVars.spacing.full,
    backgroundColor: themeVars.color.control.background.main,
    overflowY: "auto",
});

export const tourTarget = style({
    width: "fit-content",
    padding: `${themeVars.spacing.full} ${themeVars.spacing.double}`,
    border: "2px solid currentColor",
    borderRadius: themeVars.borderRadius.full,
    opacity: 0.75,
});
