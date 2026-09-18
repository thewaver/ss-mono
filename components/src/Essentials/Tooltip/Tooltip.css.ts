import { createVar, style } from "@vanilla-extract/css";

export const bridgeTopVar = createVar();
export const bridgeRightVar = createVar();
export const bridgeBottomVar = createVar();
export const bridgeLeftVar = createVar();

export const tooltipRoot = style({
    position: "absolute",
    top: 0,
    left: 0,
    pointerEvents: "none",

    selectors: {
        "&::before": {
            content: '""',
            position: "absolute",
            top: bridgeTopVar,
            right: bridgeRightVar,
            bottom: bridgeBottomVar,
            left: bridgeLeftVar,
        },
    },
});
