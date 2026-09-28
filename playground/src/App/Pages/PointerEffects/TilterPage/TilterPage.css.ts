import { style } from "@vanilla-extract/css";

import { themeVars } from "../../../Theme.css";

const panel = (from: string, to: string) => `linear-gradient(135deg, ${from}, ${to})`;

export const card = style({
    display: "grid",
    placeItems: "center",
    width: 220,
    height: 150,
    padding: themeVars.spacing.full,
    borderRadius: themeVars.borderRadius.full,
    backgroundImage: panel(themeVars.color.primary.dark, themeVars.color.primary.light),
    color: themeVars.color.primary.contrast,
    fontSize: themeVars.fontSize.small,
    textAlign: "center",
    userSelect: "none",
});

export const sheen = style({
    borderRadius: themeVars.borderRadius.full,
    mixBlendMode: "screen",
});

export const photo = style({
    width: 220,
    height: 150,
    borderRadius: themeVars.borderRadius.full,
    objectFit: "cover",
    userSelect: "none",
});
