import type { Size2d } from "@thewaver/ss-utils";
import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const STRIPE_WIDTH = 14;
const STAGE_PADDING = 40;

export const SUBJECT_SIZE: Size2d = { width: 260, height: 150 };

export const filterStageRoot = style({
    position: "relative",
    display: "grid",
    placeItems: "center",
    padding: STAGE_PADDING,
});

export const filterStageDefs = style({
    position: "absolute",
    width: 0,
    height: 0,
    overflow: "hidden",
});

export const filterStageSubject = style({
    display: "grid",
    placeItems: "center",
    width: SUBJECT_SIZE.width,
    height: SUBJECT_SIZE.height,
    borderRadius: themeVars.borderRadius.full,
    background: `repeating-linear-gradient(45deg, ${themeVars.color.primary.dark} 0 ${STRIPE_WIDTH}px, ${themeVars.color.primary.light} ${STRIPE_WIDTH}px ${STRIPE_WIDTH * 2}px)`,
});

export const filterStageWord = style({
    color: themeVars.color.primary.contrast,
    fontSize: themeVars.fontSize.xLarge,
    fontWeight: "bold",
    letterSpacing: "-0.02em",
});
