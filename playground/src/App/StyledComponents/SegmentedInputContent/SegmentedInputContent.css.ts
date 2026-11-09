import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { FOCUS_RING_WIDTH, themeVars } from "../../Theme.css";
import { FIELD_FONT_SIZE, FIELD_HEIGHT, fieldSurface } from "../TextFieldContent/TextFieldContent.css";

const CELL_WIDTH = 36;

export const hasCaret = style({});
export const isSelected = style([skinEntries.itemBase, skinStates.isSelected]);

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
        },
    },
]);
