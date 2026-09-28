import { style } from "@vanilla-extract/css";

import { FOCUS_RING_WIDTH, themeVars } from "../../Theme.css";
import { FIELD_FONT_SIZE, FIELD_HEIGHT, fieldSurface } from "../TextFieldContent/TextFieldContent.css";

const CELL_WIDTH = 36;

export const hasCaret = style({});
export const isSelected = style({});

export const segmentedInputCell = style([
    fieldSurface,
    {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: CELL_WIDTH,
        height: FIELD_HEIGHT,
        fontSize: FIELD_FONT_SIZE,
        fontVariantNumeric: "tabular-nums",

        selectors: {
            [`&.${hasCaret}`]: {
                outline: `${FOCUS_RING_WIDTH}px solid ${themeVars.color.outline.main}`,
            },
            [`&.${isSelected}`]: {
                backgroundImage: `linear-gradient(215deg, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
                color: themeVars.color.primary.contrast,
            },
        },
    },
]);
