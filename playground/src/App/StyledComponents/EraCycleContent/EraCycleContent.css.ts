import { style } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";

export const isHovered = style([lookStates.isHovered]);
export const isDisabled = style([lookStates.isDisabled]);

export const eraCycle = style([
    lookEntries.decoration,
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minWidth: 34,
        height: 22,
        padding: `0 ${themeVars.spacing.half}`,
        fontSize: themeVars.fontSize.xSmall,
        fontWeight: 600,
        letterSpacing: 0.5,
        whiteSpace: "nowrap",
        transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,
    },
]);
