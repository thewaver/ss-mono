import { style } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";

export const SELECT_CLEAR_SIZE = 24;

export const isHovered = style([lookStates.isHovered]);
export const isActive = style([lookStates.isActive]);
export const isDisabled = style([lookStates.isDisabled]);

export const selectClear = style([
    lookEntries.decoration,
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: SELECT_CLEAR_SIZE,
        height: SELECT_CLEAR_SIZE,
        fontSize: themeVars.fontSize.medium,
        transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,
    },
]);
