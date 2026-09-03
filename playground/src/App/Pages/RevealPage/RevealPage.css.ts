import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const panel = (from: string, to: string) => `linear-gradient(135deg, ${from}, ${to})`;

export const root = style({
    borderRadius: themeVars.borderRadius.full,
    overflow: "hidden",
});

export const content = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.half,
    height: 200,
    padding: themeVars.spacing.double,
    backgroundImage: panel(themeVars.color.surface.dark, themeVars.color.surface.light),
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.small,
});

export const contentTitle = style({
    color: themeVars.color.primary.main,
    fontSize: themeVars.fontSize.large,
});

export const solidCover = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    backgroundImage: panel(themeVars.color.secondary.dark, themeVars.color.secondary.light),
    color: themeVars.color.secondary.contrast,
    fontSize: themeVars.fontSize.small,
});

export const frostedCover = style({
    width: "100%",
    height: "100%",
    backdropFilter: "blur(8px) saturate(0.4)",
    backgroundColor: [themeVars.color.surface.dark, `rgb(from ${themeVars.color.surface.dark} r g b / 50%)`],
});

export const promptCover = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    backgroundImage: panel(themeVars.color.secondary.dark, themeVars.color.secondary.light),
    color: themeVars.color.secondary.contrast,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.small,
});
