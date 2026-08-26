import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const cardFace = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: themeVars.spacing.half,
    width: "100%",
    height: "100%",
    borderRadius: themeVars.borderRadius.half,
    color: themeVars.color.tooltip.contrast,
});

export const flipCardFront = style([
    cardFace,
    {
        backgroundImage: `linear-gradient(135deg, ${themeVars.color.tooltip.dark}, ${themeVars.color.tooltip.light})`,
    },
]);

export const flipCardBack = style([
    cardFace,
    {
        backgroundImage: `linear-gradient(315deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.main})`,
        color: themeVars.color.primary.contrast,
    },
]);

export const flipCardTitle = style({
    fontSize: themeVars.fontSize.large,
});

export const flipCardBody = style({
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.75,
});

export const flipCardStack = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: themeVars.spacing.full,
});
