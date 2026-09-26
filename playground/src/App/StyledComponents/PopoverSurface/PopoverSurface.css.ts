import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

const SURFACE_PADDING = 5;
const SURFACE_BORDER = 2;

export const POPOVER_SURFACE_INSET = SURFACE_PADDING + SURFACE_BORDER;

export const isVisible = style({});
export const isFlipped = style({});

export const popoverSurfaceEmpty = style({
    padding: themeVars.spacing.full,
    color: `rgb(from ${layerVars.contrast} r g b / 50%)`,
    fontSize: themeVars.fontSize.medium,
    lineHeight: 1.25,
    whiteSpace: "nowrap",
});

export const popoverSurface = style({
    boxSizing: "border-box",
    width: "100%",
    maxHeight: 220,
    overflowY: "auto",
    padding: SURFACE_PADDING,
    color: layerVars.contrast,
    boxShadow: themeVars.shadow.medium,
    border: `${SURFACE_BORDER}px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: layerVars.main,
    opacity: 0,
    transform: "translateY(-4px)",

    selectors: {
        [`&.${isFlipped}`]: {
            transform: "translateY(4px)",
        },
        [`&.${isVisible}`]: {
            opacity: 1,
            transform: "translateY(0)",
        },
    },
});
