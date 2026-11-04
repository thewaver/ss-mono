import { style, styleVariants } from "@vanilla-extract/css";

import { skinEntries } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

const DRAWER_THICKNESS = 320;
const DRAWER_DEPTH = 200;
const DRAWER_MAX_DEPTH = 400;

export const drawerPanel = style([
    skinEntries.drawer,
    {
        display: "flex",
        flexDirection: "column",
        gap: themeVars.spacing.double,
        padding: themeVars.spacing.double,
        overflow: "auto",
    },
]);

export const drawerSizeVariants = styleVariants({
    left: { width: DRAWER_THICKNESS },
    right: { width: DRAWER_THICKNESS },
    top: { minHeight: DRAWER_DEPTH, maxHeight: DRAWER_MAX_DEPTH },
    bottom: { minHeight: DRAWER_DEPTH, maxHeight: DRAWER_MAX_DEPTH },
});

export const drawerSlideOffVariants = styleVariants({
    left: { transform: "translateX(-100%)" },
    right: { transform: "translateX(100%)" },
    top: { transform: "translateY(-100%)" },
    bottom: { transform: "translateY(100%)" },
});

export const drawerSlideOn = style({
    transform: "translate(0, 0)",
});
