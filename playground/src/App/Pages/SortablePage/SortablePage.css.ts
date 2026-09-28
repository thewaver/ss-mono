import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const sortablePair = style({
    display: "flex",
    gap: themeVars.spacing.quad,
    alignItems: "flex-start",
    padding: themeVars.spacing.full,
});

export const sortableColumn = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    minWidth: 180,
});

export const sortableCaption = style({
    fontSize: themeVars.fontSize.xSmall,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    opacity: 0.5,
});
