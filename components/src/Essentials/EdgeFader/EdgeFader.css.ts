import { style } from "@vanilla-extract/css";

export const edgeFaderRoot = style({
    maxWidth: "100%",
    maxHeight: "100%",
    overflow: "auto",
    maskRepeat: "no-repeat",

    selectors: {
        "&:focus-visible": {
            maskImage: "none !important",
        },
    },
});
