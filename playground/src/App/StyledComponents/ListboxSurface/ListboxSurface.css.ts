import { style } from "@vanilla-extract/css";

import { skinEntries } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const listboxSurface = style([
    skinEntries.dropdown,
    {
        boxSizing: "border-box",
        width: 240,
        maxHeight: 220,
        overflowY: "auto",
        padding: themeVars.spacing.half,
    },
]);

export const listboxSurfaceWide = style({
    width: "auto",
    maxWidth: "100%",
});
