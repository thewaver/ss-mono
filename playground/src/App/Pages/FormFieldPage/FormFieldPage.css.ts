import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const fieldBox = style({
    padding: themeVars.spacing.double,
});

export const foreignInput = style({
    width: 240,
    color: themeVars.color.control.background.contrast,
    backgroundColor: themeVars.color.control.background.main,
    border: `1px solid ${themeVars.color.background.contrast}`,
    borderRadius: themeVars.borderRadius.half,
    padding: themeVars.spacing.half,
    fontFamily: "inherit",
    fontSize: themeVars.fontSize.small,
});

export const formStack = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: themeVars.spacing.double,
    padding: themeVars.spacing.double,
});
