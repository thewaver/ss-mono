import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";
import { FIELD_FONT_SIZE } from "../TextFieldContent/TextFieldContent.css";

export const isHovered = style({});
export const isDisabled = style({});

export const textFieldAdornment = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 26,
    borderRadius: themeVars.borderRadius.half,
    color: `rgb(from ${layerVars.contrast} r g b / 65%)`,
    fontSize: FIELD_FONT_SIZE,
    transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

    selectors: {
        [`:is(button, [role='button']) &`]: {
            paddingInline: themeVars.spacing.full,
            fontSize: themeVars.fontSize.xSmall,
            textTransform: "uppercase",
        },
        [`:is(button, [role='button']) &.${isHovered}`]: {
            color: layerVars.contrast,
            backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});
