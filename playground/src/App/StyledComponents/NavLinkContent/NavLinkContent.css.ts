import { globalStyle, style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const isSelected = style({});

export const navLinkContent = style({
    display: "block",
    padding: themeVars.spacing.half,
    borderRadius: themeVars.borderRadius.half,
    fontSize: themeVars.fontSize.medium,
    fontWeight: "bold",
    lineHeight: 1.25,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    transition: `background-color ${themeVars.animation.duration}`,

    selectors: {
        "&:hover": {
            backgroundColor: `rgb(from ${layerVars.contrast} r g b / 25%)`,
        },
    },
});

globalStyle(`a.${navLinkContent}, a.${navLinkContent}:visited`, {
    color: "inherit",
});

globalStyle(`a.${navLinkContent}.${isSelected}, a.${navLinkContent}.${isSelected}:visited`, {
    color: themeVars.color.primary.main,
});
