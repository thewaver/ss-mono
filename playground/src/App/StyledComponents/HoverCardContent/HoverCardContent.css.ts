import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const isVisible = style({});

export const hoverCardContent = style({
    boxSizing: "border-box",
    width: 280,
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    padding: themeVars.spacing.full,
    color: themeVars.color.surface.contrast,
    backgroundColor: themeVars.color.surface.dark,
    border: `1px solid rgb(from currentColor r g b / 20%)`,
    borderRadius: themeVars.borderRadius.full,
    boxShadow: themeVars.shadow.medium,
    opacity: 0,

    selectors: {
        [`&.${isVisible}`]: {
            opacity: 1,
        },
    },
});
