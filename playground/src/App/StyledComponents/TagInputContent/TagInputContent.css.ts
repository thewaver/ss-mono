import { style } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";
import { FIELD_FONT_SIZE, fieldSurface } from "../TextFieldContent/TextFieldContent.css";

export const isHovered = style([lookStates.isHovered]);
export const isFocused = style({});
export const isDisabled = style([lookStates.isDisabled]);

export const tagInputContent = style([
    fieldSurface,
    {
        position: "absolute",
        inset: 0,
    },
]);

export const tagContent = style([
    lookEntries.tag,
    {
        display: "flex",
        alignItems: "center",
        gap: themeVars.spacing.half,
        height: 24,
        whiteSpace: "nowrap",
        transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

        selectors: {
            [`&.${isFocused}`]: {
                outline: `2px solid ${themeVars.color.outline.main}`,
                outlineOffset: 1,
            },
        },
    },
]);

export const tagRemove = style({
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.75,
});

export const tagInputPlaceholder = style({
    color: `rgb(from ${layerVars.contrast} r g b / 50%)`,
    fontSize: FIELD_FONT_SIZE,
    pointerEvents: "none",
});
