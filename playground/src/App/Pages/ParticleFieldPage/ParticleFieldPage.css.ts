import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const PARTICLE_SIZE_PX = 10;

export const root = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
    gap: themeVars.spacing.quad,
});

export const valueList = style({
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: themeVars.spacing.full,
});

export const particle = style({
    width: PARTICLE_SIZE_PX,
    height: PARTICLE_SIZE_PX,
    borderRadius: "50%",
    backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.success.light}, ${themeVars.color.success.dark})`,
});

export const stack = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: themeVars.spacing.full,
});

export const shapedRoot = style({
    position: "relative",
    width: "100%",
    height: "100%",
});

export const shapeOutline = style({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    overflow: "visible",
    pointerEvents: "none",
    fill: "none",
    stroke: themeVars.color.primary.light,
    strokeWidth: 1,
    strokeDasharray: "4 4",
});
