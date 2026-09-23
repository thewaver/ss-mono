import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const dieFace = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.secondary.light}, ${themeVars.color.secondary.dark})`,
    color: themeVars.color.secondary.contrast,
    fontWeight: "bold",
    lineHeight: 1,
    userSelect: "none",
});

export const dieFaceShowing = style({
    backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
    color: themeVars.color.primary.contrast,
});
