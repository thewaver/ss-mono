import { style, styleVariants } from "@vanilla-extract/css";

import { skinEntries } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const itemGrid = style({
    display: "grid",
    fontSize: themeVars.fontSize.xSmall,
});

export const fpsCounter = style([
    skinEntries.panel,
    {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 10,

        padding: themeVars.spacing.full,
        whiteSpace: "pre",
    },
]);

export const fpsCounterVariants = styleVariants({
    incredible: {
        color: "#8080FF",
    },
    superb: {
        color: "#30C0FF",
    },
    great: {
        color: "#30FFC0",
    },
    good: {
        color: "#C0FF30",
    },
    mid: {
        color: "#FFC030",
    },
    bad: {
        color: "#FF30C0",
    },
    slideshow: {
        color: "#C0C0C0",
    },
});
