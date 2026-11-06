import { globalStyle, style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const isSelected = style([skinStates.isSelected]);

export const navLinkGroup = style({
    position: "relative",
    isolation: "isolate",
});

export const navLink = style({
    display: "block",
});

globalStyle(`a.${navLink}, a.${navLink}:visited`, {
    color: "inherit",
});

const navLinkBase = style({
    padding: themeVars.spacing.half,
    fontSize: themeVars.fontSize.medium,
    fontWeight: "bold",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    transition: `background-color ${themeVars.animation.duration}`,
});

export const navLinkContent = style([skinEntries.itemWithFloater, navLinkBase]);

export const navLinkContentWithoutFloater = style([
    skinEntries.itemWithoutFloater,
    navLinkBase,
    {
        selectors: {
            [`${navLink}:hover > &`]: {
                backgroundColor: `rgb(from ${layerVars.contrast} r g b / 25%)`,
            },
        },
    },
]);
