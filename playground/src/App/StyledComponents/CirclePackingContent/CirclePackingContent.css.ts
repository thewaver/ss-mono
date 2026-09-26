import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const circlePackingFrame = style({
    width: "100%",
    height: "100%",
    backgroundColor: layerVars.main,
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
    fill: layerVars.contrast,
    stroke: layerVars.main,
    strokeWidth: 3,
    paintOrder: "stroke",
    fontSize: themeVars.fontSize.xSmall,
    pointerEvents: "none",
    userSelect: "none",
    transition: `fill-opacity 750ms, stroke-opacity 750ms`,
});
