import { style } from "@vanilla-extract/css";

import { BUILD_PROGRESS_HEIGHT } from "./BuildProgress.const";

import { themeVars } from "../../Theme.css";

export const isHidden = style({});

export const buildProgressClip = style({
    height: "100%",
    overflow: "hidden",
});

export const buildProgressStrip = style({
    display: "flex",
    alignItems: "stretch",
    gap: themeVars.spacing.full,
    boxSizing: "border-box",
    height: BUILD_PROGRESS_HEIGHT,
    padding: `0 ${themeVars.spacing.full} 0 ${themeVars.spacing.double}`,
    fontSize: themeVars.fontSize.small,
    color: themeVars.color.surface.contrast,
    backgroundImage: `linear-gradient(45deg, ${themeVars.color.surface.dark}, ${themeVars.color.surface.light})`,

    selectors: {
        [`&.${isHidden}`]: {
            visibility: "hidden",
        },
    },
});

export const buildProgressBar = style({
    position: "relative",
    display: "flex",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
});

export const buildProgressDismiss = style({
    display: "flex",
    alignItems: "center",
});

export const buildProgressFill = style({
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: `rgb(from ${themeVars.color.surface.contrast} r g b / 15%)`,
    transition: `width ${themeVars.animation.duration}`,
});

export const buildProgressText = style({
    position: "relative",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
});
