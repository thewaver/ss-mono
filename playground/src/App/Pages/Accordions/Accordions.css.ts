import { keyframes, style } from "@vanilla-extract/css";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";

export const scrollBox = style({
    height: 160,
    overflowY: "auto",
});

export const ROW_HEIGHT = 200;
export const ROW_PANEL_WIDTH = 240;

const slideFromStart = keyframes({
    "0%": {
        opacity: 0,
        transform: "translateX(-40px)",
    },
    "100%": {
        opacity: 1,
        transform: "none",
    },
});

const slideFromEnd = keyframes({
    "0%": {
        opacity: 0,
        transform: "translateX(40px)",
    },
    "100%": {
        opacity: 1,
        transform: "none",
    },
});

export const rowStrip = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: ROW_HEIGHT,
    padding: themeVars.spacing.full,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: layerVars.main,
    transition: `filter ${themeVars.animation.duration}`,
});

export const rowStripHovered = style({
    filter: themeVars.hover.filter,
});

export const rowStripLabel = style({
    writingMode: "vertical-rl",
    transform: "rotate(180deg)",
    fontSize: themeVars.fontSize.medium,
    whiteSpace: "nowrap",
});

export const rowPanel = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: themeVars.spacing.full,
    width: ROW_PANEL_WIDTH,
    height: ROW_HEIGHT,
    padding: themeVars.spacing.double,
    fontSize: themeVars.fontSize.small,
});

export const rowPanelEnterBackward = style({
    animationName: slideFromStart,
    animationFillMode: "both",
});

export const rowPanelEnterForward = style({
    animationName: slideFromEnd,
    animationFillMode: "both",
});
