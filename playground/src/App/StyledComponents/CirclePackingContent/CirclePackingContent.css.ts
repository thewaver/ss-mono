import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const circlePackingFrame = style({
    backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.surface.light}, ${themeVars.color.surface.dark})`,
    borderRadius: themeVars.borderRadius.full,
    cursor: "pointer",
});

export const circlePackingStopLight = style({
    stopColor: themeVars.color.info.light,
});

export const circlePackingStopDark = style({
    stopColor: themeVars.color.info.dark,
});

export const circlePackingLeafStopLight = style({
    stopColor: themeVars.color.primary.light,
});

export const circlePackingLeafStopDark = style({
    stopColor: themeVars.color.primary.dark,
});

export const circlePackingCircle = style({
    fillOpacity: 0.9,
});

export const circlePackingBranch = style({
    fillOpacity: 0.35,
    cursor: "pointer",

    selectors: {
        "&:hover": {
            stroke: themeVars.color.primary.main,
            strokeWidth: 1.5,
        },
    },
});

export const circlePackingLabel = style({
    fill: themeVars.color.surface.contrast,
    stroke: themeVars.color.background.dark,
    strokeWidth: 3,
    paintOrder: "stroke",
    fontSize: themeVars.fontSize.xSmall,
    pointerEvents: "none",
    userSelect: "none",
    transition: `fill-opacity 750ms, stroke-opacity 750ms`,
});
