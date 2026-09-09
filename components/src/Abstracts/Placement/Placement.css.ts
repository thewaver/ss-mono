import { globalStyle, style } from "@vanilla-extract/css";

export const placementBox = style({
    position: "relative",
    containerType: "inline-size",
});

export const placementSpacer = style({
    width: "100%",
    pointerEvents: "none",
});

export const placementItem = style({
    display: "grid",
    gridTemplate: "100% / 100%",
    placeItems: "center",
    position: "absolute",
    transform: "translate(-50%, -50%)",
    pointerEvents: "all",
});

globalStyle(`${placementItem} > *`, {
    minWidth: "100%",
    minHeight: "100%",
});
