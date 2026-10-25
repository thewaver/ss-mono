import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const isVisible = style({});

const glideFloaterBase = style({
    width: "100%",
    height: "100%",
    borderRadius: themeVars.borderRadius.half,
    opacity: 0,
    transitionProperty: "opacity",

    selectors: {
        [`&.${isVisible}`]: {
            opacity: 1,
        },
    },
});

export const selectionGlideFloater = style([
    glideFloaterBase,
    {
        backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 15%)`,
    },
]);

export const highlightGlideFloater = style([
    glideFloaterBase,
    {
        backgroundColor: `rgb(from ${layerVars.contrast} r g b / 15%)`,
    },
]);
