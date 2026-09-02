import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const stack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    alignItems: "flex-start",
    width: "100%",
});

export const headline = style({
    color: themeVars.color.primary.main,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xLarge,
    letterSpacing: "0.05em",
});
