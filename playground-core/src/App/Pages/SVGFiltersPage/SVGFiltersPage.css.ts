import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const stack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
});

export const stepLists = style({
    display: "flex",
    flexWrap: "wrap",
    gap: themeVars.spacing.double,
    alignItems: "flex-start",
    justifyContent: "center",
    padding: themeVars.spacing.full,
});

export const stepColumn = style({
    flex: "1 1 0",
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    minWidth: 140,
});

export const stepCaption = style({
    fontSize: themeVars.fontSize.xSmall,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    opacity: 0.5,
});
