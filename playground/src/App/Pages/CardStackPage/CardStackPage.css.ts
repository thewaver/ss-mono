import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const panel = (from: string, to: string) => `linear-gradient(135deg, ${from}, ${to})`;

export const deckStage = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.double,
    alignItems: "stretch",
    width: "100%",
    minWidth: 0,
});

export const deckControls = style({
    display: "flex",
    gap: themeVars.spacing.half,
    flexWrap: "wrap",
    justifyContent: "center",
});

export const deckCard = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: themeVars.borderRadius.full,
    backgroundImage: panel(themeVars.color.secondary.dark, themeVars.color.secondary.light),
    color: themeVars.color.secondary.contrast,
    fontSize: themeVars.fontSize.medium,
    boxShadow: themeVars.shadow.small,
    userSelect: "none",
    transitionProperty: "transform, opacity",
    transitionTimingFunction: "ease-out",
});
