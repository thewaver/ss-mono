import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const isHovered = style({});
export const isActive = style({});

const BADGE_SIZE = 18;

export const propHintBadge = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    border: "1px solid currentColor",
    borderRadius: "50%",
    color: "inherit",
    fontSize: themeVars.fontSize.xSmall,
    fontWeight: "bold",
    lineHeight: 1,
    cursor: "help",
    transition: `filter ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            filter: themeVars.hover.filter,
        },
        [`&.${isActive}`]: {
            filter: themeVars.active.filter,
        },
    },
});
