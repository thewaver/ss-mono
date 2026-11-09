import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const isChecked = style([skinStates.isSelected]);
export const isHovered = style([skinStates.isHovered]);
export const isDisabled = style([skinStates.isDisabled]);
export const hasError = style({});
export const isVisible = style({});

export const segmentGroup = style([
    skinEntries.tabsTrack,
    {
        width: "fit-content",
        padding: themeVars.spacing.half,
    },
]);

export const segmentContent = style([
    skinEntries.tabsItemBase,
    skinStates.hasSelectionFloater,
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 40,
        paddingInline: themeVars.spacing.double,
        transition: `color ${themeVars.animation.duration}, filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

        selectors: {
            [`&.${hasError}`]: {
                color: themeVars.color.error.main,
            },
        },
    },
]);

export const segmentFloater = style([
    skinEntries.tabsItemSelectionFloater,
    {
        opacity: 0,
        transitionProperty: "opacity",

        selectors: {
            [`&.${isVisible}`]: {
                opacity: 1,
            },
        },
    },
]);
