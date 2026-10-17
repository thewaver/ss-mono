import { style } from "@vanilla-extract/css";

export const cornerPinRoot = style({
    position: "relative",
    isolation: "isolate",
    display: "grid",
});

export const cornerPinSurface = style({
    display: "grid",
    transformOrigin: "0 0",
    willChange: "transform",
});

export const cornerPinCatcher = style({
    position: "absolute",
    zIndex: 1,
    cursor: "crosshair",
    touchAction: "none",
});

export const cornerPinGrip = style({
    position: "absolute",
    zIndex: 2,
    display: "grid",
    transform: "translate(-50%, -50%)",
    touchAction: "none",
    userSelect: "none",
    cursor: "grab",
});

export const cornerPinAxis = style({
    appearance: "none",
    position: "absolute",
    top: 0,
    left: 0,

    width: "1px !important",
    height: "1px !important",
    minWidth: "0 !important",
    margin: "0 !important",
    padding: "0 !important",
    border: "none !important",
    borderRadius: "0 !important",
    background: "transparent !important",
    boxShadow: "none !important",
    opacity: 0,
    pointerEvents: "none",
});
