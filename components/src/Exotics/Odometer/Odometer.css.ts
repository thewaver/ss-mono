import { style } from "@vanilla-extract/css";

export const odometerRoot = style({
    display: "inline-flex",
    alignItems: "center",
});

export const odometerValue = style({
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

export const odometerWindow = style({
    position: "relative",
    flex: "none",
    overflow: "hidden",
});

export const odometerBarrel = style({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
});

export const odometerFixed = style({
    display: "grid",
    placeItems: "center",
    flex: "none",
});

export const odometerDigitFace = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
});
