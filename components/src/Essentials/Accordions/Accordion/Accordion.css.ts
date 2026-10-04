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
});

export const accordionOrientationVariants = styleVariants({
    horizontal: {
        flexDirection: "row",
        alignItems: "stretch",
    },
    vertical: {
        flexDirection: "column",
    },
});

export const accordionPanelSizer = style({
    height: "100%",
});
