import { globalStyle, style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const GLOW_NEAR = "6px";
const GLOW_FAR = "14px";

export const isMarked = style({});
export const isHovered = style({});
export const isDisabled = style({});

export const tileBoardTile = style({
    display: "grid",
    position: "relative",
    width: "100%",
    height: "100%",

    selectors: {
        [`&.${isMarked}`]: {
            filter: `drop-shadow(0 0 ${GLOW_NEAR} ${themeVars.color.primary.main}) drop-shadow(0 0 ${GLOW_FAR} ${themeVars.color.primary.main})`,
        },
    },
});

export const tileBoardTileContent = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: themeVars.spacing.half,
    width: "100%",
    height: "100%",
    backgroundImage: `linear-gradient(215deg, ${themeVars.color.surface.light}, ${themeVars.color.surface.dark})`,
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.xSmall,
    fontVariantNumeric: "tabular-nums",
    textAlign: "center",

    selectors: {
        [`&.${isMarked}`]: {
            backgroundImage: `linear-gradient(215deg, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
            color: themeVars.color.primary.contrast,
        },
        [`&.${isHovered}`]: {
            filter: themeVars.hover.filter,
        },
        [`&.${isDisabled}`]: {
            opacity: themeVars.disabled.opacity,
            filter: themeVars.disabled.filter,
        },
    },
});

globalStyle(`[role="gridcell"]:has(${tileBoardTile}):focus-visible`, {
    outline: "0 none",
});

export const tileBoardMeeple = style({
    position: "absolute",
    aspectRatio: "1",
    transform: "translate(-50%, -100%)",
    borderRadius: "50%",
    backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.secondary.light}, ${themeVars.color.secondary.dark})`,
    boxShadow: themeVars.shadow.medium,
    filter: `drop-shadow(0 0 ${GLOW_NEAR} ${themeVars.color.primary.main}) drop-shadow(0 0 ${GLOW_FAR} ${themeVars.color.primary.main})`,
    pointerEvents: "none",
    transition: `left ${themeVars.animation.duration}, top ${themeVars.animation.duration}`,
});
