import { style } from "@vanilla-extract/css";

import { skinEntries } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const dieFace = style([
    skinEntries.itemStatic,
    {
        display: "grid",
        placeItems: "center",
        width: "100%",
        height: "100%",
        border: `1px solid ${themeVars.color.primary.main}`,
        fontWeight: "bold",
        userSelect: "none",
    },
]);

export const dieFaceShowing = style({
    backgroundColor: themeVars.color.primary.light,
    backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
    color: themeVars.color.primary.contrast,
});

export const dieCore = style({
    position: "absolute",
    inset: "25%",
    borderRadius: "50%",
    backgroundColor: themeVars.color.primary.main,
    backgroundImage: `radial-gradient(circle at 35% 30%, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
});

export const dieIcon = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    userSelect: "none",
});
