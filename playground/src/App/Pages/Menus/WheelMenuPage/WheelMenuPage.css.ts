import { style } from "@vanilla-extract/css";

import { skinEntries } from "../../../Skins/Skin.css";
import { themeVars } from "../../../Theme.css";

export const stage = style({
    display: "grid",
    placeItems: "center",
    minHeight: 300,
});

export const canvas = style({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    overflow: "visible",
    pointerEvents: "none",
});

export const wedge = style({
    stroke: "currentColor",
    fill: "black",
    strokeWidth: 1,
    strokeOpacity: 0.25,
    vectorEffect: "non-scaling-stroke",
    pointerEvents: "all",
    cursor: "pointer",
    transition: "fill 120ms ease-out",
});

export const wedgeDefs = style({
    position: "absolute",
    width: 0,
    height: 0,
    pointerEvents: "none",
});

export const wedgeGradientFrom = style({
    stopColor: themeVars.color.primary.dark,
});

export const wedgeGradientTo = style({
    stopColor: themeVars.color.primary.light,
});

export const wedgeDisabled = style({
    fill: "black",
    opacity: 0.4,
    cursor: "not-allowed",
});

export const label = style({
    display: "flex",
    position: "absolute",
    inset: 0,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: themeVars.spacing.half,
    fontSize: themeVars.fontSize.xSmall,
    textAlign: "center",
    pointerEvents: "none",
});

export const labelHighlighted = style({
    color: themeVars.color.primary.contrast,
});

export const shortcut = style({
    border: "1px solid color-mix(in srgb, currentColor 25%, transparent)",
    flex: "none",
    padding: `0 ${themeVars.spacing.half}`,
    borderRadius: themeVars.borderRadius.half,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.75,
});

export const closer = style([
    skinEntries.buttonSimple,
    {
        display: "grid",
        placeItems: "center",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        boxShadow: themeVars.shadow.small,
        fontSize: themeVars.fontSize.medium,
        transition: "background-color 120ms ease-out, color 120ms ease-out",
    },
]);

export const closerHighlighted = style({
    backgroundColor: themeVars.color.primary.light,
    backgroundImage: `linear-gradient(45deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
    color: themeVars.color.primary.contrast,
});

export const layer = style({
    opacity: 0,
    transform: "scale(0.9)",
    transformOrigin: "center center",
});

export const layerVisible = style({
    opacity: 1,
    transform: "scale(1)",
});
