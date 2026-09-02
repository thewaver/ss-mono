import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const sortableGridPair = style({
    display: "flex",
    flexWrap: "wrap",
    gap: themeVars.spacing.double,
    alignItems: "flex-start",
    padding: themeVars.spacing.full,
});

export const sortableGridStack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    alignItems: "flex-start",
});

export const sortableGridCaption = style({
    fontSize: themeVars.fontSize.xSmall,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    opacity: 0.5,
});

export const sortableGridLootStrip = style({
    minWidth: 160,
});

export const sortableGridTurnControls = style({
    display: "flex",
    gap: themeVars.spacing.half,
    alignItems: "center",
});
