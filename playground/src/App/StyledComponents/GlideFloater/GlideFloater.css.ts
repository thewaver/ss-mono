import { style } from "@vanilla-extract/css";

import { skinEntries } from "../../Skins/Skin.css";

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

export const selectionGlideFloater = style([skinEntries.itemSelectionFloater, glideFloaterBase]);

export const highlightGlideFloater = style([skinEntries.itemHoverFloater, glideFloaterBase]);
