import { style } from "@vanilla-extract/css";

import { skinEntries } from "../../Skins/Skin.css";
import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";

export const paragraphs = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    paddingBottom: themeVars.spacing.full,
});

export const panel = style([
    skinEntries.panel,
    {
        padding: themeVars.spacing.full,
        backgroundColor: layerVars.main,
        backgroundImage: "none",
    },
]);

export const fade = style({
    height: 60,
    backgroundImage: `linear-gradient(to bottom, transparent, ${layerVars.main} 75%)`,
});

export const scrollBox = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    height: 220,
    overflowY: "auto",
});

export const afterwards = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    opacity: 0.75,
});
