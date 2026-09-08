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

// declared after the root so it wins on source order, since both are a single class
export const popoverTransparent = style({
    pointerEvents: "none",
});
