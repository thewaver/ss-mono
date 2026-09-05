import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const frame = style({
    height: 160,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.background.dark,
});

export const frameBody = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    fontSize: themeVars.fontSize.small,
    opacity: 0.6,
});

export const controlRow = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: themeVars.spacing.double,
});

export const panel = style({
    height: 180,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.background.dark,
});

export const panelBody = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: themeVars.spacing.full,
    height: "100%",
    padding: themeVars.spacing.double,
    boxSizing: "border-box",
    lineHeight: 1.5,
});
