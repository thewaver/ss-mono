import { style } from "@vanilla-extract/css";

import { PREVIEW_WIDTH } from "./RichTextPage.const";

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

export const diffText = style([previewText, { maxWidth: PREVIEW_WIDTH }]);

export const addedText = style({
    color: themeVars.color.success.contrast,
    backgroundColor: themeVars.color.success.dark,
    padding: `0 ${themeVars.spacing.half}`,
    borderRadius: themeVars.borderRadius.half,
});

export const removedText = style({
    color: themeVars.color.error.contrast,
    backgroundColor: themeVars.color.error.dark,
    padding: `0 ${themeVars.spacing.half}`,
    borderRadius: themeVars.borderRadius.half,
    textDecorationLine: "line-through",
});
