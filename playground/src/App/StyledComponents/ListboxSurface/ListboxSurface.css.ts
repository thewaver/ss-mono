import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const SURFACE_PADDING = 5;
const SURFACE_BORDER = 2;

export const listboxSurface = style({
    boxSizing: "border-box",
    width: 240,
    maxHeight: 220,
    overflowY: "auto",
    padding: SURFACE_PADDING,
    color: "inherit",
    border: `${SURFACE_BORDER}px solid rgb(from currentColor r g b / 25%)`,
    borderRadius: themeVars.borderRadius.half,
});

export const listboxSurfaceWide = style({
    width: "auto",
    maxWidth: "100%",
});
