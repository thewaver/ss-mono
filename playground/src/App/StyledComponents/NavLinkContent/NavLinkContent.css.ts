import { globalStyle, style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const isHovered = style([skinStates.isHovered]);
export const isSelected = style([skinStates.isSelected]);
export const hasHoverFloater = style([skinEntries.itemWithHoverFloater, skinStates.hasHoverFloater]);
export const hasSelectionFloater = style([skinEntries.itemWithSelectionFloater, skinStates.hasSelectionFloater]);

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

export const navLinkContent = style([skinEntries.itemBase, navLinkBase]);

export const hasNoHoverFloater = style({
    selectors: {
        [`${navLink}:hover > &`]: {
            backgroundColor: `rgb(from ${layerVars.contrast} r g b / 25%)`,
        },
    },
});
