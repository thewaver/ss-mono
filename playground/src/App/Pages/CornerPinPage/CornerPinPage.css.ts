import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const GRIP_SIZE = 20;

export const isPicked = style({});
export const isDragging = style({});
export const isFocused = style({});

export const stage = style({
    display: "grid",
    justifyItems: "center",
    gap: themeVars.spacing.double,
    padding: themeVars.spacing.quad,
});

export const card = style({
    display: "grid",
    alignContent: "center",
    gap: themeVars.spacing.full,
    width: 280,
    height: 180,
    padding: themeVars.spacing.double,
    backgroundImage: `linear-gradient(215deg, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
    color: themeVars.color.primary.contrast,
    fontSize: themeVars.fontSize.small,
    textAlign: "center",
    userSelect: "none",
});

export const grip = style({
    width: GRIP_SIZE,
    height: GRIP_SIZE,
    borderRadius: "50%",
    border: "2px solid white",
    backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.secondary.light}, ${themeVars.color.secondary.dark})`,
    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.5)",
    transition: `transform ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isDragging}`]: {
            transform: "scale(1.2)",
            cursor: "grabbing",
        },
        [`&.${isPicked}`]: {
            boxShadow: `0 0 0 1px rgba(0, 0, 0, 0.5), 0 0 0 5px ${themeVars.color.secondary.main}`,
        },
        [`&.${isFocused}`]: {
            outline: `2px solid ${themeVars.color.outline.main}`,
            outlineOffset: 2,
        },
    },
});
