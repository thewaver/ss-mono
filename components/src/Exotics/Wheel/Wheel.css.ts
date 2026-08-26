import { style } from "@vanilla-extract/css";

export const overheadWheelRoot = style({
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1",
});

export const overheadWheelWedge = style({
    position: "absolute",
    inset: 0,
    transformOrigin: "center center",
});

export const drumWheelRoot = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
});
