import { style } from "@vanilla-extract/css";

import { lookEntries } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";

const modalPanel = style([
    lookEntries.drawer,
    {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: themeVars.spacing.double,
        borderRadius: themeVars.borderRadius.half,
        padding: themeVars.spacing.double,
    },
]);

export const modalPanelOn = style([modalPanel, { transform: "scale(1)" }]);

export const modalPanelOff = style([modalPanel, { transform: "scale(0)" }]);

export const modalHint = style({
    pointerEvents: "none",
    userSelect: "none",
    textTransform: "uppercase",
});
