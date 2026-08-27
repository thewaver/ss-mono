import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const panel = (from: string, to: string) => `linear-gradient(135deg, ${from}, ${to})`;

export const root = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    width: "100%",
});

export const lampGrid = style({
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: themeVars.spacing.full,
});

export const lamp = style({
    aspectRatio: "1",
    borderRadius: themeVars.borderRadius.half,
    transitionProperty: "background-color, box-shadow",
    transitionDuration: "150ms",
    transitionTimingFunction: "linear",
});

export const stage = style({
    position: "relative",
    display: "grid",
    placeItems: "center",
    height: 260,
    padding: themeVars.spacing.double,
    borderRadius: themeVars.borderRadius.full,
    backgroundImage: panel(themeVars.color.secondary.dark, themeVars.color.secondary.light),
    overflow: "hidden",
});

export const card = style({
    position: "relative",
    display: "grid",
    placeItems: "center",
    width: 120,
    height: 120,
    padding: themeVars.spacing.full,
    borderRadius: themeVars.borderRadius.full,
    backgroundImage: panel(themeVars.color.surface.dark, themeVars.color.surface.light),
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.small,
    textAlign: "center",
});

export const magnetStage = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
});

export const magnetButton = style({
    padding: `${themeVars.spacing.full} ${themeVars.spacing.double}`,
    border: `2px solid ${themeVars.color.primary.main}`,
    borderRadius: themeVars.borderRadius.full,
    backgroundImage: panel(themeVars.color.surface.dark, themeVars.color.surface.light),
    color: themeVars.color.primary.main,
    fontSize: themeVars.fontSize.medium,
    cursor: "pointer",
    transitionProperty: "transform, filter",
    transitionDuration: "80ms",
    transitionTimingFunction: "linear",
});

export const glowRow = style({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: themeVars.spacing.full,
});

export const glowCard = style({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.half,
    padding: themeVars.spacing.full,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.control.background.main,
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.xSmall,
    overflow: "hidden",
});

export const glowCardTitle = style({
    color: themeVars.color.primary.main,
    fontSize: themeVars.fontSize.small,
});

export const glowCardBorder = style({
    position: "absolute",
    inset: 0,
    borderRadius: themeVars.borderRadius.full,
    padding: 2,
    pointerEvents: "none",
    transitionProperty: "opacity",
    transitionDuration: "150ms",
    transitionTimingFunction: "linear",
});

export const tiltStage = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    perspective: "600px",
});

export const tiltCard = style({
    display: "grid",
    placeItems: "center",
    width: 180,
    height: 120,
    borderRadius: themeVars.borderRadius.full,
    backgroundImage: panel(themeVars.color.primary.dark, themeVars.color.primary.light),
    color: themeVars.color.primary.contrast,
    fontSize: themeVars.fontSize.small,
    boxShadow: themeVars.shadow.medium,
    transitionProperty: "transform",
    transitionDuration: "80ms",
    transitionTimingFunction: "linear",
});

export const compassStage = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
});

export const compassDial = style({
    position: "relative",
    display: "grid",
    placeItems: "center",
    width: 140,
    height: 140,
    border: `1px solid ${themeVars.color.primary.dark}`,
    borderRadius: "50%",
});

export const compassNeedle = style({
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 60,
    height: 2,
    backgroundColor: themeVars.color.primary.main,
    transformOrigin: "0 50%",
});

export const compassAngle = style({
    color: themeVars.color.primary.main,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.small,
});
