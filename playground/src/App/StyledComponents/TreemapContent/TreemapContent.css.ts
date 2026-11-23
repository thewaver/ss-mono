import { style } from "@vanilla-extract/css";

import { skinEntries } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

const panel = (from: string, to: string) => `linear-gradient(215deg, ${from}, ${to})`;

export const treemapTile = style([
    skinEntries.itemStatic,
    {
        border: "1px solid color-mix(in srgb, currentColor 25%, transparent)",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: themeVars.spacing.half,
        fontSize: themeVars.fontSize.xSmall,
        overflow: "hidden",
    },
]);

export const treemapTileBranch = style({
    backgroundImage: panel(themeVars.color.primary.dark, themeVars.color.primary.light),
    color: themeVars.color.primary.contrast,
    cursor: "pointer",
});

export const treemapTileWeight = style({
    marginTop: 2,
    opacity: 0.7,
});

export const treemapBar = style([
    skinEntries.itemStatic,
    {
        display: "flex",
        alignItems: "center",
        gap: themeVars.spacing.full,
        width: "100%",
        height: 30,
        paddingInline: themeVars.spacing.half,
        fontSize: themeVars.fontSize.xSmall,
        cursor: "pointer",
    },
]);

export const treemapBarHovered = style({
    filter: themeVars.hover.filter,
});

export const treemapBarAtRoot = style({
    cursor: "default",
});

export const treemapBarPath = style({
    fontWeight: "bold",
});
