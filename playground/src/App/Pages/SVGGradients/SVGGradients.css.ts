import { globalStyle, style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const exampleSize = 420;

export const colorList = style({
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "start",
    gap: themeVars.spacing.full,
});

export const example = style({
    resize: "both",
    overflow: "auto",
    width: exampleSize,
    height: exampleSize,
});

export const trackedCellSize = exampleSize * 0.5;

export const trackedGrid = style({
    display: "grid",
    gridTemplateColumns: "auto auto",
    justifyContent: "start",
    alignItems: "start",
    gap: themeVars.spacing.full,
});

export const trackedCell = style({
    resize: "both",
    overflow: "auto",
    width: trackedCellSize,
    height: trackedCellSize,
});

export const screenOverlay = style({
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    mixBlendMode: "screen",
});

globalStyle(`${screenOverlay} *`, {
    pointerEvents: "none",
});

export const screenOverlayBox = style({
    width: "100vw",
    height: "100vh",
});

export const screenOverlayClose = style({
    position: "fixed",
    top: themeVars.spacing.double,
    right: themeVars.spacing.double,
});
