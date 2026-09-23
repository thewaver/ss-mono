import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const stage = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: themeVars.spacing.double,
});
