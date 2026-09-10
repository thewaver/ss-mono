import { style } from "@vanilla-extract/css";

export const popoverRoot = style({
    position: "absolute",
    top: 0,
    left: 0,
    pointerEvents: "all",
    outline: "none",

    selectors: {
        "&:focus, &:focus-visible": {
            outline: "none",
        },
    },
});

export const popoverTransparent = style({
    pointerEvents: "none",
});

export const popoverContent = style({
    display: "contents",
});

export const popoverContentCovered = style({
    display: "none",
});
