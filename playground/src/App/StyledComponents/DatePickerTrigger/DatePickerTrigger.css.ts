import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const isHovered = style({});
export const isOpen = style({});
export const isDisabled = style({});

export const datePickerTrigger = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 22,
    height: 22,
    borderRadius: themeVars.borderRadius.half,
    color: `rgb(from ${layerVars.contrast} r g b / 65%)`,
    fontSize: themeVars.fontSize.xSmall,
    lineHeight: 1,
    transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}, &.${isOpen}`]: {
            color: layerVars.contrast,
            backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});
