import { style } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";

export const isHovered = style([lookStates.isHovered]);
export const isActive = style([lookStates.isActive]);
export const isPressed = style([lookStates.isPressed]);
export const isDisabled = style([lookStates.isDisabled]);
export const hasError = style([lookStates.hasError]);

export const buttonContent = style([
    lookEntries.button,
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 40,
        transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}, box-shadow ${themeVars.animation.duration}`,
    },
]);
