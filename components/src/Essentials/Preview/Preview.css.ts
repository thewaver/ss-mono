import { style, styleVariants } from "@vanilla-extract/css";

const OVERLAY_OVERHANG = 1;

export const previewSizingVariants = styleVariants({
    "fit-content": {
        width: "fit-content",
    },
    "fill": {
        width: "100%",
    },
});

export const previewRoot = style({
    display: "flex",
    flexDirection: "column",
});

export const previewFrame = style({
    position: "relative",
});

export const previewContent = style({
    overflow: "hidden",
});

export const previewOverlay = style({
    position: "absolute",
    right: 0,
    bottom: -OVERLAY_OVERHANG,
    left: 0,
    pointerEvents: "none",
});

export const previewTrigger = style({
    display: "flex",
    pointerEvents: "all",
    border: "none",
    padding: 0,
    background: "none",
    font: "inherit",
    color: "inherit",
    textAlign: "inherit",
});
