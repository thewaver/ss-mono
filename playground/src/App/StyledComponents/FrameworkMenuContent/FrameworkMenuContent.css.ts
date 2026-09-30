import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const isHovered = style({});
export const isOpen = style({});

export const frameworkMenuTrigger = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.half,
    padding: `${themeVars.spacing.half} ${themeVars.spacing.full}`,
    borderRadius: themeVars.borderRadius.half,
    color: themeVars.color.primary.main,
    fontSize: themeVars.fontSize.medium,
    fontWeight: "bold",
    whiteSpace: "nowrap",
    cursor: "pointer",
    transition: `filter ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}, &.${isOpen}`]: {
            filter: themeVars.hover.filter,
        },
    },
});

export const frameworkMenuName = style({
    selectors: {
        [`.${isHovered} &, .${isOpen} &`]: {
            textDecoration: "underline",
        },
    },
});

export const frameworkMenuChevron = style({
    fontSize: themeVars.fontSize.xSmall,
});
