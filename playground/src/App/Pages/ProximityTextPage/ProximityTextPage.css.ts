import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const variableText = style({
    alignSelf: "stretch",
    fontFamily: "system-ui, sans-serif",
    fontSize: themeVars.fontSize.xLarge,
});

export const stack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    alignItems: "flex-start",
});
