import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const contextRegion = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 120,
    padding: themeVars.spacing.double,
    color: themeVars.color.surface.contrast,
    border: `1px dashed currentColor`,
    borderRadius: themeVars.borderRadius.full,
    fontSize: themeVars.fontSize.small,
    textAlign: "center",
});

export const laidOutItem = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: themeVars.spacing.half,
    width: "100%",
    height: "100%",
    padding: `0 ${themeVars.spacing.full}`,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.surface.dark,
    boxShadow: themeVars.shadow.small,
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.small,
    textAlign: "center",
    transition: "background-color 120ms ease-out, color 120ms ease-out, transform 120ms ease-out",
});

export const laidOutItemHighlighted = style({
    backgroundColor: themeVars.color.primary.main,
    color: themeVars.color.primary.contrast,
    transform: "scale(1.06)",
});

export const laidOutItemDisabled = style({
    opacity: 0.4,
});

export const laidOutShortcut = style({
    flex: "none",
    padding: `0 ${themeVars.spacing.half}`,
    borderRadius: themeVars.borderRadius.half,
    border: "1px solid currentColor",
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.75,
});

export const laidOutStage = style({
    display: "grid",
    placeItems: "center",
    minHeight: 340,
});

export const laidOutLayer = style({
    opacity: 0,
    transform: "scale(0.9)",
    transformOrigin: "center center",
});

export const laidOutLayerVisible = style({
    opacity: 1,
    transform: "scale(1)",
});
