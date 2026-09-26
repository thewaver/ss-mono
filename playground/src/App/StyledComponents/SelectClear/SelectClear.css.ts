import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const SELECT_CLEAR_SIZE = 24;

export const isHovered = style({});
export const isActive = style({});
export const isDisabled = style({});

export const selectClear = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: SELECT_CLEAR_SIZE,
    height: SELECT_CLEAR_SIZE,
    borderRadius: themeVars.borderRadius.half,
    color: `rgb(from ${layerVars.contrast} r g b / 65%)`,
    fontSize: themeVars.fontSize.medium,
    lineHeight: 1,
    transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            color: layerVars.contrast,
            backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
        },
        [`&.${isActive}`]: {
            filter: themeVars.active.filter,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});
