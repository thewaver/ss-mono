import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const isCurrent = style({});
export const isHovered = style({});

export const tableOfContentsContent = style({
    display: "block",
    paddingInlineStart: themeVars.spacing.full,
    borderInlineStart: `2px solid transparent`,
    opacity: 0.6,
    transition: `opacity ${themeVars.animation.duration}, border-color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isCurrent}`]: {
            opacity: 1,
            borderInlineStartColor: themeVars.color.primary.main,
        },
        [`&.${isHovered}`]: {
            opacity: 1,
        },
    },
});
