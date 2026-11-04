import { style } from "@vanilla-extract/css";

import { skinEntries } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const spotlightPopup = style([
    skinEntries.tooltip,
    {
        display: "flex",
        flexDirection: "column",
        gap: themeVars.spacing.full,
        width: 280,
        padding: themeVars.spacing.double,
    },
]);

export const spotlightPopupTitle = style({
    fontWeight: "bold",
});

export const spotlightPopupText = style({
    fontSize: themeVars.fontSize.small,
    opacity: 0.85,
});

export const spotlightPopupActions = style({
    display: "flex",
    justifyContent: "space-between",
    gap: themeVars.spacing.full,
});
