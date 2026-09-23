import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { FIELD_FONT_SIZE, FIELD_HEIGHT, fieldSurface } from "../TextFieldContent/TextFieldContent.css";

const CELL_WIDTH = 36;

export const isNext = style({});

export const pinCellsContent = style({
    display: "flex",
    gap: themeVars.spacing.half,
});

export const pinCell = style([
    fieldSurface,
    {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        width: CELL_WIDTH,
        height: FIELD_HEIGHT,
        fontSize: FIELD_FONT_SIZE,
        fontVariantNumeric: "tabular-nums",

        selectors: {
            [`&.${isNext}`]: {
                borderColor: themeVars.color.primary.main,
            },
        },
    },
]);
