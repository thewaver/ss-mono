import { createVar, fallbackVar, style } from "@vanilla-extract/css";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";

const panel = (from: string, to: string) => `linear-gradient(135deg, ${from}, ${to})`;

export const CONNECTOR_FROM_COLOR = themeVars.color.primary.dark;
export const CONNECTOR_TO_COLOR = themeVars.color.primary.light;
export const ROUTE_FROM_COLOR = themeVars.color.secondary.dark;
export const ROUTE_TO_COLOR = themeVars.color.secondary.light;

export const board = style({
    color: themeVars.color.primary.dark,
});

export const node = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    padding: `0 ${themeVars.spacing.half}`,
    border: `1px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: layerVars.main,
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.xSmall,
    textAlign: "center",
    cursor: "pointer",
});

export const nodeOnRoute = style({
    boxShadow: `0 0 0 2px ${themeVars.color.secondary.main}`,
});

export const headerPinXVar = createVar();

export const headerPinYVar = createVar();

export const layerHeader = style({
    position: "relative",
    zIndex: 1,
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: layerVars.contrast,
    color: layerVars.main,
    fontSize: themeVars.fontSize.xSmall,
    textAlign: "center",
});

export const nodeRoot = style({
    backgroundImage: panel(themeVars.color.secondary.dark, themeVars.color.secondary.light),
    color: themeVars.color.secondary.contrast,
});

export const nodeDisabled = style({
    opacity: themeVars.disabled.opacity,
    filter: themeVars.disabled.filter,
    cursor: "not-allowed",
});

export const familyStage = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: themeVars.spacing.full,
    width: "100%",
});

export const familyControls = style({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: themeVars.spacing.half,
});

export const familyFrame = style({
    position: "relative",
    overflow: "hidden",
});

export const familyCamera = style({
    width: "max-content",
    transformOrigin: "0 0",
});

export const pinnedLayerHeader = style({
    pointerEvents: "none",
    transform: `translate(${fallbackVar(headerPinXVar, "0px")}, ${fallbackVar(headerPinYVar, "0px")})`,
});

export const layerHeaderCurrent = style({
    backgroundColor: themeVars.color.primary.main,
    fontWeight: "bold",
});
