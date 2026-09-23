import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const bar = style({
    display: "flex",
    alignItems: "center",
    maxWidth: "100%",
    padding: themeVars.spacing.half,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.control.background.main,
});
