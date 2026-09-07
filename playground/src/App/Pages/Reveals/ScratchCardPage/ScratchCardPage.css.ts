import { style } from "@vanilla-extract/css";

import { themeVars } from "../../../Theme.css";

const panel = (from: string, to: string) => `linear-gradient(135deg, ${from}, ${to})`;

export const stack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    alignItems: "stretch",
    width: "100%",
});

export const card = style({
    position: "relative",
    width: "100%",
    borderRadius: themeVars.borderRadius.full,
    overflow: "hidden",
});

export const buttonRow = style({
    display: "flex",
    flex: "none",
});

export const prize = style({
    display: "grid",
    placeItems: "center",
    padding: themeVars.spacing.double,
    backgroundImage: panel(themeVars.color.surface.dark, themeVars.color.surface.light),
    color: themeVars.color.primary.main,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xLarge,
    letterSpacing: "0.1em",
});

export const foil = style({
    width: "100%",
    height: "100%",
    backgroundImage: `repeating-linear-gradient(115deg, ${themeVars.color.secondary.dark} 0 6px, ${themeVars.color.secondary.main} 6px 12px, ${themeVars.color.secondary.light} 12px 18px, ${themeVars.color.secondary.main} 18px 24px), ${panel(themeVars.color.secondary.dark, themeVars.color.secondary.light)}`,
    backgroundBlendMode: "soft-light",
});

export const pane = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: themeVars.spacing.half,
    padding: themeVars.spacing.double,
    backgroundImage: panel(themeVars.color.surface.dark, themeVars.color.surface.light),
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.small,
});

export const paneTitle = style({
    color: themeVars.color.primary.main,
    fontSize: themeVars.fontSize.large,
});

export const frost = style({
    width: "100%",
    height: "100%",
    backdropFilter: "blur(8px) saturate(0.4)",
    backgroundColor: [themeVars.color.surface.dark, `rgb(from ${themeVars.color.surface.dark} r g b / 50%)`],
});

export const coin = style({
    width: "100%",
    height: "100%",
    borderRadius: themeVars.borderRadius.half,
    border: `2px dashed ${themeVars.color.secondary.contrast}`,
    backgroundColor: `rgb(from ${themeVars.color.secondary.contrast} r g b / 15%)`,
});

export const coinRubbing = style({
    borderStyle: "solid",
    backgroundColor: `rgb(from ${themeVars.color.secondary.contrast} r g b / 35%)`,
});
