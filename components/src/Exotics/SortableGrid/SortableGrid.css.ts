import { globalStyle, style } from "@vanilla-extract/css";

export const sortableGridRoot = style({
    display: "block",
    position: "relative",
    pointerEvents: "all",
});

export const sortableGridCells = style({
    display: "grid",
    position: "absolute",
    pointerEvents: "none",
});

export const sortableGridCell = style({
    display: "flex",
    position: "relative",
});

export const sortableGridSlot = style({
    display: "flex",
    position: "absolute",
    pointerEvents: "none",
});

globalStyle(`${sortableGridSlot} > *`, {
    width: "100%",
    height: "100%",
});

export const sortableGridItem = style({
    display: "flex",
    flex: "1 1 auto",
    minWidth: 0,
    position: "relative",
    touchAction: "none",
    pointerEvents: "none",
});

export const sortableGridHit = style({
    position: "absolute",
    touchAction: "none",
    pointerEvents: "all",
});

export const sortableGridLanding = style({
    display: "flex",
    position: "absolute",
    pointerEvents: "none",
});

export const sortableGridCarried = style({
    display: "flex",
    position: "absolute",
    top: 0,
    left: 0,
    pointerEvents: "none",
    willChange: "transform",
});
