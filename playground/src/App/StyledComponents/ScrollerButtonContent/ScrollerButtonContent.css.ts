import { style, styleVariants } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const isHovered = style([skinStates.isHovered]);
export const isActive = style([skinStates.isActive]);
export const isDisabled = style([skinStates.isDisabled]);

const GLYPH_SIZE = 10;

export const scrollerButtonGlyph = style({
    display: "block",
    flexShrink: 0,
    width: GLYPH_SIZE,
    height: GLYPH_SIZE,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
});

export const scrollerButtonGlyphVariants = {
    x: styleVariants({
        previous: {
            selectors: {
                "&:dir(rtl)": { transform: "rotate(180deg)" },
            },
        },
        next: {
            transform: "rotate(180deg)",

            selectors: {
                "&:dir(rtl)": { transform: "none" },
            },
        },
    }),
    y: styleVariants({
        previous: { transform: "rotate(90deg)" },
        next: { transform: "rotate(270deg)" },
    }),
};

export const scrollerButton = style([
    skinEntries.buttonSimple,
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 28,
        height: 28,
        transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,
    },
]);
