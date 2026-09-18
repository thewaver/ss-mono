import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const isVisible = style({});

export const tooltipVisibility = style({
    boxShadow: themeVars.shadow.medium,
    opacity: 0,

    selectors: {
        [`&.${isVisible}`]: {
            opacity: 1,
        },
    },
});

export const tooltipBody = style({
    color: themeVars.color.tooltip.contrast,
    padding: themeVars.spacing.full,

    maxWidth: 240,
});
