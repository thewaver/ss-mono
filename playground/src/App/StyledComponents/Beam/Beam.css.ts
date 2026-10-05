import { createVar, keyframes, style, styleVariants } from "@vanilla-extract/css";

import { BEAM_DASH_PX } from "./Beam.const";

import { themeVars } from "../../Theme.css";

export const beamLengthVar = createVar();

export const beamDurationVar = createVar();

const towardEnd = keyframes({
    from: { strokeDashoffset: beamLengthVar },
    to: { strokeDashoffset: 0 },
});

const towardStart = keyframes({
    from: { strokeDashoffset: 0 },
    to: { strokeDashoffset: beamLengthVar },
});

export const beam = style({
    vars: { [beamLengthVar]: "0px", [beamDurationVar]: "800ms" },
    fill: "none",
    stroke: themeVars.color.alert.light,
    strokeWidth: 3,
    strokeLinecap: "round",
    strokeDasharray: `${BEAM_DASH_PX}px max(0px, calc(${beamLengthVar} - ${BEAM_DASH_PX}px))`,
    vectorEffect: "non-scaling-stroke",
    pointerEvents: "none",
    animationDuration: beamDurationVar,
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
