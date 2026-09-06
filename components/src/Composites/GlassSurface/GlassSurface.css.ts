import { createVar, style } from "@vanilla-extract/css";

export const blurRadiusVar = createVar();
export const backdropMarginVar = createVar();

export const glassSurfaceRoot = style({
    position: "relative",
    zIndex: 0,
    width: "fit-content",
    overflow: "hidden",
});

const backdropLayer = style({
    position: "absolute",
    inset: `calc(-1 * ${backdropMarginVar})`,
    pointerEvents: "none",
});

export const glassBlurLayer = style([
    backdropLayer,
    {
        zIndex: -3,
        backdropFilter: `blur(${blurRadiusVar})`,
    },
]);

export const glassRippleLayer = style([
    backdropLayer,
    {
        zIndex: -2,
    },
]);

export const glassDefs = style({
    position: "absolute",
    width: 0,
    height: 0,
    overflow: "hidden",
});

export const glassContent = style({
    position: "relative",
});
