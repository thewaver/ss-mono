import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const isHovered = style({});
export const isOpen = style({});

export const navMenuTrigger = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.half,
    padding: `${themeVars.spacing.half} ${themeVars.spacing.full}`,
    borderRadius: themeVars.borderRadius.half,
    color: themeVars.color.primary.main,
    cursor: "pointer",
    transition: `background-color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}, &.${isOpen}`]: {
            backgroundColor: `rgb(from currentColor r g b / 10%)`,
        },
    },
});

export const navMenuChevron = style({
    fontSize: themeVars.fontSize.xSmall,
    transition: `transform ${themeVars.animation.duration}`,

    selectors: {
        [`.${isOpen} &`]: {
            transform: "rotate(180deg)",
        },
    },
});
