import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const FIELD_WIDTH = 240;
export const FIELD_HEIGHT = 40;
export const FIELD_BORDER = 2;

export const FIELD_PADDING = 10 + FIELD_BORDER;
export const FIELD_STEPPER_PADDING = {
    paddingBlockStart: FIELD_PADDING,
    paddingInlineEnd: 5,
    paddingBlockEnd: FIELD_PADDING,
    paddingInlineStart: FIELD_PADDING,
};
export const FIELD_GAP = 5;
export const FIELD_FONT_SIZE = themeVars.fontSize.medium;

export const isEmpty = style({});
export const isStretched = style({});
export const isTopAligned = style({});
export const isHovered = style([skinStates.isHovered]);
export const isReadOnly = style([skinStates.isReadOnly]);
export const isDisabled = style([skinStates.isDisabled]);
export const hasError = style([skinStates.hasError]);

export const fieldSurface = style([
    skinEntries.input,
    {
        transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}, border-color ${themeVars.animation.duration}`,
    },
]);

export const textFieldContent = style([
    fieldSurface,
    {
        width: FIELD_WIDTH,
        height: FIELD_HEIGHT,

        selectors: {
            [`&.${isStretched}`]: {
                height: "auto",
            },
        },
    },
]);

export const textFieldPlaceholder = style({
    display: "flex",
    alignItems: "center",
    height: "100%",
    color: `rgb(from ${layerVars.contrast} r g b / 50%)`,
    fontSize: FIELD_FONT_SIZE,
    opacity: 0,
    transition: `opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isTopAligned}`]: {
            alignItems: "flex-start",
        },
        [`&.${isEmpty}`]: {
            opacity: 1,
        },
    },
});
