import { keyframes, style } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";

export const isIndeterminate = style({});
export const hasError = style([lookStates.hasError]);

const sweep = keyframes({
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(300%)" },
});

const sweepFromRight = keyframes({
    "0%": { transform: "translateX(100%)" },
    "100%": { transform: "translateX(-300%)" },
});

export const progressTrack = style([
    lookEntries.progressTrack,
    {
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: 8,
        transition: `border-color ${themeVars.animation.duration}`,
    },
]);

export const progressFill = style([
    lookEntries.progressFill,
    {
        height: "100%",
        transition: `width ${themeVars.animation.duration}`,

        selectors: {
            [`${progressTrack}.${isIndeterminate} &`]: {
                width: "33%",
                animation: `${sweep} 1.2s linear infinite`,
                transition: "none",
            },
            [`${progressTrack}.${isIndeterminate} &:dir(rtl)`]: {
                animationName: sweepFromRight,
            },
        },
    },
]);

export const progressReadout = style({
    fontSize: themeVars.fontSize.xSmall,
    fontVariantNumeric: "tabular-nums",
    opacity: 0.75,
});

export const progressRow = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.half,
    width: "100%",
    minWidth: 200,
});
