import { style } from "@vanilla-extract/css";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";

export const HOST_SIZE = 400;

const CARD_PADDING = 20;
export const MIN_COLUMN_WIDTH = HOST_SIZE + CARD_PADDING * 2;

export const sectionBody = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    alignSelf: "flex-start",
    width: "100%",
    minWidth: 0,
});

export const readout = style({
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.75,
    overflowWrap: "anywhere",
});

export const controls = style({
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    alignItems: "center",
    gap: themeVars.spacing.full,
    maxWidth: HOST_SIZE,
});

export const host = style({
    alignSelf: "center",
    width: HOST_SIZE,
    height: HOST_SIZE,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
    outline: [`1px dashed ${layerVars.contrast}`, `1px dashed rgb(from ${layerVars.contrast} r g b / 25%)`],
    outlineOffset: -1,
});

export const roamer = style({
    position: "absolute",
});

export const toastRaiser = style({
    position: "absolute",
    left: themeVars.spacing.half,
    bottom: themeVars.spacing.half,
});

export const cornerReadout = style({
    position: "absolute",
    right: themeVars.spacing.half,
    bottom: themeVars.spacing.half,
    pointerEvents: "none",
});

export const scrollBox = style({
    width: "100%",
    height: "100%",
    overflow: "auto",
    padding: themeVars.spacing.full,
});

export const scrollFiller = style({
    height: 240,
});
