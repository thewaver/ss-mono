import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const column = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
});

export const members = style({
    paddingInlineStart: themeVars.spacing.double,
});
