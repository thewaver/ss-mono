import { style } from "@vanilla-extract/css";

// const PROXIMITY_FILTER_TRANSITION_MS = "50ms";

export const overheadWheelRoot = style({
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1",
});

export const overheadWheelWedge = style({
    position: "absolute",
    inset: 0,
    transformOrigin: "center center",
    // transition: `filter ${PROXIMITY_FILTER_TRANSITION_MS}`,
});

export const drumWheelRoot = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
});
