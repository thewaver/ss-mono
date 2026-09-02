import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const panel = (from: string, to: string) => `linear-gradient(135deg, ${from}, ${to})`;

export const stack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    alignItems: "stretch",
    width: "100%",
    height: "100%",
});

export const card = style({
    position: "relative",
    flex: 1,
    minHeight: 0,
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
    width: "100%",
    height: "100%",
    backgroundImage: panel(themeVars.color.surface.dark, themeVars.color.surface.light),
    color: themeVars.color.primary.main,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xLarge,
    letterSpacing: "0.1em",
});

export const foil = style({
    width: "100%",
    height: "100%",
    backgroundImage: panel(themeVars.color.secondary.dark, themeVars.color.secondary.light),
});

export const foilAlternate = style({
    backgroundImage: panel(themeVars.color.secondary.light, themeVars.color.secondary.dark),
});
