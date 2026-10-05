import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const beam = style({
    fill: "none",
    stroke: themeVars.color.alert.light,
    strokeWidth: 3,
    strokeLinecap: "round",
    vectorEffect: "non-scaling-stroke",
    pointerEvents: "none",
});
