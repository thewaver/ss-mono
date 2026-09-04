import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const panel = (from: string, to: string) => `linear-gradient(135deg, ${from}, ${to})`;

export const stage = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    width: "100%",
});

export const flagTarget = style({
    display: "grid",
    placeItems: "center",
    height: 90,
    border: `1px solid ${themeVars.color.primary.main}`,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.control.background.main,
    color: themeVars.color.control.background.contrast,
    fontSize: themeVars.fontSize.small,
    userSelect: "none",
});

export const flagList = style({
    display: "flex",
    gap: themeVars.spacing.half,
    flexWrap: "wrap",
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xSmall,
});

export const flagChip = style({
    padding: `2px ${themeVars.spacing.half}`,
    borderRadius: themeVars.borderRadius.half,
    backgroundImage: panel(themeVars.color.surface.dark, themeVars.color.surface.light),
    color: themeVars.color.surface.contrast,
    opacity: 0.5,
});

export const flagChipOn = style({
    backgroundImage: panel(themeVars.color.primary.dark, themeVars.color.primary.light),
    color: themeVars.color.primary.contrast,
    opacity: 1,
});

export const dragPad = style({
    position: "relative",
    height: 160,
    borderRadius: themeVars.borderRadius.full,
    backgroundImage: panel(themeVars.color.tooltip.dark, themeVars.color.tooltip.light),
    touchAction: "none",
    cursor: "crosshair",
});

export const dragMarker = style({
    position: "absolute",
    width: 18,
    height: 18,
    marginLeft: -9,
    marginTop: -9,
    border: `2px solid ${themeVars.color.info.contrast}`,
    borderRadius: "50%",
    backgroundColor: themeVars.color.primary.main,
    pointerEvents: "none",
});

export const swipeTrack = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    overflow: "hidden",
});

export const swipeCard = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.half,
    alignItems: "center",
    width: "80%",
    padding: themeVars.spacing.full,
    borderRadius: themeVars.borderRadius.full,
    backgroundImage: panel(themeVars.color.primary.dark, themeVars.color.primary.light),
    color: themeVars.color.primary.contrast,
    fontSize: themeVars.fontSize.small,
    textAlign: "center",
});

export const stackArea = style({
    position: "relative",
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    touchAction: "none",
});

export const stackCard = style({
    position: "absolute",
    display: "grid",
    placeItems: "center",
    width: "70%",
    height: "70%",
    borderRadius: themeVars.borderRadius.full,
    backgroundImage: panel(themeVars.color.secondary.dark, themeVars.color.secondary.light),
    color: themeVars.color.secondary.contrast,
    fontSize: themeVars.fontSize.medium,
    boxShadow: themeVars.shadow.medium,
    userSelect: "none",
    transitionProperty: "transform, opacity",
    transitionTimingFunction: "ease-out",
});

export const swipeButton = style({
    padding: `2px ${themeVars.spacing.full}`,
    border: "1px solid currentColor",
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: "transparent",
    color: "inherit",
    fontSize: themeVars.fontSize.xSmall,
    cursor: "pointer",
});
