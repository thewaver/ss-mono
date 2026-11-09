import { style } from "@vanilla-extract/css";

import { skinEntries } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const bar = style([
    skinEntries.dropZone,
    {
        display: "flex",
        alignItems: "center",
        maxWidth: "100%",
        padding: themeVars.spacing.half,
    },
]);

export const wideBar = style({
    width: "100%",
});
