import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const docsView = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.double,
    width: "100%",
    maxWidth: 900,
});

export const docsLead = style({
    fontSize: themeVars.fontSize.medium,
    lineHeight: 1.6,
});
