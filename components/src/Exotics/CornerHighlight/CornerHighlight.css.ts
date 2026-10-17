import { style, styleVariants } from "@vanilla-extract/css";

export const cornerHighlightRoot = style({
    position: "relative",
    width: "100%",
    height: "100%",
});

export const cornerHighlightGlow = style({
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
});

export const cornerSVG = style({
    position: "absolute",
    zIndex: 1,
    pointerEvents: "none",
});

export const cornerVariant = styleVariants({
    bottom_left: {
        bottom: 0,
        left: 0,
        transform: "scale(1, -1)",
    },
    bottom_right: {
        bottom: 0,
        right: 0,
        transform: "scale(-1, -1)",
    },
    top_left: {
        top: 0,
        left: 0,
        transform: "scale(1, 1)",
    },
    top_right: {
        top: 0,
        right: 0,
        transform: "scale(-1, 1)",
    },
});
