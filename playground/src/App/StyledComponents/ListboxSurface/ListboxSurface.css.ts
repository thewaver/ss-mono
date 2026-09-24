import { style } from "@vanilla-extract/css";

import { fieldSurface } from "../TextFieldContent/TextFieldContent.css";

const SURFACE_PADDING = 5;

export const listboxSurface = style([
    fieldSurface,
    {
        boxSizing: "border-box",
        width: 240,
        maxHeight: 220,
        overflowY: "auto",
        padding: SURFACE_PADDING,
        color: "inherit",
    },
]);

export const listboxSurfaceWide = style({
    width: "auto",
    maxWidth: "100%",
});
