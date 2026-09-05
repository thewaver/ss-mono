import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const deck = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: themeVars.spacing.double,
    padding: themeVars.spacing.double,
});

export const row = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.full,
});
