import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const controls = style({
    display: "flex",
    gap: themeVars.spacing.half,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
});

export const slider = style({
    display: "flex",
    width: "100%",
    maxWidth: 220,
});
