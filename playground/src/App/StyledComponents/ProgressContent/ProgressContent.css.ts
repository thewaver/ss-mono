import { fallbackVar, keyframes, style } from "@vanilla-extract/css";

import { skinEntries, skinStates, skinVars } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

const PROGRESS_THICKNESS = 8;
const PROGRESS_LENGTH = 160;

const TRACK_THICKNESS = fallbackVar(skinVars.progressTrackThickness, `${PROGRESS_THICKNESS}px`);

export const isIndeterminate = style({});
export const hasError = style([skinStates.hasError]);
export const isVertical = style([skinStates.isVertical]);

const sweep = keyframes({
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(300%)" },
});

const sweepFromRight = keyframes({
    "0%": { transform: "translateX(100%)" },
    "100%": { transform: "translateX(-300%)" },
});

const sweepUp = keyframes({
    "0%": { transform: "translateY(100%)" },
    "100%": { transform: "translateY(-300%)" },
});

export const progressTrack = style([
    skinEntries.progressTrack,
    {
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: TRACK_THICKNESS,
        transition: `border-color ${themeVars.animation.duration}`,

        selectors: {
            [`&.${isVertical}`]: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                width: TRACK_THICKNESS,
                height: PROGRESS_LENGTH,
            },
        },
    },
]);

export const progressFill = style([
    skinEntries.progressFill,
    {
        height: "100%",
        transition: `width ${themeVars.animation.duration}`,

        selectors: {
            [`${progressTrack}.${isIndeterminate} &`]: {
                width: "33%",
                animation: `${sweep} 1.2s linear infinite`,
                transition: "none",
            },
            [`${progressTrack}.${isIndeterminate} &:dir(rtl):not(.${isVertical})`]: {
                animationName: sweepFromRight,
            },
            [`&.${isVertical}`]: {
                width: "100%",
                height: "auto",
                transition: `height ${themeVars.animation.duration}`,
            },
            [`${progressTrack}.${isIndeterminate} &.${isVertical}`]: {
                width: "100%",
                height: "33%",
                animationName: sweepUp,
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

    selectors: {
        [`&.${isVertical}`]: {
            flexDirection: "row",
            alignItems: "flex-end",
            width: "auto",
            minWidth: 0,
        },
    },
});
