import { style, styleVariants } from "@vanilla-extract/css";

export const collapsibleSizingVariants = styleVariants({
    "fit-content": {
        width: "fit-content",
    },
    "fill": {
        width: "100%",
    },
});

export const collapsibleRoot = style({
    display: "flex",
});

export const collapsibleSideVariants = styleVariants({
    top: {
        flexDirection: "column-reverse",
    },
    right: {
        flexDirection: "row",
    },
    bottom: {
        flexDirection: "column",
    },
    left: {
        flexDirection: "row-reverse",
    },
});

export const collapsibleSidewaysContent = style({
    width: "max-content",
    height: "100%",
});

export const collapsibleTrigger = style({
    display: "flex",
    pointerEvents: "all",
    width: "100%",
    border: "none",
    padding: 0,
    background: "none",
    font: "inherit",
    color: "inherit",
    textAlign: "inherit",
});

export const collapsibleHeading = style({
    margin: 0,
    font: "inherit",
    color: "inherit",
});

export const collapsiblePanel = style({
    overflow: "hidden",
});
