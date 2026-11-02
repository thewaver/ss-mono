import { style } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";

export const isHovered = style([lookStates.isHovered]);
export const isOpen = style([lookStates.isHovered]);
export const isDisabled = style([lookStates.isDisabled]);

export const datePickerTrigger = style([
    lookEntries.decoration,
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 22,
        height: 22,
        fontSize: themeVars.fontSize.xSmall,
        transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,
    },
]);
