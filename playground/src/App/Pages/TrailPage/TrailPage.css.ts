import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const stack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    alignItems: "center",
});

export const controls = style({
    display: "flex",
    gap: themeVars.spacing.full,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
});

export const slider = style({
    display: "flex",
    width: "100%",
    maxWidth: 320,
});
