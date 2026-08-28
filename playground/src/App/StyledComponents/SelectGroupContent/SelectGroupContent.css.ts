import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const isChecked = style({});
export const isMixed = style({});

export const selectGroupContent = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.half,
    padding: `${themeVars.spacing.full} ${themeVars.spacing.full} ${themeVars.spacing.half}`,
    color: `rgb(from currentColor r g b / 50%)`,
    fontSize: themeVars.fontSize.xSmall,
    lineHeight: 1.25,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
});

export const selectGroupMark = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 14,
    height: 14,
    border: `2px solid rgb(from currentColor r g b / 50%)`,
    borderRadius: themeVars.borderRadius.half,
    color: themeVars.color.primary.main,
    fontSize: themeVars.fontSize.small,
    lineHeight: 1,
    transition: `border-color ${themeVars.animation.duration}`,

    selectors: {
        [`&:not(.${isChecked}):not(.${isMixed})`]: {
            color: "transparent",
        },
        [`&.${isChecked}, &.${isMixed}`]: {
            borderColor: themeVars.color.primary.main,
        },
    },
});
