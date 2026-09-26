import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const KNOB_SIZE = 96;

export const isFocused = style({});
export const isDisabled = style({});
export const hasError = style({});

export const rangeKnob = style({
    position: "relative",
    display: "grid",
    placeItems: "center",
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: "50%",
    boxShadow: `${themeVars.shadow.small}, inset 0 0 0 2px rgb(from ${layerVars.contrast} r g b / 25%)`,
    backgroundColor: layerVars.main,
    transition: `box-shadow ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isFocused}`]: {
            boxShadow: `${themeVars.shadow.small}, inset 0 0 0 2px ${themeVars.color.primary.main}`,
        },
        [`&.${hasError}`]: {
            boxShadow: `${themeVars.shadow.small}, inset 0 0 0 2px ${themeVars.color.error.main}`,
        },
        [`&.${isDisabled}`]: {
            opacity: 0.5,
        },
    },
});

export const rangeKnobPointer = style({
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "42%",
    height: 4,
    marginTop: -2,
    transformOrigin: "0 50%",

    selectors: {
        "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            right: 0,
            borderRadius: themeVars.borderRadius.half,
            backgroundColor: themeVars.color.primary.main,
        },
    },
});

export const rangeKnobReadout = style({
    fontSize: themeVars.fontSize.small,
    fontVariantNumeric: "tabular-nums",
});
