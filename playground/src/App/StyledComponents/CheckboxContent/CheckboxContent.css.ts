import { style } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";

export const isChecked = style([lookStates.isChecked]);
export const isMixed = style([lookStates.isMixed]);
export const isHovered = style({});
export const isDisabled = style({});
export const hasError = style([lookStates.hasError]);

export const checkboxContent = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.full,
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

export const checkboxBox = style([
    lookEntries.checkboxBox,
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

export const checkboxMark = style([
    lookEntries.checkboxMark,
    {
        transform: "scale(0)",
        transition: `transform ${themeVars.animation.duration}`,

        selectors: {
            [`${checkboxContent}.${isChecked} &, ${checkboxContent}.${isMixed} &`]: {
                transform: "scale(1)",
            },
        },
    },
]);
