import { style } from "@vanilla-extract/css";

import { themeVars } from "../../../Theme.css";

export const root = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: themeVars.spacing.double,
});

export const row = style({
    display: "flex",
    flexDirection: "row",
    gap: themeVars.spacing.double,
});
