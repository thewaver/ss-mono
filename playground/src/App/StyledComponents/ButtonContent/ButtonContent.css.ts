import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const isHovered = style([skinStates.isHovered]);
export const isActive = style([skinStates.isActive]);
export const isPressed = style([skinStates.isPressed]);
export const isDisabled = style([skinStates.isDisabled]);
export const hasError = style([skinStates.hasError]);

export const buttonContent = style([
    skinEntries.button,
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 40,
        transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}, box-shadow ${themeVars.animation.duration}`,
    },
]);
