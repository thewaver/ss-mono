import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const isHovered = style({});
export const isDisabled = style({});

export const textFieldAdornment = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 26,
    paddingInline: themeVars.spacing.full,
    borderRadius: themeVars.borderRadius.half,
    color: `rgb(from ${layerVars.contrast} r g b / 65%)`,
    fontSize: themeVars.fontSize.xSmall,
    textTransform: "uppercase",
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
