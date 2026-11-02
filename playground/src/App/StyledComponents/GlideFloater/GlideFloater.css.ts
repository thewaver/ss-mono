import { style } from "@vanilla-extract/css";

import { lookEntries } from "../../Looks/Look.css";

export const isVisible = style({});

const glideFloaterBase = style({
    width: "100%",
    height: "100%",
    opacity: 0,
    transitionProperty: "opacity",

    selectors: {
        [`&.${isVisible}`]: {
            opacity: 1,
        },
    },
});

export const selectionGlideFloater = style([lookEntries.selectionFloater, glideFloaterBase]);

export const highlightGlideFloater = style([lookEntries.hoverFloater, glideFloaterBase]);
