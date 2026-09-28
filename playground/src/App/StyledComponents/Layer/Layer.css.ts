import { assignVars, createThemeContract, globalStyle, style, styleVariants } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const layerVars = createThemeContract({
    main: null,
    contrast: null,
});

export const layerLevelVariants = styleVariants({
    0: { vars: assignVars(layerVars, themeVars.color.control.level0) },
    1: { vars: assignVars(layerVars, themeVars.color.control.level1) },
    2: { vars: assignVars(layerVars, themeVars.color.control.level2) },
});

export const layerScope = style({
    display: "contents",
});

globalStyle(":root", {
    vars: assignVars(layerVars, themeVars.color.control.level0),
});
