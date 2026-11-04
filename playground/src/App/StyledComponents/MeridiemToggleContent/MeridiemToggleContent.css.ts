import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const isHovered = style([skinStates.isHovered]);
export const isDisabled = style([skinStates.isDisabled]);

export const meridiemToggle = style([
    skinEntries.decoration,
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 28,
        height: 22,
        fontSize: themeVars.fontSize.xSmall,
        fontWeight: 600,
        letterSpacing: 0.5,
        transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,
    },
]);
