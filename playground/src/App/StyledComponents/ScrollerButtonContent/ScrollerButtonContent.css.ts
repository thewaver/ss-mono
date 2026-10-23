import { style, styleVariants } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const isHovered = style({});
export const isActive = style({});
export const isDisabled = style({});

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

export const scrollerButton = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 28,
    height: 28,
    color: layerVars.contrast,
    backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
    borderRadius: themeVars.borderRadius.half,
    fontSize: themeVars.fontSize.small,
    transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            color: themeVars.color.primary.main,
        },
        [`&.${isActive}`]: {
            filter: themeVars.active.filter,
        },
        [`&.${isDisabled}`]: {
            opacity: themeVars.disabled.opacity,
            filter: themeVars.disabled.filter,
        },
    },
});
