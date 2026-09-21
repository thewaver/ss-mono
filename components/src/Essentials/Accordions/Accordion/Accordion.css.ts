import { style, styleVariants } from "@vanilla-extract/css";

export const accordionSizingVariants = styleVariants({
    "fit-content": {
        width: "fit-content",
    },
    "fill": {
        width: "100%",
    },
});

export const accordionRoot = style({
    display: "flex",
    flexDirection: "column",
});
