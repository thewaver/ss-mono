import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

const OPTION_WIDTH = 52;
const OPTION_HEIGHT = 34;
const COLUMN_HEIGHT = OPTION_HEIGHT * 5;

export const isSelected = style([skinStates.isSelected]);
export const isNow = style({});
export const isHovered = style([skinStates.isHovered]);
export const isDisabled = style([skinStates.isDisabled]);

const clockOptionBase = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: OPTION_WIDTH,
    height: OPTION_HEIGHT,
    fontSize: themeVars.fontSize.small,
    fontVariantNumeric: "tabular-nums",
    transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}, filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isNow}`]: {
            textDecoration: "underline",
            textUnderlineOffset: themeVars.spacing.half,
        },
    },
});

export const clockOption = style([skinEntries.itemBase, clockOptionBase]);

export const clockUnit = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: OPTION_WIDTH,
    height: OPTION_HEIGHT,
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.xSmall,
    textTransform: "uppercase",
    opacity: 0.5,
});

export const clockColumn = style({
    display: "flex",
    flexDirection: "column",
    height: COLUMN_HEIGHT,
    overflowY: "auto",
    scrollbarWidth: "none",
});

export const clockFrame = style([
    skinEntries.dropdown,
    {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "fit-content",
        padding: themeVars.spacing.full,
    },
]);
