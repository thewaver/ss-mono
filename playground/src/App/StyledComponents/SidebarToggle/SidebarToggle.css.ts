import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const TOGGLE_SIZE = 28;

export const isHovered = style({});

export const sidebarToggle = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "all",
    width: TOGGLE_SIZE,
    height: TOGGLE_SIZE,
    padding: 0,
    border: "none",
    borderRadius: themeVars.borderRadius.half,
    font: "inherit",
    color: themeVars.color.surface.contrast,
    background: "none",
    cursor: "pointer",
    transition: `background-color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            backgroundColor: `rgb(from ${themeVars.color.surface.contrast} r g b / 25%)`,
        },
    },
});
