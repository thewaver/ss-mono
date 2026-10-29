import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const root = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
    gap: themeVars.spacing.quad,
});

export const valueList = style({
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: themeVars.spacing.full,
});

export const stack = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: themeVars.spacing.full,
});

export const gpuCellsCanvas = style({
    position: "absolute",
    display: "block",
    pointerEvents: "none",
});

export const wipeOverlay = style({
    position: "fixed",
    inset: 0,
});
