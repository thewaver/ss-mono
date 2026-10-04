import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const dieFace = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    border: `1px solid ${themeVars.color.primary.main}`,
    backgroundColor: layerVars.main,
    color: layerVars.contrast,
    fontWeight: "bold",
    userSelect: "none",
});

export const dieFaceShowing = style({
    backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
    color: themeVars.color.primary.contrast,
});

export const dieIcon = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    userSelect: "none",
});
