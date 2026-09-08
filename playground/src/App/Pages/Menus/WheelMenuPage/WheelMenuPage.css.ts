import { style } from "@vanilla-extract/css";

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
    fill: themeVars.color.surface.light,
    stroke: themeVars.color.surface.contrast,
    strokeWidth: 1,
    strokeOpacity: 0.25,
    vectorEffect: "non-scaling-stroke",
    pointerEvents: "all",
    cursor: "pointer",
    transition: "fill 120ms ease-out",
});

export const wedgeHighlighted = style({
    fill: themeVars.color.primary.main,
});

export const wedgeDisabled = style({
    fill: themeVars.color.surface.dark,
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
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.xSmall,
    textAlign: "center",
    pointerEvents: "none",
});

export const labelHighlighted = style({
    color: themeVars.color.primary.contrast,
});

export const shortcut = style({
    flex: "none",
    padding: `0 ${themeVars.spacing.half}`,
    borderRadius: themeVars.borderRadius.half,
    border: "1px solid currentColor",
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.75,
});

export const closer = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    backgroundColor: themeVars.color.surface.dark,
    boxShadow: themeVars.shadow.small,
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.medium,
    transition: "background-color 120ms ease-out, color 120ms ease-out",
});

export const closerHighlighted = style({
    backgroundColor: themeVars.color.primary.main,
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
