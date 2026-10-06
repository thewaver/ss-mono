import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const CONTROL_BUTTON_SIZE = 28;

export const isHovered = style({});
export const isActive = style({});
export const isDisabled = style({});

export const controlButtonBase = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: layerVars.contrast,
    backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
    borderRadius: themeVars.borderRadius.half,
    transition: `color ${themeVars.animation.duration}, filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}, background-color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            color: themeVars.color.primary.main,
        },
        [`&.${isActive}`]: {
            filter: themeVars.active.filter,
        },
        [`&.${isDisabled}`]: {
            opacity: themeVars.disabled.opacity,
            filter: themeVars.disabled.filter,
        },
    },
});

export const controlButton = style([
    controlButtonBase,
    {
        minWidth: CONTROL_BUTTON_SIZE,
        height: CONTROL_BUTTON_SIZE,
        paddingInline: themeVars.spacing.full,
        fontSize: themeVars.fontSize.small,
        whiteSpace: "nowrap",
    },
]);

export const controlButtonGlyph = style({
    paddingInline: 0,
    width: CONTROL_BUTTON_SIZE,
});
