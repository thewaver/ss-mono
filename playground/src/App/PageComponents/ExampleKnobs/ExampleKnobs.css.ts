import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const KNOBS_WIDTH = 360;

export const isVisible = style({});

export const exampleKnobsSurface = style({
    boxSizing: "border-box",
    minWidth: KNOBS_WIDTH,
    width: "max-content",
    maxWidth: "calc(100vw - 40px)",
    maxHeight: "80vh",
    overflowY: "auto",
    padding: themeVars.spacing.full,
    color: themeVars.color.surface.contrast,
    backgroundImage: `linear-gradient(215deg, ${themeVars.color.surface.light}, ${themeVars.color.surface.dark})`,
    borderRadius: themeVars.borderRadius.full,
    boxShadow: themeVars.shadow.medium,
    opacity: 0,

    selectors: {
        [`&.${isVisible}`]: {
            opacity: 1,
        },
    },
});
