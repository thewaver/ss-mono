import { keyframes, style } from "@vanilla-extract/css";

const spread = keyframes({
    "0%": { transform: "translate(-50%, -50%) scale(0)", opacity: 0.5 },
    "100%": { transform: "translate(-50%, -50%) scale(1)", opacity: 0 },
});

export const rippleRoot = style({
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    pointerEvents: "none",
});

export const rippleMark = style({
    position: "absolute",
    width: "250%",
    aspectRatio: "1",
    borderRadius: "50%",
    backgroundColor: "currentColor",
    animationName: spread,
    animationTimingFunction: "ease-out",
    animationFillMode: "forwards",
});
