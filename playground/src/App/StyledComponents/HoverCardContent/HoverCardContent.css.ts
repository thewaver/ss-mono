import { style } from "@vanilla-extract/css";

import { lookEntries } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";

export const isVisible = style({});

export const hoverCardContent = style([
    lookEntries.tooltip,
    {
        boxSizing: "border-box",
        width: 280,
        display: "flex",
        flexDirection: "column",
        gap: themeVars.spacing.full,
        padding: themeVars.spacing.full,
        opacity: 0,

        selectors: {
            [`&.${isVisible}`]: {
                opacity: 1,
            },
        },
    },
]);
