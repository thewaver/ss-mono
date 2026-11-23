import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates, skinVars } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";
import { FIELD_FONT_SIZE, fieldSurface } from "../TextFieldContent/TextFieldContent.css";

export const isHovered = style([skinStates.isHovered]);
export const isFocused = style({});
export const isDisabled = style([skinStates.isDisabled]);
export const hasError = style([skinStates.hasError]);

export const tagInputContent = style([
    fieldSurface,
    {
        position: "absolute",
        inset: 0,
    },
]);

export const tagContent = style([
    skinEntries.tag,
    {
        display: "flex",
        alignItems: "center",
        gap: themeVars.spacing.half,
        height: 24,
        whiteSpace: "nowrap",
        transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

        selectors: {
            [`&.${isFocused}`]: {
                outline: `2px solid ${skinVars.outlineColor}`,
                outlineOffset: 1,
            },
        },
    },
]);

export const tagRemove = style({
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.75,
});

export const tagInputPlaceholder = style([
    skinEntries.placeholder,
    {
        fontSize: FIELD_FONT_SIZE,
        pointerEvents: "none",
    },
]);
