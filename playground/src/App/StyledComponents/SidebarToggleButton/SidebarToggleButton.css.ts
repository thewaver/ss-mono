import { style } from "@vanilla-extract/css";

import { layoutVars } from "../../Layout.css";
import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const isHovered = style([skinStates.isHovered]);
export const isDisabled = style([skinStates.isDisabled]);

export const sidebarToggle = style([
    skinEntries.decoration,
    {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "all",
        width: layoutVars.iconButtonSize,
        height: layoutVars.iconButtonSize,
        padding: 0,
        border: "none",
        font: "inherit",
        fontSize: themeVars.fontSize.large,
        cursor: "pointer",
        transition: `background-color ${themeVars.animation.duration}`,

        selectors: {
            [`&.${isDisabled}`]: {
                cursor: "default",
            },
        },
    },
]);
