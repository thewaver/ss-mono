import { style } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

const SWATCH_SIZE = 24;

export const isHovered = style([lookStates.isHovered]);
export const isDisabled = style([lookStates.isDisabled]);
export const hasError = style([lookStates.hasError]);

export const colorInputContent = style([
    lookEntries.input,
    {
        display: "flex",
        alignItems: "center",
        gap: themeVars.spacing.full,
        padding: themeVars.spacing.full,
        transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}, border-color ${themeVars.animation.duration}`,
    },
]);

export const colorInputSwatch = style({
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: themeVars.borderRadius.half,
    boxShadow: `inset 0 0 0 1px rgb(from ${layerVars.contrast} r g b / 25%)`,
});

export const colorInputValue = style({
    fontSize: themeVars.fontSize.small,
    fontVariantNumeric: "tabular-nums",
    textTransform: "uppercase",
});
