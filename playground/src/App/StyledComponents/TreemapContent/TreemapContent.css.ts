import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const panel = (from: string, to: string) => `linear-gradient(215deg, ${from}, ${to})`;

export const treemapTile = style({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: themeVars.spacing.half,
    border: `1px solid ${themeVars.color.background.dark}`,
    backgroundImage: panel(themeVars.color.surface.dark, themeVars.color.surface.light),
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.xSmall,
    lineHeight: 1.2,
    overflow: "hidden",
});

export const treemapTileBranch = style({
    backgroundImage: panel(themeVars.color.primary.dark, themeVars.color.primary.light),
    color: themeVars.color.primary.contrast,
    cursor: "pointer",
});

export const treemapTileWeight = style({
    marginTop: 2,
    opacity: 0.7,
});

export const treemapBar = style({
    display: "flex",
    alignItems: "baseline",
    gap: themeVars.spacing.full,
    width: "100%",
    height: 30,
    paddingInline: themeVars.spacing.half,
    backgroundImage: panel(themeVars.color.surface.dark, themeVars.color.surface.light),
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.xSmall,
    lineHeight: "30px",
    cursor: "pointer",
});

export const treemapBarHovered = style({
    filter: themeVars.hover.filter,
});

export const treemapBarAtRoot = style({
    cursor: "default",
});

export const treemapBarPath = style({
    fontWeight: "bold",
});
