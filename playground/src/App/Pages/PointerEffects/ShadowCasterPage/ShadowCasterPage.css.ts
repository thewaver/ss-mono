import { style } from "@vanilla-extract/css";

import { themeVars } from "../../../Theme.css";

const panel = (from: string, to: string) => `linear-gradient(135deg, ${from}, ${to})`;

export const stage = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: 260,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: "white",
});

export const card = style({
    display: "grid",
    placeItems: "center",
    width: "60%",
    height: "50%",
    padding: themeVars.spacing.full,
    borderRadius: themeVars.borderRadius.full,
    backgroundImage: panel(themeVars.color.primary.dark, themeVars.color.primary.light),
    color: themeVars.color.primary.contrast,
    fontSize: themeVars.fontSize.small,
    textAlign: "center",
    userSelect: "none",
});

export const badge = style({
    display: "grid",
    placeItems: "center",
    width: "45%",
    aspectRatio: "1",
    clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
    backgroundImage: panel(themeVars.color.secondary.dark, themeVars.color.secondary.light),
    color: themeVars.color.secondary.contrast,
    fontSize: themeVars.fontSize.small,
    userSelect: "none",
});
