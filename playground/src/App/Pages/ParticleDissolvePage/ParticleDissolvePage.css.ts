import { style } from "@vanilla-extract/css";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";

export const stack = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: themeVars.spacing.double,
});

export const buttonRow = style({
    display: "flex",
    gap: themeVars.spacing.full,
});

export const card = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    width: 280,
    padding: themeVars.spacing.double,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: layerVars.main,
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.small,
});

export const cardTitle = style({
    color: themeVars.color.primary.main,
    fontSize: themeVars.fontSize.large,
});

export const badge = style({
    alignSelf: "start",
    padding: `${themeVars.spacing.half} ${themeVars.spacing.full}`,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.success.light,
    backgroundImage: `linear-gradient(215deg, ${themeVars.color.success.dark}, ${themeVars.color.success.light})`,
    color: themeVars.color.success.contrast,
    fontWeight: "bold",
});

export const ashParticle = style({
    borderRadius: "50%",
});

export const svgShape = style({
    display: "block",
    overflow: "visible",
});

export const svgShapePath = style({
    fill: themeVars.color.primary.light,
    stroke: themeVars.color.primary.dark,
    strokeWidth: 4,
    strokeLinejoin: "round",
});

export const image = style({
    display: "block",
    width: 240,
});
