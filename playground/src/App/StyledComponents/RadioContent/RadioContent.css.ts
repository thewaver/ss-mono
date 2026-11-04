import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const isChecked = style([skinStates.isChecked]);
export const isHovered = style({});
export const isDisabled = style({});
export const hasError = style([skinStates.hasError]);

export const radioContent = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.full,
    height: 40,
    paddingInline: themeVars.spacing.full,
    borderRadius: themeVars.borderRadius.half,
    transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            filter: themeVars.hover.filter,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const radioMarker = style([
    skinEntries.radioBox,
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
        width: 20,
        height: 20,
        transition: `border-color ${themeVars.animation.duration}`,
    },
]);

export const radioDot = style([
    skinEntries.radioDot,
    {
        width: 8,
        height: 8,
        transform: "scale(0)",
        transition: `transform ${themeVars.animation.duration}`,

        selectors: {
            [`${radioContent}.${isChecked} &`]: {
                transform: "scale(1)",
            },
        },
    },
]);
