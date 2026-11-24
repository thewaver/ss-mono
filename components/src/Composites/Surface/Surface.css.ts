import { createVar, style } from "@vanilla-extract/css";

export const fillColorVar = createVar();
export const fillOpacityVar = createVar();
export const strokeColorVar = createVar();
export const strokeOpacityVar = createVar();

export const surfaceDivRoot = style({
    position: "relative",
    overflow: "hidden",
    backgroundColor: `color-mix(in srgb, ${fillColorVar} calc(${fillOpacityVar} * 100%), transparent)`,
});

export const surfaceDivBorder = style({
    position: "absolute",
    inset: 0,
    zIndex: 1,
    pointerEvents: "none",

    borderRadius: "inherit",
    borderStyle: "solid",
    borderColor: `color-mix(in srgb, ${strokeColorVar} calc(${strokeOpacityVar} * 100%), transparent)`,
});
