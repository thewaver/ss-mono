import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const VEHICLE_WIDTH = 44;
const VEHICLE_HEIGHT = 22;
const MARKER_SIZE = 16;

export const trailTrack = style({
    fill: "none",
    stroke: `rgb(from ${themeVars.color.primary.main} r g b / 35%)`,
    strokeWidth: 2,
    strokeDasharray: "6 6",
    strokeLinecap: "round",
});

export const trailVehicle = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: VEHICLE_WIDTH,
    height: VEHICLE_HEIGHT,
    paddingRight: themeVars.spacing.half,
    clipPath: "polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)",
    background: `linear-gradient(215deg, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
    color: themeVars.color.primary.contrast,
    fontSize: themeVars.fontSize.xSmall,
    fontWeight: "bold",
    boxShadow: themeVars.shadow.small,
});

export const trailMarker = style({
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: "50%",
    border: `2px solid ${themeVars.color.secondary.main}`,
    background: `radial-gradient(circle at 70% 30%, ${themeVars.color.secondary.light}, ${themeVars.color.secondary.dark})`,
    boxShadow: themeVars.shadow.small,
});

export const trailReadout = style({
    display: "flex",
    gap: themeVars.spacing.full,
    alignItems: "center",
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.xSmall,
    fontVariantNumeric: "tabular-nums",
});
