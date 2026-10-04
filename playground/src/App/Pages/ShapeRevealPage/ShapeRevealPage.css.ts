import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const stage = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: themeVars.spacing.double,
    width: "100%",
});

export const panel = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: themeVars.spacing.half,
    boxSizing: "border-box",
    width: "100%",
    height: 200,
    padding: themeVars.spacing.double,
    borderRadius: themeVars.borderRadius.full,
    textAlign: "center",
});

export const panelDawn = style({
    backgroundImage: `linear-gradient(215deg, ${themeVars.color.secondary.light}, ${themeVars.color.secondary.dark})`,
    color: themeVars.color.secondary.contrast,
});

export const panelDusk = style({
    backgroundImage: `linear-gradient(215deg, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
    color: themeVars.color.primary.contrast,
});

export const panelTitle = style({
    fontSize: themeVars.fontSize.xLarge,
    fontWeight: "bold",
});

export const panelLine = style({
    fontSize: themeVars.fontSize.small,
});
