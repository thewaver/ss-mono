import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const stage = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: themeVars.spacing.double,
    width: "100%",
});

export const word = style({
    width: "100%",
    textAlign: "center",
    color: themeVars.color.primary.main,
    fontSize: `calc(${themeVars.fontSize.xLarge} * 1.75)`,
    fontWeight: "bold",
});

export const paintedWord = style({
    width: 360,
    fontSize: `calc(${themeVars.fontSize.xLarge} * 1.75)`,
    fontWeight: "bold",
    textAlign: "center",
});
