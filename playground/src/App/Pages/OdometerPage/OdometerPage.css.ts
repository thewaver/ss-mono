import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const panel = (from: string, to: string) => `linear-gradient(180deg, ${from}, ${to})`;

export const stack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    alignItems: "flex-start",
    width: "100%",
});

export const controls = style({
    display: "flex",
    gap: themeVars.spacing.half,
    flexWrap: "wrap",
});

export const digit = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    backgroundImage: panel(themeVars.color.surface.dark, themeVars.color.surface.light),
    color: themeVars.color.primary.main,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xLarge,
});

export const fixed = style({
    color: themeVars.color.surface.contrast,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xLarge,
});
