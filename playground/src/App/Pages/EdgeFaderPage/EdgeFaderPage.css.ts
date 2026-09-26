import { style } from "@vanilla-extract/css";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";

const tileBackground = `rgb(from ${layerVars.contrast} r g b / 10%)`;

export const frame = style({
    width: 320,
    maxWidth: "100%",
    height: 240,
});

export const autoHeightFrame = style({
    width: 320,
    maxWidth: "100%",
});

export const column = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.half,
});

export const row = style({
    padding: themeVars.spacing.full,
    color: layerVars.contrast,
    backgroundColor: tileBackground,
    borderRadius: themeVars.borderRadius.half,
});

export const strip = style({
    display: "flex",
    gap: themeVars.spacing.full,
});

export const chip = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    height: 32,
    paddingInline: themeVars.spacing.double,
    color: layerVars.contrast,
    backgroundColor: tileBackground,
    borderRadius: themeVars.borderRadius.half,
    fontSize: themeVars.fontSize.small,
    whiteSpace: "nowrap",
});

export const grid = style({
    display: "grid",
    gridTemplateColumns: "repeat(8, 80px)",
    gap: themeVars.spacing.full,
});

export const tile = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    color: layerVars.contrast,
    backgroundColor: tileBackground,
    borderRadius: themeVars.borderRadius.half,
});

export const card = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    padding: themeVars.spacing.double,
    color: themeVars.color.primary.contrast,
    backgroundColor: themeVars.color.primary.main,
});

export const cardTitle = style({
    margin: 0,
});

export const cardText = style({
    margin: 0,
});
