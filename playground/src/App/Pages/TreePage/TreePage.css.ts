import { style } from "@vanilla-extract/css";

export const treeScroller = style({
    overflowY: "auto",
    maxHeight: 320,
    width: "100%",
});

export const rankStage = style({
    display: "grid",
    position: "relative",
    placeItems: "center",
});

export const rankRing = style({
    position: "absolute",
    top: "50%",
    left: "50%",
    border: "1px dashed color-mix(in srgb, currentColor 25%, transparent)",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
});
