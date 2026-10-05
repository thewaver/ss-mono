import { style } from "@vanilla-extract/css";

export const slotTextRoot = style({
    display: "inline-flex",
    alignItems: "center",
});

export const slotTextValue = style({
    position: "absolute",
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    border: 0,
    clipPath: "inset(50%)",
    overflow: "hidden",
    whiteSpace: "nowrap",
});

export const slotTextWindow = style({
    position: "relative",
    flex: "none",
    overflow: "hidden",
});

export const slotTextBarrel = style({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
});

export const slotTextFixed = style({
    display: "grid",
    placeItems: "center",
    flex: "none",
});

export const slotTextFace = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
});

export const slotTextFixedClipped = style({
    overflow: "hidden",
});

export const slotTextFlapTop = style({
    clipPath: "inset(0 0 50% 0)",
});

export const slotTextFlapBottom = style({
    clipPath: "inset(50% 0 0 0)",
});
