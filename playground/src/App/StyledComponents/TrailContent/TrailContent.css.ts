import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const VEHICLE_WIDTH = 44;
const VEHICLE_HEIGHT = 22;
const MARKER_SIZE = 16;

export const trailTrack = style({
    fill: "none",
    stroke: `color-mix(in srgb, ${themeVars.color.primary.main} 35%, transparent)`,
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
});

export const trailMarker = style({
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: "50%",
    border: `2px solid ${themeVars.color.primary.main}`,
    background: `radial-gradient(circle at 70% 30%, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
});

export const trailReadout = style({
    display: "flex",
    gap: themeVars.spacing.full,
    alignItems: "center",
    fontSize: themeVars.fontSize.xSmall,
    fontVariantNumeric: "tabular-nums",
});
