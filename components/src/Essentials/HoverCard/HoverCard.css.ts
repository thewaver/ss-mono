import { createVar, style } from "@vanilla-extract/css";

export const bridgeTopVar = createVar();
export const bridgeRightVar = createVar();
export const bridgeBottomVar = createVar();
export const bridgeLeftVar = createVar();

export const hoverCardPanel = style({
    position: "relative",
    isolation: "isolate",

    selectors: {
        "&::before": {
            content: '""',
            position: "absolute",
            zIndex: -1,
            top: bridgeTopVar,
            right: bridgeRightVar,
            bottom: bridgeBottomVar,
            left: bridgeLeftVar,
        },
    },
});
