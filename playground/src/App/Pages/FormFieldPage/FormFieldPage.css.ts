import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const fieldBox = style({
    padding: themeVars.spacing.double,
});

export const foreignInput = style({
    all: "revert",
});

export const formStack = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: themeVars.spacing.double,
    padding: themeVars.spacing.double,
});
