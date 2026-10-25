import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const isChecked = style({});
export const isMixed = style({});
export const isHovered = style({});
export const isDisabled = style({});
export const hasError = style({});

export const checkboxContent = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.full,
    transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            filter: themeVars.hover.filter,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const checkboxBox = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    width: 20,
    height: 20,
    boxShadow: themeVars.shadow.small,
    border: `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: layerVars.main,
    transition: `border-color ${themeVars.animation.duration}`,

    selectors: {
        [`${checkboxContent}.${hasError} &`]: {
            borderColor: themeVars.color.error.main,
        },
    },
});

export const checkboxMark = style({
    color: themeVars.color.primary.main,
    fontSize: themeVars.fontSize.medium,
    transform: "scale(0)",
    transition: `transform ${themeVars.animation.duration}`,

    selectors: {
        [`${checkboxContent}.${isChecked} &, ${checkboxContent}.${isMixed} &`]: {
            transform: "scale(1)",
        },
    },
});
