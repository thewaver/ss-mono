import { style } from "@vanilla-extract/css";

import { lookEntries } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";

const KNOBS_WIDTH = 360;

export const isVisible = style({});

export const exampleKnobsSurface = style([
    lookEntries.surface,
    {
        boxSizing: "border-box",
        minWidth: KNOBS_WIDTH,
        width: "max-content",
        maxWidth: "calc(100vw - 40px)",
        maxHeight: "80vh",
        overflowY: "auto",
        padding: themeVars.spacing.full,
        opacity: 0,

        selectors: {
            [`&.${isVisible}`]: {
                opacity: 1,
            },
        },
    },
]);
