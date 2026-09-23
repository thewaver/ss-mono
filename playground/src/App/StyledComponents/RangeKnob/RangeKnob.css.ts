import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

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
    boxShadow: `${themeVars.shadow.small}, inset 0 0 0 2px rgb(from currentColor r g b / 25%)`,
    backgroundImage: `linear-gradient(215deg, ${themeVars.color.surface.light}, ${themeVars.color.surface.dark})`,
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
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: themeVars.color.primary.main,
    transformOrigin: "0 50%",
});

export const rangeKnobReadout = style({
    fontSize: themeVars.fontSize.small,
    fontVariantNumeric: "tabular-nums",
});
