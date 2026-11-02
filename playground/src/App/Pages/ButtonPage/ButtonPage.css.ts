import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const root = style({});

export const counter = style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: themeVars.spacing.full,
});

export const counterValue = style({
    minWidth: themeVars.spacing.quad,
    textAlign: "center",
    fontSize: themeVars.fontSize.large,
    fontVariantNumeric: "tabular-nums",
});
