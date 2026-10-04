import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const isVisible = style({});

const glideFloaterBase = style({
    width: "100%",
    height: "100%",
    borderRadius: themeVars.borderRadius.half,
    opacity: 0,
    transitionProperty: "opacity",

    selectors: {
        [`&.${isVisible}`]: {
            opacity: 1,
        },
    },
});

export const selectionGlideFloater = style([
    glideFloaterBase,
    {
        boxShadow: `inset 0 0 0 2px ${themeVars.color.primary.main}`,
        backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 15%)`,
    },
]);

export const highlightGlideFloater = style([
    glideFloaterBase,
    {
        backgroundColor: `rgb(from ${layerVars.contrast} r g b / 15%)`,
    },
]);

export const isSelected = style({});

export const glideLabel = style({
    padding: themeVars.spacing.full,
    fontSize: themeVars.fontSize.medium,
    whiteSpace: "nowrap",
    transition: `color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isSelected}`]: {
            color: themeVars.color.primary.main,
            fontWeight: 700,
        },
    },
});
