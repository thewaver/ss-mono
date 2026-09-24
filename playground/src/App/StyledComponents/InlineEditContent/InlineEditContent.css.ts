import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import {
    FIELD_BORDER,
    FIELD_FONT_SIZE,
    FIELD_GAP,
    FIELD_HEIGHT,
    FIELD_LINE_HEIGHT,
    FIELD_PADDING,
    FIELD_WIDTH,
} from "../TextFieldContent/TextFieldContent.css";

export const isHinted = style({});
export const isDisabled = style({});

export const inlineEditContent = style({
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: FIELD_GAP,
    width: FIELD_WIDTH,
    height: FIELD_HEIGHT,
    paddingInline: FIELD_PADDING - FIELD_BORDER,
    border: `${FIELD_BORDER}px solid transparent`,
    borderRadius: themeVars.borderRadius.half,
    fontSize: FIELD_FONT_SIZE,
    lineHeight: FIELD_LINE_HEIGHT,
    textAlign: "start",
    cursor: "text",
    transition: `border-color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHinted}`]: {
            borderColor: `rgb(from currentColor r g b / 25%)`,
        },
        [`&.${isDisabled}`]: {
            cursor: "not-allowed",
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const inlineEditText = style({
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
});

export const inlineEditGlyph = style({
    flexShrink: 0,
    opacity: 0,
    transition: `opacity ${themeVars.animation.duration}`,

    selectors: {
        [`.${isHinted} &`]: {
            opacity: 0.75,
        },
    },
});
