import { style } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";

export const CONTROL_BUTTON_SIZE = 28;

export const isHovered = style([lookStates.isHovered]);
export const isActive = style([lookStates.isActive]);
export const isDisabled = style([lookStates.isDisabled]);

export const controlButtonBase = style([
    lookEntries.buttonSimple,
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: `color ${themeVars.animation.duration}, filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}, background-color ${themeVars.animation.duration}`,
    },
]);

export const controlButton = style([
    controlButtonBase,
    {
        minWidth: CONTROL_BUTTON_SIZE,
        height: CONTROL_BUTTON_SIZE,
        paddingInline: themeVars.spacing.full,
        whiteSpace: "nowrap",
    },
]);

export const controlButtonGlyph = style({
    paddingInline: 0,
    width: CONTROL_BUTTON_SIZE,
});
