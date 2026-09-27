import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const isHovered = style({});
export const isDisabled = style({});

export const eraCycle = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 34,
    height: 22,
    padding: `0 ${themeVars.spacing.half}`,
    borderRadius: themeVars.borderRadius.half,
    color: `rgb(from ${layerVars.contrast} r g b / 65%)`,
    fontSize: themeVars.fontSize.xSmall,
    fontWeight: 600,
    letterSpacing: 0.5,
    lineHeight: 1,
    whiteSpace: "nowrap",
    transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            color: layerVars.contrast,
            backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});
