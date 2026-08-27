import { createVar, style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const backgroundColor = createVar();

export const root = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
    gap: themeVars.spacing.quad,
});
