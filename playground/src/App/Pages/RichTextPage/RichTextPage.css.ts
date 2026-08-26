import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const root = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
    gap: themeVars.spacing.quad,
});

export const legendRoot = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    fontSize: themeVars.fontSize.small,
});

export const legendTitle = style({
    fontWeight: "bold",
});

export const legendGrid = style({
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    columnGap: themeVars.spacing.double,
    rowGap: themeVars.spacing.half,
    alignItems: "baseline",
});

export const legendTag = style({
    fontFamily: "monospace",
    color: themeVars.color.primary.main,
});

export const previewText = style({
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
});
