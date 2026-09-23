import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const ZONE_WIDTH = 320;
const ZONE_HEIGHT = 120;
const ZONE_BORDER = 2;

export const isHovered = style({});
export const isDragOver = style({});
export const isEmpty = style({});
export const isDisabled = style({});
export const hasError = style({});

export const fileDropZoneContent = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: themeVars.spacing.half,
    boxSizing: "border-box",
    width: ZONE_WIDTH,
    height: ZONE_HEIGHT,
    padding: themeVars.spacing.full,
    border: `${ZONE_BORDER}px dashed rgb(from currentColor r g b / 25%)`,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.control.background.main,
    fontSize: themeVars.fontSize.medium,
    textAlign: "center",
    transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}, border-color ${themeVars.animation.duration}, background-color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${hasError}`]: {
            borderColor: themeVars.color.error.main,
        },
        [`&.${isHovered}`]: {
            filter: themeVars.hover.filter,
        },
        [`&.${isDragOver}`]: {
            borderStyle: "solid",
            borderColor: themeVars.color.primary.main,
            backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 15%)`,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const fileDropZonePrompt = style({
    fontWeight: "bold",
});

export const fileDropZoneNames = style({
    maxWidth: "100%",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    fontSize: themeVars.fontSize.small,

    selectors: {
        [`&.${isEmpty}`]: {
            color: `rgb(from currentColor r g b / 50%)`,
            fontStyle: "italic",
        },
    },
});
