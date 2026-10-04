import { keyframes, style, styleVariants } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const towardEnd = keyframes({
    from: { strokeDashoffset: 1 },
    to: { strokeDashoffset: 0 },
});

const towardStart = keyframes({
    from: { strokeDashoffset: 0 },
    to: { strokeDashoffset: 1 },
});

export const beam = style({
    fill: "none",
    stroke: themeVars.color.alert.light,
    strokeWidth: 3,
    strokeLinecap: "round",
    strokeDasharray: "0.18 0.82",
    vectorEffect: "non-scaling-stroke",
    pointerEvents: "none",
    animationDuration: "1600ms",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
});

export const beamDirectionVariants = styleVariants({
    forward: { animationName: towardEnd },
    backward: { animationName: towardStart },
});

export const beamPaused = style({
    animationPlayState: "paused",
});
