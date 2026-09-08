import { style } from "@vanilla-extract/css";

import { themeVars } from "../../../Theme.css";

export const item = style({
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

export const itemBack = style({
    backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 20%)`,
});

export const itemHighlighted = style({
    backgroundColor: themeVars.color.primary.main,
    color: themeVars.color.primary.contrast,
    transform: "scale(1.06)",
});

export const itemDisabled = style({
    opacity: 0.4,
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

export const stage = style({
    display: "grid",
    placeItems: "center",
    minHeight: 340,
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
